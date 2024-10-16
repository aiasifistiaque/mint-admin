import React from 'react';
import { Center } from '@chakra-ui/react';
import { FC } from 'react';
import { FlexChild, padding } from '../../..';

const FooterIconContainer: FC<FlexChild> = ({ children }) => (
	<Center
		w='full'
		px={padding.LAYOUT_X}
		py={6}
		gap={6}>
		{children}
	</Center>
);

export default FooterIconContainer;
