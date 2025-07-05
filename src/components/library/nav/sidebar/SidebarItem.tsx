'use client';
import { FC } from 'react';
import {
	Center,
	Flex,
	FlexProps,
	Grid,
	Skeleton,
	Text,
	TextProps,
	useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import {
	useIsMobile,
	Icon,
	useAppDispatch,
	useAppSelector,
	navigate,
	IconNameOptions,
	radius,
	LucideIcon,
} from '../..';

type SidebarItemProps = {
	children: string;
	href?: string;
	path: string;
	icon: IconNameOptions;
	sx?: any;
	isLoading?: boolean;
};

const SidebarItem: FC<SidebarItemProps> = ({ href, children, path, icon, isLoading = false }) => {
	const { selected } = useAppSelector((state: any) => state.route);
	const sidebarType = process.env.NEXT_PUBLIC_SIDEBAR_TYPE || 'generic';

	const dispatch = useAppDispatch();

	const router = useRouter();

	const changeRoute = (e: any): void => {
		if (!href) return;
		e.preventDefault();
		router.push(href);
		dispatch(navigate({ selected: path }));
	};

	const isMobile = useIsMobile();
	const isSelected = selected === path;

	const iconColor = useColorModeValue(
		isSelected ? 'sidebar.bodyText.selectedLight' : 'sidebar.bodyText.light',
		isSelected ? 'sidebar.bodyText.selectedDark' : 'sidebar.bodyText.dark'
	);

	return (
		<Grid
			onClick={changeRoute}
			{...containerCss(isLoading, isSelected, href)}>
			{isLoading ? (
				<Skeleton
					isLoaded={!isLoading}
					{...skeletonCss}
				/>
			) : sidebarType == 'server' ? (
				<Center
					boxSize={isMobile ? 6 : 5}
					w='full'
					h='full'>
					<LucideIcon
						// color={'red'}
						// color={'background.dark'}
						name={icon}
						size={isMobile ? 20 : 16}
					/>
				</Center>
			) : (
				<Icon
					color='inherit'
					name={icon}
					size={isMobile ? 20 : 16}
				/>
			)}

			<Skeleton
				height={isLoading ? 2 : 5}
				isLoaded={!isLoading}
				borderRadius={SKELETON_BORDER_RADIUS}>
				<Text {...bodyTextCss(isSelected)}>{children}</Text>
			</Skeleton>
		</Grid>
	);
};

const bodyTextCss = (isSelected?: boolean): TextProps => {
	return {
		color: isSelected ? 'sidebar.bodyText.selectedLight' : 'sidebar.bodyText.light',
		_dark: {
			color: isSelected ? 'sidebar.bodyText.selectedDark' : 'sidebar.bodyText.dark',
		},

		fontSize: { base: '16px', md: '14px' },
		fontWeight: isSelected ? '700' : '500',
	};
};

const containerCss = (isLoading: boolean, isSelected: boolean, href?: string): FlexProps => {
	return {
		gridTemplateColumns: '1fr 6fr',
		borderRadius: radius.CONTAINER,
		alignItems: 'center',
		gap: 1,
		px: 2.5,
		transition: 'all .1s ease-in-out',
		fontWeight: '600',
		cursor: 'pointer',
		fontSize: '.9rem',
		userSelect: 'none',
		borderWidth: '1px',
		h: { base: 10, md: 8 },
		borderColor: isSelected ? 'sidebar.selectedItemBorder.light' : 'transparent',
		bg: isLoading ? 'transparent' : isSelected ? 'sidebar.selectedItemBg.light' : 'transparent',
		color: isSelected ? 'sidebar.bodyText.selectedLight' : 'sidebar.bodyText.light',
		_hover: !isSelected
			? { bg: 'sidebar.hover.bgLight' }
			: !href
			? { bg: 'sidebar.hover.bgLight' }
			: {},
		_dark: {
			bg: isLoading ? 'transparent' : isSelected ? 'sidebar.selectedItemBg.dark' : 'transparent',
			borderColor: isSelected ? 'sidebar.selectedItemBorder.dark' : 'transparent',
			color: isSelected ? 'sidebar.bodyText.selectedDark' : 'sidebar.bodyText.dark',
			_hover: !isSelected
				? { bg: 'sidebar.hover.bgDark' }
				: !href
				? { bg: 'sidebar.hover.bgDark' }
				: {},
		},
	};
};

const SKELETON_BORDER_RADIUS = '90px';

const skeletonCss: any = {
	borderRadius: SKELETON_BORDER_RADIUS,
	height: '20px',
	width: '20px',
};

export default SidebarItem;
