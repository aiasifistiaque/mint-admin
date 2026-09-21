'use client';

import { Flex, Text } from '@chakra-ui/react';
import { useGetVercelProjectResourcesQuery } from '@/components/library';
import { Panel, ErrorState, ResourceSection, Column } from '@/components/library/cl';

const text = (value: any) => <Text fontSize='13px'>{value}</Text>;
const muted = (value: any) => (
	<Text
		fontSize='13px'
		color='fg.muted'>
		{value || '—'}
	</Text>
);

const storeColumns: Column<any>[] = [
	{ key: 'name', label: 'Name', render: row => text(row.name || row.id) },
	{ key: 'type', label: 'Type', render: row => muted(row.type) },
	{ key: 'region', label: 'Region', render: row => muted(row.region) },
];

const integrationColumns: Column<any>[] = [
	{ key: 'name', label: 'Name', render: row => text(row.name || row.slug) },
	{ key: 'created', label: 'Installed', render: row => muted(row.createdAt?.slice(0, 10)) },
];

const drainColumns: Column<any>[] = [
	{ key: 'name', label: 'Name', render: row => text(row.name || row.id) },
	{
		key: 'url',
		label: 'Endpoint',
		render: row => (
			<Text
				fontSize='13px'
				fontFamily='mono'
				color='fg.muted'
				lineClamp={1}>
				{row.url || '—'}
			</Text>
		),
	},
];

/** What this one project consumes. The account-wide inverse — and the orphan
 *  list, which only that view can produce — lives on the account page. */
const ResourcesTab = ({ id, projectRef, team }: { id: string; projectRef: string; team: string }) => {
	const { data, isError, error } = useGetVercelProjectResourcesQuery({
		id,
		project: projectRef,
		team,
	});

	const resources = data?.resources;

	if (isError) return <ErrorState error={error} />;

	return (
		<Flex
			direction='column'
			gap={4}>
			<Panel title='Git'>
				{resources?.gitRepo ? (
					<Flex
						direction='column'
						gap={2}>
						<Text fontSize='13px'>
							{resources.gitRepo.org}/{resources.gitRepo.repo}
						</Text>
						<Text
							fontSize='xs'
							color='fg.muted'>
							{resources.gitRepo.type} · production branch{' '}
							{resources.gitRepo.productionBranch || 'unknown'}
						</Text>
					</Flex>
				) : (
					<Text
						fontSize='13px'
						color='fg.muted'>
						No repository connected. Deployments have to be redeployed from an existing build.
					</Text>
				)}
			</Panel>

			<ResourceSection
				title='Stores'
				section={resources?.stores}
				emptyText='This project uses no stores'
				rowKey={(row: any) => row.id}
				columns={storeColumns}
			/>

			<ResourceSection
				title='Integrations'
				section={resources?.integrations}
				emptyText='No integrations on this project'
				rowKey={(row: any) => row.id}
				columns={integrationColumns}
			/>

			<ResourceSection
				title='Log drains'
				section={resources?.logDrains}
				emptyText='No log drains on this project'
				rowKey={(row: any) => row.id}
				columns={drainColumns}
			/>
		</Flex>
	);
};

export default ResourcesTab;
