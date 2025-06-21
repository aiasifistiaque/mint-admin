'use client';
import { FC } from 'react';
import { Flex, FlexProps, Skeleton, Text, TextProps } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import {
	useIsMobile,
	Icon,
	useAppDispatch,
	useAppSelector,
	navigate,
	IconNameOptions,
	radius,
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

	return (
		<Flex
			onClick={changeRoute}
			{...containerCss(isLoading, isSelected, href)}>
			{isLoading ? (
				<Skeleton
					isLoaded={!isLoading}
					{...skeletonCss}
				/>
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
		</Flex>
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
		borderRadius: radius.CONTAINER,
		alignItems: 'center',
		gap: 2.5,
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
