'use client';
import { useEffect, useRef, useState } from 'react';
import { Box, Flex, FlexProps, Grid, Image, useColorModeValue } from '@chakra-ui/react';
import { useIsMobile } from '../../hooks';
import { useGetAllQuery } from '../..';

const MyPhotos = ({ handleSelect, type = 'image' }: { handleSelect: any; type?: string }) => {
	const { data } = useGetAllQuery({
		path: `upload?type=${type || 'image'}`,
		limit: '999',
		type,
		page: 1,
		sort: '-createdAt',
	});
	const [selected, setSelected] = useState<any>(null);

	return (
		<Grid
			gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(5, 1fr)' }}
			gap={2}>
			{data?.doc?.map((item: any, i: number) => (
				<ImageComponent
					src={item?.url}
					type={type}
					onClick={() => {
						setSelected(item?.url);
						handleSelect(item?.url);
					}}
					selected={selected}
					key={i}
				/>
			))}
		</Grid>
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
			borderRadius='4px'
			cursor='pointer'
			w='full'
			h='200px'
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			border='2px solid'
			borderColor={selected === src ? borderColor : '#ddd'}
			bg='whitesmoke'
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
					alt={src}
				/>
			)}
		</Flex>
	);
};

export default MyPhotos;
