'use client';

import { FC, ReactNode } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Link, Text } from '@chakra-ui/react';

/** The component library's pages, in reading order. */
export const LIBRARY_PAGES = [
	{ href: '/docs/components', title: 'Filters & charts' },
	{ href: '/docs/components/inputs', title: 'Form inputs' },
	{ href: '/docs/components/tables', title: 'Tables' },
	{ href: '/docs/components/view', title: 'Detail pages' },
	{ href: '/docs/components/dashboard', title: 'Dashboard' },
];

/** The tab row under the component library's header, joining its pages. */
export const LibraryTabs: FC<{ current: string }> = ({ current }) => (
	<Flex
		as='nav'
		aria-label='Component library'
		gap={1}
		mb={2}
		borderBottomWidth='1px'
		borderColor='border.muted'
		overflowX='auto'
		css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
		{LIBRARY_PAGES.map(p => {
			const on = p.href === current;
			return (
				<Link
					key={p.href}
					asChild
					flexShrink={0}
					px={3}
					py={2}
					mb='-1px'
					fontSize='13px'
					whiteSpace='nowrap'
					color={on ? 'fg' : 'fg.muted'}
					fontWeight={on ? '500' : '400'}
					borderBottomWidth='2px'
					borderColor={on ? 'fg' : 'transparent'}
					_hover={{ color: 'fg', textDecoration: 'none' }}>
					<NextLink
						href={p.href}
						aria-current={on ? 'page' : undefined}>
						{p.title}
					</NextLink>
				</Link>
			);
		})}
	</Flex>
);

/**
 * A labelled cell of an example grid: the variation's name over the live
 * component.
 */
export const Variant: FC<{ label: string; children: ReactNode; wide?: boolean }> = ({ label, children, wide }) => (
	<Box
		minW={0}
		gridColumn={wide ? '1 / -1' : undefined}>
		<Text
			fontSize='11px'
			fontWeight='500'
			letterSpacing='0.04em'
			textTransform='uppercase'
			color='fg.muted'
			mb={2}>
			{label}
		</Text>
		{children}
	</Box>
);
