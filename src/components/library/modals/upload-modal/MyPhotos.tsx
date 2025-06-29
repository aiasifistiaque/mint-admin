'use client';
import { useEffect, useRef, useState } from 'react';
import { Button, Flex, FlexProps, Grid, Image, useColorModeValue } from '@chakra-ui/react';
import { useIsMobile } from '../../hooks';
import { Column, useGetAllQuery } from '../..';

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

const ImageComponent = ({
	src,
	type,
	selected,
	thumbnail,
	...props
}: FlexProps & {
	src: string;
	type: string;
	selected: any;
	thumbnail?: string;
}) => {
	const videoRef = useRef<any>(null);
	const isMobile = useIsMobile();
	const borderColor = useColorModeValue('brand.500', 'brand.200');

	useEffect(() => {
		// if (isMobile) {
		// 	videoRef?.current?.play();
		// }
	}, [videoRef]);

	const handleMouseEnter = () => {
		if (isMobile) return;
		// If the type is not video, we don't need to play the video
		if (type !== 'video') return;
		videoRef.current?.play();
	};

	const handleMouseLeave = () => {
		if (isMobile) return;

		// If the type is not video, we don't need to play the video
		if (type !== 'video') return;
		videoRef.current?.pause();
		videoRef.current.currentTime = 0;
	};

	return (
		<Flex
			p={1}
			borderRadius='4px'
			cursor='pointer'
			w='full'
			h='200px'
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			border='2px solid'
			borderColor={selected === src ? borderColor : '#ddd'}
			bg='background.light'
			_dark={{
				bg: 'background.dark',
			}}
			{...props}>
			{type == 'video' ? (
				<video
					muted
					poster={thumbnail || undefined}
					ref={videoRef}
					playsInline
					loop
					style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
					<source
						src={src}
						type='video/mp4'
					/>
					Your browser does not support the video tag.
				</video>
			) : (
				<Image
					objectFit='contain'
					src={src}
					w='full'
					h='auto'
					alt={src}
				/>
			)}
		</Flex>
	);
};

export default MyPhotos;
