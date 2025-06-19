import React from 'react';
import { Column } from '@/components/library';
import { Flex, FlexProps } from '@chakra-ui/react';

const BottomContainer = ({ children, ...props }: FlexProps & { children: React.ReactNode }) => (
	<Flex
		align='center'
		justify='space-between'
		w='full'
		py={2}
		borderTop='1px dashed'
		borderTopColor='#bbb'
		_dark={{ borderTopColor: 'stroke.deepD' }}
		{...props}>
		{children}
	</Flex>
);

export default BottomContainer;
