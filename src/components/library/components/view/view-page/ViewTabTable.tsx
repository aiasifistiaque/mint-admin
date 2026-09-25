'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useGetViewTabQuery } from '../../../store';
import Panel from '../../../cl/Panel';
import DataTable from '../../../cl/DataTable';
import { EmptyState, ErrorState, TableSkeleton } from '../../../cl/States';
import { cellText } from './cells';

/**
 * One tab of a view page after Overview: the records of another route that
 * link to this one (an author's blogs), a page at a time, as configured in
 * the route builder's view tabs. Each row opens its own view page.
 */

type Props = {
	/** This record's route and id. */
	path: string;
	id: string;
	/** The tab's position in the route's `viewTabs`. */
	index: number;
	title: string;
};

const ViewTabTable: FC<Props> = ({ path, id, index, title }) => {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const { data, isLoading, isFetching, isError, error, refetch } = useGetViewTabQuery({ path, id, index, page });

	if (isLoading)
		return (
			<Panel flush>
				<Box p={4}>
					<TableSkeleton
						rows={5}
						cols={3}
					/>
				</Box>
			</Panel>
		);

	if (isError)
		return (
			<ErrorState
				error={error}
				onRetry={refetch}
			/>
		);

	const rows: any[] = data?.rows || [];
	const total: number = data?.total || 0;
	const limit: number = data?.limit || rows.length || 1;
	const totalPages: number = data?.totalPages || 1;
	const from = total ? (page - 1) * limit + 1 : 0;
	const to = Math.min(total, (page - 1) * limit + rows.length);

	return (
		<Panel
			flush
			title={title}
			subtitle={
				data?.allowed === false
					? 'You don’t have access to these records'
					: `${total.toLocaleString()} record${total === 1 ? '' : 's'}`
			}
			actions={
				data?.allowed && total > 0 ? (
					<Link href={`/${data.route}`}>
						<Text
							fontSize='xs'
							color='fg.muted'
							_hover={{ color: 'fg' }}>
							Open {title} →
						</Text>
					</Link>
				) : undefined
			}>
			{data?.allowed === false ? (
				<Text
					px={4}
					py={3}
					fontSize='xs'
					color='fg.muted'>
					Ask an admin for access to {title} to see them here.
				</Text>
			) : rows.length === 0 ? (
				<Box p={4}>
					<EmptyState
						title={`No ${title.toLowerCase()} yet`}
						description='Records that link to this one show up here.'
					/>
				</Box>
			) : (
				<Box opacity={isFetching ? 0.6 : 1}>
					<DataTable
						columns={(data.columns || []).map((c: any) => ({
							key: c.key,
							label: c.label,
							render: (r: any) => (
								<Text
									fontSize='sm'
									truncate>
									{cellText(r[c.key])}
								</Text>
							),
						}))}
						rows={rows}
						rowKey={(r: any) => r._id}
						onRowClick={(r: any) => router.push(`/view/${data.route}/${r._id}`)}
					/>
					{totalPages > 1 && (
						<Flex
							align='center'
							justify='space-between'
							px={4}
							py={2.5}
							borderTopWidth='1px'
							borderColor='border.muted'>
							<Text
								fontSize='xs'
								color='fg.muted'>
								{from}–{to} of {total.toLocaleString()}
							</Text>
							<Flex gap={2}>
								<Button
									size='xs'
									variant='outline'
									disabled={page <= 1 || isFetching}
									onClick={() => setPage(p => p - 1)}>
									Previous
								</Button>
								<Button
									size='xs'
									variant='outline'
									disabled={page >= totalPages || isFetching}
									onClick={() => setPage(p => p + 1)}>
									Next
								</Button>
							</Flex>
						</Flex>
					)}
				</Box>
			)}
		</Panel>
	);
};

export default ViewTabTable;
