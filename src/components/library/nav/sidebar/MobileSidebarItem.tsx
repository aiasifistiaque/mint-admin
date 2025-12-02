'use client';
import { FC } from 'react';
import { Center, Flex, FlexProps, Grid, Skeleton, Text, TextProps } from '@chakra-ui/react';
import { useColorMode } from '@/components/ui/color-mode';
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

const MobileSidebarItem: FC<SidebarItemProps> = ({
	href,
	children,
	path,
	icon,
	isLoading = false,
}) => {
	const { selected } = useAppSelector((state: any) => state.route);
	const sidebarType = process.env.NEXT_PUBLIC_SIDEBAR_TYPE || 'generic';
	const { colorMode } = useColorMode();

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

	const iconColor =
		colorMode === 'light'
			? isSelected
				? 'sidebar.bodyText.selectedLight'
				: 'sidebar.bodyText.light'
			: isSelected
			? 'sidebar.bodyText.selectedDark'
			: 'sidebar.bodyText.dark';

	return (
		<Center
			onClick={changeRoute}
			{...containerCss(isLoading, isSelected, href)}>
			{isLoading ? (
				<Skeleton {...skeletonCss} />
			) : sidebarType == 'server' ? (
				<Center
					w='100px'
					h='100px'>
					<LucideIcon
						// color={'red'}
						// color={'background.dark'}
						name={icon}
						size={34}
					/>
				</Center>
			) : (
				<Icon
					color='inherit'
					name={icon}
					size={isMobile ? 20 : 16}
				/>
			)}

			{isLoading ? (
				<Skeleton
					height={2}
					borderRadius={SKELETON_BORDER_RADIUS}
				/>
			) : (
				<Text {...bodyTextCss(isSelected)}>{children}</Text>
			)}
		</Center>
	);
};

const bodyTextCss = (isSelected?: boolean): TextProps => {
	return {
		color: isSelected ? 'sidebar.bodyText.selectedLight' : 'sidebar.bodyText.light',
		_dark: {
			color: isSelected ? 'sidebar.bodyText.selectedDark' : 'sidebar.bodyText.dark',
		},

		fontSize: { base: '15px', md: '14px' },
		fontWeight: isSelected ? '700' : '600',
		textAlign: 'center',
	};
};

const containerCss = (isLoading: boolean, isSelected: boolean, href?: string): any => {
	return {
		flexDir: 'column',
		borderRadius: radius.CONTAINER,
		alignItems: 'center',
		gap: 2,
		p: 2.5,
		fontWeight: '600',
		cursor: 'pointer',
		fontSize: '.9rem',
		userSelect: 'none',
		borderWidth: '1px',
		h: '92px',

		borderColor: 'border.light',
		bg: 'sidebar.selectedItemBg.light',
		color: isSelected ? 'sidebar.bodyText.selectedLight' : 'sidebar.bodyText.light',
		_hover: !isSelected
			? { bg: 'sidebar.hover.bgLight' }
			: !href
			? { bg: 'sidebar.hover.bgLight' }
			: {},
		_dark: {
			bg: isLoading
				? 'transparent'
				: isSelected
				? 'sidebar.selectedItemBg.dark'
				: 'sidebar.selectedItemBg.dark',
			borderColor: isSelected
				? 'sidebar.selectedItemBorder.dark'
				: 'sidebar.selectedItemBorder.dark',
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

export default MobileSidebarItem;
