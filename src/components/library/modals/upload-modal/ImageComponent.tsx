import { useRef } from 'react';
import { Box, Flex, Image, FlexProps } from '@chakra-ui/react';
import { useIsMobile } from '../../hooks';
import { Icon } from '../..';

const ImageComponent = ({
	src,
	type,
	selected,
	thumbnail,
	...props
}: FlexProps & {
	src: string;
	type: string;
	/** A single selected url (single-select mode) or an array of them
	 *  (multi-select mode — see `MyPhotos`/`MyFolders`'s `multiple` prop). */
	selected: any;
	thumbnail?: string;
}) => {
	const videoRef = useRef<any>(null);
	const isMobile = useIsMobile();
	const isSelected = Array.isArray(selected) ? selected.includes(src) : selected === src;

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
			position='relative'
			border='2px solid'
			borderColor={isSelected ? 'accent.solid' : 'border'}
			bg='background.light'
			_dark={{ bg: 'background.dark' }}
			{...props}>
			{isSelected && Array.isArray(selected) && (
				<Box
					position='absolute'
					top={1}
					right={1}
					zIndex={1}
					bg='accent.solid'
					color='accent.contrast'
					borderRadius='full'
					p='2px'>
					<Icon
						name='check'
						size={14}
					/>
				</Box>
			)}
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
