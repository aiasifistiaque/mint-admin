import { sizes, THEME } from '../../../';
import { FlexProps, Flex } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

const SidebarContainer: FC<FlexProps & { children: ReactNode }> = ({ children, ...props }) => {
	return (
		<Flex {...containerCss}>
			<Flex
				{...bodyCss}
				{...props}>
				{children}
			</Flex>
		</Flex>
	);
};

const containerCss: FlexProps = {
	h: '100vh',
	position: 'fixed',
	overflow: 'none',
	w: { base: 'full', md: sizes.SIDEBAR_WIDTH },
	minW: sizes.SIDEBAR_WIDTH,
	bg: 'sidebar.light',
	_dark: { bg: 'sidebar.dark' },
};

const bodyCss: FlexProps = {
	flexDir: 'column',
	flex: 1,
	bg: 'sidebar.light',
	w: 'full',
	_dark: { bg: 'sidebar.dark' },
	borderTopRadius: { base: '0', md: THEME == 'basic' ? 0 : 'xl' },
	pl: sizes.SIDEBAR_PX,
	mx: THEME == 'basic' ? 0 : 4,
	zIndex: '9999',
};

export default SidebarContainer;
