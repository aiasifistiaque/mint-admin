import React from 'react';
import { Center, FlexProps, Image } from '@chakra-ui/react';
import { PLACEHOLDER_IMAGE } from '../';

type ImageContainerProps = FlexProps & {
	size?: number;
	children?: React.ReactNode;
	src?: string;
	alt?: string;
	objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
};

const ImageContainer: React.FC<ImageContainerProps> = ({
	children,
	objectFit,
	size,
	alt,
	src,
	...props
}) => {
	const boxSize = size || 200;

	const imageComponent = (
		<Image
			src={src || PLACEHOLDER_IMAGE}
			alt={alt || 'image'}
			objectFit={objectFit || 'contain'}
			width='100%'
			height='100%'
			style={{ borderRadius: '2px' }}
		/>
	);

	const innerComponent = src ? imageComponent : children;

	return (
		<Center
			borderRadius='4px'
			h={`${boxSize}px`}
			w={`${boxSize}px`}
			bg='sidebar.light'
			_dark={{ bg: 'background.dark' }}
			{...props}>
			{innerComponent}
		</Center>
	);
};

export default ImageContainer;
