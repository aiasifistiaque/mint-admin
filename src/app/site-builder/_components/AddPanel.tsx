'use client';

import { FC, memo, useMemo, useState } from 'react';
import { Box, Flex, Image, Input, Text } from '@chakra-ui/react';
import { Puzzle } from 'lucide-react';
import type { SbManifest } from '@/components/library/store/services/siteBuilderApi';
import type { AddItem } from './edit';
import { SITES_URL } from './protocol';
import SiteGuide from './SiteGuide';

/**
 * The Add tab (docs/site-builder SB-06): every block and every preset section
 * from the manifest, grouped, with a search — and the saved sections (SB-07). Click one to add it next to the
 * selection (or into it); drag one onto the page to drop it where the line shows.
 */

const BLOCK_GROUPS: { key: string; label: string }[] = [
	{ key: 'layout', label: 'Layout' },
	{ key: 'basic', label: 'Text and buttons' },
	{ key: 'media', label: 'Pictures and video' },
	{ key: 'navigation', label: 'Navigation' },
	{ key: 'overlay', label: 'Pop-ups and drawers' },
	{ key: 'data', label: 'Your data' },
	{ key: 'commerce', label: 'Shop' },
	{ key: 'form', label: 'Forms' },
	{ key: 'widget', label: 'Widgets' },
];

const PRESET_GROUPS: Record<string, string> = {
	header: 'Headers',
	hero: 'Heroes',
	features: 'Features',
	cta: 'Calls to action',
	pricing: 'Pricing',
	testimonials: 'Testimonials',
	faq: 'Questions',
	team: 'Team',
	stats: 'Numbers',
	logos: 'Logos',
	contact: 'Contact',
	blog: 'Blog',
	products: 'Products',
	footer: 'Footers',
};

type Props = {
	manifest: SbManifest | undefined;
	/** the design's saved sections (none while a saved section is being edited — it can't hold another) */
	sections: { id: string; name: string }[];
	readOnly: boolean;
	onAdd: (item: AddItem) => void;
	onDragStart: (e: React.PointerEvent, item: AddItem) => void;
};

const Group: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
	<Box mb={4}>
		<Text
			px={3}
			mb={1.5}
			fontSize='11px'
			fontWeight='600'
			textTransform='uppercase'
			letterSpacing='0.06em'
			color='fg.muted'>
			{title}
		</Text>
		{children}
	</Box>
);

const AddPanel: FC<Props> = ({ manifest, sections, readOnly, onAdd, onDragStart }) => {
	const [q, setQ] = useState('');
	const query = q.trim().toLowerCase();

	const blocks = useMemo(() => {
		const list = (manifest?.blocks || []).filter(
			b => b.type !== 'section-ref' && (!query || b.label.toLowerCase().includes(query) || b.description.toLowerCase().includes(query) || b.type.includes(query))
		);
		return BLOCK_GROUPS.map(g => ({ ...g, items: list.filter(b => b.category === g.key) })).filter(g => g.items.length);
	}, [manifest, query]);

	const presets = useMemo(() => {
		const list = (manifest?.presets || []).filter(p => !query || p.label.toLowerCase().includes(query) || p.category.includes(query));
		const order = Object.keys(PRESET_GROUPS);
		const rank = (c: string) => (order.includes(c) ? order.indexOf(c) : order.length - 1.5); // unknown kinds before the footers
		const cats = [...new Set(list.map(p => p.category))].sort((a, b) => rank(a) - rank(b));
		return cats.map(c => ({ key: c, label: PRESET_GROUPS[c] || c, items: list.filter(p => p.category === c) }));
	}, [manifest, query]);

	const saved = useMemo(() => sections.filter(s => !query || s.name.toLowerCase().includes(query)), [sections, query]);

	const itemProps = (item: AddItem) => ({
		as: 'button' as const,
		type: 'button',
		'aria-label': `Add ${item.label}`,
		disabled: readOnly,
		title: readOnly ? 'Your role can’t change the site' : 'Click to add · drag onto the page',
		onClick: () => !readOnly && onAdd(item),
		onPointerDown: (e: React.PointerEvent) => !readOnly && e.button === 0 && onDragStart(e, item),
		cursor: readOnly ? 'not-allowed' : 'grab',
		opacity: readOnly ? 0.6 : 1,
		style: { touchAction: 'none' },
		_hover: readOnly ? undefined : { bg: 'bg.muted' },
	});

	return (
		<Flex
			direction='column'
			h='full'
			minH={0}>
			<Flex
				align='center'
				gap={2}
				px={3}
				py={2}
				borderBottomWidth='1px'>
				<Input
					size='xs'
					value={q}
					placeholder='Find a block or section'
					onChange={e => setQ(e.target.value)}
				/>
				<SiteGuide section='add' />
			</Flex>
			<Box
				flex={1}
				overflowY='auto'
				py={3}>
				{saved.length > 0 && (
					<>
						<Flex
							align='center'
							justify='space-between'
							px={3}
							mb={2}>
							<Text
								fontSize='12.5px'
								fontWeight='600'>
								Saved sections
							</Text>
							<SiteGuide section='sections' />
						</Flex>
						<Box mb={4}>
							{saved.map(s => (
								<Flex
									key={s.id}
									{...itemProps({ kind: 'saved', key: s.id, label: s.name, types: ['section-ref'] })}
									align='center'
									gap={2}
									w='calc(100% - 16px)'
									mx={2}
									mb={1}
									px={2}
									py={2}
									textAlign='left'
									borderWidth='1px'
									borderRadius='md'
									fontSize='12.5px'>
									<Puzzle size={14} />
									{s.name}
								</Flex>
							))}
						</Box>
					</>
				)}
				{presets.length > 0 && (
					<>
						<Flex
							align='center'
							justify='space-between'
							px={3}
							mb={2}>
							<Text
								fontSize='12.5px'
								fontWeight='600'>
								Sections
							</Text>
							<SiteGuide section='presets' />
						</Flex>
						{presets.map(g => (
							<Group
								key={g.key}
								title={g.label}>
								{g.items.map(p => (
									<Box
										key={p.key}
										{...itemProps({ kind: 'preset', key: p.key, label: p.label, types: p.tree.map(n => n.type) })}
										display='block'
										w='calc(100% - 16px)'
										mx={2}
										mb={1}
										px={2}
										py={2}
										textAlign='left'
										borderWidth='1px'
										borderRadius='md'
										fontSize='12.5px'
										lineHeight='1.35'>
										{p.thumbnail && (
											<Image
												src={`${SITES_URL}${p.thumbnail}`}
												alt=''
												w='full'
												mb={1.5}
												borderRadius='sm'
												loading='lazy'
											/>
										)}
										{p.label}
									</Box>
								))}
							</Group>
						))}
					</>
				)}
				<Text
					px={3}
					mb={2}
					mt={presets.length ? 2 : 0}
					fontSize='12.5px'
					fontWeight='600'>
					Blocks
				</Text>
				{blocks.map(g => (
					<Group
						key={g.key}
						title={g.label}>
						<Box
							display='grid'
							gridTemplateColumns='1fr 1fr'
							gap={1}
							px={2}>
							{g.items.map(b => (
								<Flex
									key={b.type}
									{...itemProps({ kind: 'block', key: b.type, label: b.label, types: [b.type] })}
									direction='column'
									align='center'
									justify='center'
									gap={1.5}
									h='68px'
									px={1}
									borderWidth='1px'
									borderRadius='md'
									fontSize='11.5px'
									textAlign='center'>
									<Image
										src={`${SITES_URL}/__mint/icon/${b.icon}`}
										alt=''
										w='20px'
										h='20px'
										loading='lazy'
										draggable={false}
										_dark={{ filter: 'invert(1)' }}
									/>
									{b.label}
								</Flex>
							))}
						</Box>
					</Group>
				))}
				{!blocks.length && !presets.length && !saved.length && (
					<Text
						px={3}
						fontSize='12.5px'
						color='fg.muted'>
						Nothing matches “{q}”.
					</Text>
				)}
			</Box>
		</Flex>
	);
};

export default memo(AddPanel);
