import React from 'react';
import { ReactNode } from 'react';
import { TableContainer } from '@chakra-ui/react';

import { sizes, shadow } from '../';

const MintTableContainer = ({ children }: { children: ReactNode }) => (
	<TableContainer
		bg={{ base: 'transparent', md: 'menu.light' }}
		_dark={{ bg: { base: 'transparent', md: 'menu.dark' } }}
		p={{ base: 0, md: 4 }}
		borderRadius={sizes.CARD_RADIUS}
		boxShadow={{ base: 'none', md: shadow.CARD }}
		borderWidth={{ base: 0, md: 1 }}>
		{children}
	</TableContainer>
);

export default MintTableContainer;
