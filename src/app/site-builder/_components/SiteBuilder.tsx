'use client';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Box, Button, Flex, IconButton, Link, Text } from '@chakra-ui/react';
import { ArrowLeft, ExternalLink, Maximize2, Monitor, Moon, Redo2, Smartphone, Sun, Tablet, Undo2 } from 'lucide-react';
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
import DesignPanel from './DesignPanel';
import { resolvedColors, resolvedSpace } from './designTokens';
import { clipboard, flatIds, insertOps, isOverlay, nodeFromBlock, nodesFor, placeFor, placeProblem, rekey, type AddItem } from './edit';
import LayoutsPanel from './LayoutsPanel';
import type { Bp } from './StylePanel';
import Inspector, { type Command } from './Inspector';
import Outline from './Outline';
import PageDialog from './PageDialog';
import PagesPanel, { type PageAction } from './PagesPanel';
import PublishDialog from './PublishDialog';
import SiteGuide from './SiteGuide';
import type { CanvasMessage, DropTarget } from './protocol';
import { findNode, locate, newId, pathTo, type Op } from './tree';
import { parsePart, partKey, partTree, useDesign, type Part } from './useDesign';
import { useDraft, type SaveStatus } from './useDraft';

/**
 * The site builder's editor (docs/site-builder SB-05): pages and the outline
 * on the left, the page drawn by the real renderer in the middle, the selected
 * block's settings on the right. The open page's draft lives here (useDraft),
 * saves itself, and goes live with Publish. SB-06: the Add tab (click or drag
 * blocks and sections onto the page), moving blocks on the canvas and in the
 * outline, typing on the canvas, copy / paste / duplicate / wrap, shortcuts,
 * and overlays (pop-ups, drawers, popovers). SB-07: styles per screen size,
 * the Design tab (theme and its tokens), and editing the design's own trees —
 * the layouts' headers and footers and the saved sections — on the canvas
 * like a page ("parts", useDesign). Undo follows what you're editing: the
 * design's history in a part or the Design tab, the page's otherwise.
 */

type Tab = 'pages' | 'outline' | 'add' | 'design';
const TAB_LABEL: Record<Tab, string> = { pages: 'Pages', outline: 'Outline', add: 'Add', design: 'Design' };
const TABS: Tab[] = ['pages', 'outline', 'add', 'design'];

/** The worst of two save states, for the one status line. */
const RANK: SaveStatus[] = ['saved', 'unsaved', 'saving', 'error', 'conflict'];
const worst = (a: SaveStatus, b: SaveStatus) => (RANK.indexOf(a) >= RANK.indexOf(b) ? a : b);

const BP_OF: Record<Exclude<Device, 'fit'>, Bp> = { mobile: 'base', tablet: 'md', desktop: 'lg' };
const DEVICE_OF: Record<Bp, Device> = { base: 'mobile', md: 'tablet', lg: 'desktop' };

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
const EMPTY_TREE: SbNode[] = [];

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
		{TABS.map(t => (
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
	const { data: designData } = useSiteBuilderDesignQuery();
	const pages = pagesData?.pages;

	const [pageId, setPageId] = useState<string | null>(() =>
		typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('page')
	);
	const pageQ = useSiteBuilderPageQuery(pageId as string, { skip: !pageId, refetchOnMountOrArgChange: true });
	const draft = useDraft({ readOnly });
	const design = useDesign({ readOnly });
	const [part, setPart] = useState<Part | null>(() => (typeof window === 'undefined' ? null : parsePart(new URLSearchParams(window.location.search).get('part'))));
	const [canvasWidth, setCanvasWidth] = useState(1280);

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

	// The page (and the header, footer or section being edited) in the address, so a reload opens it again.
	useEffect(() => {
		if (!pageId) return;
		const url = new URL(window.location.href);
		url.searchParams.set('page', pageId);
		if (part) url.searchParams.set('part', partKey(part));
		else url.searchParams.delete('part');
		window.history.replaceState(window.history.state, '', url.toString());
	}, [pageId, part]);

	// The design arrives → it becomes the design draft; a newer one (a restore) replaces it if nothing is waiting to save.
	const { load: loadDesign } = design;
	useEffect(() => {
		if (!designData) return;
		if (!design.loaded || (designData.draft.rev > design.rev && design.status === 'saved')) loadDesign(designData);
	}, [designData, design.loaded, design.rev, design.status, loadDesign]);

	// The part being edited was deleted (or never existed): back to the page.
	useEffect(() => {
		if (!part || !design.data) return;
		const gone = part.kind === 'section' ? !design.data.sections?.[part.id] : !design.data.layouts?.[part.layout];
		if (gone) setPart(null);
	}, [part, design.data]);

	// A page's data arrives → it becomes the draft (once per page).
	const loaded = pageQ.data;
	const { load } = draft;
	useEffect(() => {
		if (loaded && loaded.id === pageId && draft.pageId !== loaded.id) load(loaded);
	}, [loaded, pageId, draft.pageId, load]);

	const current = pages?.find(p => p.id === pageId) || null;
	const blocks = useMemo(() => new Map((manifest?.blocks || []).map(b => [b.type, b])), [manifest]);
	const d = design.data;
	const pageLayoutKey = current?.layout || 'default';
	const layoutKey = pageLayoutKey !== 'none' && d && !d.layouts[pageLayoutKey] ? 'default' : pageLayoutKey;
	// A header, footer or saved section is drawn on its own; a page with its layout's.
	const layout = useMemo(() => {
		if (part || !d || layoutKey === 'none') return null;
		const l = d.layouts[layoutKey];
		return l ? { header: l.header || [], footer: l.footer || [] } : null;
	}, [part, d, layoutKey]);
	const canvasDesign = useMemo(
		() => (d ? { theme: d.theme, tokens: d.tokens || {}, colorScheme: d.colorScheme || 'light', sections: d.sections || {} } : null),
		[d]
	);
	const links = useMemo(() => Object.fromEntries((pages || []).map(p => [p.id, p.path])), [pages]);
	// What the header, menu, logo, socials, map and breadcrumbs blocks show (SB-08) — as /render sends it, from the drafts.
	const pagePath = part ? undefined : current?.path;
	const canvasContext = useMemo(() => {
		const list = pages || [];
		const menu = list
			.filter(p => p.showInMenu && p.kind !== 'template')
			.sort((a, b) => (b.priority || 0) - (a.priority || 0) || a.name.localeCompare(b.name))
			.map(p => ({ label: p.menuLabel || p.name, path: p.path }));
		const byPath = new Map(list.map(p => [p.path, p.name]));
		const parts = (pagePath || '').split('/').filter(Boolean);
		const crumbs = pagePath ? ['/', ...parts.map((_, i) => `/${parts.slice(0, i + 1).join('/')}`)].filter(x => byPath.has(x)).map(x => ({ label: byPath.get(x)!, path: x })) : [];
		return { site: pagesData?.site, menu, path: pagePath, crumbs };
	}, [pages, pagesData?.site, pagePath]);

	const pageTree = draft.pageId === pageId ? draft.tree : EMPTY_TREE;
	const tree = useMemo(() => (part ? partTree(d, part) : pageTree), [part, d, pageTree]);
	const header = layout?.header || EMPTY_TREE;
	const footer = layout?.footer || EMPTY_TREE;
	const label = useCallback((n: SbNode) => n.name || blocks.get(n.type)?.label || n.type, [blocks]);
	const pageNode = findNode(tree, selectedId);
	const inHeader = !pageNode && !!findNode(header, selectedId);
	const selected = pageNode || findNode(header, selectedId) || findNode(footer, selectedId);
	const shared: Part | null = useMemo(() => (!pageNode && selected ? { kind: inHeader ? 'header' : 'footer', layout: layoutKey } : null), [pageNode, selected, inHeader, layoutKey]);
	const crumbs = selectedId ? pathTo(pageNode ? tree : inHeader ? header : footer, selectedId) : [];

	// Styles are edited for the screen size the canvas shows (Fit: the window's width).
	const bp: Bp = device === 'fit' ? (canvasWidth >= 1024 ? 'lg' : canvasWidth >= 768 ? 'md' : 'base') : BP_OF[device];
	const colors = useMemo(() => resolvedColors(manifest, d, theme), [manifest, d, theme]);
	const space = useMemo(() => resolvedSpace(manifest, d), [manifest, d]);
	const sectionList = useMemo(
		() => Object.entries(d?.sections || {}).map(([id, s]) => ({ id, name: s.name })).sort((a, b) => a.name.localeCompare(b.name)),
		[d]
	);
	// Where saved sections are used: the server's count, plus this page's unsaved draft.
	const usage = useMemo(() => {
		const out = structuredClone(design.usage || {});
		if (!current || part) return out;
		const refs = new Set<string>();
		const walk = (list: SbNode[]) =>
			list.forEach(n => {
				if (n.type === 'section-ref' && n.props?.section) refs.add(n.props.section);
				walk(n.children || []);
				Object.values(n.slots || {}).forEach(walk);
			});
		walk(pageTree);
		for (const id of refs) {
			out[id] ||= { pages: [], layouts: [] };
			if (!out[id].pages.some(p => p.id === current.id)) out[id].pages.push({ id: current.id, name: current.name });
		}
		return out;
	}, [design.usage, pageTree, current, part]);

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
		return { manifest: manifest!, pages: pages || [], nodes, overlays, sections: part?.kind === 'section' ? [] : sectionList, colors };
	}, [tree, manifest, pages, label, blocks, sectionList, colors, part]);

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
			setPart(null);
			setSelectedId(select);
			setTab('outline');
		},
		[pageId, draft]
	);

	/** Opens a header, footer or saved section on the canvas (the page stays loaded underneath). */
	const editPart = useCallback((p: Part, select: string | null = null) => {
		setPart(p);
		setSelectedId(select);
		setTab('outline');
	}, []);

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

	const { apply: applyPage } = draft;
	const { applyPart } = design;
	/** Ops on whatever is being edited: the page, or a header, footer or saved section. */
	const apply = useCallback((ops: Op[], key?: string) => (part ? applyPart(part, ops, key) : applyPage(ops, key)), [part, applyPart, applyPage]);
	const history = part || tab === 'design' ? design : draft;
	const onRename = useCallback((id: string, name: string) => apply([{ op: 'update', id, name: name || null }]), [apply]);
	const onToggleHidden = useCallback(
		(id: string) => {
			const n = findNode(tree, id);
			if (n) apply([{ op: 'update', id, hidden: n.hidden && Object.values(n.hidden).some(Boolean) ? null : { base: true } }]);
		},
		[apply, tree]
	);
	const onToggleLocked = useCallback(
		(id: string) => {
			const n = findNode(tree, id);
			if (n) apply([{ op: 'update', id, locked: !n.locked }]);
		},
		[apply, tree]
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
				if (k.shift || key === 'y') history.redo();
				else history.undo();
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
		[history, runCommand]
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
	const onBp = useCallback((b: Bp) => setDevice(DEVICE_OF[b]), []);

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

	/* --------------------------------------------- saved sections (SB-07) */

	/** The selection becomes a saved section, and a section-ref takes its place. */
	const onSaveSection = useCallback(
		(name: string) => {
			const t = treeRef.current;
			const loc = selectedRef.current ? locate(t, selectedRef.current) : null;
			if (!loc || !d) return;
			if (loc.node.locked) return fail(`${label(loc.node)} is locked — unlock it in the outline first.`);
			const id = newId();
			const err = design.set({ sections: { ...d.sections, [id]: { name, tree: rekey([loc.node]) } } }, `sections:add:${id}`);
			if (err) return fail(err);
			const slot = loc.parent && loc.parent.children !== loc.list ? Object.entries(loc.parent.slots || {}).find(([, l]) => l === loc.list)?.[0] : undefined;
			const ref: SbNode = { id: newId(), type: 'section-ref', name: name.slice(0, 80), props: { section: id } };
			if (!onApply([{ op: 'insert', parentId: loc.parent?.id ?? null, index: loc.index, node: ref, ...(slot && { slot }) }, { op: 'remove', id: loc.node.id }])) {
				setSelectedId(ref.id);
				toaster.create({ type: 'success', title: `Saved “${name}”`, description: 'Add it to any page from the Add tab.' });
			}
		},
		[d, design, label, onApply]
	);

	/** A section-ref becomes a copy of the section's blocks, to change on this page only. */
	const onDetach = useCallback(() => {
		const t = treeRef.current;
		const loc = selectedRef.current ? locate(t, selectedRef.current) : null;
		const saved = loc?.node.type === 'section-ref' ? d?.sections?.[loc.node.props?.section] : null;
		if (!loc || !saved) return;
		const copies = rekey(saved.tree);
		const slot = loc.parent && loc.parent.children !== loc.list ? Object.entries(loc.parent.slots || {}).find(([, l]) => l === loc.list)?.[0] : undefined;
		const ops: Op[] = [
			...copies.map((node, i) => ({ op: 'insert' as const, parentId: loc.parent?.id ?? null, index: loc.index + i, node, ...(slot && { slot }) })),
			{ op: 'remove', id: loc.node.id },
		];
		if (!onApply(ops) && copies[0]) setSelectedId(copies[0].id);
	}, [d, onApply]);

	const onProblem = useCallback(
		(p: SbProblem) => {
			if (p.page) return openPage(p.page, p.nodeId || null);
			const layoutHit = p.path.match(/^layouts\.([a-z0-9-]+)\.(header|footer)/);
			if (layoutHit) return editPart({ kind: layoutHit[2] as 'header' | 'footer', layout: layoutHit[1] }, p.nodeId || null);
			const sectionHit = p.path.match(/^sections\.([A-Za-z0-9_-]+)/);
			if (sectionHit) return editPart({ kind: 'section', id: sectionHit[1] }, p.nodeId || null);
			if (p.part === 'design') setTab('design');
		},
		[openPage, editPart]
	);

	const flushAll = useCallback(async () => {
		await draft.flush();
		await design.flush();
	}, [draft, design]);

	const status = worst(draft.status, design.status);
	const saveError = design.error && design.status === 'error' ? design.error : draft.error;
	const partLabel = (p: Part) =>
		p.kind === 'section' ? `Saved section “${d?.sections?.[p.id]?.name || ''}”` : `${p.kind === 'header' ? 'Header' : 'Footer'}${p.layout === 'default' ? '' : ` · ${p.layout} layout`}`;
	const partNote = (p: Part) => {
		if (p.kind === 'section') {
			const u = usage[p.id];
			const n = u ? u.pages.length + u.layouts.length : 0;
			return n ? `Used in ${n} place${n === 1 ? '' : 's'} — changes show everywhere it’s used` : 'Not used anywhere yet — add it from the Add tab';
		}
		const n = (pages || []).filter(x => (x.layout || 'default') === p.layout).length;
		return `On ${n} page${n === 1 ? '' : 's'} — changes show on all of them`;
	};

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
						value={part ? `part:${partKey(part)}` : pageId || ''}
						onChange={v => {
							const p = v.startsWith('part:') ? parsePart(v.slice(5)) : null;
							if (p) editPart(p);
							else openPage(v);
						}}
						items={[
							...(pages || []).map(p => ({ value: p.id, label: `${p.name}  ${p.path}`, group: 'Pages' })),
							...Object.keys(d?.layouts || {}).flatMap(l =>
								(['header', 'footer'] as const).map(kind => ({
									value: `part:${kind}:${l}`,
									label: partLabel({ kind, layout: l }),
									group: 'Header and footer',
								}))
							),
							...sectionList.map(s => ({ value: `part:section:${s.id}`, label: s.name, group: 'Saved sections' })),
						]}
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
						disabled={!history.canUndo || readOnly}
						onClick={history.undo}>
						<Undo2 size={14} />
					</IconButton>
					<IconButton
						size='xs'
						variant='ghost'
						aria-label='Redo'
						title='Redo (⇧⌘Z)'
						disabled={!history.canRedo || readOnly}
						onClick={history.redo}>
						<Redo2 size={14} />
					</IconButton>
				</Flex>
				<Text
					fontSize='12px'
					color={status === 'error' || status === 'conflict' ? 'red.fg' : 'fg.muted'}
					title={saveError?.problems.map(p => p.message).join('\n') || saveError?.message}
					truncate>
					{readOnly ? 'View only — your role can’t change the site' : STATUS_TEXT[status]}
					{status === 'error' && saveError ? ` — ${saveError.problems[0]?.message || saveError.message}` : ''}
				</Text>
				<Box flex={1} />
				{current && !part && (
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
						{tab === 'design' ? (
							manifest && d ? (
								<DesignPanel
									manifest={manifest}
									data={d}
									readOnly={readOnly}
									set={design.set}
								/>
							) : null
						) : tab === 'add' ? (
							<AddPanel
								manifest={manifest}
								sections={part?.kind === 'section' ? [] : sectionList}
								readOnly={readOnly}
								onAdd={onAdd}
								onDragStart={onDragStart}
							/>
						) : tab === 'pages' ? (
							<PagesPanel
								pages={pages}
								currentId={part ? null : pageId}
								readOnly={readOnly}
								onOpen={id => openPage(id)}
								onAdd={() => setDialog({ kind: 'add' })}
								onAction={onAction}>
								{d && (
									<LayoutsPanel
										data={d}
										pages={pages || []}
										usage={usage}
										editing={part ? partKey(part) : null}
										readOnly={readOnly}
										set={design.set}
										onEdit={p => editPart(p)}
									/>
								)}
							</PagesPanel>
						) : (
							<Outline
								tree={tree}
								loading={part ? !design.loaded : draft.pageId !== pageId}
								title={part ? (part.kind === 'section' ? 'Saved section' : part.kind === 'header' ? 'Header' : 'Footer') : undefined}
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
						{part && (
							<Flex
								align='center'
								gap={1.5}
								mr={2}
								flexShrink={0}>
								<Box
									as='button'
									display='inline-flex'
									alignItems='center'
									gap={1}
									title={current ? `Back to ${current.name}` : 'Back to the page'}
									_hover={{ color: 'fg' }}
									onClick={() => current && openPage(current.id)}>
									<ArrowLeft size={12} /> {current?.name || 'Page'}
								</Box>
								<Text>/</Text>
								<Badge
									size='xs'
									colorPalette='purple'
									title={partNote(part)}>
									{partLabel(part)}
								</Badge>
								{!crumbs.length && <Text truncate>{partNote(part)}</Text>}
							</Flex>
						)}
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
							!part && <Text>{current ? `${current.name} — click a block to change it` : ''}</Text>
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
						context={canvasContext}
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
						onWidth={setCanvasWidth}
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
							shared={shared}
							ctx={ctx}
							theme={d?.theme || 'studio'}
							bp={bp}
							onBp={onBp}
							space={space}
							usage={usage}
							inSection={part?.kind === 'section'}
							readOnly={readOnly}
							apply={onApply}
							onCommand={runCommand}
							onEditPart={editPart}
							onSaveSection={onSaveSection}
							onDetach={onDetach}
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
				layouts={Object.keys(d?.layouts || { default: 1 })}
				saving={savingSettings || creating.isLoading}
				onClose={() => setDialog(null)}
				onSave={onSaveDialog}
			/>
			<PublishDialog
				open={publishOpen}
				onClose={() => setPublishOpen(false)}
				beforeOpen={flushAll}
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
			<PromptDialog
				open={!!design.conflict}
				tone='warning'
				title='Someone else changed the design'
				description='While you were editing, the theme, header, footer or saved sections were saved from another tab or by someone else. Load their version (your unsaved design changes here are dropped), or keep yours and save it over theirs.'
				confirmLabel='Load their version'
				cancelLabel='Keep mine'
				onClose={() => design.resolve('mine')}
				onConfirm={() => design.resolve('theirs')}
			/>
		</Flex>
	);
};

export default SiteBuilder;
