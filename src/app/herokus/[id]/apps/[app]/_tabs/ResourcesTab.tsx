'use client';

import { FC } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { useGetHerokuAppResourcesQuery } from '@/components/library';
import {
	Panel,
	DataTable,
	StatusDot,
	CopyValue,
	EmptyState,
	ErrorState,
	TableSkeleton,
} from '../../../../_components';

/** Heroku reports add-on plan prices in cents per month; this one *is*
 *  documented, unlike the billing totals. */
const price = (cents?: number | null) =>
	typeof cents === 'number' ? `$${(cents / 100).toFixed(2)}/mo` : '—';

const ResourcesTab: FC<{ id: string; app: string }> = ({ id, app }) => {
	const { data, isFetching, isError, error, refetch } = useGetHerokuAppResourcesQuery({ id, app });

	if (isFetching && !data) return <TableSkeleton rows={5} cols={4} />;
	if (isError) return <ErrorState error={error} onRetry={refetch} />;

	return (
		<Flex direction='column' gap={6}>
			<Panel flush title={`Add-ons (${data?.addons?.length ?? 0})`}>
				{!data?.addons?.length ? (
					<EmptyState title='No add-ons' description={`${app} has no add-ons attached.`} />
				) : (
					<DataTable<any>
						rows={data.addons}
						rowKey={addon => addon.id}
						columns={[
							{
								key: 'name',
								label: 'Name',
								render: addon => (
									<Text fontSize='13px' fontWeight='600'>
										{addon.name}
									</Text>
								),
							},
							{ key: 'service', label: 'Service', render: addon => addon.addonService },
							{ key: 'plan', label: 'Plan', render: addon => addon.plan },
							{ key: 'state', label: 'State', render: addon => <StatusDot state={addon.state} /> },
							{
								key: 'price',
								label: 'Price',
								numeric: true,
								render: addon => price(addon.priceCents),
							},
						]}
					/>
				)}
			</Panel>

			<Panel flush title={`Domains (${data?.domains?.length ?? 0})`}>
				{!data?.domains?.length ? (
					<EmptyState title='No custom domains' description='Only the default herokuapp.com hostname.' />
				) : (
					<DataTable<any>
						rows={data.domains}
						rowKey={domain => domain.id}
						columns={[
							{
								key: 'hostname',
								label: 'Hostname',
								render: domain => (
									<Text fontSize='13px' fontWeight='600'>
										{domain.hostname}
									</Text>
								),
							},
							{ key: 'kind', label: 'Kind', render: domain => domain.kind },
							{
								key: 'cname',
								label: 'DNS target',
								render: domain =>
									domain.cname ? <CopyValue value={domain.cname} ariaLabel='Copy DNS target' /> : '—',
							},
							{
								key: 'status',
								label: 'Status',
								render: domain => <StatusDot state={domain.status} />,
							},
							{ key: 'acm', label: 'Certificate', render: domain => domain.acmStatus || '—' },
						]}
					/>
				)}
			</Panel>

			<Panel flush title={`Collaborators (${data?.collaborators?.length ?? 0})`}>
				{!data?.collaborators?.length ? (
					<EmptyState title='No collaborators' description='Only the app owner has access.' />
				) : (
					<DataTable<any>
						rows={data.collaborators}
						rowKey={person => person.id}
						columns={[
							{ key: 'email', label: 'Email', render: person => person.email },
							{ key: 'role', label: 'Role', render: person => person.role || 'collaborator' },
						]}
					/>
				)}
			</Panel>
		</Flex>
	);
};

export default ResourcesTab;
