'use client';
import { useEffect, useState } from 'react';
import { Button, Grid } from '@chakra-ui/react';
import { Column, useGetAllQuery } from '../..';
import { ImageComponent } from '.';

const MyPhotos = ({ handleSelect, type = 'image' }: { handleSelect: any; type?: string }) => {
	const [page, setPage] = useState<number>(1);
	const [viewData, setViewData] = useState<any>([]);
	const { data, isFetching } = useGetAllQuery({
		path: `upload`,
		limit: '20',
		type,
		page,
		sort: '-createdAt',
		filters: { type: type || 'image' },
	});
	const [selected, setSelected] = useState<any>(null);

	const onLoadMore = () => {
		if (page < data?.totalPages) setPage(prev => prev + 1);
	};

	useEffect(() => {
		if (isFetching) return;
		if (data?.doc) {
			if (page === 1) {
				// Reset viewData for first page
				setViewData(data.doc);
			} else {
				// Append for subsequent pages
				setViewData((prev: any) => [...prev, ...data.doc]);
			}
		}
	}, [data, isFetching, page]);

	return (
		<Column
			gap={3}
			pb={2}>
			<Grid
				minH='200px'
				gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(5, 1fr)' }}
				gap={2}>
				{viewData?.map((item: any, i: number) => (
					<ImageComponent
						src={item?.url}
						type={type}
						onClick={() => {
							setSelected(item?.url);
							handleSelect(item?.url);
						}}
						selected={selected}
						key={item?._id}
					/>
				))}
			</Grid>

			<Button
				isDisabled={isFetching || data?.totalPages <= page}
				onClick={onLoadMore}
				variant='white'>
				Load More
			</Button>
		</Column>
	);
};

export default MyPhotos;
