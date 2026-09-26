'use client';

import { Grid, Skeleton } from '@chakra-ui/react';

import { Layout, Count, useGetByIdQuery, ShowSum, useGetDashboardQuery } from '@/components/library';
import { DashboardGrid } from '@/components/library/dashboard/widgets';

/**
 * The dashboard: the widgets saved in the dashboard builder (/dashboard-builder),
 * or — until one is saved — the built-in cards below.
 */
export default function Dashboard() {
	const { data, isLoading } = useGetDashboardQuery();
	const widgets = data?.widgets || [];

	return (
		<Layout
			title='Dashboard'
			path='dashboard'>
			{isLoading ? (
				<Grid
					pt={3}
					gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
					gap={2}>
					{[0, 1, 2].map(i => (
						<Skeleton
							key={i}
							h='96px'
						/>
					))}
				</Grid>
			) : data?.saved && widgets.length ? (
				<DashboardGrid widgets={widgets} />
			) : (
				<BuiltInDashboard />
			)}
		</Layout>
	);
}

/** The dashboard as it was before the builder — shown until one is saved. */
const BuiltInDashboard = () => {
	const { data, isFetching, isError }: any = useGetByIdQuery({
		path: 'sms/check',
		id: 'balance',
	});

	return (
		<Grid
			pt={3}
			gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
			gap={2}>
			<Count
				href='/views'
				title='Website views'
				path='views'
			/>

			<ShowSum
				title='SMS Balance'
				isLoading={isFetching}
				isError={isError}>
				BDT. {data?.balance || '--'}
			</ShowSum>

			<Count
				title='Total Stores'
				path='shops'
			/>
			<Count
				title='Total Products'
				path='products'
			/>
			<Count
				title='Total Customers'
				path='customers'
			/>
		</Grid>
	);
};
