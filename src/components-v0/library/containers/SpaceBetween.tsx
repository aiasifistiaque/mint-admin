import { FlexPropsType } from '@/types';
import { Flex } from '@chakra-ui/react';
import React from 'react';

const SpaceBetween: React.FC<FlexPropsType> = ({ children, ...props }) => {
	return (
		<Flex
			w='100%'
			alignItems='center'
			justifyContent='space-between'
			gap={2}
			{...props}>
			{children}
		</Flex>
	);
};

export default SpaceBetween;
