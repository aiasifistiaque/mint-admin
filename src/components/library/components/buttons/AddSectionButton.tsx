import React from 'react';
import { Center, FlexProps, Heading } from '@chakra-ui/react';
import { Icon } from '../../';

type AddImageButtonProps = FlexProps & {
	children?: React.ReactNode;
	size?: string;
};

const DEFAULT_IMAGE_SIZE = '100px';

const AddSectionButton: React.FC<AddImageButtonProps> = ({ children, size, ...props }) => {
	return (
		<Center
			cursor='pointer'
			flexDir='column'
			h={size || DEFAULT_IMAGE_SIZE}
			w='full'
			border='2px dashed #ccc'
			borderRadius='8px'
			color='#ccc'
			userSelect='none'
			gap={2}
			{...props}>
			<Icon
				name='add-image'
				size={30}
			/>
			<Heading
				color='#ccc'
				size='xs'>
				{children || 'Add Image'}
			</Heading>
		</Center>
	);
};

export default AddSectionButton;
