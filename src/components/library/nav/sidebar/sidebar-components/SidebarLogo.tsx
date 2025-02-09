import React, { FC, ReactNode } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';
import { sizes, THEME, styles } from '../../..';

type SidebarLogoProps = FlexProps & {
	children: ReactNode;
};

const SidebarLogo: FC<SidebarLogoProps> = ({ children, ...props }) => {
	return (
		<Flex
			position='fixed'
			top={0}
			left={0}
			px={5}
			{...styles.NAVBAR}
			_dark={{
				bg: 'sidebar.dark',
				borderBottom: 'none',
			}}
			w={{ base: '320px', md: sizes.SIDEBAR_WIDTH }}>
			{children}
		</Flex>
	);
};

export default SidebarLogo;
