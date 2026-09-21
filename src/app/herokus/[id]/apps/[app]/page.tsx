'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import NextLink from 'next/link';
import { Badge, Button, Flex, Link, Menu, Portal, Tabs, Text } from '@chakra-ui/react';
import { ExternalLink as ExternalIcon, MoreHorizontal as MoreIcon } from 'lucide-react';
import {
	Layout,
	Toast,
	radius,
	useGetByIdQuery,
	useGetHerokuAppQuery,
	useGetHerokuCurrentReleaseQuery,
	useRedeployHerokuAppMutation,
	useRestartHerokuAppMutation,
} from '@/components/library';
import {
	Panel,
	PageHeader,
	StatusDot,
	CopyValue,
	ConfirmAction,
	ErrorState,
	DetailSkeleton,
} from '../../../_components';
import ConfigVarsTab from './_tabs/ConfigVarsTab';
import DeploysTab from './_tabs/DeploysTab';
import DynosTab from './_tabs/DynosTab';
import LogsTab from './_tabs/LogsTab';
import ResourcesTab from './_tabs/ResourcesTab';
import SettingsTab from './_tabs/SettingsTab';

const TABS = [
	{ value: 'overview', label: 'Overview' },
	{ value: 'config', label: 'Config Vars' },
	{ value: 'deploys', label: 'Deploys' },
	{ value: 'dynos', label: 'Dynos' },
	{ value: 'logs', label: 'Logs' },
	{ value: 'resources', label: 'Resources' },
	{ value: 'settings', label: 'Settings' },
];

const when = (value?: string | null) =>
	value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const bytes = (value?: number | null) =>
	typeof value === 'number' ? `${(value / 1024 / 1024).toFixed(1)} MB` : '—';

const HerokuAppPage = () => {
	const { id, app }: { id: string; app: string } = useParams();

	const [tab, setTab] = useState('overview');
	const [redeploying, setRedeploying] = useState(false);
	const [restarting, setRestarting] = useState(false);

	// Only for the breadcrumb — an account's label reads as a name, its ObjectId
	// does not.
	const { data: stored } = useGetByIdQuery({ path: 'herokus', id }, { skip: !id });

	const {
		data: appData,
		isFetching: appFetching,
		isError: appIsError,
		error: appError,
		refetch: refetchApp,
	} = useGetHerokuAppQuery({ id, app }, { skip: !id || !app });

	const { data: releaseData } = useGetHerokuCurrentReleaseQuery(
		{ id, app },
		{ skip: !id || !app }
	);

	const [redeploy, redeployResult] = useRedeployHerokuAppMutation();
	const [restart, restartResult] = useRestartHerokuAppMutation();

	const detail = appData?.app;
	const release = releaseData?.release;

	const onRedeploy = async () => {
		const result = await redeploy({ id, app });
		if ('error' in result) return;
		setRedeploying(false);
	};

	const onRestart = async () => {
		const result = await restart({ id, app });
		if ('error' in result) return;
		setRestarting(false);
	};

	return (
		<Layout
			title={app || 'Loading…'}
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
						{ href: `/herokus/${id}`, title: stored?.label || '…' },
						{ href: `/herokus/${id}/apps/${app}`, title: app },
					]}
					title={app}
					badge={
						detail?.maintenance ? (
							<Badge
								size='sm'
								colorPalette='blue'>
								maintenance
							</Badge>
						) : null
					}
					meta={
						detail
							? [detail.region, detail.stack, detail.team || 'Personal']
									.filter(Boolean)
									.join(' · ')
							: undefined
					}
					actions={
						<>
							{detail?.webUrl && (
								<Link
									href={detail.webUrl}
									target='_blank'
									rel='noreferrer'>
									<Button
										size='sm'
										variant='outline'>
										Visit <ExternalIcon size={13} />
									</Button>
								</Link>
							)}

							<Button
								size='sm'
								variant='outline'
								onClick={() => setRestarting(true)}>
								Restart
							</Button>

							<Button
								size='sm'
								onClick={() => setRedeploying(true)}>
								Redeploy
							</Button>

							<Menu.Root>
								<Menu.Trigger asChild>
									<Button
										size='sm'
										variant='ghost'
										aria-label='More actions'>
										<MoreIcon size={16} />
									</Button>
								</Menu.Trigger>
								<Portal>
									<Menu.Positioner>
										<Menu.Content borderRadius={radius.MENU}>
											<Menu.Item
												value='settings'
												onClick={() => setTab('settings')}>
												App settings
											</Menu.Item>
											<Menu.Item
												value='logs'
												onClick={() => setTab('logs')}>
												View logs
											</Menu.Item>
											<Menu.Item
												value='heroku'
												asChild>
												<NextLink
													href={`https://dashboard.heroku.com/apps/${app}`}
													target='_blank'>
													Open on Heroku
												</NextLink>
											</Menu.Item>
										</Menu.Content>
									</Menu.Positioner>
								</Portal>
							</Menu.Root>
						</>
					}
				/>

				{appIsError ? (
					<ErrorState
						error={appError}
						onRetry={refetchApp}
					/>
				) : (
					<>
						<Panel title='Current release'>
							{!release ? (
								<Text
									fontSize='sm'
									color='fg.muted'>
									{appFetching ? 'Loading…' : 'This app has never been deployed.'}
								</Text>
							) : (
								<Flex
									align='center'
									justify='space-between'
									gap={4}
									flexWrap='wrap'>
									<Flex
										direction='column'
										gap={1}
										minW={0}>
										<Flex
											align='center'
											gap={3}>
											<Text
												fontSize='sm'
												fontWeight='600'
												fontFamily='mono'>
												v{release.version}
											</Text>
											<StatusDot state={release.status} />
										</Flex>
										<Text
											fontSize='13px'
											truncate>
											{release.description}
										</Text>
										<Text
											fontSize='xs'
											color='fg.muted'>
											{release.user || 'unknown'} · {when(release.createdAt)}
										</Text>
									</Flex>

									<Button
										size='sm'
										variant='outline'
										onClick={() => setTab('deploys')}>
										Release history
									</Button>
								</Flex>
							)}
						</Panel>

						<Tabs.Root
							size='sm'
							variant='subtle'
							lazyMount
							value={tab}
							onValueChange={event => setTab(event.value)}>
							<Tabs.List
								border='none'
								gap={1}
								flexWrap='wrap'
								mb={4}>
								{TABS.map(item => (
									<Tabs.Trigger
										key={item.value}
										value={item.value}
										px={3}
										fontSize='13px'
										borderRadius={radius.PILL}
										_selected={{ bg: 'bg.inverted', color: 'fg.inverted' }}>
										{item.label}
									</Tabs.Trigger>
								))}
							</Tabs.List>

							<Tabs.Content
								value='overview'
								px={0}>
								<Panel title='App'>
									{appFetching && !detail ? (
										<DetailSkeleton />
									) : (
										<Flex
											direction='column'
											gap={3}>
											<Row
												label='Web URL'
												value={
													detail?.webUrl ? (
														<Link
															href={detail.webUrl}
															target='_blank'
															rel='noreferrer'
															fontSize='13px'>
															{detail.webUrl}
														</Link>
													) : (
														'—'
													)
												}
											/>
											<Row
												label='Git remote'
												value={
													detail?.gitUrl ? (
														<CopyValue
															value={detail.gitUrl}
															ariaLabel='Copy git remote'
														/>
													) : (
														'—'
													)
												}
											/>
											<Row
												label='Buildpack'
												value={detail?.buildpack || '—'}
											/>
											<Row
												label='Stack'
												value={detail?.stack || '—'}
											/>
											<Row
												label='Region'
												value={detail?.region || '—'}
											/>
											<Row
												label='Owner'
												value={detail?.owner || '—'}
											/>
											<Row
												label='Team'
												value={detail?.team || 'Personal'}
											/>
											<Row
												label='Slug size'
												value={bytes(detail?.slugSize)}
											/>
											<Row
												label='Last released'
												value={when(detail?.releasedAt)}
											/>
										</Flex>
									)}
								</Panel>
							</Tabs.Content>

							<Tabs.Content
								value='config'
								px={0}>
								<ConfigVarsTab
									id={id}
									app={app}
								/>
							</Tabs.Content>

							<Tabs.Content
								value='deploys'
								px={0}>
								<DeploysTab
									id={id}
									app={app}
								/>
							</Tabs.Content>

							<Tabs.Content
								value='dynos'
								px={0}>
								<DynosTab
									id={id}
									app={app}
								/>
							</Tabs.Content>

							<Tabs.Content
								value='logs'
								px={0}>
								<LogsTab
									id={id}
									app={app}
								/>
							</Tabs.Content>

							<Tabs.Content
								value='resources'
								px={0}>
								<ResourcesTab
									id={id}
									app={app}
								/>
							</Tabs.Content>

							<Tabs.Content
								value='settings'
								px={0}>
								<SettingsTab
									id={id}
									app={app}
									maintenance={!!detail?.maintenance}
								/>
							</Tabs.Content>
						</Tabs.Root>
					</>
				)}
			</Flex>

			<ConfirmAction
				isOpen={redeploying}
				onClose={() => setRedeploying(false)}
				onConfirm={onRedeploy}
				title={`Redeploy ${app}`}
				confirmLabel='Redeploy'
				destructive
				typeToConfirm={app}
				isLoading={redeployResult.isLoading}
				consequence={`This re-releases the build that is already live${release ? ` (v${release.version})` : ''} and restarts every dyno. It does not fetch new code — for that, use Build from URL on the Deploys tab.`}
			/>

			<ConfirmAction
				isOpen={restarting}
				onClose={() => setRestarting(false)}
				onConfirm={onRestart}
				title={`Restart ${app}`}
				confirmLabel='Restart'
				destructive
				typeToConfirm={app}
				isLoading={restartResult.isLoading}
				consequence={`Every dyno on ${app} stops and restarts. The app will be briefly unavailable.`}
			/>

			<Toast
				isError={redeployResult.isError || restartResult.isError}
				error={redeployResult.error || restartResult.error}
			/>
			<Toast
				isSuccess={redeployResult.isSuccess || restartResult.isSuccess}
				successTitle='Done'
				successText={`${app} is restarting.`}
			/>
		</Layout>
	);
};

const Row = ({ label, value }: { label: string; value: any }) => (
	<Flex
		gap={4}
		align='baseline'>
		<Text
			fontSize='13px'
			color='fg.muted'
			minW='140px'>
			{label}
		</Text>
		<Flex
			fontSize='13px'
			minW={0}>
			{value}
		</Flex>
	</Flex>
);

export default HerokuAppPage;
