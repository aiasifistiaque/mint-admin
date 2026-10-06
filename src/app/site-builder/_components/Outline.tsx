'use client';

import { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import { Box, Flex, IconButton, Input, Text } from '@chakra-ui/react';
import { ChevronDown, ChevronRight, Eye, EyeOff, Lock, LockOpen } from 'lucide-react';
import type { SbBlockDef, SbNode } from '@/components/library/store/services/siteBuilderApi';
import { isOverlay, problemFor } from './edit';
import { allIds, locate, outlineRows, type OutlineRow } from './tree';
import SiteGuide from './SiteGuide';

/**
 * The page as a tree (docs/site-builder SB-05): header, page and footer, each
 * block's name, expand/collapse, select, rename (double click), hide, lock.
 * Rows only take primitive props and are memoized, so typing in the inspector
 * re-renders just the row whose name changed. The header and footer belong to
 * the design and every page shares them — they're edited on their own (SB-07):
 * then the tree is the header, footer or saved section, titled `title`.
 * SB-06: drag a row to move its block (above, below or into another row);
 * pop-ups, drawers and popovers are listed under Overlays.
 */

type Where = 'before' | 'after' | 'inside';
type Drag = { id: string; overId: string | null; where: Where; problem: string | null };

type Props = {
	tree: SbNode[];
	/** The page's draft hasn't arrived yet — don't call it empty. */
	loading?: boolean;
	/** what the tree is, when it isn't a page: 'Header', 'Footer', 'Saved section' */
	title?: string;
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
	onMove: (id: string, target: { parentId: string | null; index: number }) => void;
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
	/** drag and drop: off for the shared header / footer, read-only roles and locked blocks */
	draggable: boolean;
	holds: boolean;
	dropAt?: Where;
	dropBad?: boolean;
	onDragStartRow: (id: string) => void;
	onDragOverRow: (id: string, where: Where) => void;
	onDropRow: () => void;
	onDragEndRow: () => void;
};

const DROP_BLUE = 'var(--chakra-colors-blue-solid)';
const DROP_RED = 'var(--chakra-colors-red-solid)';

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
			draggable={p.draggable && !editing}
			onDragStart={e => {
				e.dataTransfer.effectAllowed = 'move';
				e.dataTransfer.setData('text/plain', p.id);
				p.onDragStartRow(p.id);
			}}
			onDragOver={e => {
				if (p.shared) return;
				e.preventDefault();
				const r = e.currentTarget.getBoundingClientRect();
				const f = (e.clientY - r.top) / r.height;
				p.onDragOverRow(p.id, p.holds ? (f < 0.28 ? 'before' : f > 0.72 ? 'after' : 'inside') : f < 0.5 ? 'before' : 'after');
			}}
			onDrop={e => {
				e.preventDefault();
				p.onDropRow();
			}}
			onDragEnd={p.onDragEndRow}
			position='relative'
			outline={p.dropAt === 'inside' ? `2px solid ${p.dropBad ? DROP_RED : DROP_BLUE}` : undefined}
			outlineOffset='-2px'
			_before={
				p.dropAt === 'before' || p.dropAt === 'after'
					? {
							content: '""',
							position: 'absolute',
							left: `${6 + p.depth * 14}px`,
							right: 0,
							height: '2px',
							bg: p.dropBad ? DROP_RED : DROP_BLUE,
							...(p.dropAt === 'before' ? { top: '-1px' } : { bottom: '-1px' }),
						}
					: undefined
			}
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

const Outline: FC<Props> = ({ tree, loading, title, header, footer, blocks, selectedId, hoveredId, readOnly, onSelect, onHover, onRename, onToggleHidden, onToggleLocked, onMove }) => {
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
		const page = outlineRows(tree, collapsed, label);
		const overlayRoots = new Set(tree.filter(n => isOverlay(blocks, n.type)).map(n => n.id));
		return {
			header: shared(header),
			page: page.filter(r => !overlayRoots.has(r.root)),
			overlays: page.filter(r => overlayRoots.has(r.root)),
			footer: shared(footer),
		};
	}, [tree, header, footer, collapsed, openShared, label, blocks]);

	/* ---------------------------------------------------- drag and drop */

	const [drag, setDrag] = useState<Drag | null>(null);
	const dragRef = useRef(drag);
	dragRef.current = drag;
	const treeRef = useRef(tree);
	treeRef.current = tree;
	const rowsById = useMemo(() => new Map([...groups.page, ...groups.overlays].map(r => [r.id, r])), [groups]);
	const rowsRef = useRef(rowsById);
	rowsRef.current = rowsById;

	/** Where a drop on `overId` puts the dragged block, and whether it may go there. */
	const targetOf = useCallback(
		(id: string, overId: string, where: Where) => {
			const t = treeRef.current;
			const over = rowsRef.current.get(overId);
			const moving = locate(t, id)?.node;
			if (!over || !moving) return null;
			const parentId = where === 'inside' ? overId : over.parentId;
			const index = where === 'inside' ? (locate(t, overId)?.node.children || []).length : over.index + (where === 'after' ? 1 : 0);
			let problem: string | null = null;
			for (let p: string | null = parentId; p; p = locate(t, p)?.parent?.id ?? null)
				if (p === id) {
					problem = 'A block can’t go inside itself.';
					break;
				}
			problem ??= problemFor(blocks, parentId ? locate(t, parentId)?.node.type ?? null : null, [moving.type]);
			return { target: { parentId, index }, problem };
		},
		[blocks]
	);
	const onDragStartRow = useCallback((id: string) => setDrag({ id, overId: null, where: 'before', problem: null }), []);
	const onDragOverRow = useCallback(
		(overId: string, where: Where) => {
			const d = dragRef.current;
			if (!d || (d.overId === overId && d.where === where)) return;
			setDrag({ ...d, overId, where, problem: overId === d.id ? null : targetOf(d.id, overId, where)?.problem ?? null });
		},
		[targetOf]
	);
	const onDropRow = useCallback(() => {
		const d = dragRef.current;
		setDrag(null);
		if (!d?.overId || d.overId === d.id) return;
		const t = targetOf(d.id, d.overId, d.where);
		if (t && !t.problem) onMove(d.id, t.target);
	}, [targetOf, onMove]);
	const onDragEndRow = useCallback(() => setDrag(null), []);
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
				draggable={!shared && !readOnly && !r.locked}
				holds={!shared && !!blocks.get(r.type)?.slots?.children}
				dropAt={drag && drag.overId === r.id && drag.id !== r.id ? drag.where : undefined}
				dropBad={!!(drag && drag.overId === r.id && drag.problem)}
				onDragStartRow={onDragStartRow}
				onDragOverRow={onDragOverRow}
				onDropRow={onDropRow}
				onDragEndRow={onDragEndRow}
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
				<Group title={title || 'Page'}>
					{groups.page.length ? (
						rows(groups.page, false)
					) : (
						<Text
							px={3}
							fontSize='12px'
							color='fg.muted'>
							{loading ? 'Loading…' : title ? 'Nothing here yet — add blocks from the Add tab.' : 'This page is empty.'}
						</Text>
					)}
				</Group>
				{groups.overlays.length > 0 && (
					<Group
						title='Overlays'
						note='open from a button'>
						{rows(groups.overlays, false)}
					</Group>
				)}
				{drag?.problem && drag.overId && (
					<Text
						mx={3}
						my={1}
						p={2}
						fontSize='11.5px'
						color='red.fg'
						bg='red.subtle'
						borderRadius='md'>
						{drag.problem}
					</Text>
				)}
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
