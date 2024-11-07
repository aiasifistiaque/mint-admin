'use client';

import React, { FC } from 'react';
import { Flex, Heading, useMediaQuery, FlexProps } from '@chakra-ui/react';

import {
	useIsMobile,
	AuthWrapper,
	SelfMenu,
	SpaceBetween,
	CreateMenu,
	refresh,
	navigate,
	padding,
	sizes,
	useAppDispatch,
	ColorMode,
	Body,
	Navbar,
	Sidebar,
	Column,
} from '../library';

const PX = { base: padding.BASE, md: padding.MD, lg: padding.LG };
const PADDING_TOP = { base: 16, md: 16, lg: 16 };

export type FlexPropsType = FlexProps & {
	children?: React.ReactNode;
};

type LayoutProps = FlexPropsType & {
	children: React.ReactNode;
	title: string;
	path?: string;
	type?: 'default' | 'pos';
	hideColorMode?: boolean;
};

const Layout: FC<LayoutProps> = ({
	children,
	title,
	//type = 'default',
	path = '/dashboard',
	hideColorMode = false,
	...props
}) => {
	const dispatch = useAppDispatch();
	dispatch(navigate({ selected: path }));

	React.useEffect(() => {
		dispatch(refresh());
	}, []);

	const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

	const type = isLargerThan800 ? 'default' : 'pos';

	const isMobile = useIsMobile();

	return (
		<AuthWrapper>
			<Flex
				w='100%'
				gap={0}>
				<Navbar
					px={PX}
					w={isMobile ? 'full' : sizes.HOME_NAV_MAX_WIDTH}
					left={isMobile ? 0 : sizes.HOME_NAV_LEFT}
					_dark={{ bg: 'navbar.dark' }}>
					<SpaceBetween>
						<Heading
							size='md'
							fontFamily='Bebas Neue'>
							{title}
						</Heading>
					</SpaceBetween>
					<Flex
						align='center'
						gap={4}>
						<SelfMenu />
						<CreateMenu />
					</Flex>
				</Navbar>
			</Flex>
			<Body>
				{type == 'default' && <Sidebar />}
				<Flex
					flexDir='column'
					w='full'
					pl={type !== 'default' ? 0 : sizes.HOME_NAV_LEFT}
					{...props}>
					<Flex
						pt={type == 'pos' ? 12 : PADDING_TOP}
						flex={1}
						w='full'>
						<Flex
							p={PX}
							pt={2}
							pb={0}
							w='full'>
							<Column
								w='full'
								gap={4}>
								{children}
							</Column>
						</Flex>
					</Flex>
				</Flex>
			</Body>
			{!hideColorMode && <ColorMode />}
		</AuthWrapper>
	);
};

export default Layout;
