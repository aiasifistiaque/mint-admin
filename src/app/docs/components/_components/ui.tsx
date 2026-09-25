'use client';

import { FC, ReactNode, useState } from 'react';
import { Box, Button, Flex, Table, Text } from '@chakra-ui/react';
import { Check, Copy } from 'lucide-react';

import { useAppSelector } from '@/components/library';

/**
 * Typographic and layout pieces for the component library page. Same visual
 * language as the route builder guide (`/docs/builder`) so the two docs read as
 * one set.
 */

export const Section: FC<{ id: string; title: string; lead?: ReactNode; children: ReactNode }> = ({
	id,
	title,
	lead,
	children,
}) => (
	<Box
		as='section'
		id={id}
		scrollMarginTop='24px'
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
			<a href={`#${id}`}>{title}</a>
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
			gap={4}>
			{children}
		</Flex>
	</Box>
);

export const H3: FC<{ children: ReactNode }> = ({ children }) => (
	<Text
		as='h3'
		fontSize='11px'
		fontWeight='600'
		letterSpacing='0.06em'
		textTransform='uppercase'
		color='fg.muted'
		mt={2}
		mb={-2}>
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

/** A code block with a copy button. */
export const Code: FC<{ children: string; label?: string }> = ({ children, label }) => {
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(children);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// Clipboard can be blocked (insecure origin, permissions); the code is
			// still selectable by hand.
		}
	};

	return (
		<Box
			borderWidth='1px'
			borderColor='border'
			borderRadius='md'
			overflow='hidden'>
			<Flex
				align='center'
				justify='space-between'
				px={3}
				h='32px'
				bg='bg.subtle'
				borderBottomWidth='1px'
				borderColor='border.muted'>
				<Text
					fontSize='12px'
					color='fg.muted'>
					{label}
				</Text>
				<Button
					size='xs'
					h='24px'
					px={2}
					variant='ghost'
					color='fg.muted'
					onClick={copy}>
					{copied ? <Check size={12} /> : <Copy size={12} />}
					{copied ? 'Copied' : 'Copy'}
				</Button>
			</Flex>
			<Box
				as='pre'
				m={0}
				px={4}
				py={3}
				overflowX='auto'
				fontFamily='mono'
				fontSize='12.5px'
				lineHeight='1.65'
				whiteSpace='pre'>
				<code>{children}</code>
			</Box>
		</Box>
	);
};

/**
 * A live example. `fields` are the filter keys the example writes (matched by
 * prefix, so `createdAt` also catches `createdAt_btwn`), and the strip
 * underneath shows the query they produce as you use it.
 */
export const Preview: FC<{ children: ReactNode; fields?: string[] }> = ({ children, fields }) => {
	const { filters } = useAppSelector((state: any) => state.table);

	const query = fields
		? Object.entries(filters || {})
				.filter(
					([key, value]) =>
						fields.some(field => key.startsWith(field)) && value !== '' && value !== null
				)
				.map(([key, value]) => `${key}=${value}`)
				.join('&')
		: '';

	return (
		<Box
			borderWidth='1px'
			borderColor='border'
			borderRadius='md'
			overflow='hidden'>
			<Flex
				minH='120px'
				px={6}
				py={8}
				gap={2}
				align='flex-start'
				justify='center'
				wrap='wrap'
				// A faint dot grid marks this as a canvas, not page content.
				bgImage='radial-gradient(circle, var(--chakra-colors-border-muted) 1px, transparent 1px)'
				bgSize='14px 14px'>
				{children}
			</Flex>
			{fields && (
				<Flex
					px={3}
					h='32px'
					align='center'
					gap={2}
					borderTopWidth='1px'
					borderColor='border.muted'
					bg='bg.subtle'
					fontSize='12px'>
					<Text color='fg.muted'>Query</Text>
					<Box
						as='code'
						fontFamily='mono'
						color={query ? 'fg' : 'fg.subtle'}
						truncate>
						{query ? `?${query}` : 'nothing applied'}
					</Box>
				</Flex>
			)}
		</Box>
	);
};

export type PropRow = { name: string; type: string; required?: boolean; description: ReactNode };

/**
 * Props reference table. `head` renames the columns for other three-column
 * references; `plainNames` drops the code styling from the first column when
 * it holds words rather than identifiers.
 */
export const Props: FC<{ rows: PropRow[]; head?: [string, string, string]; plainNames?: boolean }> = ({
	rows,
	head = ['Prop', 'Type', 'Description'],
	plainNames,
}) => (
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
				{rows.map(row => (
					<Table.Row
						key={row.name}
						bg='transparent'>
						<Table.Cell
							verticalAlign='top'
							whiteSpace='nowrap'
							fontSize='sm'>
							{plainNames ? row.name : <C>{row.name}</C>}
							{row.required && (
								<Text
									as='span'
									ml={1}
									color='red.solid'
									fontSize='xs'>
									*
								</Text>
							)}
						</Table.Cell>
						<Table.Cell
							verticalAlign='top'
							fontFamily='mono'
							fontSize='12px'
							color='fg.muted'
							whiteSpace='nowrap'>
							{row.type}
						</Table.Cell>
						<Table.Cell
							fontSize='sm'
							color='fg.muted'
							lineHeight='1.6'>
							{row.description}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	</Box>
);
