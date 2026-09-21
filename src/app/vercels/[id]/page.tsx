'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Badge, Button, Flex, Grid, Input, NativeSelect, Tabs, Text } from '@chakra-ui/react';
import {
	Layout,
	Toast,
	radius,
	useGetByIdQuery,
	useGetVercelAccountQuery,
	useGetVercelProjectsQuery,
	useGetVercelUsageQuery,
	useGetVercelAccountResourcesQuery,
	useGetVercelActivityQuery,
	useVerifyVercelTokenMutation,
	useRotateVercelTokenMutation,
} from '@/components/library';
import {
	dateTime,
	date,
	DetailRow,
	ConsoleTabs,
	Panel,
	PageHeader,
	StatTile,
	StatusDot,
	DataTable,
	FilterInput,
	ConfirmAction,
	EmptyState,
	ErrorState,
	TableSkeleton,
	DetailSkeleton,
	ResourceSection,
	Column,
	SortDir,
} from '@/components/library/cl';
import UsageTab from './_tabs/UsageTab';
import NewProject from './_tabs/NewProject';

const TABS = [
	{ value: 'overview', label: 'Overview' },
	{ value: 'projects', label: 'Projects' },
	{ value: 'usage', label: 'Usage' },
	{ value: 'resources', label: 'Resources' },
	{ value: 'domains', label: 'Domains' },
	{ value: 'activity', label: 'Activity' },
];

const PLAN_LABEL: Record<string, string> = {
	hobby: 'Hobby',
	pro: 'Pro',
	enterprise: 'Enterprise',
	unknown: 'Unknown',
};

const VercelAccountPage = () => {
	const params = useParams();
	const router = useRouter();
	const search = useSearchParams();
	const id = String(params?.id || '');

	const [tab, setTab] = useState('overview');
	const [filter, setFilter] = useState('');
	const [sortKey, setSortKey] = useState('name');
	const [sortDir, setSortDir] = useState<SortDir>('asc');
	const [rotating, setRotating] = useState(false);
	const [newToken, setNewToken] = useState('');
	const [days, setDays] = useState(30);
	const [creating, setCreating] = useState(false);

	// The team rides in the URL so a link to this page is a link to this scope.
	const team = String(search?.get('team') || '');

	const { data: stored, isLoading: storedLoading } = useGetByIdQuery(
		{ path: 'vercels', id },
		{ skip: !id }
	);

	const isInvalid = stored?.status === 'invalid';
	// Every live call is pointless once Vercel has rejected the token. `!stored`
	// matters as much as the status: on first render it is still undefined, so a
	// bare status check is false and the request goes out anyway.
	const skipLive = !id || !stored || isInvalid;

	const {
		data: live,
		isFetching: liveFetching,
		isError: liveIsError,
		error: liveError,
		refetch: refetchLive,
	} = useGetVercelAccountQuery({ id, team }, { skip: !id });

	const {
		data: projectsData,
		isFetching: projectsFetching,
		isError: projectsIsError,
		error: projectsError,
		refetch: refetchProjects,
	} = useGetVercelProjectsQuery({ id, team }, { skip: skipLive });

	const {
		data: usageData,
		isFetching: usageFetching,
		isError: usageIsError,
		error: usageError,
	} = useGetVercelUsageQuery({ id, days, team }, { skip: skipLive || tab !== 'usage' });

	const {
		data: resourcesData,
		isFetching: resourcesFetching,
		isError: resourcesIsError,
		error: resourcesError,
	} = useGetVercelAccountResourcesQuery(
		{ id, team },
		{ skip: skipLive || (tab !== 'resources' && tab !== 'domains') }
	);

	const { data: activity, isFetching: activityFetching } = useGetVercelActivityQuery(
		{ id },
		{ skip: !id || tab !== 'activity' }
	);

	const [verifyToken, verifyResult] = useVerifyVercelTokenMutation();
	const [rotateToken, rotateResult] = useRotateVercelTokenMutation();

	const projects = projectsData?.projects || [];
	const teams = live?.teams || stored?.teams || [];
	const resources = resourcesData?.resources;

	const filtered = useMemo(() => {
		const needle = filter.trim().toLowerCase();

		const matched = needle
			? projects.filter((project: any) =>
					[project.name, project.framework, project.gitRepo?.repo, project.storefront?.shopName]
						.filter(Boolean)
						.some((field: string) => String(field).toLowerCase().includes(needle))
				)
			: projects;

		const sorted = [...matched].sort((a: any, b: any) => {
			const pick = (row: any) => {
				if (sortKey === 'framework') return row.framework || '';
				if (sortKey === 'repo') return row.gitRepo?.repo || '';
				if (sortKey === 'updated') return row.updatedAt || '';
				return row.name || '';
			};

			const result = String(pick(a)).localeCompare(String(pick(b)));
			return sortDir === 'asc' ? result : -result;
		});

		return sorted;
	}, [projects, filter, sortKey, sortDir]);

	const onSort = (key: string) => {
		if (key === sortKey) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
		else {
			setSortKey(key);
			setSortDir('asc');
		}
	};

	const switchTeam = (next: string) => {
		const query = next ? `?team=${encodeURIComponent(next)}` : '';
		router.replace(`/vercels/${id}${query}`);
	};

	if (storedLoading || !stored) {
		return (
			<Layout
				title='Loading…'
				path='vercels'>
				<Flex
					direction='column'
					gap={6}
					pt={{ base: 3, md: 5 }}>
					<DetailSkeleton />
				</Flex>
			</Layout>
		);
	}

	const projectColumns: Column<any>[] = [
		{
			key: 'name',
			label: 'Name',
			sortable: true,
			render: row => (
				<Flex
					align='center'
					gap={2}
					minW={0}>
					<Text
						fontSize='13px'
						fontWeight='600'
						lineClamp={1}>
						{row.name}
					</Text>
					{row.storefront && (
						<Badge
							size='xs'
							colorPalette='purple'
							title={`Live storefront for ${row.storefront.shopName}`}>
							Storefront
						</Badge>
					)}
				</Flex>
			),
		},
		{
			key: 'framework',
			label: 'Framework',
			sortable: true,
			render: row => (
				<Text
					fontSize='13px'
					color='fg.muted'>
					{row.framework || '—'}
				</Text>
			),
		},
		{
			key: 'repo',
			label: 'Repository',
			sortable: true,
			render: row => (
				<Text
					fontSize='13px'
					fontFamily='mono'
					color='fg.muted'
					lineClamp={1}>
					{row.gitRepo?.repo ? `${row.gitRepo.org || ''}/${row.gitRepo.repo}` : '—'}
				</Text>
			),
		},
		{
			key: 'state',
			label: 'Production',
			render: row =>
				row.latestProductionDeployment ? (
					<StatusDot
						state={row.latestProductionDeployment.readyState}
						label={String(row.latestProductionDeployment.readyState || '').toLowerCase()}
					/>
				) : (
					<Text
						fontSize='13px'
						color='fg.muted'>
						Never deployed
					</Text>
				),
		},
		{
			key: 'updated',
			label: 'Updated',
			sortable: true,
			render: row => (
				<Text
					fontSize='13px'
					color='fg.muted'>
					{date(row.updatedAt)}
				</Text>
			),
		},
	];

	return (
		<Layout
			title={stored.label}
			path='vercels'>
			<Flex
				direction='column'
				gap={6}
				pt={{ base: 3, md: 5 }}
				pb={8}>
				<PageHeader
					breadcrumbs={[
						{ href: '/dashboard', title: 'Home' },
						{ href: '/vercels', title: 'Vercel Accounts' },
						{ href: `/vercels/${id}`, title: stored.label },
					]}
					title={stored.label}
					badge={
						<Badge
							size='sm'
							colorPalette={
								stored.status === 'active' ? 'green' : stored.status === 'invalid' ? 'red' : 'orange'
							}>
							{stored.status}
						</Badge>
					}
					meta={
						<>
							{stored.userEmail} · {PLAN_LABEL[live?.account?.plan || stored.plan] || 'Unknown plan'} ·
							Token ••••{stored.tokenLast4}
							{/* Null whenever Vercel sent no rate headers — nothing here
								invents a budget. */}
							{typeof live?.rateLimit?.remaining === 'number' &&
								` · ${live.rateLimit.remaining} API requests left this hour`}
						</>
					}
					actions={
						<>
							{/* Rendered only when there is something to switch between.
								A personal account has one scope and no switcher. */}
							{teams.length > 1 && (
								<NativeSelect.Root
									size='sm'
									width='220px'>
									<NativeSelect.Field
										value={team}
										onChange={event => switchTeam(event.target.value)}>
										<option value=''>Personal account</option>
										{teams.map((entry: any) => (
											<option
												key={entry.teamId}
												value={entry.teamId}>
												{entry.name || entry.slug}
											</option>
										))}
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							)}
							<Button
								size='sm'
								variant='outline'
								loading={liveFetching}
								onClick={() => {
									refetchLive();
									refetchProjects();
								}}>
								Sync
							</Button>
							<Button
								size='sm'
								variant='outline'
								onClick={() => setRotating(true)}>
								Rotate Token
							</Button>
							<Button
								size='sm'
								onClick={() => setCreating(true)}>
								New Project
							</Button>
						</>
					}
				/>

				{isInvalid && (
					<Panel title='This token no longer works'>
						<Text fontSize='sm'>
							Vercel rejected it. Rotate the token to bring this account back online — every
							live view stays empty until then.
						</Text>
					</Panel>
				)}

				<Grid
					templateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }}
					gap={3}>
					<StatTile
						label='Projects'
						isLoading={projectsFetching}
						value={projectsData?.count ?? stored.projectCount ?? '—'}
					/>
					<StatTile
						label='Deployments'
						hint='last 30 days'
						isLoading={usageFetching}
						value={usageData?.usage?.builds?.total ?? '—'}
					/>
					<StatTile
						label='Domains'
						isLoading={resourcesFetching}
						value={resources?.domains?.available ? resources.domains.items.length : '—'}
					/>
					<StatTile
						label='Plan'
						hint={live?.account?.plan === 'hobby' ? 'metered usage is Pro-only' : undefined}
						value={PLAN_LABEL[live?.account?.plan || stored.plan] || 'Unknown'}
					/>
				</Grid>

				<ConsoleTabs
					tabs={TABS}
					value={tab}
					onChange={setTab}>

					<Tabs.Content value='overview'>
						<Panel title='Account'>
							{liveIsError ? (
								<ErrorState
									error={liveError}
									onRetry={refetchLive}
								/>
							) : (
								<Flex
									direction='column'
									gap={3}>
									<DetailRow
										label='Username'
										value={live?.account?.username || stored.username}
									/>
									<DetailRow
										label='Email'
										value={live?.account?.userEmail || stored.userEmail}
									/>
									<DetailRow
										label='Name'
										value={live?.account?.displayName || stored.displayName}
									/>
									<DetailRow
										label='Plan'
										value={PLAN_LABEL[live?.account?.plan || stored.plan] || 'Unknown'}
									/>
									<DetailRow
										label='Teams'
										value={teams.length ? teams.map((t: any) => t.name).join(', ') : 'Personal account only'}
									/>
									<DetailRow
										label='Client'
										value={stored.client?.name}
									/>
									<DetailRow
										label='Project'
										value={stored.project?.name}
									/>
									<DetailRow
										label='Last synced'
										value={dateTime(stored.lastSyncedAt)}
									/>
								</Flex>
							)}
						</Panel>
					</Tabs.Content>

					<Tabs.Content value='projects'>
						<Panel
							title='Projects'
							flush
							actions={
								<FilterInput
									value={filter}
									onChange={setFilter}
									placeholder='Filter by name, framework, repo or shop…'
									shown={filtered.length}
									total={projects.length}
								/>
							}>
							{projectsFetching && !projects.length ? (
								<TableSkeleton rows={6} />
							) : projectsIsError ? (
								<ErrorState
									error={projectsError}
									onRetry={refetchProjects}
								/>
							) : !filtered.length ? (
								<EmptyState
									title={filter ? 'No project matches that' : 'No projects yet'}
									description={
										filter ? 'Try a shorter search.' : 'Create one to get started.'
									}
								/>
							) : (
								<DataTable<any>
									columns={projectColumns}
									rows={filtered}
									rowKey={row => row.id}
									sortKey={sortKey}
									sortDir={sortDir}
									onSort={onSort}
									onRowClick={row =>
										router.push(
											`/vercels/${id}/projects/${row.id}${team ? `?team=${team}` : ''}`
										)
									}
								/>
							)}
						</Panel>
					</Tabs.Content>

					<Tabs.Content value='usage'>
						<UsageTab
							usage={usageData?.usage}
							isFetching={usageFetching}
							isError={usageIsError}
							error={usageError}
							days={days}
							setDays={setDays}
						/>
					</Tabs.Content>

					<Tabs.Content value='resources'>
						{resourcesIsError ? (
							<ErrorState error={resourcesError} />
						) : (
							<Flex
								direction='column'
								gap={4}>
								{/* Nothing uses these. Surfaced first because it is the
									one question the per-project view cannot answer, and
									an unused paid store is money leaving the account. */}
								{!!(resources?.orphans?.stores?.length || resources?.orphans?.integrations?.length) && (
									<Panel
										title='Attached to no project'
										subtitle='Still provisioned, and still billed if it is a paid plan.'>
										<Flex
											direction='column'
											gap={2}>
											{[...(resources.orphans.stores || []), ...(resources.orphans.integrations || [])].map(
												(item: any) => (
													<Flex
														key={item.id}
														align='center'
														gap={2}>
														<StatusDot
															tone='pending'
															showLabel={false}
														/>
														<Text fontSize='13px'>{item.name || item.slug || item.id}</Text>
														<Text
															fontSize='xs'
															color='fg.muted'>
															{item.type || 'integration'}
														</Text>
													</Flex>
												)
											)}
										</Flex>
									</Panel>
								)}

								<ResourceSection
									title='Stores'
									section={resources?.stores}
									emptyText='No Blob, Postgres, KV or Edge Config stores'
									rowKey={row => row.id}
									columns={[
										{ key: 'name', label: 'Name', render: row => <Text fontSize='13px'>{row.name || row.id}</Text> },
										{ key: 'type', label: 'Type', render: row => <Text fontSize='13px' color='fg.muted'>{row.type || '—'}</Text> },
										{ key: 'region', label: 'Region', render: row => <Text fontSize='13px' color='fg.muted'>{row.region || '—'}</Text> },
										{ key: 'projects', label: 'Used by', render: row => <Text fontSize='13px' color='fg.muted'>{row.projects?.join(', ') || 'Nothing'}</Text> },
									]}
								/>

								<ResourceSection
									title='Integrations'
									section={resources?.integrations}
									emptyText='No marketplace integrations installed'
									rowKey={row => row.id}
									columns={[
										{ key: 'name', label: 'Name', render: row => <Text fontSize='13px'>{row.name || row.slug}</Text> },
										{ key: 'projects', label: 'Used by', render: row => <Text fontSize='13px' color='fg.muted'>{row.projects?.join(', ') || 'Nothing'}</Text> },
										{ key: 'created', label: 'Installed', render: row => <Text fontSize='13px' color='fg.muted'>{date(row.createdAt)}</Text> },
									]}
								/>

								<ResourceSection
									title='Log drains'
									section={resources?.logDrains}
									emptyText='No log drains configured'
									rowKey={row => row.id}
									columns={[
										{ key: 'name', label: 'Name', render: row => <Text fontSize='13px'>{row.name || row.id}</Text> },
										{ key: 'url', label: 'Endpoint', render: row => <Text fontSize='13px' fontFamily='mono' color='fg.muted' lineClamp={1}>{row.url || '—'}</Text> },
									]}
								/>
							</Flex>
						)}
					</Tabs.Content>

					<Tabs.Content value='domains'>
						<ResourceSection
							title='Domains on this account'
							section={resources?.domains}
							emptyText='No domains on this account'
							rowKey={row => row.name}
							columns={[
								{ key: 'name', label: 'Domain', render: row => <Text fontSize='13px' fontFamily='mono'>{row.name}</Text> },
								{
									key: 'verified',
									label: 'Status',
									render: row => (
										<StatusDot
											tone={row.verified ? 'running' : 'pending'}
											label={row.verified ? 'verified' : 'unverified'}
										/>
									),
								},
								{ key: 'service', label: 'Service', render: row => <Text fontSize='13px' color='fg.muted'>{row.serviceType || '—'}</Text> },
								{ key: 'expires', label: 'Expires', render: row => <Text fontSize='13px' color='fg.muted'>{date(row.expiresAt)}</Text> },
							]}
						/>
					</Tabs.Content>

					<Tabs.Content value='activity'>
						<Panel
							title='Activity'
							flush>
							{activityFetching && !activity ? (
								<TableSkeleton rows={5} />
							) : !activity?.activity?.length ? (
								<EmptyState
									title='Nothing yet'
									description='Every change made from this console is recorded here.'
								/>
							) : (
								<DataTable<any>
									columns={[
										{
											key: 'summary',
											label: 'What happened',
											render: row => (
												<Flex
													direction='column'
													gap={0.5}
													minW={0}>
													<Text fontSize='13px'>{row.summary}</Text>
													{!!row.changes?.length && (
														<Text
															fontSize='xs'
															color='fg.muted'
															lineClamp={1}>
															{/* Names and targets only — never a value. */}
															{row.changes
																.map((c: any) => `${c.kind} ${c.key} (${c.target})`)
																.join(', ')}
														</Text>
													)}
												</Flex>
											),
										},
										{
											key: 'project',
											label: 'Project',
											render: row => (
												<Flex
													align='center'
													gap={2}>
													<Text
														fontSize='13px'
														color='fg.muted'>
														{row.projectName || '—'}
													</Text>
													{row.isStorefront && (
														<Badge
															size='xs'
															colorPalette='purple'>
															Shop
														</Badge>
													)}
												</Flex>
											),
										},
										{
											key: 'status',
											label: 'Result',
											render: row => (
												<StatusDot
													tone={
														row.status === 'success'
															? 'running'
															: row.status === 'partial'
																? 'pending'
																: 'failed'
													}
													label={row.status}
													title={row.errorMessage || undefined}
												/>
											),
										},
										{
											key: 'who',
											label: 'Who',
											render: row => (
												<Text
													fontSize='13px'
													color='fg.muted'>
													{row.performedByName}
												</Text>
											),
										},
										{
											key: 'when',
											label: 'When',
											render: row => (
												<Text
													fontSize='13px'
													color='fg.muted'>
													{dateTime(row.createdAt)}
												</Text>
											),
										},
									]}
									rows={activity.activity}
									rowKey={row => row._id}
								/>
							)}
						</Panel>
					</Tabs.Content>
				</ConsoleTabs>
			</Flex>

			<NewProject
				id={id}
				team={team}
				isOpen={creating}
				onClose={() => setCreating(false)}
				onCreated={project =>
					router.push(`/vercels/${id}/projects/${project.id}${team ? `?team=${team}` : ''}`)
				}
			/>

			<ConfirmAction
				isOpen={rotating}
				onClose={() => {
					setRotating(false);
					setNewToken('');
				}}
				onConfirm={async () => {
					const check: any = await verifyToken({ apiToken: newToken });
					if (!check?.data?.valid) return;

					await rotateToken({ id, apiToken: newToken });
					setRotating(false);
					setNewToken('');
				}}
				title='Rotate API token'
				consequence='The new token is checked against Vercel before it replaces the stored one. A token belonging to a different Vercel account is refused.'
				confirmLabel='Rotate'
				isLoading={verifyResult.isLoading || rotateResult.isLoading}>
				<Input
					size='sm'
					type='password'
					borderRadius={radius.INPUT}
					placeholder='New Vercel API token'
					value={newToken}
					onChange={event => setNewToken(event.target.value)}
				/>
			</ConfirmAction>

			<Toast
				isError={verifyResult.isError || rotateResult.isError}
				error={verifyResult.error || rotateResult.error}
			/>
			<Toast
				isSuccess={rotateResult.isSuccess}
				successTitle='Token rotated'
				successText='The account is using the new API token.'
			/>
		</Layout>
	);
};

export default VercelAccountPage;
