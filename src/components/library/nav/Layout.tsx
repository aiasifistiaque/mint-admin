'use client';

import { FC, useEffect, ReactNode } from 'react';
import { Flex, Heading, useMediaQuery, FlexProps, HeadingProps } from '@chakra-ui/react';

import { SelfMenu, SearchMenu } from '../menu';
import { AuthWrapper } from '../wrappers';
import ColorMode from '../components/color-mode/ColorMode';
import { LayoutWrapper, Navbar, Sidebar, Body, MainBody } from '../nav';
import { Align, SpaceBetween } from '../containers';
import { useIsMobile, useAppDispatch } from '../hooks';
import { refresh, useGetQuery, navigate } from '../store';
import { padding, sizes } from '../config';

const PX = { base: padding.BASE, md: padding.MD, lg: padding.LG };

export type FlexPropsType = FlexProps & {
	children?: ReactNode;
};

type LayoutProps = FlexPropsType & {
	children: ReactNode;
	title: string;
	path?: string;
	type?: 'default' | 'pos';
	hideColorMode?: boolean;
	isLoading?: boolean;
};

const Layout: FC<LayoutProps> = ({
	children,
	title,
	path = '/dashboard',
	hideColorMode = false,
	isLoading,
	...props
}) => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(navigate({ selected: path }));
		dispatch(refresh());
	}, []);

	// Chakra UI v3: useMediaQuery expects an array and returns an array of booleans
	const [isLargerThan800] = useMediaQuery(['(min-width: 800px)']);

	const type = isLargerThan800 ? (props?.type == 'pos' ? 'pos' : 'default') : 'pos';
	const isMobile = useIsMobile();
	const showMenu = isMobile || props?.type == 'pos';

	const sidebarType = process.env.NEXT_PUBLIC_SIDEBAR_TYPE || 'generic';

	const { data, isFetching, isError } = useGetQuery({ path: `/sidebar/crm/${sidebarType}` });

	const ICON_SIZE = 17;

	return (
		<AuthWrapper>
			<LayoutWrapper>
				<Navbar
					showMenu={showMenu}
					px={PX}
					w={showMenu ? 'full' : sizes.HOME_NAV_MAX_WIDTH}
					left={showMenu ? 0 : sizes.HOME_NAV_LEFT}>
					<SpaceBetween>
						<Heading {...titleCss}>{title}</Heading>
					</SpaceBetween>
					<Align gap={1}>
						<ColorMode
							size={ICON_SIZE}
							position='navbar'
						/>
						{data && (
							<SearchMenu
								sidebarData={data}
								iconSize={ICON_SIZE}
							/>
						)}
						<SelfMenu iconSize={ICON_SIZE} />
						{/* <CreateMenu /> */}
					</Align>
				</Navbar>
				<Body>
					{type == 'default' && <Sidebar />}
					<Flex
						{...mainContainer}
						pl={type !== 'default' ? 0 : sizes.HOME_NAV_LEFT}
						{...props}>
						<MainBody>{!isLoading && children}</MainBody>
					</Flex>
				</Body>
				{!hideColorMode && <ColorMode size={ICON_SIZE} />}
			</LayoutWrapper>
		</AuthWrapper>
	);
};

const titleCss: HeadingProps = {
	color: 'inherit',
	_dark: {
		color: 'inherit',
	},
	size: 'lg',
	fontFamily: 'Bebas Neue',
};

const mainContainer: FlexProps = {
	bg: 'background.light',
	_dark: { bg: 'background.dark' },
	flexDir: 'column',
	w: 'full',
	pt: sizes.NAV_HEIGHT,
};

export default Layout;
