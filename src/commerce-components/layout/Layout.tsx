import { Flex, FlexProps } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Header, Body, Footer } from '..';
import { ColorMode } from '@/components/library';

type LayoutProps = FlexProps & {
	children: React.ReactNode;
};

const Layout: FC<LayoutProps> = ({ children, ...props }) => {
	return (
		<Flex
			flexDir='column'
			minH='100vh'
			w='100%'
			flex={1}
			{...props}>
			<Header />
			<Body>{children}</Body>
			<Footer />
			<ColorMode />
		</Flex>
	);
};

export default Layout;
