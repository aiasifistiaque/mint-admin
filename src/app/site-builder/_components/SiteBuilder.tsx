'use client';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Box, Button, Flex, IconButton, Link, Text } from '@chakra-ui/react';
import { ExternalLink, Maximize2, Monitor, Moon, Redo2, Smartphone, Sun, Tablet, Undo2 } from 'lucide-react';
import { PromptDialog } from '@/components/library';
import { Dropdown } from '@/components/library/cl';
import { toaster } from '@/components/ui/toaster';
import {
	useSiteBuilderCreatePageMutation,
	useSiteBuilderDeletePageMutation,
	useSiteBuilderDesignQuery,
	useSiteBuilderDuplicatePageMutation,
	useSiteBuilderManifestQuery,
	useSiteBuilderPageQuery,
	useSiteBuilderPagesQuery,
	useSiteBuilderSavePageMutation,
	useSiteBuilderSetHomeMutation,
	useSiteBuilderUnpublishPageMutation,
	type SbNode,
	type SbPageInput,
	type SbPageSummary,
	type SbProblem,
} from '@/components/library/store/services/siteBuilderApi';
import AddPanel from './AddPanel';
import Canvas, { type CanvasHandle, type Device } from './Canvas';
import { clipboard, flatIds, insertOps, isOverlay, nodeFromBlock, nodesFor, placeFor, placeProblem, rekey, type AddItem } from './edit';
import Inspector, { type Command } from './Inspector';
import Outline from './Outline';
import PageDialog from './PageDialog';
import PagesPanel, { type PageAction } from './PagesPanel';
import PublishDialog from './PublishDialog';
import SiteGuide from './SiteGuide';
import type { CanvasMessage, DropTarget } from './protocol';
import { findNode, locate, pathTo } from './tree';
import { useDraft, type SaveStatus } from './useDraft';

/**
 * The site builder's editor (docs/site-builder SB-05): pages and the outline
 * on the left, the page drawn by the real renderer in the middle, the selected
 * block's settings on the right. The open page's draft lives here (useDraft),
 * saves itself, and goes live with Publish. SB-06: the Add tab (click or drag
 * blocks and sections onto the page), moving blocks on the canvas and in the
 * outline, typing on the canvas, copy / paste / duplicate / wrap, shortcuts,
 * and overlays (pop-ups, drawers, popovers).
 */

type Tab = 'pages' | 'outline' | 'add';
const TAB_LABEL: Record<Tab, string> = { pages: 'Pages', outline: 'Outline', add: 'Add' };

type Key = Pick<Extract<CanvasMessage, { type: 'key' }>, 'key' | 'meta' | 'ctrl' | 'shift' | 'alt'>;

/** Typing in a field, or a dialog / menu is open: the editor's shortcuts stay out of the way. */
const typingOrDialog = (t: EventTarget | null) =>
	(t instanceof HTMLElement && !!t.closest('input, textarea, select, [contenteditable="true"], .ql-editor, [role="menu"]')) ||
	!!document.querySelector('[data-scope="dialog"][data-state="open"]');

const STATUS_TEXT: Record<SaveStatus, string> = {
	saved: 'Saved',
	unsaved: 'Unsaved changes',
	saving: 'Saving…',
	error: 'Not saved',
	conflict: 'Changed elsewhere',
};

const errorOf = (e: any, fallback: string) => e?.data?.message || fallback;

const DEVICES: { key: Device; label: string; icon: React.ReactNode }[] = [
	{ key: 'mobile', label: 'Phone (390 px)', icon: <Smartphone size={14} /> },
	{ key: 'tablet', label: 'Tablet (768 px)', icon: <Tablet size={14} /> },
	{ key: 'desktop', label: 'Desktop (1280 px)', icon: <Monitor size={14} /> },
	{ key: 'fit', label: 'Fit the window', icon: <Maximize2 size={14} /> },
];

const Rail: FC<{ tab: Tab; onTab: (t: Tab) => void }> = ({ tab, onTab }) => (
	<Flex
		borderBottomWidth='1px'
		px={2}
		pt={2}
		gap={1}>
		{(['pages', 'outline', 'add'] as const).map(t => (
			<Button
				key={t}
				size='xs'
				variant='ghost'
				borderRadius='0'
				borderBottomWidth='2px'
				borderColor={tab === t ? 'fg' : 'transparent'}
				fontWeight={tab === t ? '600' : '400'}
				onClick={() => onTab(t)}>
				{TAB_LABEL[t]}
			</Button>
		))}
	</Flex>
);

const SiteBuilder: FC<{ readOnly: boolean }> = ({ readOnly }) => {
	const { data: manifest } = useSiteBuilderManifestQuery();
	const { data: pagesData, isFetching: pagesFetching } = useSiteBuilderPagesQuery();
	const { data: design } = useSiteBuilderDesignQuery();
	const pages = pagesData?.pages;

	const [pageId, setPageId] = useState<string | null>(() =>
		typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('page')
	);
	const pageQ = useSiteBuilderPageQuery(pageId as string, { skip: !pageId, refetchOnMountOrArgChange: true });
	const draft = useDraft({ readOnly });

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const [device, setDevice] = useState<Device>('desktop');
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const [tab, setTab] = useState<Tab>('outline');
	const [dialog, setDialog] = useState<null | { kind: 'add' } | { kind: 'settings' }>(null);
	const [publishOpen, setPublishOpen] = useState(false);
	const [deleting, setDeleting] = useState<SbPageSummary | null>(null);
	const [takingOff, setTakingOff] = useState<SbPageSummary | null>(null);

	const [createPage, creating] = useSiteBuilderCreatePageMutation();
	const [savePage] = useSiteBuilderSavePageMutation();
	const [deletePage, deletingState] = useSiteBuilderDeletePageMutation();
	const [duplicatePage] = useSiteBuilderDuplicatePageMutation();
	const [setHome] = useSiteBuilderSetHomeMutation();
	const [unpublish, unpublishState] = useSiteBuilderUnpublishPageMutation();
	const [savingSettings, setSavingSettings] = useState(false);

	// No page in the address (or one that's gone): the home page. Not while the list is
	// refreshing — a page just added isn't in it yet.
	useEffect(() => {
		if (pagesFetching || !pages?.length) return;
		if (!pageId || !pages.some(p => p.id === pageId)) setPageId((pages.find(p => p.isHome) || pages[0]).id);
	}, [pages, pageId, pagesFetching]);

	// The page's address in the tab, so a reload opens it again.
	useEffect(() => {
		if (!pageId) return;
		const url = new URL(window.location.href);
		url.searchParams.set('page', pageId);
		window.history.replaceState(window.history.state, '', url.toString());
	}, [pageId]);

	// A page's data arrives → it becomes the draft (once per page).
	const loaded = pageQ.data;
	const { load } = draft;
	useEffect(() => {
		if (loaded && loaded.id === pageId && draft.pageId !== loaded.id) load(loaded);
	}, [loaded, pageId, draft.pageId, load]);

	const current = pages?.find(p => p.id === pageId) || null;
	const blocks = useMemo(() => new Map((manifest?.blocks || []).map(b => [b.type, b])), [manifest]);
	const layoutKey = current?.layout || 'default';
	const layout = useMemo(() => {
		if (!design || layoutKey === 'none') return null;
		const l = design.draft.layouts[layoutKey] || design.draft.layouts.default;
		return l ? { header: l.header || [], footer: l.footer || [] } : null;
	}, [design, layoutKey]);
	const canvasDesign = useMemo(
		() => (design ? { theme: design.draft.theme, tokens: design.draft.tokens || {}, colorScheme: design.draft.colorScheme || 'light' } : null),
		[design]
	);
	const links = useMemo(() => Object.fromEntries((pages || []).map(p => [p.id, p.path])), [pages]);

	const tree = draft.pageId === pageId ? draft.tree : [];
	const header = layout?.header || [];
	const footer = layout?.footer || [];
	const label = useCallback((n: SbNode) => n.name || blocks.get(n.type)?.label || n.type, [blocks]);
	const pageNode = findNode(tree, selectedId);
	const selected = pageNode || findNode(header, selectedId) || findNode(footer, selectedId);
	const crumbs = selectedId ? pathTo(pageNode ? tree : findNode(header, selectedId) ? header : footer, selectedId) : [];

	const ctx = useMemo(() => {
		const nodes: { id: string; label: string }[] = [];
		const walk = (list: SbNode[], depth: number) =>
			list.forEach(n => {
				nodes.push({ id: n.id, label: `${'  '.repeat(depth)}${label(n)}` });
				walk(n.children || [], depth + 1);
				Object.values(n.slots || {}).forEach(s => walk(s, depth + 1));
			});
		walk(tree, 0);
		const overlays = tree.filter(n => isOverlay(blocks, n.type)).map(n => ({ id: n.id, label: label(n) }));
		return { manifest: manifest!, pages: pages || [], nodes, overlays };
	}, [tree, manifest, pages, label, blocks]);

	// A pop-up, drawer or popover shows on the canvas while it — or something in it — is selected.
	const openId = useMemo(() => {
		const root = selectedId ? pathTo(tree, selectedId)[0] : null;
		return root && isOverlay(blocks, root.type) ? root.id : null;
	}, [tree, selectedId, blocks]);

	/* ---------------------------------------------------- page switching */

	const openPage = useCallback(
		async (id: string, select: string | null = null) => {
			if (id !== pageId) {
				try {
					await draft.flush();
				} catch {
					toaster.create({ type: 'error', title: 'This page isn’t saved', description: 'Fix what stops it from saving, then switch pages.' });
					return;
				}
				setPageId(id);
			}
			setSelectedId(select);
			setTab('outline');
		},
		[pageId, draft]
	);

	const reloadPage = useCallback(async () => {
		const r = await pageQ.refetch();
		if (r.data) load(r.data);
	}, [pageQ, load]);

	/* -------------------------------------------------------- page actions */

	const onAction = async (p: SbPageSummary, action: PageAction) => {
		try {
			switch (action) {
				case 'settings':
					await openPage(p.id);
					setDialog({ kind: 'settings' });
					break;
				case 'home':
					await draft.flush();
					await setHome(p.id).unwrap();
					if (p.id === pageId || current?.isHome) await reloadPage();
					toaster.create({ type: 'success', title: `${p.name} is now the home page`, description: 'Publish to make it live.' });
					break;
				case 'duplicate': {
					await draft.flush();
					const copy = await duplicatePage({ id: p.id }).unwrap();
					await openPage(copy.id);
					break;
				}
				case 'unpublish':
					setTakingOff(p);
					break;
				case 'republish':
					if (p.id === pageId) await draft.send({ status: 'draft' });
					else await savePage({ id: p.id, rev: p.rev, status: 'draft' }).unwrap();
					toaster.create({ type: 'success', title: `${p.name} goes back on the site with the next publish` });
					break;
				case 'delete':
					setDeleting(p);
					break;
			}
		} catch (e: any) {
			toaster.create({ type: 'error', title: errorOf(e, 'That didn’t work — try again.') });
		}
	};

	const onSaveDialog = async (input: SbPageInput) => {
		setSavingSettings(true);
		try {
			if (dialog?.kind === 'add') {
				await draft.flush();
				const page = await createPage(input).unwrap();
				setDialog(null);
				await openPage(page.id);
			} else {
				await draft.send(input);
				setDialog(null);
			}
		} catch (e: any) {
			toaster.create({ type: 'error', title: errorOf(e, 'Not saved — try again.') });
		} finally {
			setSavingSettings(false);
		}
	};

	/* ------------------------------------------------------ editing nodes */

	const { apply } = draft;
	const onRename = useCallback((id: string, name: string) => apply([{ op: 'update', id, name: name || null }]), [apply]);
	const onToggleHidden = useCallback(
		(id: string) => {
			const n = findNode(draft.tree, id);
			if (n) apply([{ op: 'update', id, hidden: n.hidden && Object.values(n.hidden).some(Boolean) ? null : { base: true } }]);
		},
		[apply, draft.tree]
	);
	const onToggleLocked = useCallback(
		(id: string) => {
			const n = findNode(draft.tree, id);
			if (n) apply([{ op: 'update', id, locked: !n.locked }]);
		},
		[apply, draft.tree]
	);
	const onSelect = useCallback((id: string) => setSelectedId(id), []);
	const onCanvasSelect = useCallback((id: string) => {
		setSelectedId(id);
		setTab(t => (t === 'pages' ? 'outline' : t));
	}, []);
	const onHover = useCallback((id: string | null) => setHoveredId(id), []);
	const onApply = useCallback(
		(ops: Parameters<typeof apply>[0], key?: string) => {
			const err = apply(ops, key);
			if (err) toaster.create({ type: 'error', title: err });
			return err;
		},
		[apply]
	);

	/* ------------------------------------- adding, copying, moving (SB-06) */

	const treeRef = useRef(tree);
	treeRef.current = tree;
	const selectedRef = useRef(selectedId);
	selectedRef.current = selectedId;
	const fail = (title: string) => toaster.create({ type: 'error', title });

	/** Inserts `nodes` at `place` as one undo step and selects the first. */
	const insertAt = useCallback(
		(nodes: SbNode[], place: { parentId: string | null; index: number }) => {
			if (!nodes.length) return;
			if (!onApply(insertOps(nodes, place))) {
				setSelectedId(nodes[0].id);
				setTab(t => (t === 'pages' ? 'outline' : t));
			}
		},
		[onApply]
	);

	const insertNodes = useCallback(
		(nodes: SbNode[]) => {
			const place = placeFor(treeRef.current, selectedRef.current, nodes.map(n => n.type), blocks);
			if ('problem' in place) return fail(place.problem);
			insertAt(nodes, place);
		},
		[blocks, insertAt]
	);

	const suppressClick = useRef(false);
	const onAdd = useCallback(
		(item: AddItem) => {
			if (suppressClick.current || !manifest || readOnly) return;
			insertNodes(nodesFor(item, manifest, blocks));
		},
		[manifest, blocks, insertNodes, readOnly]
	);

	const runCommand = useCallback(
		(cmd: Command) => {
			if (readOnly) return;
			const t = treeRef.current;
			const id = selectedRef.current;
			if (cmd === 'paste') {
				const copied = clipboard.read();
				if (!copied) return fail('Nothing copied yet — select a block and press ⌘C.');
				return insertNodes(rekey(copied));
			}
			const loc = id ? locate(t, id) : null;
			if (!loc) return;
			const n = loc.node;
			const parentId = loc.parent?.id ?? null;
			switch (cmd) {
				case 'copy':
					clipboard.write([n]);
					toaster.create({ type: 'info', title: `Copied ${label(n)}`, description: 'Paste it on any page with ⌘V.', duration: 2000 });
					return;
				case 'cut':
				case 'delete': {
					if (n.locked) return fail(`${label(n)} is locked — unlock it in the outline first.`);
					if (cmd === 'cut') clipboard.write([n]);
					if (onApply([{ op: 'remove', id: n.id }])) return;
					const next = loc.list[loc.index + 1] || loc.list[loc.index - 1];
					setSelectedId(next?.id ?? parentId);
					return;
				}
				case 'duplicate': {
					const [copy] = rekey([n]);
					return insertAt([copy], { parentId, index: loc.index + 1 });
				}
				case 'up':
				case 'down': {
					if (n.locked) return fail(`${label(n)} is locked — unlock it in the outline first.`);
					if (cmd === 'up' ? loc.index === 0 : loc.index >= loc.list.length - 1) return;
					onApply([{ op: 'move', id: n.id, parentId, index: cmd === 'up' ? loc.index - 1 : loc.index + 2 }]);
					return;
				}
				case 'parent':
					setSelectedId(parentId);
					return;
				case 'wrap-stack':
				case 'wrap-section': {
					const def = blocks.get(cmd === 'wrap-stack' ? 'stack' : 'section');
					if (!def) return;
					const why = placeProblem(blocks, loc.parent?.type ?? null, def.type) || placeProblem(blocks, def.type, n.type);
					if (why) return fail(why);
					const wrapper = { ...nodeFromBlock(def), children: undefined };
					if (!onApply([{ op: 'wrap', ids: [n.id], node: wrapper }])) setSelectedId(wrapper.id);
					return;
				}
			}
		},
		[readOnly, blocks, label, onApply, insertAt, insertNodes]
	);

	/** Shortcuts, from the panel or the canvas. Returns true when it handled the key. */
	const onShortcut = useCallback(
		(k: Key): boolean => {
			const mod = k.meta || k.ctrl;
			const key = k.key.toLowerCase();
			if (mod && (key === 'z' || key === 'y')) {
				if (k.shift || key === 'y') draft.redo();
				else draft.undo();
				return true;
			}
			const cmd: Command | null = mod
				? ({ c: 'copy', x: 'cut', v: 'paste', d: 'duplicate' } as Record<string, Command>)[key] || null
				: key === 'delete' || key === 'backspace'
					? 'delete'
					: key === 'escape'
						? 'parent'
						: k.alt && key === 'arrowup'
							? 'up'
							: k.alt && key === 'arrowdown'
								? 'down'
								: null;
			if (cmd) {
				if (cmd !== 'paste' && !selectedRef.current) return false;
				runCommand(cmd);
				return true;
			}
			if (key === 'arrowup' || key === 'arrowdown') {
				const ids = flatIds(treeRef.current);
				if (!ids.length) return false;
				const i = selectedRef.current ? ids.indexOf(selectedRef.current) : -1;
				const next = key === 'arrowup' ? (i <= 0 ? 0 : i - 1) : Math.min(ids.length - 1, i + 1);
				setSelectedId(ids[next]);
				return true;
			}
			return false;
		},
		[draft, runCommand]
	);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (typingOrDialog(e.target)) return;
			if (onShortcut({ key: e.key, meta: e.metaKey, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey })) e.preventDefault();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onShortcut]);

	/* ------------------------------------------------- canvas callbacks */

	const canvasRef = useRef<CanvasHandle>(null);
	const dropRef = useRef<{ target: DropTarget | null; reason?: string } | null>(null);
	const onDropTarget = useCallback((target: DropTarget | null, reason?: string) => {
		dropRef.current = { target, reason };
	}, []);
	const onCanvasMove = useCallback(
		(id: string, target: DropTarget) => {
			if (!onApply([{ op: 'move', id, parentId: target.parentId, index: target.index, ...(target.slot && { slot: target.slot }) }])) setSelectedId(id);
		},
		[onApply]
	);
	const onCanvasText = useCallback(
		(id: string, prop: string, value: string) => {
			onApply([{ op: 'update', id, props: { [prop]: value } }]);
		},
		[onApply]
	);
	const onCanvasKey = useCallback((k: Key) => void onShortcut(k), [onShortcut]);

	/* -------------------------------------- dragging from the Add panel */

	const ghost = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState(false);
	const onDragStart = useCallback(
		(e: React.PointerEvent, item: AddItem) => {
			if (readOnly || !manifest) return;
			const el = e.currentTarget as HTMLElement;
			const start = { x: e.clientX, y: e.clientY };
			let active = false;
			try {
				el.setPointerCapture(e.pointerId);
			} catch {}
			const move = (ev: PointerEvent) => {
				if (!active) {
					if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 5) return;
					active = true;
					dropRef.current = null;
					setDragging(true);
				}
				const g = ghost.current;
				if (g) {
					g.textContent = item.label;
					g.style.display = 'block';
					g.style.transform = `translate(${ev.clientX + 14}px, ${ev.clientY + 14}px)`;
				}
				const at = canvasRef.current?.toCanvas(ev.clientX, ev.clientY);
				if (at) canvasRef.current!.drag(at.x, at.y, { types: item.types, label: item.label });
				else {
					canvasRef.current?.dragEnd();
					dropRef.current = null;
				}
			};
			const end = (ev: PointerEvent) => {
				el.removeEventListener('pointermove', move);
				el.removeEventListener('pointerup', end);
				el.removeEventListener('pointercancel', end);
				if (!active) return;
				suppressClick.current = true;
				setTimeout(() => (suppressClick.current = false), 0);
				setDragging(false);
				if (ghost.current) ghost.current.style.display = 'none';
				canvasRef.current?.dragEnd();
				const over = ev.type === 'pointerup' && canvasRef.current?.toCanvas(ev.clientX, ev.clientY);
				const drop = dropRef.current;
				dropRef.current = null;
				if (!over) return;
				if (!drop?.target) return drop?.reason ? fail(drop.reason) : undefined;
				insertAt(nodesFor(item, manifest, blocks), drop.target);
			};
			el.addEventListener('pointermove', move);
			el.addEventListener('pointerup', end);
			el.addEventListener('pointercancel', end);
		},
		[readOnly, manifest, blocks, insertAt]
	);

	const onProblem = useCallback(
		(p: SbProblem) => {
			if (p.page) openPage(p.page, p.nodeId || null);
		},
		[openPage]
	);

	const liveHref = pagesData?.url && current?.publishedAt ? `${pagesData.url}${current.path === '/' ? '' : current.path}` : null;

	return (
		<Flex
			direction='column'
			h='full'
			minH={0}>
			{/* top bar */}
			<Flex
				align='center'
				gap={2}
				px={3}
				h='48px'
				flexShrink={0}
				borderBottomWidth='1px'
				bg='bg.panel'>
				<Box w='220px'>
					<Dropdown
						size='xs'
						value={pageId || ''}
						onChange={id => openPage(id)}
						items={(pages || []).map(p => ({ value: p.id, label: `${p.name}  ${p.path}` }))}
						placeholder='Page'
					/>
				</Box>
				<Flex
					gap={0.5}
					ml={2}>
					{DEVICES.map(d => (
						<IconButton
							key={d.key}
							size='xs'
							variant={device === d.key ? 'subtle' : 'ghost'}
							aria-label={d.label}
							title={d.label}
							onClick={() => setDevice(d.key)}>
							{d.icon}
						</IconButton>
					))}
					<IconButton
						size='xs'
						variant='ghost'
						aria-label={theme === 'light' ? 'Preview in dark' : 'Preview in light'}
						title={theme === 'light' ? 'Preview in dark' : 'Preview in light'}
						onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}>
						{theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
					</IconButton>
				</Flex>
				<Flex
					gap={0.5}
					ml={2}>
					<IconButton
						size='xs'
						variant='ghost'
						aria-label='Undo'
						title='Undo (⌘Z)'
						disabled={!draft.canUndo || readOnly}
						onClick={draft.undo}>
						<Undo2 size={14} />
					</IconButton>
					<IconButton
						size='xs'
						variant='ghost'
						aria-label='Redo'
						title='Redo (⇧⌘Z)'
						disabled={!draft.canRedo || readOnly}
						onClick={draft.redo}>
						<Redo2 size={14} />
					</IconButton>
				</Flex>
				<Text
					fontSize='12px'
					color={draft.status === 'error' || draft.status === 'conflict' ? 'red.fg' : 'fg.muted'}
					title={draft.error?.problems.map(p => p.message).join('\n') || draft.error?.message}
					truncate>
					{readOnly ? 'View only — your role can’t change the site' : STATUS_TEXT[draft.status]}
					{draft.status === 'error' && draft.error ? ` — ${draft.error.problems[0]?.message || draft.error.message}` : ''}
				</Text>
				<Box flex={1} />
				{current && (
					<Box display={{ base: 'none', xl: 'block' }}>
						{current.status === 'draft' ? (
							<Badge
								size='xs'
								colorPalette='orange'>
								Not published yet
							</Badge>
						) : current.changed ? (
							<Badge
								size='xs'
								colorPalette='blue'>
								Changes not live
							</Badge>
						) : null}
					</Box>
				)}
				{liveHref && (
					<Button
						asChild
						size='xs'
						variant='outline'>
						<Link
							href={liveHref}
							target='_blank'
							rel='noreferrer'>
							View site <ExternalLink size={12} />
						</Link>
					</Button>
				)}
				{!readOnly && (
					<Button
						size='xs'
						onClick={() => setPublishOpen(true)}>
						Publish
					</Button>
				)}
			</Flex>

			<Flex
				flex={1}
				minH={0}>
				{/* left: pages / outline */}
				<Flex
					direction='column'
					w='260px'
					flexShrink={0}
					borderRightWidth='1px'
					bg='bg.panel'
					minH={0}>
					<Rail
						tab={tab}
						onTab={setTab}
					/>
					<Box
						flex={1}
						minH={0}>
						{tab === 'add' ? (
							<AddPanel
								manifest={manifest}
								readOnly={readOnly}
								onAdd={onAdd}
								onDragStart={onDragStart}
							/>
						) : tab === 'pages' ? (
							<PagesPanel
								pages={pages}
								currentId={pageId}
								readOnly={readOnly}
								onOpen={id => openPage(id)}
								onAdd={() => setDialog({ kind: 'add' })}
								onAction={onAction}
							/>
						) : (
							<Outline
								tree={tree}
								loading={draft.pageId !== pageId}
								header={header}
								footer={footer}
								blocks={blocks}
								selectedId={selectedId}
								hoveredId={hoveredId}
								readOnly={readOnly}
								onSelect={onSelect}
								onHover={onHover}
								onRename={onRename}
								onToggleHidden={onToggleHidden}
								onToggleLocked={onToggleLocked}
								onMove={onCanvasMove}
							/>
						)}
					</Box>
				</Flex>

				{/* middle: breadcrumb + canvas */}
				<Flex
					direction='column'
					flex={1}
					minW={0}>
					<Flex
						align='center'
						gap={1}
						px={3}
						h='32px'
						flexShrink={0}
						borderBottomWidth='1px'
						fontSize='12px'
						color='fg.muted'
						bg='bg.panel'
						overflow='hidden'>
						{crumbs.length ? (
							crumbs.map((n, i) => (
								<Flex
									key={n.id}
									align='center'
									gap={1}
									minW={0}>
									{i > 0 && <Text>/</Text>}
									<Box
										as='button'
										truncate
										fontWeight={i === crumbs.length - 1 ? '600' : '400'}
										color={i === crumbs.length - 1 ? 'fg' : undefined}
										onClick={() => setSelectedId(n.id)}>
										{label(n)}
									</Box>
								</Flex>
							))
						) : (
							<Text>{current ? `${current.name} — click a block to change it` : ''}</Text>
						)}
						<Box flex={1} />
						<SiteGuide section='canvas' />
					</Flex>
					<Canvas
						ref={canvasRef}
						tree={tree}
						layout={layout}
						design={canvasDesign}
						links={links}
						theme={theme}
						device={device}
						selectedId={selectedId}
						hoveredId={hoveredId}
						readOnly={readOnly}
						openId={openId}
						dragging={dragging}
						onSelect={onCanvasSelect}
						onHover={onHover}
						onDropTarget={onDropTarget}
						onMove={onCanvasMove}
						onText={onCanvasText}
						onKey={onCanvasKey}
					/>
				</Flex>

				{/* right: settings */}
				<Box
					w='300px'
					flexShrink={0}
					borderLeftWidth='1px'
					bg='bg.panel'
					minH={0}>
					{manifest && (
						<Inspector
							node={selected}
							def={selected ? blocks.get(selected.type) || null : null}
							shared={!!selected && !pageNode}
							ctx={ctx}
							theme={design?.draft.theme || 'studio'}
							readOnly={readOnly}
							apply={onApply}
							onCommand={runCommand}
						/>
					)}
				</Box>
			</Flex>

			{/* the label that follows the pointer while dragging from the Add tab */}
			<Box
				ref={ghost}
				position='fixed'
				top={0}
				left={0}
				zIndex={2000}
				display='none'
				pointerEvents='none'
				px={2}
				py={1}
				fontSize='12px'
				fontWeight='500'
				bg='bg.inverted'
				color='fg.inverted'
				borderRadius='md'
				boxShadow='md'
			/>
			<PageDialog
				open={!!dialog}
				page={dialog?.kind === 'settings' ? draft.page : null}
				layouts={Object.keys(design?.draft.layouts || { default: 1 })}
				saving={savingSettings || creating.isLoading}
				onClose={() => setDialog(null)}
				onSave={onSaveDialog}
			/>
			<PublishDialog
				open={publishOpen}
				onClose={() => setPublishOpen(false)}
				beforeOpen={draft.flush}
				onProblem={onProblem}
			/>
			<PromptDialog
				open={!!deleting}
				title={`Delete “${deleting?.name}”?`}
				description={
					deleting?.publishedAt
						? 'It stays on the live site until you publish, then it’s gone. Earlier versions in the history keep it.'
						: 'It has never been published, so nothing changes on the live site.'
				}
				subject={deleting?.path}
				loading={deletingState.isLoading}
				onClose={() => setDeleting(null)}
				onConfirm={async () => {
					const p = deleting!;
					try {
						await deletePage(p.id).unwrap();
						setDeleting(null);
						if (p.id === pageId) {
							const home = pages?.find(x => x.isHome);
							if (home) {
								setSelectedId(null);
								setPageId(home.id);
							}
						}
					} catch (e: any) {
						toaster.create({ type: 'error', title: errorOf(e, 'Not deleted — try again.') });
					}
				}}
			/>
			<PromptDialog
				open={!!takingOff}
				tone='warning'
				title={`Take “${takingOff?.name}” off the site?`}
				description='It goes off the live site now, without publishing — visitors get “Page not found” there. Your draft is kept; put it back on the site any time and it returns with the next publish.'
				subject={takingOff?.path}
				confirmLabel='Take it off'
				loading={unpublishState.isLoading}
				onClose={() => setTakingOff(null)}
				onConfirm={async () => {
					const p = takingOff!;
					try {
						await unpublish(p.id).unwrap();
						setTakingOff(null);
						toaster.create({ type: 'success', title: `${p.name} is off the site`, description: 'Visitors get “Page not found” there now.' });
					} catch (e: any) {
						toaster.create({ type: 'error', title: errorOf(e, 'Still on the site — try again.') });
					}
				}}
			/>
			<PromptDialog
				open={!!draft.conflict}
				tone='warning'
				title='Someone else changed this page'
				description='While you were editing, the page was saved from another tab or by someone else. Load their version (your unsaved changes here are dropped), or keep yours and save it over theirs.'
				confirmLabel='Load their version'
				cancelLabel='Keep mine'
				onClose={() => draft.resolve('mine')}
				onConfirm={() => draft.resolve('theirs')}
			/>
		</Flex>
	);
};

export default SiteBuilder;
