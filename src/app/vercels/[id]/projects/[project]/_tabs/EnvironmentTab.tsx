'use client';

import { useMemo, useState } from 'react';
import {
	Badge,
	Button,
	Checkbox,
	Flex,
	IconButton,
	Input,
	Menu,
	NativeSelect,
	Portal,
	Text,
} from '@chakra-ui/react';
import { Check, Copy, Eye, Lock, MoreHorizontal, Trash2 } from 'lucide-react';
import {
	Toast,
	radius,
	useGetVercelEnvQuery,
	useLazyRevealVercelEnvQuery,
	useUpdateVercelEnvMutation,
	useDownloadVercelEnvMutation,
	useCopyVercelEnvMutation,
} from '@/components/library';
import {
	envFileBody,
	Panel,
	DataTable,
	FilterInput,
	ConfirmAction,
	CopyValue,
	EmptyState,
	ErrorState,
	TableSkeleton,
	Column,
} from '@/components/library/cl';

const TARGETS = ['production', 'preview', 'development'] as const;

type Props = {
	id: string;
	projectRef: string;
	projectName: string;
	team: string;
	storefront?: any;
	onProductionChanged: () => void;
	onRedeploy: () => void;
};

/** A staged change the admin has made but not committed. */
type Staged =
	| { kind: 'add'; key: string; value: string; target: string[] }
	| { kind: 'replace'; id: string; key: string; value: string; target: string[] }
	| { kind: 'remove'; id: string; key: string; target: string[] };

const EnvironmentTab = ({
	id,
	projectRef,
	projectName,
	team,
	storefront,
	onProductionChanged,
	onRedeploy,
}: Props) => {
	const [filter, setFilter] = useState('');
	const [staged, setStaged] = useState<Staged[]>([]);
	const [revealed, setRevealed] = useState<Record<string, string>>({});
	const [confirming, setConfirming] = useState(false);
	const [result, setResult] = useState<any>(null);
	const [replacing, setReplacing] = useState<any>(null);
	const [replacement, setReplacement] = useState('');
	/** Which target the .env download and the copy apply to. */
	const [fileTarget, setFileTarget] = useState<string>('production');
	const [copied, setCopied] = useState(false);

	const [newKey, setNewKey] = useState('');
	const [newValue, setNewValue] = useState('');
	const [newTargets, setNewTargets] = useState<string[]>(['production', 'preview', 'development']);

	const { data, isFetching, isError, error, refetch } = useGetVercelEnvQuery({
		id,
		project: projectRef,
		team,
	});

	const [reveal, revealResult] = useLazyRevealVercelEnvQuery();
	const [commit, commitResult] = useUpdateVercelEnvMutation();
	// One hook per button, not one shared between them: a single mutation would
	// put the spinner on every button at once and there would be no way to tell
	// which download was actually running.
	const [downloadEnv, envResult] = useDownloadVercelEnvMutation();
	const [downloadJson, jsonResult] = useDownloadVercelEnvMutation();
	const [copyEnv, copyResult] = useCopyVercelEnvMutation();

	const records = data?.records || [];

	const filtered = useMemo(() => {
		const needle = filter.trim().toLowerCase();
		if (!needle) return records;

		return records.filter((record: any) =>
			[record.key, ...(record.target || [])].join(' ').toLowerCase().includes(needle)
		);
	}, [records, filter]);

	const stagedFor = (recordId: string) => staged.find(s => 'id' in s && s.id === recordId);

	const onReveal = async (record: any) => {
		const answer = await reveal({ id, project: projectRef, envId: record.id, team });
		if (typeof answer?.data?.value === 'string') {
			setRevealed(current => ({ ...current, [record.id]: answer.data.value }));
		}
	};

	/**
	 * The full desired set the backend diffs against.
	 *
	 * Every untouched record is included unchanged — without a value, because a
	 * list read never returns one and sending back a masked envelope would look
	 * like a rewrite of every variable on the project.
	 */
	const desiredSet = () => {
		const removed = new Set(staged.filter(s => s.kind === 'remove').map((s: any) => s.id));
		const replaced = new Map(
			staged.filter(s => s.kind === 'replace').map((s: any) => [s.id, s])
		);

		const kept = records
			.filter((record: any) => !removed.has(record.id))
			.map((record: any) => {
				const change: any = replaced.get(record.id);

				return {
					id: record.id,
					key: record.key,
					target: record.target,
					gitBranch: record.gitBranch,
					type: record.type,
					...(change ? { value: change.value } : {}),
				};
			});

		const added = staged
			.filter(s => s.kind === 'add')
			.map((s: any) => ({ key: s.key, value: s.value, target: s.target, type: 'encrypted' }));

		return kept.concat(added);
	};

	const touchesProduction = staged.some(s => (s.target || []).includes('production'));

	const save = async () => {
		const answer: any = await commit({
			id,
			project: projectRef,
			team,
			records: desiredSet(),
			...(storefront && touchesProduction ? { confirm: projectName } : {}),
		});

		setConfirming(false);

		if (answer?.data) {
			setResult(answer.data);
			setStaged([]);
			setRevealed({});
			if (answer.data.requiresRedeploy) onProductionChanged();
		}
	};

	const columns: Column<any>[] = [
		{
			key: 'key',
			label: 'Key',
			render: row => {
				const change = stagedFor(row.id);

				return (
					<Flex
						align='center'
						gap={2}
						minW={0}>
						<Text
							fontSize='13px'
							fontFamily='mono'
							lineClamp={1}
							textDecoration={change?.kind === 'remove' ? 'line-through' : undefined}
							color={change?.kind === 'remove' ? 'fg.muted' : undefined}>
							{row.key}
						</Text>
						{change && (
							<Badge
								size='xs'
								colorPalette={change.kind === 'remove' ? 'red' : 'orange'}>
								{change.kind === 'remove' ? 'removing' : 'changed'}
							</Badge>
						)}
					</Flex>
				);
			},
		},
		{
			key: 'target',
			label: 'Targets',
			width: '220px',
			render: row => (
				<Flex
					gap={1}
					flexWrap='wrap'>
					{(row.target || []).map((t: string) => (
						<Badge
							key={t}
							size='xs'
							colorPalette={t === 'production' ? 'green' : 'gray'}>
							{t}
						</Badge>
					))}
					{row.gitBranch && (
						<Badge
							size='xs'
							colorPalette='blue'>
							{row.gitBranch}
						</Badge>
					)}
				</Flex>
			),
		},
		{
			key: 'value',
			label: 'Value',
			render: row => {
				if (!row.revealable) {
					return (
						<Flex
							align='center'
							gap={2}
							color='fg.muted'
							title='Vercel never returns a sensitive value to anyone, including its own dashboard'>
							<Lock size={13} />
							<Text fontSize='13px'>Sensitive — cannot be read</Text>
						</Flex>
					);
				}

				const value = revealed[row.id];

				if (typeof value === 'string') {
					return (
						<CopyValue
							value={value}
							display={value.length > 48 ? `${value.slice(0, 48)}…` : value}
						/>
					);
				}

				return (
					<Button
						size='xs'
						variant='ghost'
						loading={revealResult.isFetching}
						onClick={() => onReveal(row)}>
						<Eye size={13} />
						Reveal
					</Button>
				);
			},
		},
	];

	return (
		<Flex
			direction='column'
			gap={4}>
			{!!staged.length && (
				<Panel title={`${staged.length} unsaved change${staged.length > 1 ? 's' : ''}`}>
					<Flex
						align='center'
						justify='space-between'
						gap={4}
						flexWrap='wrap'>
						<Text
							fontSize='13px'
							color='fg.muted'>
							Nothing has been sent to Vercel yet. Saving does not restart or redeploy
							anything — the running deployment keeps the old values until the next deploy.
						</Text>
						<Flex gap={2}>
							<Button
								size='xs'
								variant='ghost'
								onClick={() => setStaged([])}>
								Discard
							</Button>
							<Button
								size='xs'
								onClick={() => setConfirming(true)}>
								Save changes
							</Button>
						</Flex>
					</Flex>
				</Panel>
			)}

			{result && (
				<Panel
					title={
						result.status === 'success'
							? 'Environment updated'
							: result.status === 'partial'
								? 'Partly applied'
								: 'Nothing was applied'
					}
					actions={
						<Button
							size='xs'
							variant='ghost'
							onClick={() => setResult(null)}>
							Dismiss
						</Button>
					}>
					<Flex
						direction='column'
						gap={2}>
						<Text fontSize='13px'>{result.message}</Text>

						{/* A partial write is its own outcome. Saying which
							operations landed and which did not is the whole point —
							"failed" would imply nothing changed. */}
						{!!result.applied?.length && (
							<Text
								fontSize='xs'
								color='fg.muted'>
								Applied: {result.applied.join(', ')}
							</Text>
						)}
						{!!result.remaining?.length && (
							<Text
								fontSize='xs'
								color='fg.error'>
								Not applied: {result.remaining.join(', ')}
							</Text>
						)}

						{result.requiresRedeploy && (
							<Flex
								align='center'
								gap={3}
								mt={1}>
								<Text
									fontSize='13px'
									color='fg.muted'>
									Production variables changed. The live deployment still holds the old
									values.
								</Text>
								<Button
									size='xs'
									onClick={onRedeploy}>
									Redeploy production now
								</Button>
							</Flex>
						)}
					</Flex>
				</Panel>
			)}

			<Panel title='Add a variable'>
				<Flex
					gap={2}
					align='center'
					flexWrap='wrap'>
					<Input
						size='sm'
						width='220px'
						fontFamily='mono'
						borderRadius={radius.INPUT}
						placeholder='KEY'
						value={newKey}
						onChange={event => setNewKey(event.target.value.toUpperCase())}
					/>
					<Input
						size='sm'
						width='260px'
						borderRadius={radius.INPUT}
						placeholder='Value'
						value={newValue}
						onChange={event => setNewValue(event.target.value)}
					/>
					<Flex
						gap={3}
						align='center'>
						{TARGETS.map(target => (
							<Checkbox.Root
								key={target}
								size='sm'
								checked={newTargets.includes(target)}
								onCheckedChange={details =>
									setNewTargets(current =>
										details.checked
											? current.concat(target)
											: current.filter(t => t !== target)
									)
								}>
								<Checkbox.HiddenInput />
								<Checkbox.Control />
								<Checkbox.Label fontSize='12px'>{target}</Checkbox.Label>
							</Checkbox.Root>
						))}
					</Flex>
					<Button
						size='sm'
						disabled={!newKey.trim() || !newTargets.length}
						onClick={() => {
							setStaged(current =>
								current.concat({
									kind: 'add',
									key: newKey.trim(),
									value: newValue,
									target: newTargets,
								})
							);
							setNewKey('');
							setNewValue('');
						}}>
						Stage
					</Button>
				</Flex>
			</Panel>

			<Panel
				title='Environment variables'
				flush
				actions={
					<Flex
						gap={2}
						align='center'
						flexWrap='wrap'>
						<FilterInput
							value={filter}
							onChange={setFilter}
							placeholder='Filter by key or target…'
							shown={filtered.length}
							total={records.length}
							width='200px'
						/>

						{/* Unlike Heroku's flat config vars, a Vercel .env is only
							meaningful for one target — the same key can hold three
							different values — so the target is picked here and governs
							both the .env download and the copy. */}
						<NativeSelect.Root
							size='sm'
							width='140px'>
							<NativeSelect.Field
								value={fileTarget}
								onChange={event => setFileTarget(event.target.value)}>
								{TARGETS.map(target => (
									<option
										key={target}
										value={target}>
										{target}
									</option>
								))}
							</NativeSelect.Field>
							<NativeSelect.Indicator />
						</NativeSelect.Root>

						<Button
							size='sm'
							variant='outline'
							loading={copyResult.isLoading}
							onClick={async () => {
								const answer: any = await copyEnv({
									id,
									project: projectRef,
									team,
									target: fileTarget,
								});

								if (typeof answer?.data !== 'string') return;

								await navigator.clipboard.writeText(envFileBody(answer.data));
								setCopied(true);
								window.setTimeout(() => setCopied(false), 2000);
							}}>
							{copied ? <Check size={13} /> : <Copy size={13} />}
							{copied ? 'Copied' : 'Copy all'}
						</Button>

						<Button
							size='sm'
							variant='outline'
							loading={envResult.isLoading}
							onClick={() =>
								downloadEnv({
									id,
									project: projectRef,
									projectName,
									team,
									format: 'env',
									target: fileTarget,
								})
							}>
							.env
						</Button>

						<Button
							size='sm'
							variant='outline'
							loading={jsonResult.isLoading}
							onClick={() =>
								downloadJson({
									id,
									project: projectRef,
									projectName,
									team,
									format: 'json',
								})
							}>
							.json
						</Button>
					</Flex>
				}>
				{isFetching && !records.length ? (
					<TableSkeleton rows={5} />
				) : isError ? (
					<ErrorState
						error={error}
						onRetry={refetch}
					/>
				) : !filtered.length ? (
					<EmptyState
						title={filter ? 'No variable matches that' : 'No environment variables'}
						description={filter ? undefined : 'Add one above.'}
					/>
				) : (
					<DataTable<any>
						columns={columns}
						rows={filtered}
						rowKey={row => row.id}
						rowActions={row => (
							<Menu.Root>
								<Menu.Trigger asChild>
									<IconButton
										size='xs'
										variant='ghost'
										aria-label='Actions'>
										<MoreHorizontal size={15} />
									</IconButton>
								</Menu.Trigger>
								<Portal>
									<Menu.Positioner>
										<Menu.Content>
											<Menu.Item
												value='replace'
												onClick={() => {
													setReplacing(row);
													setReplacement('');
												}}>
												{row.revealable ? 'Replace value' : 'Replace (sensitive)'}
											</Menu.Item>
											<Menu.Item
												value='remove'
												color='fg.error'
												onClick={() =>
													setStaged(current =>
														current
															.filter(s => !('id' in s && s.id === row.id))
															.concat({
																kind: 'remove',
																id: row.id,
																key: row.key,
																target: row.target,
															})
													)
												}>
												<Trash2 size={13} />
												Remove
											</Menu.Item>
										</Menu.Content>
									</Menu.Positioner>
								</Portal>
							</Menu.Root>
						)}
					/>
				)}
			</Panel>

			<ConfirmAction
				isOpen={!!replacing}
				onClose={() => {
					setReplacing(null);
					setReplacement('');
				}}
				onConfirm={() => {
					setStaged(current =>
						current
							.filter(s => !('id' in s && s.id === replacing.id))
							.concat({
								kind: 'replace',
								id: replacing.id,
								key: replacing.key,
								value: replacement,
								target: replacing.target,
							})
					);
					setReplacing(null);
					setReplacement('');
				}}
				title={`Replace ${replacing?.key || ''}`}
				consequence={
					replacing?.revealable
						? `This stages a new value for ${replacing?.key} on ${(replacing?.target || []).join(', ')}. Nothing is sent to Vercel until you save.`
						: `${replacing?.key} is sensitive, so its current value cannot be shown for comparison — only replaced. Nothing is sent to Vercel until you save.`
				}
				confirmLabel='Stage'>
				<Input
					size='sm'
					borderRadius={radius.INPUT}
					placeholder='New value'
					autoFocus
					value={replacement}
					onChange={event => setReplacement(event.target.value)}
				/>
			</ConfirmAction>

			<ConfirmAction
				isOpen={confirming}
				onClose={() => setConfirming(false)}
				onConfirm={save}
				title='Save environment changes'
				consequence={
					<Flex
						direction='column'
						gap={2}>
						<Text fontSize='13px'>
							{touchesProduction
								? storefront
									? `This changes the production environment of ${storefront.shopName}'s live storefront. It takes effect on the next deployment, not immediately.`
									: 'This changes the production environment. It takes effect on the next deployment, not immediately.'
								: 'These changes take effect on the next deployment.'}
						</Text>
						{/* Names and targets only — never a value, on either side. */}
						{staged.map((change, index) => (
							<Text
								key={index}
								fontSize='xs'
								fontFamily='mono'
								color='fg.muted'>
								{change.kind === 'add'
									? 'add'
									: change.kind === 'remove'
										? 'remove'
										: 'update'}{' '}
								{change.key} ({(change.target || []).join(', ')})
							</Text>
						))}
					</Flex>
				}
				confirmLabel='Save'
				isLoading={commitResult.isLoading}
				typeToConfirm={storefront && touchesProduction ? projectName : undefined}
			/>

			<Toast
				isError={
					commitResult.isError || envResult.isError || jsonResult.isError || copyResult.isError
				}
				error={commitResult.error || envResult.error || jsonResult.error || copyResult.error}
			/>
		</Flex>
	);
};

export default EnvironmentTab;
