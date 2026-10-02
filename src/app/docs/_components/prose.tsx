'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Box, Button, Flex, Link, Table, Text } from '@chakra-ui/react';
import { Copy } from 'lucide-react';

/**
 * The building blocks of a guide's text — sections, paragraphs, lists, notes,
 * term tables and code — shared by the user guides (/user-docs). The older
 * /docs guides still carry their own copies of the same pieces.
 */

/** A guide section: an anchored heading (an "On this page" target), a lead line, the body. */
export const Section: FC<{ id: string; title: string; lead?: ReactNode; children: ReactNode }> = ({ id, title, lead, children }) => (
	<Box
		as='section'
		id={id}
		scrollMarginTop='80px'
		pt={8}
		pb={2}
		borderTopWidth='1px'
		borderColor='border.muted'
		_first={{ borderTopWidth: 0, pt: 0 }}>
		<Text
			as='h2'
			fontSize='lg'
			fontWeight='600'
			mb={lead ? 1 : 3}>
			<Link
				href={`#${id}`}
				color='fg'
				_hover={{ textDecoration: 'none', color: 'fg.muted' }}>
				{title}
			</Link>
		</Text>
		{lead && (
			<Text
				fontSize='sm'
				color='fg.muted'
				mb={4}>
				{lead}
			</Text>
		)}
		<Flex
			direction='column'
			gap={3}>
			{children}
		</Flex>
	</Box>
);

/** A sub-heading inside a section; with `id` it's a link target of its own. */
export const H3: FC<{ id?: string; children: ReactNode }> = ({ id, children }) => (
	<Text
		as='h3'
		id={id}
		scrollMarginTop='80px'
		fontSize='md'
		fontWeight='600'
		mt={3}>
		{children}
	</Text>
);

export const P: FC<{ children: ReactNode }> = ({ children }) => (
	<Text
		fontSize='sm'
		lineHeight='1.7'>
		{children}
	</Text>
);

/** Inline code. */
export const C: FC<{ children: ReactNode }> = ({ children }) => (
	<Box
		as='code'
		fontFamily='mono'
		fontSize='0.85em'
		px={1}
		py={0.5}
		borderRadius='sm'
		bg='bg.muted'>
		{children}
	</Box>
);

/** A link inside the text: client-side for addresses in this app, a new tab for other sites. */
export const A: FC<{ href: string; children: ReactNode }> = ({ href, children }) =>
	/^https?:/.test(href) ? (
		<Link
			href={href}
			target='_blank'
			rel='noreferrer'>
			{children}
		</Link>
	) : (
		<Link asChild>
			<NextLink href={href}>{children}</NextLink>
		</Link>
	);

export const List: FC<{ items: ReactNode[]; ordered?: boolean }> = ({ items, ordered }) => (
	<Box
		as={ordered ? 'ol' : 'ul'}
		pl={5}
		fontSize='sm'
		lineHeight='1.7'
		listStyleType={ordered ? 'decimal' : 'disc'}>
		{items.map((item, i) => (
			<Box
				as='li'
				key={i}
				mb={1}>
				{item}
			</Box>
		))}
	</Box>
);

export const Note: FC<{ children: ReactNode; tone?: 'warn' }> = ({ children, tone }) => (
	<Box
		px={4}
		py={3}
		borderLeftWidth='3px'
		borderColor={tone === 'warn' ? 'orange.solid' : 'border.emphasized'}
		bg='bg.subtle'
		borderRadius='sm'
		fontSize='sm'
		lineHeight='1.7'>
		{children}
	</Box>
);

/** A two-column table: a term and what it means. */
export const Terms: FC<{ head?: [string, string]; rows: [ReactNode, ReactNode][] }> = ({ head = ['Field', 'What it does'], rows }) => (
	<Box
		borderWidth='1px'
		borderColor='border'
		borderRadius='md'
		overflowX='auto'>
		<Table.Root
			size='sm'
			variant='line'>
			<Table.Header>
				<Table.Row bg='bg.subtle'>
					{head.map(h => (
						<Table.ColumnHeader
							key={h}
							fontSize='11px'
							fontWeight='500'
							letterSpacing='0.04em'
							textTransform='uppercase'
							color='fg.muted'>
							{h}
						</Table.ColumnHeader>
					))}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{rows.map(([term, def], i) => (
					<Table.Row
						key={i}
						bg='transparent'>
						<Table.Cell
							fontSize='sm'
							fontWeight='500'
							verticalAlign='top'
							w='34%'
							minW='150px'>
							{term}
						</Table.Cell>
						<Table.Cell
							fontSize='sm'
							color='fg.muted'
							lineHeight='1.6'>
							{def}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	</Box>
);

/** A block of code with a copy button. */
export const CodeBlock: FC<{ code: string; label?: string }> = ({ code, label = 'code' }) => {
	const [copied, setCopied] = useState(false);
	return (
		<Box
			position='relative'
			borderWidth='1px'
			borderColor='border'
			borderRadius='md'
			bg='bg.subtle'>
			<Box
				as='pre'
				m={0}
				p={3}
				pr={14}
				fontSize='12.5px'
				lineHeight='1.6'
				fontFamily='mono'
				whiteSpace='pre-wrap'
				wordBreak='break-word'
				overflowX='auto'
				aria-label={label}>
				{code}
			</Box>
			<Button
				position='absolute'
				top={1.5}
				right={1.5}
				size='xs'
				variant='ghost'
				aria-label={`Copy ${label}`}
				onClick={() => {
					navigator.clipboard?.writeText(code);
					setCopied(true);
					setTimeout(() => setCopied(false), 1500);
				}}>
				{copied ? 'Copied' : <Copy size={14} />}
			</Button>
		</Box>
	);
};

/**
 * Jumps to `#section` once the guide is on screen — a guide behind sign-in
 * renders after the browser's own jump has already happened (to nothing).
 */
export const useHashScroll = () =>
	useEffect(() => {
		const id = decodeURIComponent(window.location.hash.slice(1));
		if (id) document.getElementById(id)?.scrollIntoView();
	}, []);
