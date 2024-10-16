'use client';

import { Flex, FlexProps } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import SideDrawer from './sidebar/SideDrawer';
import { sizes, zIndex, padding } from '..';

type FlexPropsType = FlexProps & {
	children: ReactNode;
	showMenu?: boolean;
};

const PX = { base: padding.BASE, md: padding.MD, lg: padding.LG };

const Navbar: FC<FlexPropsType> = ({ children, showMenu, ...props }) => {
	const styles = {
		container: {
			h: sizes.NAV_HEIGHT || 12,
			poistion: 'fixed',
			top: 0,
			left: 0,
			alignItems: 'center',
			bg: 'navbar.light',
			borderBottomWidth: 2,
			borderBottomColor: 'stroke.light',
			px: PX,
			w: '100vw',
			zIndex: zIndex.NAV || 999,
			_dark: {
				bg: 'navbar.dark',
				borderBottomColor: 'stroke.dark',
			},
			...props,
		},
	};

	return (
		<Flex
			sx={styles.container}
			position='fixed'>
			{showMenu && <SideDrawer />}
			{children}
		</Flex>
	);
};

export default Navbar;
