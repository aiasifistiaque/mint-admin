'use client';

import { Grid } from '@chakra-ui/react';

import { Layout, Count, useAppSelector, useSum } from '@/components/library';

export default function UserFeedback() {
	const { filters } = useAppSelector((state: any) => state.table);

	return (
		<Layout
			title='Dashboard'
			path='dashboard'>
			<Grid
				gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
				gap={2}>
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
