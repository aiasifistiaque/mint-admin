import React, { FC, ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import { sizes, THEME } from '../../../';

type SidebarLogoProps = {
	children: ReactNode;
};

const style = {
	h: sizes.NAV_HEIGHT || 12,
	px: 5,
	width: '100%',
	bg: THEME == 'basic' ? 'sidebar.light' : 'navbar.light',
	borderBottomColor: 'navbar.light',
	alignItems: 'center',
	_dark: {
		bg: THEME == 'basic' ? 'sidebar.dark' : 'navbar.light',
		borderBottomColor: 'sidebar.dark',
	},
};

const SidebarLogo: FC<SidebarLogoProps> = ({ children }) => {
	return <Flex sx={style}>{children}</Flex>;
};

export default SidebarLogo;
