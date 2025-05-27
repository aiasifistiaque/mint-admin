'use client';
import { useRef, useState } from 'react';
import { Box, Flex, Grid, Image, useColorModeValue } from '@chakra-ui/react';
import { useGetAllUploadsQuery } from '@/store/services/uploadApi';
import { useIsMobile } from '../../hooks';

const MyPhotos = ({ handleSelect, type = 'image' }: { handleSelect: any; type: string }) => {
	const { data } = useGetAllUploadsQuery({ limit: '999', type, page: 1, sort: '-createdAt' });
	const [selected, setSelected] = useState<any>(null);
	const borderColor = useColorModeValue('brand.500', 'brand.200');

	const isMobile = useIsMobile();

	const videoRef = useRef<any>(null);

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
		<Grid
			gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(5, 1fr)' }}
			gap={2}>
			{data?.doc?.map((item: any) => (
				<Flex
					borderRadius='4px'
					onClick={() => {
						setSelected(item?.url);
						handleSelect(item?.url);
					}}
					cursor='pointer'
					key={item._id}
					w='full'
					h='200px'
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					border='2px solid'
					borderColor={selected === item?.url ? borderColor : '#ddd'}
					bg='whitesmoke'>
					{type == 'video' ? (
						<video
							// controls={isMobile}
							autoPlay={isMobile}
							muted
							ref={videoRef}
							playsInline
							loop
							style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
							<source
								src={item?.url}
								type='video/mp4'
							/>
							Your browser does not support the video tag.
						</video>
					) : (
						<Image
							objectFit='contain'
							src={item?.url}
							alt={item?.name}
						/>
					)}
				</Flex>
			))}
		</Grid>
	);
};

export default MyPhotos;
