'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Badge, Button, Flex, Menu, Portal, Tabs, Text } from '@chakra-ui/react';
import { ChevronDown, Github } from 'lucide-react';
import {
	Layout,
	Toast,
	useGetByIdQuery,
	useGetVercelProjectQuery,
	useGetVercelDeploymentsQuery,
	useCreateVercelDeploymentMutation,
	usePromoteVercelDeploymentMutation,
} from '@/components/library';
import {
	when,
	ConsoleTabs,
	Panel,
	PageHeader,
	StatusDot,
	ConfirmAction,
	CopyValue,
	ErrorState,
	DetailSkeleton,
} from '@/components/library/cl';
import OverviewTab from './_tabs/OverviewTab';
import EnvironmentTab from './_tabs/EnvironmentTab';
import DeploymentsTab from './_tabs/DeploymentsTab';
import DomainsTab from './_tabs/DomainsTab';
import ResourcesTab from './_tabs/ResourcesTab';
import SettingsTab from './_tabs/SettingsTab';

const TABS = [
	{ value: 'overview', label: 'Overview' },
	{ value: 'environment', label: 'Environment' },
	{ value: 'deployments', label: 'Deployments' },
	{ value: 'domains', label: 'Domains' },
	{ value: 'resources', label: 'Resources' },
	{ value: 'settings', label: 'Settings' },
];

const VercelProjectPage = () => {
	const params = useParams();
	const router = useRouter();
	const search = useSearchParams();

	const id = String(params?.id || '');
	const projectRef = String(params?.project || '');
	const team = String(search?.get('team') || '');

	const [tab, setTab] = useState('overview');
	const [redeploying, setRedeploying] = useState(false);
	/**
	 * Set by the Environment tab after a production save. Vercel applies env
	 * changes on the *next* deployment and never to the running one, so without
	 * this the admin walks away believing a change is live when it is not.
	 */
	const [envChanged, setEnvChanged] = useState(false);

	const { data: stored } = useGetByIdQuery({ path: 'vercels', id }, { skip: !id });

	const {
		data,
		isFetching,
		isError,
		error,
		refetch,
	} = useGetVercelProjectQuery({ id, project: projectRef, team }, { skip: !id || !projectRef });

	const { data: deploymentsData } = useGetVercelDeploymentsQuery(
		{ id, project: projectRef, team, target: 'production' },
		{ skip: !id || !projectRef }
	);

	const [deploy, deployResult] = useCreateVercelDeploymentMutation();
	const [promote, promoteResult] = usePromoteVercelDeploymentMutation();

	const project = data?.project;
	const storefront = data?.storefront;
	const production = deploymentsData?.deployments?.[0] || project?.latestProductionDeployment;

	if (isError) {
		return (
			<Layout
				title='Project'
				path='vercels'>
				<Flex
					direction='column'
					pt={5}>
					<ErrorState
						error={error}
						onRetry={refetch}
					/>
				</Flex>
			</Layout>
		);
	}

	if (!project) {
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

	const needsTypedConfirm = !!storefront;
	const projectName = project.name;

	const runRedeploy = async () => {
		await deploy({
			id,
			project: projectRef,
			team,
			deploymentId: production?.id,
			target: 'production',
			// `ConfirmAction` has already required the name to be typed; this is
			// the value the backend re-checks, so a mis-targeted scripted call
			// cannot deploy to the wrong project.
			...(needsTypedConfirm ? { confirm: projectName } : {}),
		});

		setRedeploying(false);
		setEnvChanged(false);
		setTab('deployments');
	};

	return (
		<Layout
			title={project.name}
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
						// The account by label, never the raw ObjectId.
						{ href: `/vercels/${id}`, title: stored?.label || 'Account' },
						{ href: `/vercels/${id}/projects/${projectRef}`, title: project.name },
					]}
					title={project.name}
					badge={
						storefront ? (
							<Badge
								size='sm'
								colorPalette='purple'
								title={`Live storefront for ${storefront.shopName}`}>
								Storefront · {storefront.shopName}
							</Badge>
						) : undefined
					}
					meta={
						<>
							{project.framework || 'no framework'}
							{project.gitRepo?.repo && ` · ${project.gitRepo.org}/${project.gitRepo.repo}`}
							{production?.createdAt && ` · last deployed ${when(production.createdAt)}`}
						</>
					}
					actions={
						<>
							{/* Sits before Visit: the repository is where you go to
								change the thing, the deployment is where you go to look
								at it. */}
							{project.gitRepo?.url && (
								<Button
									size='sm'
									variant='outline'
									asChild>
									<a
										href={project.gitRepo.url}
										target='_blank'
										rel='noreferrer'
										title={`${project.gitRepo.org}/${project.gitRepo.repo}`}>
										<Github size={14} />
										Repository
									</a>
								</Button>
							)}
							{production?.url && (
								<Button
									size='sm'
									variant='outline'
									asChild>
									<a
										href={production.url}
										target='_blank'
										rel='noreferrer'>
										Visit ↗
									</a>
								</Button>
							)}
							<Menu.Root>
								<Menu.Trigger asChild>
									<Button
										size='sm'
										variant='outline'>
										Deploy
										<ChevronDown size={14} />
									</Button>
								</Menu.Trigger>
								<Portal>
									<Menu.Positioner>
										<Menu.Content>
											<Menu.Item
												value='redeploy'
												disabled={!production?.id}
												onClick={() => setRedeploying(true)}>
												Redeploy production
											</Menu.Item>
											<Menu.Item
												value='branch'
												onClick={() => setTab('deployments')}>
												Deploy a branch…
											</Menu.Item>
										</Menu.Content>
									</Menu.Positioner>
								</Portal>
							</Menu.Root>
						</>
					}
				/>

				{envChanged && (
					<Panel title='Environment changed since the last deployment'>
						<Flex
							align='center'
							justify='space-between'
							gap={4}
							flexWrap='wrap'>
							<Text
								fontSize='13px'
								color='fg.muted'>
								The running deployment was built with the old values. Vercel applies
								environment changes on the next deployment only.
							</Text>
							<Button
								size='xs'
								onClick={() => setRedeploying(true)}>
								Redeploy production
							</Button>
						</Flex>
					</Panel>
				)}

				<Panel
					title='Production deployment'
					actions={
						production?.id && (
							<Button
								size='xs'
								variant='outline'
								loading={deployResult.isLoading}
								onClick={() => setRedeploying(true)}>
								Redeploy
							</Button>
						)
					}>
					{!production ? (
						<Text
							fontSize='13px'
							color='fg.muted'>
							Never deployed. Deploy a branch to put this project online.
						</Text>
					) : (
						<Flex
							direction='column'
							gap={3}>
							<Flex
								align='center'
								gap={3}
								flexWrap='wrap'>
								<StatusDot
									state={production.readyState}
									label={String(production.readyState || '').toLowerCase()}
								/>
								{production.url && (
									<CopyValue
										value={production.url}
										display={production.url.replace(/^https?:\/\//, '')}
									/>
								)}
							</Flex>
							<Text fontSize='13px'>{production.commitMessage || 'No commit message'}</Text>
							<Text
								fontSize='xs'
								color='fg.muted'>
								{production.branch || 'unknown branch'}
								{production.author && ` · ${production.author}`}
								{` · ${when(production.createdAt)}`}
								{typeof production.buildSeconds === 'number' &&
									` · built in ${production.buildSeconds}s`}
							</Text>
						</Flex>
					)}
				</Panel>

				<ConsoleTabs
					tabs={TABS}
					value={tab}
					onChange={setTab}>

					<Tabs.Content value='overview'>
						<OverviewTab
							project={project}
							storefront={storefront}
						/>
					</Tabs.Content>

					<Tabs.Content value='environment'>
						<EnvironmentTab
							id={id}
							projectRef={projectRef}
							projectName={project.name}
							team={team}
							storefront={storefront}
							onProductionChanged={() => setEnvChanged(true)}
							onRedeploy={() => setRedeploying(true)}
						/>
					</Tabs.Content>

					<Tabs.Content value='deployments'>
						<DeploymentsTab
							id={id}
							projectRef={projectRef}
							projectName={project.name}
							team={team}
							storefront={storefront}
							productionId={production?.id}
							defaultBranch={project.gitRepo?.productionBranch}
							hasGit={!!project.gitRepo?.repo}
							onEnvAndRedeploy={() => setTab('environment')}
						/>
					</Tabs.Content>

					<Tabs.Content value='domains'>
						<DomainsTab
							id={id}
							projectRef={projectRef}
							projectName={project.name}
							team={team}
							storefront={storefront}
						/>
					</Tabs.Content>

					<Tabs.Content value='resources'>
						<ResourcesTab
							id={id}
							projectRef={projectRef}
							team={team}
						/>
					</Tabs.Content>

					<Tabs.Content value='settings'>
						<SettingsTab
							id={id}
							projectRef={projectRef}
							project={project}
							team={team}
							storefront={storefront}
							onDeleted={() => router.push(`/vercels/${id}`)}
						/>
					</Tabs.Content>
				</ConsoleTabs>
			</Flex>

			<ConfirmAction
				isOpen={redeploying}
				onClose={() => setRedeploying(false)}
				onConfirm={runRedeploy}
				title='Redeploy production'
				consequence={
					storefront
						? `This builds ${project.name} again and serves the result to everyone visiting ${storefront.shopName}. It picks up the current environment variables.`
						: `This builds ${project.name} again and replaces what production serves. It picks up the current environment variables.`
				}
				confirmLabel='Redeploy'
				isLoading={deployResult.isLoading}
				typeToConfirm={needsTypedConfirm ? project.name : undefined}
			/>

			<Toast
				isError={deployResult.isError || promoteResult.isError}
				error={deployResult.error || promoteResult.error}
			/>
			<Toast
				isSuccess={deployResult.isSuccess}
				successTitle='Deployment started'
				successText='Watch it build in the Deployments tab.'
			/>
		</Layout>
	);
};

export default VercelProjectPage;
