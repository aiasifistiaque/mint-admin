import { FC, ReactNode } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';
import { sizes, styles } from '../../..';

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
			{...styles.SIDEBAR_NAV}
			userSelect={'none'}
			w={{ base: '320px', md: sizes.SIDEBAR_WIDTH }}
			{...props}>
			{children}
		</Flex>
	);
};

export default SidebarLogo;
