'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge, Button, Grid, Flex, Input, Tabs, Text } from '@chakra-ui/react';
import {
	Layout,
	Toast,
	radius,
	useGetByIdQuery,
	useGetHerokuAccountQuery,
	useGetHerokuAppsQuery,
	useGetHerokuBillingQuery,
	useGetHerokuUsageQuery,
	useGetHerokuActivityQuery,
	useVerifyHerokuKeyMutation,
	useRotateHerokuKeyMutation,
} from '@/components/library';
import {
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
	Column,
	SortDir,
} from '@/components/library/cl';

const TABS = [
	{ value: 'overview', label: 'Overview' },
	{ value: 'apps', label: 'Apps' },
	{ value: 'billing', label: 'Billing' },
	{ value: 'usage', label: 'Usage' },
	{ value: 'activity', label: 'Activity' },
];

/**
 * Invoice amounts arrive as integer cents — a total of 777 is $7.77 — so the
 * division happens here, once, at the point of display. `amountsInCents` comes
 * from the backend rather than being assumed, so if Heroku ever changes the
 * unit the server says so instead of this quietly dividing by 100 anyway.
 */
const money = (cents: number, amountsInCents?: boolean) => {
	const amount = amountsInCents === false ? cents : cents / 100;
	return `$${amount.toFixed(2)}`;
};

/**
 * Heroku does not document its invoice state enum, and a real account returns
 * codes outside the four we know. Showing a bare `-1` in a State column is
 * worse than saying so — the label reads "unknown" and the raw code is on hover
 * for whoever has to identify it.
 */
const invoiceState = (invoice: any) =>
	invoice.state === 'unknown' && invoice.stateCode !== null
		? { label: 'unknown', title: `Heroku state code ${invoice.stateCode}` }
		: { label: invoice.state, title: undefined };

const HerokuAccountPage = () => {
	const { id }: { id: string } = useParams();
	const router = useRouter();

	const [tab, setTab] = useState('overview');
	const [appSearch, setAppSearch] = useState('');
	const [team, setTeam] = useState<string>('');
	const [sortKey, setSortKey] = useState<'name' | 'released' | 'dynoHours'>('name');
	const [sortDir, setSortDir] = useState<SortDir>('asc');
	const [rotating, setRotating] = useState(false);
	const [newKey, setNewKey] = useState('');

	const { data: stored, isLoading: storedLoading } = useGetByIdQuery(
		{ path: 'herokus', id },
		{ skip: !id }
	);

	const isInvalid = stored?.status === 'invalid';
	// Every live call is pointless once Heroku has rejected the key. `!stored`
	// matters as much as the status: on first render it is still undefined, so a
	// bare status check is false and the request goes out anyway.
	const skipLive = !id || !stored || isInvalid;

	const {
		data: live,
		isFetching: liveFetching,
		isError: liveIsError,
		error: liveError,
		refetch: refetchLive,
	} = useGetHerokuAccountQuery({ id }, { skip: !id });

	const {
		data: appsData,
		isFetching: appsFetching,
		isError: appsIsError,
		error: appsError,
		refetch: refetchApps,
	} = useGetHerokuAppsQuery({ id }, { skip: skipLive });

	const { data: billing, isFetching: billingFetching, isError: billingIsError, error: billingError } =
		useGetHerokuBillingQuery({ id }, { skip: skipLive || tab !== 'billing' });

	const { data: usage, isFetching: usageFetching, isError: usageIsError, error: usageError } =
		useGetHerokuUsageQuery({ id }, { skip: skipLive });

	const { data: activity, isFetching: activityFetching } = useGetHerokuActivityQuery(
		{ id },
		{ skip: !id || tab !== 'activity' }
	);

	const [verifyKey, verifyResult] = useVerifyHerokuKeyMutation();
	const [rotateKey, rotateResult] = useRotateHerokuKeyMutation();

	const apps = appsData?.apps || [];
	const teams: string[] = useMemo(
		() => Array.from(new Set(apps.map((app: any) => app.team).filter(Boolean))) as string[],
		[apps]
	);

	const thisMonth = usage?.usage?.[0];

	/**
	 * Dyno hours per app, keyed by name.
	 *
	 * The usage endpoint reports per-app figures for the whole account, so the
	 * apps table can show them without a second request. It can legitimately
	 * return nothing — the endpoint needs account-owner rights, and a token
	 * belonging to a collaborator gets a 403 — so every lookup falls back to a
	 * dash rather than a zero, which would read as "this app used nothing".
	 */
	const dynoHoursByApp: Record<string, number> = useMemo(() => {
		if (!thisMonth?.apps) return {};

		return thisMonth.apps.reduce((acc: Record<string, number>, app: any) => {
			if (app.appName) acc[app.appName] = app.dynos;
			return acc;
		}, {});
	}, [thisMonth]);

	const filteredApps = useMemo(() => {
		const term = appSearch.trim().toLowerCase();

		const matched = apps.filter((app: any) => {
			if (team && app.team !== team) return false;
			if (!term) return true;

			return [app.name, app.team, app.region, app.stack]
				.filter(Boolean)
				.some((field: string) => field.toLowerCase().includes(term));
		});

		const direction = sortDir === 'asc' ? 1 : -1;

		return [...matched].sort((a: any, b: any) => {
			if (sortKey === 'released') {
				// Never deployed sorts last in both directions rather than reading as
				// the oldest release — the app has no release date, it isn't ancient.
				const left = a.releasedAt ? new Date(a.releasedAt).getTime() : null;
				const right = b.releasedAt ? new Date(b.releasedAt).getTime() : null;

				if (left === null && right === null) return a.name.localeCompare(b.name);
				if (left === null) return 1;
				if (right === null) return -1;

				return (left - right) * direction;
			}

			if (sortKey === 'dynoHours') {
				const left = dynoHoursByApp[a.name];
				const right = dynoHoursByApp[b.name];

				if (left === undefined && right === undefined) return a.name.localeCompare(b.name);
				if (left === undefined) return 1;
				if (right === undefined) return -1;

				return (left - right) * direction;
			}

			return a.name.localeCompare(b.name) * direction;
		});
	}, [apps, appSearch, team, sortKey, sortDir, dynoHoursByApp]);

	/** Clicking the active column flips direction; a new column starts ascending. */
	const onSort = (key: string) => {
		if (key === sortKey) {
			setSortDir(current => (current === 'asc' ? 'desc' : 'asc'));
			return;
		}
		setSortKey(key as typeof sortKey);
		setSortDir('asc');
	};

	const onRotate = async () => {
		// Pre-flight against Heroku before writing: a key that does not work is
		// not a partial success, and replacing a good key with a dead one is the
		// worst outcome here.
		const check = await verifyKey({ apiKey: newKey.trim() });
		if ('error' in check) return;

		const result = await rotateKey({ id, apiKey: newKey.trim() });
		if ('error' in result) return;

		setRotating(false);
		setNewKey('');
	};

	if (!stored || storedLoading)
		return (
			<Layout
				title='Loading…'
				path='herokus'>
				<Flex
					direction='column'
					gap={6}
					pt={4}>
					<DetailSkeleton rows={3} />
				</Flex>
			</Layout>
		);

	const appColumns: Column<any>[] = [
		{
			key: 'name',
			label: 'Name',
			sortable: true,
			render: app => (
				<Flex
					align='center'
					gap={2}
					minW={0}>
					{app.maintenance && (
						<StatusDot
							tone='maintenance'
							showLabel={false}
						/>
					)}
					<Text
						fontSize='13px'
						fontWeight='600'
						truncate>
						{app.name}
					</Text>
				</Flex>
			),
		},
		{ key: 'region', label: 'Region', render: app => app.region || '—' },
		{ key: 'stack', label: 'Stack', render: app => app.stack || '—' },
		{ key: 'team', label: 'Team', render: app => app.team || 'Personal' },
		{
			key: 'dynoHours',
			label: 'Dyno Hours',
			numeric: true,
			sortable: true,
			render: app => {
				const hours = dynoHoursByApp[app.name];
				return hours === undefined ? '—' : hours;
			},
		},
		{
			key: 'released',
			label: 'Last Released',
			sortable: true,
			render: app => date(app.releasedAt),
		},
	];

	return (
		<Layout
			title={stored.label}
			path='herokus'>
			<Flex
				direction='column'
				gap={6}
				pt={{ base: 3, md: 5 }}
				pb={8}>
				<PageHeader
					breadcrumbs={[
						{ href: '/dashboard', title: 'Home' },
						{ href: '/herokus', title: 'Heroku Accounts' },
						{ href: `/herokus/${id}`, title: stored.label },
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
							{stored.accountEmail} · Key ••••{stored.keyLast4}
							{typeof live?.rateLimit?.remaining === 'number' &&
								` · ${live.rateLimit.remaining} API requests left this hour`}
						</>
					}
					actions={
						<>
							<Button
								size='sm'
								variant='outline'
								loading={liveFetching}
								onClick={() => {
									refetchLive();
									refetchApps();
								}}>
								Sync
							</Button>
							<Button
								size='sm'
								variant='outline'
								onClick={() => setRotating(true)}>
								Rotate Key
							</Button>
						</>
					}
				/>

				{isInvalid && (
					<Panel title='This key no longer works'>
						<Text fontSize='sm'>
							Heroku rejected this API key. It was most likely revoked or regenerated. Rotate it to
							restore access — nothing else on this page will load until you do.
						</Text>
						{stored.lastError && (
							<Text
								fontSize='xs'
								color='fg.muted'
								mt={2}>
								{stored.lastError}
							</Text>
						)}
					</Panel>
				)}

				{!isInvalid && (
					<Grid
						gap={3}
						templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}>
						<StatTile
							label='Apps'
							value={appsData?.count ?? '—'}
							isLoading={appsFetching && !appsData}
						/>
						<StatTile
							label='Dyno hours'
							value={thisMonth ? thisMonth.dynos : '—'}
							hint={usage?.start || 'this month'}
							isLoading={usageFetching && !usage}
						/>
						<StatTile
							label='Month to date'
							// Deliberately not money(): only invoice amounts are confirmed
							// as cents. Usage figures use an unverified unit, so this stays
							// bare rather than gaining a currency symbol it may not deserve.
							value={
								thisMonth
									? (thisMonth.addons + thisMonth.data + thisMonth.partner).toFixed(2)
									: '—'
							}
							hint='add-ons, data and partner (unit unconfirmed)'
							isLoading={usageFetching && !usage}
						/>
						<StatTile
							label='Latest invoice'
							value={
								billing?.invoices?.[0]
									? money(billing.invoices[0].total, billing.amountsInCents)
									: '—'
							}
							hint={billing?.invoices?.[0]?.state || 'open the Billing tab'}
							isLoading={billingFetching && !billing}
						/>
					</Grid>
				)}

				{!isInvalid && (
					<ConsoleTabs
						tabs={TABS}
						value={tab}
						onChange={setTab}>

						<Tabs.Content
							value='overview'
							px={0}>
							<Panel title='Account'>
								{liveFetching && !live ? (
									<DetailSkeleton />
								) : liveIsError ? (
									<ErrorState
										error={liveError}
										onRetry={refetchLive}
									/>
								) : (
									<Flex
										direction='column'
										gap={3}>
										<DetailRow
											label='Heroku email'
											value={live?.account?.email || stored.accountEmail}
										/>
										<DetailRow
											label='Name'
											value={live?.account?.name || stored.accountName}
										/>
										<DetailRow
											label='Verified'
											value={(live?.account?.verified ?? stored.isVerified) ? 'Yes' : 'No'}
										/>
										<DetailRow
											label='Two-factor'
											value={
												(live?.account?.twoFactor ?? stored.twoFactor) ? 'Enabled' : 'Disabled'
											}
										/>
										<DetailRow
											label='Default team'
											value={live?.account?.defaultTeam || stored.defaultTeam}
										/>
										<DetailRow
											label='Created'
											value={date(live?.account?.createdAt)}
										/>
										<DetailRow
											label='Last login'
											value={date(live?.account?.lastLogin)}
										/>
										<DetailRow
											label='Client'
											value={stored.client?.name}
										/>
										<DetailRow
											label='Project'
											value={stored.project?.name}
										/>
									</Flex>
								)}
							</Panel>
						</Tabs.Content>

						<Tabs.Content
							value='apps'
							px={0}>
							<Panel
								flush
								title='Apps'
								subtitle={
									teams.length > 1 ? `Across ${teams.length} teams and your personal account` : undefined
								}
								actions={
									<>
										{teams.length > 1 && (
											<Flex
												gap={1}
												flexWrap='wrap'>
												<TeamChip
													label='All'
													active={!team}
													onClick={() => setTeam('')}
												/>
												{teams.map(name => (
													<TeamChip
														key={name}
														label={name}
														active={team === name}
														onClick={() => setTeam(name)}
													/>
												))}
											</Flex>
										)}
										<FilterInput
											value={appSearch}
											onChange={setAppSearch}
											placeholder='Search name, team, region…'
											shown={filteredApps.length}
											total={apps.length}
										/>
									</>
								}>
								{appsFetching && !appsData ? (
									<TableSkeleton
										rows={6}
										cols={5}
									/>
								) : appsIsError ? (
									<ErrorState
										error={appsError}
										onRetry={refetchApps}
									/>
								) : apps.length === 0 ? (
									<EmptyState
										title='No apps on this account'
										description='Apps created on Heroku under this account, or any team it belongs to, will appear here.'
									/>
								) : filteredApps.length === 0 ? (
									<EmptyState
										title='No apps match that search'
										description='Try a different name, team or region.'
										action={
											<Button
												size='xs'
												variant='outline'
												onClick={() => {
													setAppSearch('');
													setTeam('');
												}}>
												Clear filters
											</Button>
										}
									/>
								) : (
									<DataTable
										columns={appColumns}
										rows={filteredApps}
										rowKey={app => app.id}
										sortKey={sortKey}
										sortDir={sortDir}
										onSort={onSort}
										onRowClick={app => router.push(`/herokus/${id}/apps/${app.name}`)}
									/>
								)}
							</Panel>
						</Tabs.Content>

						<Tabs.Content
							value='billing'
							px={0}>
							<Panel
								flush
								title='Invoices'
								subtitle='Amounts are in USD, converted from the cents Heroku reports.'>
								{billingFetching && !billing ? (
									<TableSkeleton
										rows={5}
										cols={5}
									/>
								) : billingIsError ? (
									<ErrorState error={billingError} />
								) : !billing?.invoices?.length ? (
									<EmptyState
										title='No invoices yet'
										description='Heroku issues an invoice at the end of each billing period.'
									/>
								) : (
									<DataTable<any>
										rows={billing.invoices}
										rowKey={invoice => String(invoice.number)}
										columns={[
											{ key: 'number', label: 'Invoice', render: i => `#${i.number}` },
											{
												key: 'period',
												label: 'Period',
												render: i => `${date(i.periodStart)} – ${date(i.periodEnd)}`,
											},
											{
												key: 'charges',
												label: 'Charges',
												numeric: true,
												render: i => money(i.chargesTotal, billing.amountsInCents),
											},
											{
												key: 'credits',
												label: 'Credits',
												numeric: true,
												render: i => money(i.creditsTotal, billing.amountsInCents),
											},
											{
												key: 'total',
												label: 'Total',
												numeric: true,
												render: i => (
													<Text
														fontSize='13px'
														fontWeight='600'>
														{money(i.total, billing.amountsInCents)}
													</Text>
												),
											},
											{
												key: 'state',
												label: 'State',
												render: i => {
													const { label, title } = invoiceState(i);
													return (
														<StatusDot
															state={i.state}
															label={label}
															title={title}
														/>
													);
												},
											},
										]}
									/>
								)}
							</Panel>
						</Tabs.Content>

						<Tabs.Content
							value='usage'
							px={0}>
							<Panel
								flush
								title='Usage this month'
								subtitle={
									usage && !usage.unitsVerified
										? 'Values are as reported by Heroku; units are not yet confirmed.'
										: undefined
								}>
								{usageFetching && !usage ? (
									<TableSkeleton
										rows={4}
										cols={5}
									/>
								) : usageIsError ? (
									<ErrorState error={usageError} />
								) : !thisMonth?.apps?.length ? (
									<EmptyState
										title='No usage recorded'
										description='Nothing has been billed against this account for the current period.'
									/>
								) : (
									<DataTable<any>
										rows={thisMonth.apps}
										rowKey={app => app.appName || 'unknown'}
										columns={[
											{ key: 'app', label: 'App', render: a => a.appName || '—' },
											{ key: 'dynos', label: 'Dynos', numeric: true, render: a => a.dynos },
											{ key: 'addons', label: 'Add-ons', numeric: true, render: a => a.addons },
											{ key: 'data', label: 'Data', numeric: true, render: a => a.data },
											{ key: 'partner', label: 'Partner', numeric: true, render: a => a.partner },
										]}
									/>
								)}
							</Panel>
						</Tabs.Content>

						<Tabs.Content
							value='activity'
							px={0}>
							<Panel
								flush
								title='Activity'
								subtitle='Every change made through this console. Config var entries record key names only, never values.'>
								{activityFetching && !activity ? (
									<TableSkeleton
										rows={5}
										cols={4}
									/>
								) : !activity?.activity?.length ? (
									<EmptyState
										title='Nothing yet'
										description='Restarts, deploys, scaling and config changes made here will be listed.'
									/>
								) : (
									<DataTable<any>
										rows={activity.activity}
										rowKey={row => row._id}
										columns={[
											{
												key: 'summary',
												label: 'What happened',
												render: row => (
													<Flex
														direction='column'
														minW={0}>
														<Text
															fontSize='13px'
															truncate>
															{row.summary}
														</Text>
														{row.changes?.length > 0 && (
															<Text
																fontSize='xs'
																color='fg.muted'
																truncate>
																{row.changes
																	.map((c: any) => `${c.key} (${c.kind})`)
																	.join(', ')}
															</Text>
														)}
													</Flex>
												),
											},
											{ key: 'app', label: 'App', render: row => row.appName || '—' },
											{ key: 'by', label: 'By', render: row => row.performedByName },
											{
												key: 'status',
												label: 'Status',
												render: row => (
													<StatusDot
														tone={row.status === 'success' ? 'running' : 'failed'}
														label={row.status}
													/>
												),
											},
											{ key: 'when', label: 'When', render: row => date(row.createdAt) },
										]}
									/>
								)}
							</Panel>
						</Tabs.Content>
					</ConsoleTabs>
				)}
			</Flex>

			<ConfirmAction
				isOpen={rotating}
				onClose={() => setRotating(false)}
				onConfirm={onRotate}
				title='Rotate API key'
				confirmLabel='Verify and save'
				isLoading={verifyResult.isLoading || rotateResult.isLoading}
				consequence='The new key is checked against Heroku before anything is saved, so a bad key cannot replace a working one.'>
				<Input
					size='sm'
					type='password'
					autoComplete='off'
					placeholder='Heroku API key'
					value={newKey}
					borderRadius={radius.INPUT}
					onChange={event => setNewKey(event.target.value)}
				/>
			</ConfirmAction>

			<Toast
				isError={verifyResult.isError || rotateResult.isError}
				error={verifyResult.error || rotateResult.error}
			/>
			<Toast
				isSuccess={rotateResult.isSuccess}
				successTitle='Key rotated'
				successText='The account is using the new API key.'
			/>
		</Layout>
	);
};

const TeamChip = ({
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) => (
	<Button
		size='xs'
		variant={active ? 'solid' : 'outline'}
		borderRadius={radius.PILL}
		px={3}
		fontSize='12px'
		onClick={onClick}>
		{label}
	</Button>
);

export default HerokuAccountPage;
