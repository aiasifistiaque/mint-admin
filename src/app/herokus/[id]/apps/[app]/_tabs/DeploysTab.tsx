'use client';

import { FC, useState } from 'react';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import {
	Toast,
	radius,
	useGetHerokuReleasesQuery,
	useGetHerokuBuildsQuery,
	useRollbackHerokuReleaseMutation,
	useCreateHerokuBuildMutation,
} from '@/components/library';
import {
	when,
	Panel,
	DataTable,
	StatusDot,
	ConfirmAction,
	EmptyState,
	ErrorState,
	TableSkeleton,
} from '@/components/library/cl';

const DeploysTab: FC<{ id: string; app: string }> = ({ id, app }) => {
	const {
		data: releasesData,
		isFetching: releasesFetching,
		isError: releasesIsError,
		error: releasesError,
		refetch: refetchReleases,
	} = useGetHerokuReleasesQuery({ id, app });

	const { data: buildsData, isFetching: buildsFetching } = useGetHerokuBuildsQuery({ id, app });

	const [rollback, rollbackResult] = useRollbackHerokuReleaseMutation();
	const [createBuild, buildResult] = useCreateHerokuBuildMutation();

	const [target, setTarget] = useState<any>(null);
	const [building, setBuilding] = useState(false);
	const [sourceUrl, setSourceUrl] = useState('');
	const [version, setVersion] = useState('');

	const releases = releasesData?.releases || [];
	const builds = buildsData?.builds || [];

	const onRollback = async () => {
		const result = await rollback({ id, app, version: target.version });
		if ('error' in result) return;
		setTarget(null);
	};

	const onBuild = async () => {
		const result = await createBuild({
			id,
			app,
			sourceUrl: sourceUrl.trim(),
			version: version.trim() || undefined,
		});
		if ('error' in result) return;

		setBuilding(false);
		setSourceUrl('');
		setVersion('');
	};

	return (
		<Flex direction='column' gap={6}>
			<Panel
				flush
				title='Releases'
				subtitle='Rolling back re-releases that build. It does not fetch new code.'>
				{releasesFetching && !releasesData ? (
					<TableSkeleton rows={6} cols={5} />
				) : releasesIsError ? (
					<ErrorState error={releasesError} onRetry={refetchReleases} />
				) : releases.length === 0 ? (
					<EmptyState title='No releases yet' description={`${app} has never been deployed.`} />
				) : (
					<DataTable<any>
						rows={releases}
						rowKey={release => release.id}
						columns={[
							{
								key: 'version',
								label: 'Version',
								width: '90px',
								render: release => (
									<Flex align='center' gap={2}>
										<Text fontSize='13px' fontWeight='600' fontFamily='mono'>
											v{release.version}
										</Text>
										{release.current && (
											<Text fontSize='10px' color='green.500'>
												live
											</Text>
										)}
									</Flex>
								),
							},
							{ key: 'description', label: 'Description', render: release => release.description },
							{
								key: 'status',
								label: 'Status',
								render: release => <StatusDot state={release.status} />,
							},
							{ key: 'user', label: 'By', render: release => release.user || '—' },
							{ key: 'when', label: 'When', render: release => when(release.createdAt) },
						]}
						rowActions={release =>
							// A release with no slug is a config or add-on change, not a
							// deploy — there is no build to go back to.
							release.slugId && !release.current ? (
								<Button size='2xs' variant='ghost' onClick={() => setTarget(release)}>
									Rollback
								</Button>
							) : null
						}
					/>
				)}
			</Panel>

			<Panel
				flush
				title='Builds'
				actions={
					<Button size='sm' variant='outline' onClick={() => setBuilding(true)}>
						Build from URL
					</Button>
				}>
				{buildsFetching && !buildsData ? (
					<TableSkeleton rows={4} cols={4} />
				) : builds.length === 0 ? (
					<EmptyState
						title='No builds'
						description='Builds started from a source tarball appear here. Pushes over git do not.'
					/>
				) : (
					<DataTable<any>
						rows={builds}
						rowKey={build => build.id}
						columns={[
							{
								key: 'status',
								label: 'Status',
								render: build => <StatusDot state={build.status} />,
							},
							{
								key: 'source',
								label: 'Source',
								render: build => (
									<Text fontSize='12px' fontFamily='mono' truncate title={build.sourceUrl || ''}>
										{build.sourceUrl || '—'}
									</Text>
								),
							},
							{ key: 'version', label: 'Version', render: build => build.sourceVersion || '—' },
							{ key: 'user', label: 'By', render: build => build.user || '—' },
							{ key: 'when', label: 'When', render: build => when(build.createdAt) },
						]}
					/>
				)}
			</Panel>

			<ConfirmAction
				isOpen={!!target}
				onClose={() => setTarget(null)}
				onConfirm={onRollback}
				title={`Roll back to v${target?.version ?? ''}`}
				confirmLabel='Roll back'
				destructive
				typeToConfirm={app}
				isLoading={rollbackResult.isLoading}
				consequence={`${app} will start serving the build from v${target?.version ?? ''} again. Config vars are not rolled back — only the code.`}
			/>

			<ConfirmAction
				isOpen={building}
				onClose={() => setBuilding(false)}
				onConfirm={onBuild}
				title='Build from a source URL'
				confirmLabel='Start build'
				isLoading={buildResult.isLoading}
				consequence={`Heroku will download the tarball, build it and release the result to ${app}.`}>
				<Flex direction='column' gap={3}>
					<Flex direction='column' gap={1}>
						<Text fontSize='xs' color='fg.muted'>
							Tarball URL — a GitHub tarball for a branch or tag works here, e.g.
							https://github.com/owner/repo/archive/refs/heads/main.tar.gz
						</Text>
						<Input
							size='sm'
							placeholder='https://…/archive.tar.gz'
							fontSize='13px'
							borderRadius={radius.INPUT}
							value={sourceUrl}
							onChange={event => setSourceUrl(event.target.value)}
						/>
					</Flex>
					<Flex direction='column' gap={1}>
						<Text fontSize='xs' color='fg.muted'>
							Version label (optional) — shows against the build, usually a commit SHA.
						</Text>
						<Input
							size='sm'
							placeholder='main@a1b2c3d'
							fontSize='13px'
							borderRadius={radius.INPUT}
							value={version}
							onChange={event => setVersion(event.target.value)}
						/>
					</Flex>
				</Flex>
			</ConfirmAction>

			<Toast
				isError={rollbackResult.isError || buildResult.isError}
				error={rollbackResult.error || buildResult.error}
			/>
			<Toast
				isSuccess={rollbackResult.isSuccess || buildResult.isSuccess}
				successTitle='Done'
				successText={`${app} is updating.`}
			/>
		</Flex>
	);
};

export default DeploysTab;
