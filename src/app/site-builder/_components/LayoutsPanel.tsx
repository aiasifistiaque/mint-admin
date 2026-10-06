'use client';

import { FC, memo, useState } from 'react';
import { Box, Button, Flex, IconButton, Input, Text } from '@chakra-ui/react';
import { Pencil, PanelBottom, PanelTop, Plus, Puzzle, Trash2 } from 'lucide-react';
import { PromptDialog } from '@/components/library';
import type { SbPageSummary, SbSectionUsage } from '@/components/library/store/services/siteBuilderApi';
import { rekey } from './edit';
import SiteGuide from './SiteGuide';
import { partKey, type DesignData, type Part } from './useDesign';

/**
 * Under the pages (docs/site-builder SB-07): the layouts — a header and a
 * footer that pages share — and the saved sections. Each opens on the canvas
 * like a page. A page picks its layout in its settings ("none" = no header or
 * footer). A layout or saved section in use can't be deleted.
 */

type Props = {
	data: DesignData;
	pages: SbPageSummary[];
	usage: SbSectionUsage;
	editing: string | null;
	readOnly: boolean;
	set: (patch: Partial<DesignData>, key?: string) => string | null;
	onEdit: (part: Part) => void;
};

const Title: FC<{ children: React.ReactNode; guide: string }> = ({ children, guide }) => (
	<Flex
		align='center'
		justify='space-between'
		px={3}
		mt={4}
		mb={1}>
		<Text
			fontSize='11px'
			fontWeight='600'
			textTransform='uppercase'
			letterSpacing='0.06em'
			color='fg.muted'>
			{children}
		</Text>
		<SiteGuide section={guide} />
	</Flex>
);

const PartRow: FC<{ icon: React.ReactNode; label: string; sub?: string; active: boolean; onClick: () => void; actions?: React.ReactNode }> = ({ icon, label, sub, active, onClick, actions }) => (
	<Flex
		align='center'
		gap={2}
		mx={2}
		px={2}
		py={1.5}
		borderRadius='md'
		cursor='pointer'
		bg={active ? 'bg.emphasized' : undefined}
		_hover={{ bg: active ? 'bg.emphasized' : 'bg.muted' }}
		onClick={onClick}>
		<Box color='fg.muted'>{icon}</Box>
		<Box
			flex={1}
			minW={0}>
			<Text
				fontSize='12.5px'
				truncate>
				{label}
			</Text>
			{sub && (
				<Text
					fontSize='11px'
					color='fg.muted'
					truncate>
					{sub}
				</Text>
			)}
		</Box>
		{actions}
	</Flex>
);

const slug = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 40);

const LayoutsPanel: FC<Props> = ({ data, pages, usage, editing, readOnly, set, onEdit }) => {
	const [adding, setAdding] = useState<string | null>(null);
	const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);
	const [deleting, setDeleting] = useState<{ kind: 'layout' | 'section'; key: string; name: string } | null>(null);

	const layouts = Object.keys(data.layouts || {}).sort((a, b) => (a === 'default' ? -1 : b === 'default' ? 1 : a.localeCompare(b)));
	const using = (key: string) => pages.filter(p => (p.layout || 'default') === key);
	const sections = Object.entries(data.sections || {}).sort(([, a], [, b]) => a.name.localeCompare(b.name));

	const addLayout = () => {
		const key = slug(adding || '');
		if (!key || key === 'none') return;
		if (data.layouts[key]) return setAdding(null);
		const base = data.layouts.default || { header: [], footer: [] };
		const err = set({ layouts: { ...data.layouts, [key]: { header: rekey(base.header || []), footer: rekey(base.footer || []) } } }, `layouts:add:${key}`);
		if (!err) {
			setAdding(null);
			onEdit({ kind: 'header', layout: key });
		}
	};

	const usedBy = (id: string) => {
		const u = usage[id];
		if (!u) return [];
		return [...u.pages.map(p => p.name), ...u.layouts.map(l => `the ${l} layout`)];
	};

	return (
		<Box pb={4}>
			<Title guide='layouts'>Header and footer</Title>
			{layouts.map(key => {
				const n = using(key).length;
				return (
					<Box key={key}>
						{layouts.length > 1 && (
							<Flex
								align='center'
								justify='space-between'
								px={4}
								mt={1}>
								<Text
									fontSize='11.5px'
									fontWeight='600'>
									{key === 'default' ? 'Default layout' : `“${key}” layout`}
									<Text
										as='span'
										fontWeight='400'
										color='fg.muted'>
										{' '}
										· {n} page{n === 1 ? '' : 's'}
									</Text>
								</Text>
								{key !== 'default' && !readOnly && (
									<IconButton
										size='2xs'
										variant='ghost'
										aria-label={`Delete the ${key} layout`}
										title={n ? `Pages use it: ${using(key).map(p => p.name).join(', ')} — move them to another layout first` : 'Delete this layout'}
										disabled={n > 0}
										onClick={() => setDeleting({ kind: 'layout', key, name: key })}>
										<Trash2 size={12} />
									</IconButton>
								)}
							</Flex>
						)}
						{(['header', 'footer'] as const).map(kind => {
							const part: Part = { kind, layout: key };
							const blocks = (data.layouts[key]?.[kind] || []).length;
							return (
								<PartRow
									key={kind}
									icon={kind === 'header' ? <PanelTop size={14} /> : <PanelBottom size={14} />}
									label={kind === 'header' ? 'Header' : 'Footer'}
									sub={blocks ? `${blocks} block${blocks === 1 ? '' : 's'} · on every page with this layout` : 'Empty'}
									active={editing === partKey(part)}
									onClick={() => onEdit(part)}
								/>
							);
						})}
					</Box>
				);
			})}
			{!readOnly &&
				(adding === null ? (
					<Button
						size='2xs'
						variant='ghost'
						mx={3}
						mt={1}
						onClick={() => setAdding('')}>
						<Plus size={12} /> Another layout
					</Button>
				) : (
					<Flex
						gap={1}
						mx={3}
						mt={1}>
						<Input
							size='xs'
							autoFocus
							placeholder='Name, e.g. landing'
							value={adding}
							onChange={e => setAdding(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter') addLayout();
								if (e.key === 'Escape') setAdding(null);
							}}
						/>
						<Button
							size='xs'
							disabled={!slug(adding) || slug(adding) === 'none'}
							onClick={addLayout}>
							Add
						</Button>
					</Flex>
				))}

			<Title guide='sections'>Saved sections</Title>
			{!sections.length && (
				<Text
					px={4}
					fontSize='12px'
					color='fg.muted'
					lineHeight='1.45'>
					None yet. Select a block on a page and choose “Save as section” to use it on other pages too.
				</Text>
			)}
			{sections.map(([id, s]) => {
				const used = usedBy(id);
				const part: Part = { kind: 'section', id };
				return renaming?.id === id ? (
					<Flex
						key={id}
						gap={1}
						mx={3}
						my={1}>
						<Input
							size='xs'
							autoFocus
							value={renaming.name}
							maxLength={80}
							onChange={e => setRenaming({ id, name: e.target.value })}
							onKeyDown={e => {
								if (e.key === 'Escape') setRenaming(null);
								if (e.key === 'Enter' && renaming.name.trim()) {
									set({ sections: { ...data.sections, [id]: { ...s, name: renaming.name.trim() } } }, `sections:rename:${id}`);
									setRenaming(null);
								}
							}}
							onBlur={() => {
								if (renaming.name.trim()) set({ sections: { ...data.sections, [id]: { ...s, name: renaming.name.trim() } } }, `sections:rename:${id}`);
								setRenaming(null);
							}}
						/>
					</Flex>
				) : (
					<PartRow
						key={id}
						icon={<Puzzle size={14} />}
						label={s.name}
						sub={used.length ? `Used on ${used.length === 1 ? used[0] : `${used.length} pages`}` : 'Not used anywhere'}
						active={editing === partKey(part)}
						onClick={() => onEdit(part)}
						actions={
							!readOnly && (
								<Flex
									gap={0}
									onClick={e => e.stopPropagation()}>
									<IconButton
										size='2xs'
										variant='ghost'
										aria-label={`Rename ${s.name}`}
										title='Rename'
										onClick={() => setRenaming({ id, name: s.name })}>
										<Pencil size={11} />
									</IconButton>
									<IconButton
										size='2xs'
										variant='ghost'
										aria-label={`Delete ${s.name}`}
										title={used.length ? `Used on ${used.join(', ')} — remove it there first` : 'Delete'}
										disabled={used.length > 0}
										onClick={() => setDeleting({ kind: 'section', key: id, name: s.name })}>
										<Trash2 size={11} />
									</IconButton>
								</Flex>
							)
						}
					/>
				);
			})}

			<PromptDialog
				open={!!deleting}
				title={deleting?.kind === 'layout' ? `Delete the “${deleting?.name}” layout?` : `Delete “${deleting?.name}”?`}
				description={
					deleting?.kind === 'layout'
						? 'Its header and footer go. No page uses it. It stays on the live site until you publish.'
						: 'No page uses it. It stays in earlier versions in the history.'
				}
				onClose={() => setDeleting(null)}
				onConfirm={() => {
					const d = deleting!;
					if (d.kind === 'layout') {
						const { [d.key]: _, ...rest } = data.layouts;
						set({ layouts: rest }, `layouts:delete:${d.key}`);
					} else {
						const { [d.key]: _, ...rest } = data.sections;
						set({ sections: rest }, `sections:delete:${d.key}`);
					}
					setDeleting(null);
				}}
			/>
		</Box>
	);
};

export default memo(LayoutsPanel);
