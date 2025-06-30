'use client';

import { Grid } from '@chakra-ui/react';

import {
	Layout,
	Count,
	useAppSelector,
	useGetByIdQuery,
	ShowSum,
	useGetSumQuery,
} from '@/components/library';

export default function UserFeedback() {
	const { filters } = useAppSelector((state: any) => state.table);

	const { data, isFetching, isError, error, isSuccess }: any = useGetByIdQuery({
		path: 'sms/check',
		id: 'balance',
	});

	const {
		data: storageData,
		isFetching: storageIsFetching,
		isError: storageError,
	} = useGetSumQuery({
		path: 'files',
		field: 'size',
	});

	const convertSizeToKb = (size: number) => {
		if (size === undefined || size === null) return '--';

		const bytes = size;
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

		if (bytes === 0) return '0 B';

		const i = Math.floor(Math.log(bytes) / Math.log(k));
		const convertedSize = bytes / Math.pow(k, i);

		return parseFloat(convertedSize.toFixed(2)) + ' ' + sizes[i];
	};

	return (
		<Layout
			title='Dashboard'
			path='dashboard'>
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
					title='Storage Used'
					isLoading={storageIsFetching}
					isError={storageError}>
					{(storageData && convertSizeToKb(storageData?.total)) || '--'}
				</ShowSum>
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
