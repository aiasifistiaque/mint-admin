'use client';

import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { GUIDES } from './guides';

/** What a docs navbar links to: its home, its guides, and back to the panel. */
export type DocsNav = {
	home: string;
	brand: string;
	guides: { href: string; title: string }[];
	open: { href: string; label: string };
};

/** The super admin's docs (/docs). The user guides (/user-docs) pass their own. */
export const ADMIN_DOCS_NAV: DocsNav = { home: '/docs', brand: 'MINT Docs', guides: GUIDES, open: { href: '/', label: 'Open admin' } };

/**
 * The top bar of every docs page (DocsShell) — the docs have no admin
 * sidebar: the docs' name (their home), a link to each guide, and back to the
 * panel. Pinned while the page scrolls; 56px tall, like the admin's own
 * navbar, so GuideNav sticks under it the same way.
 */
const DocsNavbar: FC<{ current: string; nav?: DocsNav }> = ({ current, nav = ADMIN_DOCS_NAV }) => (
	<Flex
		as='header'
		position='sticky'
		top={0}
		zIndex={10}
		h='56px'
		align='center'
		gap={4}
		px={{ base: 4, md: 10 }}
		bg='bg'
		borderBottomWidth='1px'
		borderColor='border.muted'>
		<Link
			asChild
			display='flex'
			alignItems='center'
			gap={2}
			flexShrink={0}
			color='fg'
			_hover={{ textDecoration: 'none' }}>
			<NextLink href={nav.home}>
				<BookOpen size={17} />
				<Text
					fontWeight='600'
					fontSize='15px'
					letterSpacing='-0.01em'>
					{nav.brand}
				</Text>
			</NextLink>
		</Link>

		<Flex
			as='nav'
			aria-label='Guides'
			flex={1}
			minW={0}
			gap={1}
			overflowX='auto'
			css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
			{nav.guides.map(g => {
				const on = g.href === current;
				return (
					<Link
						key={g.href}
						asChild
						flexShrink={0}
						px={2.5}
						py={1.5}
						borderRadius='md'
						fontSize='13px'
						whiteSpace='nowrap'
						color={on ? 'fg' : 'fg.muted'}
						fontWeight={on ? '500' : '400'}
						bg={on ? 'bg.muted' : 'transparent'}
						_hover={{ color: 'fg', bg: 'bg.muted', textDecoration: 'none' }}>
						<NextLink
							href={g.href}
							aria-current={on ? 'page' : undefined}>
							{g.title}
						</NextLink>
					</Link>
				);
			})}
		</Flex>

		<Box flexShrink={0}>
			<Button
				asChild
				size='xs'
				variant='outline'>
				<NextLink href={nav.open.href}>
					{nav.open.label}
					<ArrowUpRight size={13} />
				</NextLink>
			</Button>
		</Box>
	</Flex>
);

export default DocsNavbar;
