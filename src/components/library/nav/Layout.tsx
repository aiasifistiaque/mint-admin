'use client';

import React, { FC } from 'react';
import { Flex, Heading, useMediaQuery, FlexProps } from '@chakra-ui/react';

import { refresh, navigate } from '..';

import {
	useIsMobile,
	AuthWrapper,
	SelfMenu,
	SpaceBetween,
	CreateMenu,
	padding,
	sizes,
	useAppDispatch,
	ColorMode,
	Body,
	Navbar,
	Sidebar,
	Column,
	LayoutWrapper,
	THEME,
} from '..';

const PX = { base: padding.BASE, md: padding.MD, lg: padding.LG };

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

	const type = isLargerThan800 ? (props?.type == 'pos' ? 'pos' : 'default') : 'pos';

	const isMobile = useIsMobile();
	const showMenu = isMobile || props?.type == 'pos';

	return (
		<AuthWrapper>
			<LayoutWrapper>
				{props?.type !== 'pos' && (
					<Navbar
						showMenu={showMenu}
						px={PX}
						w={showMenu ? 'full' : sizes.HOME_NAV_MAX_WIDTH}
						left={showMenu ? 0 : sizes.HOME_NAV_LEFT}>
						<SpaceBetween>
							<Heading
								color={THEME == 'basic' ? 'inherit' : 'white'}
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
				)}

				<Body>
					{type == 'default' && <Sidebar />}
					<Flex
						flexDir='column'
						w='full'
						pl={type !== 'default' ? 0 : sizes.HOME_NAV_LEFT}
						{...props}>
						<Flex
							pt={props?.type == 'pos' ? 0 : type == 'pos' ? 12 : sizes.NAV_HEIGHT}
							flex={1}
							w='full'>
							<Flex
								overflowY='hidden'
								h={`calc(100vh - ${sizes.NAV_HEIGHT})`}
								borderTopRightRadius={{ base: `0`, md: THEME == 'basic' ? 0 : 'xl' }}
								bg={{ base: 'background.400', md: 'background.light' }}
								_dark={{ bg: 'background.dark', borderTopRightRadius: 0 }}
								p={PX}
								pb={0}
								w='full'>
								<Column
									pl={{ base: 0, md: 2 }}
									w='full'
									gap={4}>
									{children}
								</Column>
							</Flex>
						</Flex>
					</Flex>
				</Body>
				{!hideColorMode && <ColorMode />}
			</LayoutWrapper>
		</AuthWrapper>
	);
};

export default Layout;
