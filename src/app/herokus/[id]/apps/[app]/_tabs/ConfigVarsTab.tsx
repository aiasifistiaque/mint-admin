'use client';

import { FC, useMemo, useState } from 'react';
import { Box, Button, Flex, IconButton, Input, Text, Textarea } from '@chakra-ui/react';
import {
	Copy as CopyIcon,
	Eye as EyeIcon,
	EyeOff as EyeOffIcon,
	Plus as PlusIcon,
	Trash2 as TrashIcon,
	Undo2 as UndoIcon,
} from 'lucide-react';
import {
	Toast,
	radius,
	useGetHerokuConfigVarsQuery,
	useUpdateHerokuConfigVarsMutation,
	useDownloadHerokuConfigVarsMutation,
	useCopyHerokuConfigVarsMutation,
} from '@/components/library';
import {
	envFileBody,
	Panel,
	FilterInput,
	ConfirmAction,
	EmptyState,
	ErrorState,
	TableSkeleton,
} from '@/components/library/cl';

const MASK = '••••••••';

type Draft = Record<string, string | null>;

/**
 * Config vars, read and write.
 *
 * Edits stage locally and commit as **one** PATCH. Committing per row would
 * restart the app once per key — the operational difference between one
 * 10-second blip and eight of them.
 */
const ConfigVarsTab: FC<{ id: string; app: string }> = ({ id, app }) => {
	const { data, isFetching, isError, error, refetch } = useGetHerokuConfigVarsQuery({ id, app });
	const [commit, commitResult] = useUpdateHerokuConfigVarsMutation();
	const [downloadEnv, envResult] = useDownloadHerokuConfigVarsMutation();
	const [downloadJson, jsonResult] = useDownloadHerokuConfigVarsMutation();
	const [copyVars, copyResult] = useCopyHerokuConfigVarsMutation();
	const [copied, setCopied] = useState(false);

	const [search, setSearch] = useState('');
	const [revealed, setRevealed] = useState<Record<string, boolean>>({});
	const [allRevealed, setAllRevealed] = useState(false);
	const [draft, setDraft] = useState<Draft>({});
	const [confirming, setConfirming] = useState(false);
	const [pasting, setPasting] = useState(false);
	const [pasteText, setPasteText] = useState('');
	const [newKey, setNewKey] = useState('');

	const server: Record<string, string> = data?.vars || {};

	/** Server values with the staged changes applied — what the table renders. */
	const merged = useMemo(() => {
		const next: Record<string, string> = { ...server };

		Object.keys(draft).forEach(key => {
			const value = draft[key];
			if (value === null) delete next[key];
			else next[key] = value;
		});

		return next;
	}, [server, draft]);

	const rows = useMemo(() => {
		const term = search.trim().toLowerCase();
		return Object.keys(merged)
			.sort()
			.filter(key => !term || key.toLowerCase().includes(term));
	}, [merged, search]);

	const removedKeys = Object.keys(draft).filter(key => draft[key] === null);

	const changes = useMemo(() => {
		return Object.keys(draft)
			.map(key => {
				const value = draft[key];
				const exists = Object.prototype.hasOwnProperty.call(server, key);

				if (value === null) return exists ? { key, kind: 'removed' as const } : null;
				if (!exists) return { key, kind: 'added' as const };
				if (server[key] !== value) return { key, kind: 'updated' as const };
				return null;
			})
			.filter(Boolean) as { key: string; kind: 'added' | 'updated' | 'removed' }[];
	}, [draft, server]);

	const setValue = (key: string, value: string) => setDraft(prev => ({ ...prev, [key]: value }));
	const removeKey = (key: string) => setDraft(prev => ({ ...prev, [key]: null }));

	const revertKey = (key: string) =>
		setDraft(prev => {
			const next = { ...prev };
			delete next[key];
			return next;
		});

	const toggleAll = () => {
		if (allRevealed) {
			setRevealed({});
			setAllRevealed(false);
			return;
		}
		setRevealed(Object.fromEntries(Object.keys(merged).map(key => [key, true])));
		setAllRevealed(true);
	};

	const addKey = () => {
		const key = newKey.trim();
		if (!key) return;
		setDraft(prev => ({ ...prev, [key]: '' }));
		setRevealed(prev => ({ ...prev, [key]: true }));
		setNewKey('');
	};

	/**
	 * Accepts what you get from `heroku config -s` or a .env file. Deliberately
	 * simple: `KEY=value`, one per line, optional surrounding quotes stripped.
	 * Anything more clever would silently mangle values people paste in.
	 */
	const applyPaste = () => {
		const parsed: Draft = {};

		pasteText.split('\n').forEach(line => {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('#')) return;

			const at = trimmed.indexOf('=');
			if (at < 1) return;

			const key = trimmed.slice(0, at).trim().replace(/^export\s+/, '');
			let value = trimmed.slice(at + 1).trim();

			if (
				(value.startsWith("'") && value.endsWith("'")) ||
				(value.startsWith('"') && value.endsWith('"'))
			) {
				value = value.slice(1, -1);
			}

			if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) parsed[key] = value;
		});

		setDraft(prev => ({ ...prev, ...parsed }));
		setPasteText('');
		setPasting(false);
	};

	const onCommit = async () => {
		const result = await commit({ id, app, vars: draft });
		if ('error' in result) return;

		setDraft({});
		setConfirming(false);
	};

	const body = () => {
		if (isFetching && !data) return <TableSkeleton rows={6} cols={3} />;
		if (isError) return <ErrorState error={error} onRetry={refetch} />;

		if (Object.keys(merged).length === 0)
			return (
				<EmptyState
					title='No config vars'
					description={`${app} has no environment variables set.`}
					action={
						<Button size='xs' variant='outline' onClick={() => setPasting(true)}>
							Paste from .env
						</Button>
					}
				/>
			);

		if (rows.length === 0)
			return (
				<EmptyState
					title='No keys match that search'
					action={
						<Button size='xs' variant='outline' onClick={() => setSearch('')}>
							Clear search
						</Button>
					}
				/>
			);

		return (
			<Box>
				{rows.map(key => {
					const staged = Object.prototype.hasOwnProperty.call(draft, key);
					const isNew = staged && !Object.prototype.hasOwnProperty.call(server, key);

					return (
						<Flex
							key={key}
							align='center'
							gap={3}
							px={4}
							py={2}
							borderBottomWidth='1px'
							borderColor='border.muted'
							_hover={{ bg: 'bg.subtle' }}>
							<Flex align='center' gap={2} w='260px' flexShrink={0} minW={0}>
								<Text fontSize='13px' fontWeight='600' fontFamily='mono' truncate title={key}>
									{key}
								</Text>
								{staged && (
									<Text fontSize='10px' color='orange.500' flexShrink={0}>
										{isNew ? 'new' : 'edited'}
									</Text>
								)}
							</Flex>

							{revealed[key] ? (
								<Input
									size='xs'
									flex={1}
									fontFamily='mono'
									fontSize='12px'
									borderRadius={radius.INPUT}
									value={merged[key]}
									onChange={event => setValue(key, event.target.value)}
								/>
							) : (
								<Text flex={1} fontSize='13px' fontFamily='mono' color='fg.muted'>
									{MASK}
								</Text>
							)}

							<Flex gap={1} flexShrink={0}>
								<IconButton
									size='2xs'
									variant='ghost'
									aria-label={revealed[key] ? 'Hide value' : 'Reveal and edit'}
									onClick={() => setRevealed(prev => ({ ...prev, [key]: !prev[key] }))}>
									{revealed[key] ? <EyeOffIcon size={13} /> : <EyeIcon size={13} />}
								</IconButton>
								<IconButton
									size='2xs'
									variant='ghost'
									aria-label='Copy value'
									onClick={() => navigator.clipboard?.writeText(merged[key] ?? '')}>
									<CopyIcon size={13} />
								</IconButton>
								{staged ? (
									<IconButton
										size='2xs'
										variant='ghost'
										aria-label='Undo this change'
										onClick={() => revertKey(key)}>
										<UndoIcon size={13} />
									</IconButton>
								) : (
									<IconButton
										size='2xs'
										variant='ghost'
										colorPalette='red'
										aria-label='Delete this key'
										onClick={() => removeKey(key)}>
										<TrashIcon size={13} />
									</IconButton>
								)}
							</Flex>
						</Flex>
					);
				})}

				{removedKeys.length > 0 && (
					<Box px={4} py={3}>
						<Text fontSize='xs' color='fg.muted' mb={2}>
							Staged for deletion
						</Text>
						<Flex gap={2} flexWrap='wrap'>
							{removedKeys.map(key => (
								<Button
									key={key}
									size='xs'
									variant='outline'
									colorPalette='red'
									borderRadius={radius.PILL}
									onClick={() => revertKey(key)}>
									{key} ✕
								</Button>
							))}
						</Flex>
					</Box>
				)}
			</Box>
		);
	};

	return (
		<>
			<Panel
				flush
				title={`Config Vars${data?.count != null ? ` (${Object.keys(merged).length})` : ''}`}
				subtitle={
					changes.length > 0
						? `${changes.length} unsaved change${changes.length === 1 ? '' : 's'}`
						: undefined
				}
				actions={
					<>
						<FilterInput
							value={search}
							onChange={setSearch}
							placeholder='Search keys…'
							shown={rows.length}
							total={Object.keys(merged).length}
							width='200px'
						/>
						<Button size='sm' variant='outline' onClick={toggleAll}>
							{allRevealed ? 'Hide all' : 'Reveal all'}
						</Button>
						<Button size='sm' variant='outline' onClick={() => setPasting(true)}>
							Paste .env
						</Button>
						<Button
							size='sm'
							variant='outline'
							loading={copyResult.isLoading}
							onClick={async () => {
								const answer: any = await copyVars({ id, app });
								if (typeof answer?.data !== 'string') return;

								await navigator.clipboard.writeText(envFileBody(answer.data));
								setCopied(true);
								window.setTimeout(() => setCopied(false), 2000);
							}}>
							{copied ? 'Copied' : 'Copy all'}
						</Button>
						<Button
							size='sm'
							variant='outline'
							loading={envResult.isLoading}
							onClick={() => downloadEnv({ id, app, format: 'env' })}>
							.env
						</Button>
						<Button
							size='sm'
							variant='outline'
							loading={jsonResult.isLoading}
							onClick={() => downloadJson({ id, app, format: 'json' })}>
							.json
						</Button>
						{changes.length > 0 && (
							<Button size='sm' onClick={() => setConfirming(true)}>
								Save {changes.length}
							</Button>
						)}
					</>
				}>
				<Flex
					align='center'
					gap={2}
					px={4}
					py={3}
					borderBottomWidth='1px'
					borderColor='border.muted'>
					<Input
						size='xs'
						w='260px'
						placeholder='NEW_KEY_NAME'
						fontFamily='mono'
						fontSize='12px'
						borderRadius={radius.INPUT}
						value={newKey}
						onChange={event => setNewKey(event.target.value.toUpperCase())}
						onKeyDown={event => event.key === 'Enter' && addKey()}
					/>
					<Button size='xs' variant='outline' onClick={addKey} disabled={!newKey.trim()}>
						<PlusIcon size={13} /> Add
					</Button>
				</Flex>

				{body()}
			</Panel>

			<ConfirmAction
				isOpen={confirming}
				onClose={() => setConfirming(false)}
				onConfirm={onCommit}
				title='Save config vars'
				confirmLabel={`Save and restart ${app}`}
				destructive
				typeToConfirm={app}
				isLoading={commitResult.isLoading}
				consequence={`Heroku restarts every dyno on ${app} when config vars change. The app will be briefly unavailable.`}>
				<Flex direction='column' gap={1}>
					{changes.map(change => (
						<Flex key={change.key} gap={2} align='baseline'>
							<Text
								fontSize='11px'
								w='70px'
								color={
									change.kind === 'removed'
										? 'red.500'
										: change.kind === 'added'
											? 'green.500'
											: 'orange.500'
								}>
								{change.kind}
							</Text>
							<Text fontSize='13px' fontFamily='mono' truncate>
								{change.key}
							</Text>
						</Flex>
					))}
				</Flex>
			</ConfirmAction>

			<ConfirmAction
				isOpen={pasting}
				onClose={() => setPasting(false)}
				onConfirm={applyPaste}
				title='Paste from .env'
				confirmLabel='Stage these'
				consequence='Pasted keys are staged alongside your other edits. Nothing is sent to Heroku until you save.'>
				<Textarea
					rows={8}
					fontFamily='mono'
					fontSize='12px'
					borderRadius={radius.INPUT}
					placeholder={'KEY=value\nANOTHER_KEY=another value'}
					value={pasteText}
					onChange={event => setPasteText(event.target.value)}
				/>
			</ConfirmAction>

			<Toast
				isError={commitResult.isError || envResult.isError || jsonResult.isError}
				error={commitResult.error || envResult.error || jsonResult.error}
			/>
			<Toast
				isSuccess={commitResult.isSuccess}
				successTitle='Config vars saved'
				successText={`${app} is restarting.`}
			/>
		</>
	);
};

export default ConfigVarsTab;
