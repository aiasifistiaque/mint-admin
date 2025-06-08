'use client';

import { Grid } from '@chakra-ui/react';

import {
	Layout,
	Count,
	useAppSelector,
	useSum,
	useGetByIdQuery,
	ShowSum,
} from '@/components/library';

export default function UserFeedback() {
	const { filters } = useAppSelector((state: any) => state.table);

	const { data, isFetching, isError, error, isSuccess }: any = useGetByIdQuery({
		path: 'sms/check',
		id: 'balance',
	});

	return (
		<Layout
			title='Dashboard'
			path='dashboard'>
			<Grid
				pt={3}
				gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
				gap={2}>
				<Count
					title='Website views'
					path='views'
				/>
				<ShowSum
					title='SMS Balance'
					isLoading={isFetching}
					isError={isError}>
					{data?.balance || '--'}
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
		</Layout>
	);
}
