import { sizes } from '@/lib/constants';
import { FlexProps, Flex } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

const containerCss: FlexProps = {
	h: '100vh',
	position: 'fixed',
	overflow: 'none',
	w: sizes.SIDEBAR_WIDTH,
	minW: sizes.SIDEBAR_WIDTH,
	borderRightWidth: 0,
	borderRightColor: 'stroke.light',
	flexDir: 'column',
	_dark: {
		borderRightColor: 'stroke.dark',
	},
};

const SidebarContainer: FC<FlexProps & { children: ReactNode }> = ({ children, ...props }) => {
	return (
		<Flex
			{...containerCss}
			{...props}>
			{children}
		</Flex>
	);
};

export default SidebarContainer;
