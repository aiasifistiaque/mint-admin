import React from 'react';
import { Center } from '@chakra-ui/react';
import { FC } from 'react';
import { FlexChild } from '../../..';

const FooterContainer: FC<FlexChild> = ({ children }) => (
	<Center
		flex={1}
		flexDir='column'
		w='100%'>
		{children}
	</Center>
);

export default FooterContainer;
