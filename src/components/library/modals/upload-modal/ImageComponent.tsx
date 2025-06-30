import { useRef } from 'react';
import { Flex, Image, useColorModeValue, FlexProps } from '@chakra-ui/react';
import { useIsMobile } from '../../hooks';

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

export default ImageComponent;
