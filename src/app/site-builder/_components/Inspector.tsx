'use client';

import { FC, memo, useCallback } from 'react';
import { Box, Button, Flex, IconButton, Menu, Portal, Text } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, ClipboardPaste, Copy, CopyPlus, CornerLeftUp, Group, Scissors, Trash2 } from 'lucide-react';
import type { SbBlockDef, SbNode } from '@/components/library/store/services/siteBuilderApi';
import { ActionEditor, PropInput, type InputContext } from './PropInputs';
import type { Op } from './tree';
import SiteGuide from './SiteGuide';

/**
 * The selected block's settings (docs/site-builder SB-05): its props from the
 * manifest, and what it does when clicked. Styles arrive with SB-07. Blocks of
 * the shared header and footer are shown, not edited, here. SB-06: a toolbar
 * for duplicate / copy / cut / paste / move / wrap / delete.
 */

type Props = {
	node: SbNode | null;
	def: SbBlockDef | null;
	shared: boolean;
	ctx: InputContext;
	theme: string;
	readOnly: boolean;
	apply: (ops: Op[], key?: string) => string | null;
	onCommand: (cmd: Command) => void;
};

/** What the block toolbar and the shortcuts can do to the selection (SiteBuilder runs them). */
export type Command = 'duplicate' | 'copy' | 'cut' | 'paste' | 'wrap-stack' | 'wrap-section' | 'up' | 'down' | 'parent' | 'delete';

const TOOLS: { cmd: Command; label: string; keys: string; icon: React.ReactNode }[] = [
	{ cmd: 'duplicate', label: 'Duplicate', keys: '⌘D', icon: <CopyPlus size={13} /> },
	{ cmd: 'copy', label: 'Copy', keys: '⌘C', icon: <Copy size={13} /> },
	{ cmd: 'cut', label: 'Cut', keys: '⌘X', icon: <Scissors size={13} /> },
	{ cmd: 'paste', label: 'Paste after it', keys: '⌘V', icon: <ClipboardPaste size={13} /> },
	{ cmd: 'up', label: 'Move up', keys: '⌥↑', icon: <ArrowUp size={13} /> },
	{ cmd: 'down', label: 'Move down', keys: '⌥↓', icon: <ArrowDown size={13} /> },
	{ cmd: 'parent', label: 'Select the block it’s in', keys: 'Esc', icon: <CornerLeftUp size={13} /> },
];

/** Duplicate, copy, cut, paste, wrap, move, select the parent — each with its shortcut in the tooltip. */
const Toolbar: FC<{ locked: boolean; onCommand: (cmd: Command) => void }> = ({ locked, onCommand }) => (
	<Flex
		align='center'
		gap={0.5}
		px={2}
		py={1}
		borderBottomWidth='1px'>
		{TOOLS.map(t => (
			<IconButton
				key={t.cmd}
				size='2xs'
				variant='ghost'
				aria-label={t.label}
				title={`${t.label} (${t.keys})`}
				disabled={locked && (t.cmd === 'cut' || t.cmd === 'up' || t.cmd === 'down')}
				onClick={() => onCommand(t.cmd)}>
				{t.icon}
			</IconButton>
		))}
		<Menu.Root positioning={{ placement: 'bottom-end' }}>
			<Menu.Trigger asChild>
				<IconButton
					size='2xs'
					variant='ghost'
					aria-label='Wrap it'
					title='Wrap it in a stack or a section'>
					<Group size={13} />
				</IconButton>
			</Menu.Trigger>
			<Portal>
				<Menu.Positioner>
					<Menu.Content minW='200px'>
						<Menu.Item
							value='wrap-stack'
							fontSize='12.5px'
							onClick={() => onCommand('wrap-stack')}>
							Wrap in a stack
						</Menu.Item>
						<Menu.Item
							value='wrap-section'
							fontSize='12.5px'
							onClick={() => onCommand('wrap-section')}>
							Wrap in a section
						</Menu.Item>
					</Menu.Content>
				</Menu.Positioner>
			</Portal>
		</Menu.Root>
		<Box flex={1} />
		<IconButton
			size='2xs'
			variant='ghost'
			colorPalette='red'
			aria-label='Delete'
			title={locked ? 'Unlock it in the outline first' : 'Delete (⌫)'}
			disabled={locked}
			onClick={() => onCommand('delete')}>
			<Trash2 size={13} />
		</IconButton>
	</Flex>
);

const Header: FC<{ title: string; sub?: string }> = ({ title, sub }) => (
	<Flex
		align='center'
		justify='space-between'
		px={3}
		py={2}
		borderBottomWidth='1px'>
		<Box minW={0}>
			<Text
				fontSize='13px'
				fontWeight='600'
				truncate>
				{title}
			</Text>
			{sub && (
				<Text
					fontSize='11.5px'
					color='fg.muted'
					truncate>
					{sub}
				</Text>
			)}
		</Box>
		<SiteGuide section='props' />
	</Flex>
);

const Inspector: FC<Props> = ({ node, def, shared, ctx, theme, readOnly, apply, onCommand }) => {
	const id = node?.id;
	const setProp = useCallback(
		(key: string, value: any) => {
			if (id) apply([{ op: 'update', id, props: { [key]: value ?? null } }], `${id}:${key}`);
		},
		[id, apply]
	);

	if (!node || !def)
		return (
			<Flex
				direction='column'
				h='full'>
				<Header title='Settings' />
				<Text
					p={3}
					fontSize='12.5px'
					color='fg.muted'
					lineHeight='1.5'>
					Click a block on the page, or in the outline, to change it.
				</Text>
			</Flex>
		);

	const locked = readOnly || shared;
	return (
		<Flex
			direction='column'
			h='full'
			minH={0}>
			<Header
				title={node.name || def.label}
				sub={node.name ? def.label : def.description}
			/>
			{!locked && (
				<Toolbar
					locked={!!node.locked}
					onCommand={onCommand}
				/>
			)}
			<Box
				flex={1}
				overflowY='auto'
				p={3}>
				{shared && (
					<Text
						fontSize='12px'
						color='fg.muted'
						mb={3}
						p={2}
						bg='bg.subtle'
						borderRadius='md'
						lineHeight='1.5'>
						Part of the header or footer every page shares. You’ll edit it from Design, coming next.
					</Text>
				)}
				<Flex
					direction='column'
					gap={3}>
					{def.props.map(p => (
						<PropInput
							key={`${node.id}:${p.key}`}
							def={p}
							value={node.props?.[p.key]}
							ctx={ctx}
							theme={theme}
							readOnly={locked}
							onChange={v => setProp(p.key, v)}
						/>
					))}
					{!def.props.length && (
						<Text
							fontSize='12px'
							color='fg.muted'>
							This block has no settings of its own.
						</Text>
					)}
				</Flex>
				{def.actions && (
					<Box
						mt={4}
						pt={3}
						borderTopWidth='1px'>
						<ActionEditor
							node={node}
							ctx={ctx}
							readOnly={locked}
							onChange={action => apply([{ op: 'update', id: node.id, action: action ?? null }], `${node.id}:action`)}
						/>
					</Box>
				)}
				{!locked && (
					<Button
						mt={6}
						size='xs'
						variant='ghost'
						colorPalette='red'
						disabled={!!node.locked}
						title={node.locked ? 'Unlock it in the outline first' : undefined}
						onClick={() => onCommand('delete')}>
						<Trash2 size={12} /> Remove block
					</Button>
				)}
			</Box>
		</Flex>
	);
};

export default memo(Inspector);
