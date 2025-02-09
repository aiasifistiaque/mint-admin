'use client';
import React from 'react';
import { Select, SelectProps } from '@chakra-ui/react';
import { Icon } from '../../../..';
import { useColorModeValue } from '@chakra-ui/react';

type InputContainerProps = SelectProps & {
	children: React.ReactNode;
};

const RowSelect: React.FC<InputContainerProps> = ({ children, ...props }) => {
	const borderColor = useColorModeValue('brand.500', 'brand.200');

	return (
		<Select
			icon={<Icon name='select' />}
			borderRadius='lg'
			focusBorderColor={borderColor}
			color='text.500'
			borderColor='selectBorder.light'
			_dark={{
				color: 'gray.300',
				borderColor: 'selectBorder.dark',
			}}
			boxShadow='md'
			size={{ base: 'md', md: 'sm' }}
			minW='100px'
			_placeholder={{ fontSize: 14, fontWeight: '500' }}
			{...props}>
			{children}
		</Select>
	);
};

export default RowSelect;
