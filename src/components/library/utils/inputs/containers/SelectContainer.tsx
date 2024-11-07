'use client';
import React from 'react';
import { Select, SelectProps, useColorModeValue } from '@chakra-ui/react';
import { Icon } from '../../../';

type InputContainerProps = SelectProps & {
	children: React.ReactNode;
};

const SelectContainer: React.FC<InputContainerProps> = ({ children, ...props }) => {
	const borderColor = useColorModeValue('brand.500', 'brand.200');

	return (
		<Select
			icon={<Icon name='select' />}
			size='sm'
			borderRadius='lg'
			focusBorderColor={borderColor}
			color='text.500'
			borderColor='selectBorder.light'
			_dark={{
				color: 'gray.300',
				borderColor: 'selectBorder.dark',
			}}
			boxShadow='md'
			_placeholder={{ fontSize: 14, fontWeight: '500' }}
			{...props}>
			{children}
		</Select>
	);
};

export default SelectContainer;
