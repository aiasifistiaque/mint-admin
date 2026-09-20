'use client';
import { useEffect, useState } from 'react';
import { Button, Grid, GridItem, Input } from '@chakra-ui/react';
import { Column, useGetAllQuery } from '../..';
import { ImageComponent } from '.';

const MyPhotos = ({
	handleSelect,
	type = 'image',
	multiple = false,
}: {
	handleSelect: any;
	type?: string;
	/** Lets several images be picked before "Insert Media" is pressed — each
	 *  click toggles that image in/out of the selection instead of replacing
	 *  it, and `handleSelect` is called with the whole array so far. */
	multiple?: boolean;
}) => {
	const [page, setPage] = useState<number>(1);
	const [viewData, setViewData] = useState<any>([]);
	const [search, setSearch] = useState<string>('');
	const { data, isFetching } = useGetAllQuery({
		path: `upload`,
		limit: '20',
		search,
		type,
		page,
		sort: '-createdAt',
		filters: { type: type || 'image' },
	});
	const [selected, setSelected] = useState<any>(multiple ? [] : null);

	const toggleSelect = (url: string) => {
		if (!multiple) {
			setSelected(url);
			handleSelect(url);
			return;
		}
		setSelected((prev: string[]) => {
			const next = prev.includes(url) ? prev.filter(existing => existing !== url) : [...prev, url];
			handleSelect(next);
			return next;
		});
	};

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
				mt={2}
				minH='200px'
				gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }}
				gap={2}>
				<GridItem colSpan={{ base: 2, md: 3, lg: 4 }}>
					<Input
						value={search}
						px={3}
						onChange={(e: any) => setSearch(e.target.value)}
						placeholder='Search Image...'
						_placeholder={{ fontSize: '13px', _dark: { color: 'text.dark' } }}
						size='xs'
						_dark={{ borderColor: 'border.dark' }}
						// focusBorderColor='brand.500'
						// _dark={{ focusBorderColor: 'brand.200' }}
					/>
				</GridItem>
				{viewData?.map((item: any, i: number) => (
					<ImageComponent
						src={item?.url}
						type={type}
						onClick={() => toggleSelect(item?.url)}
						selected={selected}
						key={item?._id}
					/>
				))}
			</Grid>

			<Button
				disabled={isFetching || data?.totalPages <= page}
				onClick={onLoadMore}>
				Load More
			</Button>
		</Column>
	);
};

export default MyPhotos;
