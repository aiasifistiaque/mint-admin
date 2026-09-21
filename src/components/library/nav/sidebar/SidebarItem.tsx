'use client';
import { FC } from 'react';
import { Flex, Skeleton, Text, TextProps } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector, navigate, IconNameOptions } from '../..';

type SidebarItemProps = {
	children: string;
	href?: string;
	path: string;
	/**
	 * Still accepted so callers don't have to change, but no longer rendered —
	 * the icon now lives on the category heading instead. A glyph on every row
	 * made the list read as ~30 equally-weighted things; the category carries
	 * the symbol and its items are plain labels under it.
	 */
	icon?: IconNameOptions;
	sx?: any;
	isLoading?: boolean;
};

const SidebarItem: FC<SidebarItemProps> = ({ href, children, path, isLoading = false }) => {
	const { selected } = useAppSelector((state: any) => state.route);

	const dispatch = useAppDispatch();

	const router = useRouter();

	const changeRoute = (e: any): void => {
		if (!href) return;
		e.preventDefault();
		router.push(href);
		dispatch(navigate({ selected: path }));
	};

	const isSelected = selected === path;

	return (
		<Flex
			onClick={changeRoute}
			{...containerCss(isLoading, isSelected, href)}>
			{isLoading ? (
				<Skeleton
					height={2}
					w='full'
					borderRadius={SKELETON_BORDER_RADIUS}
				/>
			) : (
				<Text {...bodyTextCss(isSelected)}>{children}</Text>
			)}
		</Flex>
	);
};

const bodyTextCss = (isSelected?: boolean): TextProps => {
	return {
		color: isSelected ? 'sidebar.bodyText.selectedLight' : 'sidebar.bodyText.light',
		_dark: {
			color: isSelected ? 'sidebar.bodyText.selectedDark' : 'sidebar.bodyText.dark',
		},

		fontSize: { base: '14px', md: '12.5px' },
		fontWeight: isSelected ? '600' : '500',
		lineHeight: '1.3',
		lineClamp: 1,
		// Sits clear of the descenders rather than cutting through them.
		textDecoration: isSelected ? 'underline' : 'none',
		textUnderlineOffset: UNDERLINE_OFFSET,
		textDecorationThickness: '1px',
	};
};

/**
 * No chip, no fill, no rule across the row — both states underline the label
 * itself, so they read as one gesture at two strengths: faded on hover, solid
 * when current.
 *
 * The hover underline is declared on the row rather than the label because
 * `text-decoration` propagates to in-flow descendants and a child cannot switch
 * an ancestor's decoration back off — which is exactly what's wanted here, and
 * it keeps the hover target the whole row instead of just the glyphs.
 */
const containerCss = (isLoading: boolean, isSelected: boolean, href?: string): any => {
	const hover = {
		textDecoration: 'underline',
		textUnderlineOffset: UNDERLINE_OFFSET,
		textDecorationThickness: '1px',
	};

	return {
		alignItems: 'center',
		gap: 1,
		px: 1.5,
		transition: 'color .12s ease-in-out',
		cursor: 'pointer',
		userSelect: 'none',
		// Chakra's spacing scale has no 6.5 — it fell through as a raw 6.5px and
		// collapsed every row to 7px tall, overlapping the labels. 7 = 28px.
		h: { base: 9, md: 7 },
		bg: 'transparent',
		color: isSelected ? 'sidebar.bodyText.selectedLight' : 'sidebar.bodyText.light',
		_hover: isSelected ? {} : { ...hover, textDecorationColor: 'sidebar.hoverUnderline.light' },
		_dark: {
			bg: 'transparent',
			color: isSelected ? 'sidebar.bodyText.selectedDark' : 'sidebar.bodyText.dark',
			_hover: isSelected ? {} : { ...hover, textDecorationColor: 'sidebar.hoverUnderline.dark' },
		},
	};
};

// Far enough below the baseline to clear descenders on both states.
const UNDERLINE_OFFSET = '4px';

const SKELETON_BORDER_RADIUS = '90px';

export default SidebarItem;
