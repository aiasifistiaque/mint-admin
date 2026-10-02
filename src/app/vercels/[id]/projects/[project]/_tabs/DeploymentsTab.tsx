'use client';

import { useState } from 'react';
import {
	Badge,
	Box,
	Button,
	Flex,
	IconButton,
	Input,
	Menu,
	Portal,
	Text,
} from '@chakra-ui/react';
import { MoreHorizontal } from 'lucide-react';
import {
	Toast,
	radius,
	useGetVercelDeploymentsQuery,
	useGetVercelBuildLogsQuery,
	useCreateVercelDeploymentMutation,
	usePromoteVercelDeploymentMutation,
	useCancelVercelDeploymentMutation,
	useDeleteVercelDeploymentMutation,
} from '@/components/library';
import {
	when,
	Panel,
	StatusDot,
	DataTable,
	ConfirmAction,
	EmptyState,
	ErrorState,
	TableSkeleton,
	Column,
	Dropdown,
} from '@/components/library/cl';

const TARGETS = [
	{ value: '', label: 'All targets' },
	{ value: 'production', label: 'Production' },
	{ value: 'preview', label: 'Preview' },
];

const STATES = [
	{ value: '', label: 'All states' },
	{ value: 'READY', label: 'Ready' },
	{ value: 'BUILDING', label: 'Building' },
	{ value: 'QUEUED', label: 'Queued' },
	{ value: 'ERROR', label: 'Error' },
	{ value: 'CANCELED', label: 'Canceled' },
];

const isRunning = (state?: string | null) =>
	['BUILDING', 'QUEUED', 'INITIALIZING'].includes(String(state || '').toUpperCase());

type Props = {
	id: string;
	projectRef: string;
	projectName: string;
	team: string;
	storefront?: any;
	productionId?: string;
	defaultBranch?: string | null;
	hasGit: boolean;
	onEnvAndRedeploy: () => void;
};

const DeploymentsTab = ({
	id,
	projectRef,
	projectName,
	team,
	storefront,
	productionId,
	defaultBranch,
	hasGit,
	onEnvAndRedeploy,
}: Props) => {
	const [target, setTarget] = useState('');
	const [state, setState] = useState('');
	const [branch, setBranch] = useState(defaultBranch || 'main');
	const [branchTarget, setBranchTarget] = useState('preview');
	const [logsFor, setLogsFor] = useState<string | null>(null);
	const [pending, setPending] = useState<{ kind: string; row: any } | null>(null);

	const { data, isFetching, isError, error, refetch } = useGetVercelDeploymentsQuery({
		id,
		project: projectRef,
		team,
		target,
		state,
	});

	const { data: logs, isFetching: logsFetching } = useGetVercelBuildLogsQuery(
		{ id, deployment: logsFor || '', team },
		{ skip: !logsFor }
	);

	const [deploy, deployResult] = useCreateVercelDeploymentMutation();
	const [promote, promoteResult] = usePromoteVercelDeploymentMutation();
	const [cancel, cancelResult] = useCancelVercelDeploymentMutation();
	const [remove, removeResult] = useDeleteVercelDeploymentMutation();

	const deployments = data?.deployments || [];
	const needsTypedConfirm = !!storefront;

	const runPending = async () => {
		if (!pending) return;
		const { kind, row } = pending;

		if (kind === 'promote') {
			await promote({
				id,
				project: projectRef,
				deployment: row.id,
				team,
				...(needsTypedConfirm ? { confirm: projectName } : {}),
			});
		} else if (kind === 'redeploy') {
			await deploy({
				id,
				project: projectRef,
				team,
				deploymentId: row.id,
				target: row.target || 'production',
				...(needsTypedConfirm && row.target === 'production' ? { confirm: projectName } : {}),
			});
		} else if (kind === 'cancel') {
			await cancel({ id, deployment: row.id, team });
		} else if (kind === 'delete') {
			await remove({ id, deployment: row.id, team });
		}

		setPending(null);
	};

	const runBranchDeploy = async () => {
		await deploy({
			id,
			project: projectRef,
			team,
			ref: branch,
			target: branchTarget,
			...(needsTypedConfirm && branchTarget === 'production' ? { confirm: projectName } : {}),
		});
	};

	const columns: Column<any>[] = [
		{
			key: 'state',
			label: 'State',
			width: '150px',
			render: row => (
				<StatusDot
					state={row.readyState}
					label={
						row.isQueued
							? 'queued'
							: String(row.readyState || '').toLowerCase()
					}
					title={row.isQueued ? 'Waiting for the current build to finish' : undefined}
				/>
			),
		},
		{
			key: 'commit',
			label: 'Commit',
			render: row => (
				<Flex
					direction='column'
					gap={0.5}
					minW={0}>
					<Text
						fontSize='13px'
						lineClamp={1}>
						{row.commitMessage || 'No commit message'}
					</Text>
					<Text
						fontSize='xs'
						color='fg.muted'
						lineClamp={1}>
						{row.branch || 'unknown branch'}
						{row.author && ` · ${row.author}`}
					</Text>
				</Flex>
			),
		},
		{
			key: 'target',
			label: 'Target',
			width: '120px',
			render: row =>
				row.target ? (
					<Badge
						size='xs'
						colorPalette={row.target === 'production' ? 'green' : 'gray'}>
						{row.target}
					</Badge>
				) : (
					<Text
						fontSize='13px'
						color='fg.muted'>
						preview
					</Text>
				),
		},
		{
			key: 'duration',
			label: 'Build',
			numeric: true,
			width: '90px',
			render: row => (
				<Text
					fontSize='13px'
					color='fg.muted'>
					{typeof row.buildSeconds === 'number' ? `${row.buildSeconds}s` : '—'}
				</Text>
			),
		},
		{
			key: 'when',
			label: 'When',
			width: '190px',
			render: row => (
				<Text
					fontSize='13px'
					color='fg.muted'>
					{when(row.createdAt)}
				</Text>
			),
		},
	];

	return (
		<Flex
			direction='column'
			gap={4}>
			{hasGit && (
				<Panel title='Deploy a branch'>
					<Flex
						gap={2}
						align='center'
						flexWrap='wrap'>
						<Input
							size='sm'
							width='220px'
							borderRadius={radius.INPUT}
							placeholder='Branch'
							value={branch}
							onChange={event => setBranch(event.target.value)}
						/>
						<Dropdown
							size='sm'
							width='160px'
							value={branchTarget}
							onChange={v => setBranchTarget(v)}>
							<option value='preview'>Preview</option>
							<option value='production'>Production</option>
						</Dropdown>
						<Button
							size='sm'
							loading={deployResult.isLoading}
							disabled={!branch.trim()}
							onClick={runBranchDeploy}>
							Deploy
						</Button>
						{branchTarget === 'production' && (
							<Text
								fontSize='xs'
								color='fg.muted'>
								{storefront
									? `This replaces what ${storefront.shopName}'s visitors are served.`
									: 'This replaces what production serves.'}
							</Text>
						)}
					</Flex>
				</Panel>
			)}

			<Panel
				title='Deployments'
				flush
				actions={
					<Flex gap={2}>
						<Dropdown
							size='sm'
							width='150px'
							value={target}
							onChange={v => setTarget(v)}>
							{TARGETS.map(option => (
								<option
									key={option.value}
									value={option.value}>
									{option.label}
								</option>
							))}
						</Dropdown>
						<Dropdown
							size='sm'
							width='150px'
							value={state}
							onChange={v => setState(v)}>
							{STATES.map(option => (
								<option
									key={option.value}
									value={option.value}>
									{option.label}
								</option>
							))}
						</Dropdown>
					</Flex>
				}>
				{isFetching && !deployments.length ? (
					<TableSkeleton rows={6} />
				) : isError ? (
					<ErrorState
						error={error}
						onRetry={refetch}
					/>
				) : !deployments.length ? (
					<EmptyState
						title='No deployments'
						description={
							target || state ? 'Nothing matches these filters.' : 'Deploy a branch to start.'
						}
					/>
				) : (
					<DataTable<any>
						columns={columns}
						rows={deployments}
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
												value='logs'
												onClick={() => setLogsFor(row.id)}>
												View build logs
											</Menu.Item>
											<Menu.Item
												value='promote'
												disabled={row.id === productionId || isRunning(row.readyState)}
												onClick={() => setPending({ kind: 'promote', row })}>
												Promote to production
											</Menu.Item>
											<Menu.Item
												value='redeploy'
												disabled={isRunning(row.readyState)}
												onClick={() => setPending({ kind: 'redeploy', row })}>
												Redeploy
											</Menu.Item>
											<Menu.Item
												value='env'
												onClick={onEnvAndRedeploy}>
												Edit environment and redeploy
											</Menu.Item>
											{isRunning(row.readyState) && (
												<Menu.Item
													value='cancel'
													onClick={() => setPending({ kind: 'cancel', row })}>
													Cancel build
												</Menu.Item>
											)}
											<Menu.Item
												value='delete'
												color='fg.error'
												onClick={() => setPending({ kind: 'delete', row })}>
												Delete
											</Menu.Item>
										</Menu.Content>
									</Menu.Positioner>
								</Portal>
							</Menu.Root>
						)}
					/>
				)}
			</Panel>

			{logsFor && (
				<Panel
					title='Build logs'
					subtitle='Build output routinely contains environment values, tokens and connection strings.'
					actions={
						<Button
							size='xs'
							variant='ghost'
							onClick={() => setLogsFor(null)}>
							Close
						</Button>
					}>
					{logsFetching && !logs ? (
						<TableSkeleton rows={8} />
					) : !logs?.events?.length ? (
						<EmptyState title='No log output for this deployment' />
					) : (
						<Box
							maxH='420px'
							overflowY='auto'
							bg='bg.subtle'
							borderRadius={radius.CONTAINER}
							p={3}>
							{logs.events.map((event: any, index: number) => (
								<Text
									key={index}
									fontFamily='mono'
									fontSize='12px'
									whiteSpace='pre-wrap'
									color={
										event.type === 'stderr' || event.level === 'error'
											? 'fg.error'
											: 'fg.muted'
									}>
									{event.text}
								</Text>
							))}
						</Box>
					)}
				</Panel>
			)}

			<ConfirmAction
				isOpen={!!pending}
				onClose={() => setPending(null)}
				onConfirm={runPending}
				title={
					pending?.kind === 'promote'
						? 'Promote to production'
						: pending?.kind === 'redeploy'
							? 'Redeploy'
							: pending?.kind === 'cancel'
								? 'Cancel this build'
								: 'Delete this deployment'
				}
				consequence={
					pending?.kind === 'promote'
						? `Production will serve "${pending?.row?.commitMessage || 'this deployment'}" from ${
								pending?.row?.branch || 'its branch'
							}. Nothing is rebuilt, and promoting the current one back undoes it.${
								storefront ? ` ${storefront.shopName}'s visitors see this immediately.` : ''
							}`
						: pending?.kind === 'redeploy'
							? `This builds the same commit again with the current environment variables${
									pending?.row?.target === 'production' ? ' and replaces what production serves' : ''
								}.`
							: pending?.kind === 'cancel'
								? 'The running build stops. Whatever is currently deployed keeps serving.'
								: 'The deployment and its URL are removed permanently. This cannot be undone.'
				}
				confirmLabel={
					pending?.kind === 'promote'
						? 'Promote'
						: pending?.kind === 'redeploy'
							? 'Redeploy'
							: pending?.kind === 'cancel'
								? 'Cancel build'
								: 'Delete'
				}
				destructive={pending?.kind === 'delete'}
				isLoading={
					promoteResult.isLoading ||
					deployResult.isLoading ||
					cancelResult.isLoading ||
					removeResult.isLoading
				}
				typeToConfirm={
					needsTypedConfirm &&
					(pending?.kind === 'promote' ||
						(pending?.kind === 'redeploy' && pending?.row?.target === 'production'))
						? projectName
						: undefined
				}
			/>

			<Toast
				isError={
					deployResult.isError || promoteResult.isError || cancelResult.isError || removeResult.isError
				}
				error={
					deployResult.error || promoteResult.error || cancelResult.error || removeResult.error
				}
			/>
			<Toast
				isSuccess={promoteResult.isSuccess}
				successTitle='Promoted'
				successText='Production is now serving that deployment.'
			/>
			<Toast
				isSuccess={deployResult.isSuccess}
				successTitle='Deployment started'
				successText={
					deployResult.data?.usedFallback
						? 'Vercel would not redeploy that build directly, so the same branch was deployed again instead.'
						: 'It will appear in the list as it builds.'
				}
			/>
		</Flex>
	);
};

export default DeploymentsTab;
