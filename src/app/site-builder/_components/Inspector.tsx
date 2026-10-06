'use client';

import { FC, memo, useCallback, useState } from 'react';
import { Box, Button, Flex, IconButton, Input, Menu, Portal, Text } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, ClipboardPaste, Copy, CopyPlus, CornerLeftUp, Group, Pencil, Puzzle, Scissors, Trash2, Unlink } from 'lucide-react';
import { PromptDialog } from '@/components/library';
import type { SbBlockDef, SbNode, SbSectionUsage } from '@/components/library/store/services/siteBuilderApi';
import { ActionEditor, PropInput, type InputContext } from './PropInputs';
import StylePanel, { type Bp } from './StylePanel';
import type { Op } from './tree';
import type { Part } from './useDesign';
import SiteGuide from './SiteGuide';

/**
 * The selected block's settings (docs/site-builder SB-05): its props from the
 * manifest, and what it does when clicked. SB-06: a toolbar for duplicate /
 * copy / cut / paste / move / wrap / delete. SB-07: a Style tab (StylePanel),
 * "Save as section", and for a saved section, editing or detaching it. While a
 * page is open, blocks of its header and footer are shown here and edited in
 * the header or footer itself.
 */

type Props = {
	node: SbNode | null;
	def: SbBlockDef | null;
	/** the block is in the header or footer of the page being edited — edit it there */
	shared: Part | null;
	ctx: InputContext;
	theme: string;
	bp: Bp;
	onBp: (bp: Bp) => void;
	/** the space scale's lengths, for the Style tab's labels */
	space: Record<string, string>;
	usage: SbSectionUsage;
	/** a saved section is being edited (it can't hold another) */
	inSection: boolean;
	readOnly: boolean;
	apply: (ops: Op[], key?: string) => string | null;
	onCommand: (cmd: Command) => void;
	onEditPart: (part: Part) => void;
	onSaveSection: (name: string) => void;
	onDetach: () => void;
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

/** Duplicate, copy, cut, paste, wrap, move, select the parent, save as section — each with its shortcut in the tooltip. */
const Toolbar: FC<{ locked: boolean; onCommand: (cmd: Command) => void; onSaveSection?: () => void }> = ({ locked, onCommand, onSaveSection }) => (
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
		{onSaveSection && (
			<IconButton
				size='2xs'
				variant='ghost'
				aria-label='Save as section'
				title='Save as section — use it on other pages, change it in one place'
				onClick={onSaveSection}>
				<Puzzle size={13} />
			</IconButton>
		)}
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

/** A saved section on the page: where it's used, edit it (everywhere), or put a copy of its own here. */
const SectionRefBox: FC<{ node: SbNode; ctx: InputContext; usage: SbSectionUsage; readOnly: boolean; onEditPart: Props['onEditPart']; onDetach: () => void }> = ({
	node,
	ctx,
	usage,
	readOnly,
	onEditPart,
	onDetach,
}) => {
	const id = node.props?.section;
	const saved = ctx.sections.find(s => s.id === id);
	if (!saved) return null;
	const u = usage[id];
	const where = u ? [...u.pages.map(p => p.name), ...u.layouts.map(l => `the ${l} layout`)] : [];
	return (
		<Box
			p={2.5}
			bg='bg.subtle'
			borderRadius='md'>
			<Text
				fontSize='12px'
				lineHeight='1.5'
				color='fg.muted'>
				“{saved.name}” is shared{where.length > 1 ? ` — it’s on ${where.join(', ')}` : ''}. Change it once and every page that uses it follows.
			</Text>
			<Flex
				gap={1}
				mt={2}
				wrap='wrap'>
				<Button
					size='2xs'
					variant='outline'
					onClick={() => onEditPart({ kind: 'section', id })}>
					<Pencil size={11} /> Edit the section
				</Button>
				{!readOnly && (
					<Button
						size='2xs'
						variant='ghost'
						title='Put a copy of its blocks here instead, to change on this page only'
						onClick={onDetach}>
						<Unlink size={11} /> Detach a copy
					</Button>
				)}
			</Flex>
		</Box>
	);
};

const Inspector: FC<Props> = ({ node, def, shared, ctx, theme, bp, onBp, space, usage, inSection, readOnly, apply, onCommand, onEditPart, onSaveSection, onDetach }) => {
	const [tab, setTab] = useState<'settings' | 'style'>('settings');
	const [naming, setNaming] = useState<string | null>(null);
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

	const locked = readOnly || !!shared;
	const canSave = !locked && !inSection && def.category !== 'overlay' && node.type !== 'section-ref';
	const hasStyle = def.style === 'all' || def.style.length > 0;
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
					onSaveSection={canSave ? () => setNaming(node.name || def.label) : undefined}
				/>
			)}
			<Flex
				px={2}
				gap={1}
				borderBottomWidth='1px'>
				{(['settings', 'style'] as const).map(t => (
					<Button
						key={t}
						size='xs'
						variant='ghost'
						borderRadius='0'
						borderBottomWidth='2px'
						borderColor={tab === t ? 'fg' : 'transparent'}
						fontWeight={tab === t ? '600' : '400'}
						onClick={() => setTab(t)}>
						{t === 'settings' ? 'Settings' : 'Style'}
					</Button>
				))}
				<Box flex={1} />
				<Flex
					align='center'
					pr={1}>
					<SiteGuide section={tab === 'settings' ? 'props' : 'style'} />
				</Flex>
			</Flex>
			<Box
				flex={1}
				overflowY='auto'
				p={3}>
				{shared && (
					<Box
						mb={3}
						p={2.5}
						bg='bg.subtle'
						borderRadius='md'>
						<Text
							fontSize='12px'
							color='fg.muted'
							lineHeight='1.5'>
							Part of the {shared.kind} that every page with this layout shares. Change it in the {shared.kind} itself.
						</Text>
						<Button
							mt={2}
							size='2xs'
							variant='outline'
							onClick={() => onEditPart(shared)}>
							<Pencil size={11} /> Edit the {shared.kind}
						</Button>
					</Box>
				)}
				{tab === 'style' ? (
					hasStyle ? (
						<StylePanel
							node={node}
							def={def}
							manifest={ctx.manifest}
							bp={bp}
							onBp={onBp}
							colors={ctx.colors}
							space={space}
							readOnly={locked}
							apply={apply}
						/>
					) : (
						<Text
							fontSize='12px'
							color='fg.muted'>
							This block has no styles of its own.
						</Text>
					)
				) : (
					<>
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
							{node.type === 'section-ref' && (
								<SectionRefBox
									node={node}
									ctx={ctx}
									usage={usage}
									readOnly={locked}
									onEditPart={onEditPart}
									onDetach={onDetach}
								/>
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
					</>
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
			<PromptDialog
				open={naming !== null}
				tone='default'
				icon={<Puzzle size={18} strokeWidth={1.75} />}
				title='Save as a section'
				description='It becomes a saved section you can add to any page from the Add tab, and it takes this block’s place here. Change the section once and every page that uses it follows.'
				confirmLabel='Save section'
				disabled={!naming?.trim()}
				onClose={() => setNaming(null)}
				onConfirm={() => {
					onSaveSection(naming!.trim());
					setNaming(null);
				}}>
				<Input
					size='sm'
					autoFocus
					maxLength={80}
					placeholder='Name, e.g. Newsletter sign-up'
					value={naming || ''}
					onChange={e => setNaming(e.target.value)}
				/>
			</PromptDialog>
		</Flex>
	);
};

export default memo(Inspector);
