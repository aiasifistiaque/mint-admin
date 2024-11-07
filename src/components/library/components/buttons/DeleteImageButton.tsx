import React from 'react';
import { Button, ButtonProps, IconButton } from '@chakra-ui/react';
import { Icon } from '../../';

const buttonStyle = {
	position: 'absolute',
	top: '2',
	right: '2',
};

const DeleteImageButton = ({ ...props }: ButtonProps) => {
	return (
		<Button
			as={IconButton}
			sx={buttonStyle}
			size='xs'
			colorScheme='gray'
			{...props}
			icon={
				<Icon
					name='delete'
					color='red'
					size={12}
				/>
			}
		/>
	);
};

export default DeleteImageButton;
