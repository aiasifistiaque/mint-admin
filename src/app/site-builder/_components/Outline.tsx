'use client';

import { FC, memo, useCallback, useMemo, useState } from 'react';
import { Box, Flex, IconButton, Input, Text } from '@chakra-ui/react';
import { ChevronDown, ChevronRight, Eye, EyeOff, Lock, LockOpen } from 'lucide-react';
import type { SbBlockDef, SbNode } from '@/components/library/store/services/siteBuilderApi';
import { allIds, outlineRows, type OutlineRow } from './tree';
import SiteGuide from './SiteGuide';

/**
 * The page as a tree (docs/site-builder SB-05): header, page and footer, each
 * block's name, expand/collapse, select, rename (double click), hide, lock.
 * Rows only take primitive props and are memoized, so typing in the inspector
 * re-renders just the row whose name changed. The header and footer belong to
 * the design and every page shares them — they're edited from Design (SB-07).
 */

type Props = {
	tree: SbNode[];
	header: SbNode[];
	footer: SbNode[];
	blocks: Map<string, SbBlockDef>;
	selectedId: string | null;
	hoveredId: string | null;
	readOnly: boolean;
	onSelect: (id: string) => void;
	onHover: (id: string | null) => void;
	onRename: (id: string, name: string) => void;
	onToggleHidden: (id: string) => void;
	onToggleLocked: (id: string) => void;
};

type RowProps = OutlineRow & {
	expanded: boolean;
	selected: boolean;
	hovered: boolean;
	shared: boolean;
	readOnly: boolean;
	onSelect: (id: string) => void;
	onHover: (id: string | null) => void;
	onToggle: (id: string) => void;
	onRename: (id: string, name: string) => void;
	onToggleHidden: (id: string) => void;
	onToggleLocked: (id: string) => void;
};

const Row: FC<RowProps> = memo(function Row(p) {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(p.name);
	const commit = () => {
		setEditing(false);
		if (value.trim() !== p.name) p.onRename(p.id, value.trim());
	};
	return (
		<Flex
			role='treeitem'
			aria-selected={p.selected}
			align='center'
			gap={1}
			h='28px'
			pl={`${6 + p.depth * 14}px`}
			pr={1}
			cursor='pointer'
			fontSize='12.5px'
			bg={p.selected ? 'blue.subtle' : p.hovered ? 'bg.muted' : undefined}
			color={p.hidden ? 'fg.subtle' : undefined}
			onClick={() => p.onSelect(p.id)}
			onDoubleClick={() => {
				if (p.shared || p.readOnly) return;
				setValue(p.name);
				setEditing(true);
			}}
			onMouseEnter={() => p.onHover(p.id)}
			onMouseLeave={() => p.onHover(null)}
			className='sb-row'>
			<Box
				as='button'
				w='16px'
				display='flex'
				justifyContent='center'
				color='fg.muted'
				visibility={p.hasChildren ? 'visible' : 'hidden'}
				aria-label={p.expanded ? 'Collapse' : 'Expand'}
				onClick={e => {
					e.stopPropagation();
					p.onToggle(p.id);
				}}>
				{p.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
			</Box>
			{editing ? (
				<Input
					size='2xs'
					autoFocus
					value={value}
					maxLength={80}
					onChange={e => setValue(e.target.value)}
					onBlur={commit}
					onKeyDown={e => {
						if (e.key === 'Enter') commit();
						if (e.key === 'Escape') setEditing(false);
					}}
					onClick={e => e.stopPropagation()}
				/>
			) : (
				<Text
					flex={1}
					minW={0}
					truncate
					fontWeight={p.selected ? '600' : undefined}>
					{p.slot && (
						<Text
							as='span'
							color='fg.muted'>
							{p.slot}:{' '}
						</Text>
					)}
					{p.name}
				</Text>
			)}
			{!p.shared && !p.readOnly && (
				<Flex
					gap={0}
					className='sb-row-tools'
					opacity={p.hidden || p.locked ? 1 : 0}
					css={{ '.sb-row:hover &': { opacity: 1 } }}>
					<IconButton
						size='2xs'
						variant='ghost'
						aria-label={p.hidden ? 'Show' : 'Hide'}
						onClick={e => {
							e.stopPropagation();
							p.onToggleHidden(p.id);
						}}>
						{p.hidden ? <EyeOff size={12} /> : <Eye size={12} />}
					</IconButton>
					<IconButton
						size='2xs'
						variant='ghost'
						aria-label={p.locked ? 'Unlock' : 'Lock'}
						onClick={e => {
							e.stopPropagation();
							p.onToggleLocked(p.id);
						}}>
						{p.locked ? <Lock size={12} /> : <LockOpen size={12} />}
					</IconButton>
				</Flex>
			)}
		</Flex>
	);
});

const Group: FC<{ title: string; note?: string; children: React.ReactNode }> = ({ title, note, children }) => (
	<Box mb={2}>
		<Flex
			align='baseline'
			gap={2}
			px={3}
			py={1.5}>
			<Text
				fontSize='11px'
				fontWeight='600'
				textTransform='uppercase'
				letterSpacing='0.06em'
				color='fg.muted'>
				{title}
			</Text>
			{note && (
				<Text
					fontSize='11px'
					color='fg.subtle'>
					{note}
				</Text>
			)}
		</Flex>
		{children}
	</Box>
);

const Outline: FC<Props> = ({ tree, header, footer, blocks, selectedId, hoveredId, readOnly, onSelect, onHover, onRename, onToggleHidden, onToggleLocked }) => {
	const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
	const label = useCallback((n: SbNode) => n.name || blocks.get(n.type)?.label || n.type, [blocks]);
	const onToggle = useCallback(
		(id: string) =>
			setCollapsed(s => {
				const next = new Set(s);
				if (next.has(id)) next.delete(id);
				else next.add(id);
				return next;
			}),
		[]
	);

	// The shared header and footer start folded to their top level.
	const [openShared, setOpenShared] = useState<Set<string>>(() => new Set());
	const groups = useMemo(() => {
		const shared = (nodes: SbNode[]) => outlineRows(nodes, new Set([...allIds(nodes)].filter(id => !openShared.has(id))), label);
		return { header: shared(header), page: outlineRows(tree, collapsed, label), footer: shared(footer) };
	}, [tree, header, footer, collapsed, openShared, label]);
	const toggleShared = useCallback(
		(id: string) =>
			setOpenShared(s => {
				const next = new Set(s);
				if (next.has(id)) next.delete(id);
				else next.add(id);
				return next;
			}),
		[]
	);

	const rows = (list: OutlineRow[], shared: boolean) =>
		list.map(r => (
			<Row
				key={r.id}
				{...r}
				expanded={shared ? openShared.has(r.id) : !collapsed.has(r.id)}
				selected={r.id === selectedId}
				hovered={r.id === hoveredId}
				shared={shared}
				readOnly={readOnly}
				onSelect={onSelect}
				onHover={onHover}
				onToggle={shared ? toggleShared : onToggle}
				onRename={onRename}
				onToggleHidden={onToggleHidden}
				onToggleLocked={onToggleLocked}
			/>
		));

	return (
		<Flex
			direction='column'
			h='full'
			minH={0}>
			<Flex
				align='center'
				justify='space-between'
				px={3}
				py={2}
				borderBottomWidth='1px'>
				<Text
					fontSize='13px'
					fontWeight='600'>
					Outline
				</Text>
				<SiteGuide section='outline' />
			</Flex>
			<Box
				role='tree'
				flex={1}
				overflowY='auto'
				py={1}>
				{header.length > 0 && (
					<Group
						title='Header'
						note='every page'>
						{rows(groups.header, true)}
					</Group>
				)}
				<Group title='Page'>
					{groups.page.length ? (
						rows(groups.page, false)
					) : (
						<Text
							px={3}
							fontSize='12px'
							color='fg.muted'>
							This page is empty.
						</Text>
					)}
				</Group>
				{footer.length > 0 && (
					<Group
						title='Footer'
						note='every page'>
						{rows(groups.footer, true)}
					</Group>
				)}
			</Box>
		</Flex>
	);
};

export default memo(Outline);
