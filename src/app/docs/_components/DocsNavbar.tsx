'use client';

import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { GUIDES } from './guides';

/**
 * The top bar of every docs page (DocsShell) — the docs have no admin
 * sidebar: MINT Docs (the docs home), a link to each guide, and back to the
 * admin. Pinned while the page scrolls; 56px tall, like the admin's own
 * navbar, so GuideNav sticks under it the same way.
 */
const DocsNavbar: FC<{ current: string }> = ({ current }) => (
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
			<NextLink href='/docs'>
				<BookOpen size={17} />
				<Text
					fontWeight='600'
					fontSize='15px'
					letterSpacing='-0.01em'>
					MINT Docs
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
			{GUIDES.map(g => {
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
				<NextLink href='/'>
					Open admin
					<ArrowUpRight size={13} />
				</NextLink>
			</Button>
		</Box>
	</Flex>
);

export default DocsNavbar;
