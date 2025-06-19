import React from 'react';
import { Button, Flex, IconButton, useColorModeValue } from '@chakra-ui/react';
import { Icon } from '../..';

const buttonStyle = {
	position: 'absolute',
	top: '2',
	right: '2',
};

const EditImageButton = ({ onDelete }: { onDelete?: any }) => {
	const color = useColorModeValue('white', 'black');

	return (
		<Flex
			gap={1}
			sx={buttonStyle}>
			<Button
				size='xs'
				as={IconButton}
				icon={
					<Icon
						name='edit'
						color={color}
						size={12}
					/>
				}
			/>
		</Flex>
	);
};

export default EditImageButton;
