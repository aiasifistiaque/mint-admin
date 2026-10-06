'use client';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
import Canvas, { type Device } from './Canvas';
import Inspector from './Inspector';
import Outline from './Outline';
import PageDialog from './PageDialog';
import PagesPanel, { type PageAction } from './PagesPanel';
import PublishDialog from './PublishDialog';
import SiteGuide from './SiteGuide';
import { findNode, pathTo } from './tree';
import { useDraft, type SaveStatus } from './useDraft';

/**
 * The site builder's editor (docs/site-builder SB-05): pages and the outline
 * on the left, the page drawn by the real renderer in the middle, the selected
 * block's settings on the right. The open page's draft lives here (useDraft),
 * saves itself, and goes live with Publish.
 */

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

const Rail: FC<{ tab: 'pages' | 'outline'; onTab: (t: 'pages' | 'outline') => void }> = ({ tab, onTab }) => (
	<Flex
		borderBottomWidth='1px'
		px={2}
		pt={2}
		gap={1}>
		{(['pages', 'outline'] as const).map(t => (
			<Button
				key={t}
				size='xs'
				variant='ghost'
				borderRadius='0'
				borderBottomWidth='2px'
				borderColor={tab === t ? 'fg' : 'transparent'}
				fontWeight={tab === t ? '600' : '400'}
				onClick={() => onTab(t)}>
				{t === 'pages' ? 'Pages' : 'Outline'}
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
	const [tab, setTab] = useState<'pages' | 'outline'>('outline');
	const [dialog, setDialog] = useState<null | { kind: 'add' } | { kind: 'settings' }>(null);
	const [publishOpen, setPublishOpen] = useState(false);
	const [deleting, setDeleting] = useState<SbPageSummary | null>(null);

	const [createPage, creating] = useSiteBuilderCreatePageMutation();
	const [savePage] = useSiteBuilderSavePageMutation();
	const [deletePage, deletingState] = useSiteBuilderDeletePageMutation();
	const [duplicatePage] = useSiteBuilderDuplicatePageMutation();
	const [setHome] = useSiteBuilderSetHomeMutation();
	const [unpublish] = useSiteBuilderUnpublishPageMutation();
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
		return { manifest: manifest!, pages: pages || [], nodes };
	}, [tree, manifest, pages, label]);

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
					await unpublish(p.id).unwrap();
					toaster.create({ type: 'success', title: `${p.name} is off the site`, description: 'Visitors get “Page not found” there now.' });
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
		setTab('outline');
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

	// ⌘Z / ⇧⌘Z (Ctrl on Windows), except while typing in a field.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'z') return;
			const t = e.target as HTMLElement;
			if (t.closest('input, textarea, [contenteditable="true"], .ql-editor')) return;
			e.preventDefault();
			if (e.shiftKey) draft.redo();
			else draft.undo();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [draft]);

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
						{tab === 'pages' ? (
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
						tree={tree}
						layout={layout}
						design={canvasDesign}
						links={links}
						theme={theme}
						device={device}
						selectedId={selectedId}
						hoveredId={hoveredId}
						onSelect={onCanvasSelect}
						onHover={onHover}
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
							onRemoved={() => setSelectedId(null)}
						/>
					)}
				</Box>
			</Flex>

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
