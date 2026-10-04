'use client';

import { FC, useEffect, useState } from 'react';
import { Badge, Box, Button, Flex, Grid, IconButton, Input, Text, Textarea } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Dropdown, Panel } from '@/components/library/cl';
import { GuideLink, Intro, Label } from '../../_components/ui';
import { BLOCK_CATEGORIES, Block, Card, Site, blankBlock, pageLabel, pageTree } from './website';
import type { TabProps } from './types';

/**
 * The Content tab (website templates): each page's content blocks, in order —
 * the kit's Contents (WebContent) records the site reads by slug. A block's
 * category decides which fields it uses; any text can hold a question's
 * {{key}}.
 */

const lines = (v: string) => v.split('\n');

const TextArea: FC<{ label: string; hint?: string; value: string; rows?: number; mono?: boolean; onChange: (v: string) => void }> = ({ label, hint, value, rows = 3, mono, onChange }) => (
	<Box>
		<Label hint={hint}>{label}</Label>
		<Textarea
			size='sm'
			rows={rows}
			value={value}
			fontFamily={mono ? 'mono' : undefined}
			fontSize={mono ? '12px' : undefined}
			onChange={e => onChange(e.target.value)}
		/>
	</Box>
);

const Line: FC<{ label: string; hint?: string; value: string; mono?: boolean; onChange: (v: string) => void }> = ({ label, hint, value, mono, onChange }) => (
	<Box>
		<Label hint={hint}>{label}</Label>
		<Input
			size='sm'
			value={value}
			fontFamily={mono ? 'mono' : undefined}
			onChange={e => onChange(e.target.value)}
		/>
	</Box>
);

const Cards: FC<{ value: Card[]; onChange: (v: Card[]) => void }> = ({ value, onChange }) => {
	const set = (i: number, patch: Partial<Card>) => onChange(value.map((c, j) => (j === i ? { ...c, ...patch } : c)));
	return (
		<Box>
			<Label hint='Each with an image, a title, a sub title and a few lines.'>Cards</Label>
			<Flex
				direction='column'
				gap={2}>
				{value.map((c, i) => (
					<Grid
						key={i}
						templateColumns={{ base: '1fr', md: '1fr 1fr auto' }}
						gap={2}
						p={2.5}
						borderWidth='1px'
						borderColor='border.muted'
						borderRadius='md'>
						<Input
							size='sm'
							placeholder='Title'
							value={c.title}
							onChange={e => set(i, { title: e.target.value })}
						/>
						<Input
							size='sm'
							placeholder='Sub title'
							value={c.subTitle}
							onChange={e => set(i, { subTitle: e.target.value })}
						/>
						<IconButton
							aria-label='Remove the card'
							size='xs'
							variant='ghost'
							onClick={() => onChange(value.filter((_, j) => j !== i))}>
							<Trash2 size={13} />
						</IconButton>
						<Input
							size='sm'
							placeholder='Image URL'
							fontFamily='mono'
							value={c.image}
							onChange={e => set(i, { image: e.target.value })}
						/>
						<Input
							size='sm'
							placeholder='Description'
							value={c.description}
							onChange={e => set(i, { description: e.target.value })}
						/>
					</Grid>
				))}
				<Button
					size='xs'
					variant='outline'
					alignSelf='flex-start'
					onClick={() => onChange([...value, { image: '', title: '', subTitle: '', description: '' }])}>
					<Plus size={12} />
					Add a card
				</Button>
			</Flex>
		</Box>
	);
};

/** "Hero — content: Welcome to …" — what a closed block shows. */
const summary = (b: Block) => {
	const text = b.content || b.richContent.replace(/<[^>]+>/g, ' ') || b.list.join(', ') || b.card.map(c => c.title).join(', ') || b.image || b.videoUrl || b.gallery.join(', ');
	return text.trim().slice(0, 90);
};

const BlockEditor: FC<{ b: Block; onChange: (b: Block) => void }> = ({ b, onChange }) => {
	const set = (patch: Partial<Block>) => onChange({ ...b, ...patch });
	const c = b.category;
	return (
		<Flex
			direction='column'
			gap={3}>
			<Grid
				templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
				alignItems='end'
				gap={3}>
				<Box>
					<Label
						required
						hint='How the site’s code finds it, e.g. “hero”.'>
						Slug
					</Label>
					<Input
						size='sm'
						fontFamily='mono'
						value={b.slug}
						onChange={e => set({ slug: e.target.value.replace(/\s+/g, '-').toLowerCase() })}
					/>
				</Box>
				<Line
					label='Name'
					hint='For the people editing it.'
					value={b.name}
					onChange={name => set({ name })}
				/>
				<Box>
					<Label hint={BLOCK_CATEGORIES.find(x => x.value === c)?.hint}>Category</Label>
					<Dropdown
						size='sm'
						value={c}
						onChange={category => set({ category })}
						items={BLOCK_CATEGORIES.map(x => ({ value: x.value, label: x.label }))}
					/>
				</Box>
				<Line
					label='Section'
					hint='Optional — groups blocks.'
					value={b.section}
					onChange={section => set({ section })}
				/>
			</Grid>

			{['content', 'section', 'other', 'card', 'list', 'list-of-links', 'image', 'gallery', 'video'].includes(c) && (
				<Grid
					templateColumns={{ base: '1fr', md: '1fr 1fr' }}
					gap={3}>
					<TextArea
						label={c === 'content' ? 'Heading or text' : 'Text'}
						value={b.content}
						rows={2}
						onChange={content => set({ content })}
					/>
					<TextArea
						label='Text under it'
						value={b.subContent}
						rows={2}
						onChange={subContent => set({ subContent })}
					/>
				</Grid>
			)}
			{['content', 'section', 'other', 'card'].includes(c) && (
				<Grid
					templateColumns={{ base: '1fr', md: '1fr 1fr' }}
					gap={3}>
					<Line
						label='Button text'
						value={b.btnText}
						onChange={btnText => set({ btnText })}
					/>
					<Line
						label='Button link'
						hint='A path on the site (/contact) or a full address.'
						value={b.url}
						mono
						onChange={url => set({ url })}
					/>
				</Grid>
			)}
			{c === 'rich-content' && (
				<TextArea
					label='Rich content'
					hint='HTML — headings, paragraphs, lists, links.'
					value={b.richContent}
					rows={6}
					mono
					onChange={richContent => set({ richContent })}
				/>
			)}
			{(c === 'list' || c === 'list-of-links') && (
				<TextArea
					label={c === 'list' ? 'Items' : 'Links'}
					hint={c === 'list' ? 'One per line.' : 'One per line: “Label | https://…”.'}
					value={b.list.join('\n')}
					rows={4}
					onChange={v => set({ list: lines(v) })}
				/>
			)}
			{c === 'card' && (
				<Cards
					value={b.card}
					onChange={card => set({ card })}
				/>
			)}
			{(c === 'image' || c === 'content' || c === 'section') && (
				<Line
					label='Image'
					hint='The image’s address. The project can swap it for an upload later.'
					value={b.image}
					mono
					onChange={image => set({ image })}
				/>
			)}
			{c === 'gallery' && (
				<TextArea
					label='Images'
					hint='One address per line.'
					value={b.gallery.join('\n')}
					rows={4}
					mono
					onChange={v => set({ gallery: lines(v) })}
				/>
			)}
			{c === 'video' && (
				<Line
					label='Video URL'
					hint='YouTube, Vimeo or a file.'
					value={b.videoUrl}
					mono
					onChange={videoUrl => set({ videoUrl })}
				/>
			)}
		</Flex>
	);
};

const WebsiteContentTab: FC<TabProps<Site>> = ({ doc, value, onChange, focus }) => {
	const tree = pageTree(value.pages);
	const [pageIndex, setPageIndex] = useState<number>(tree[0]?.index ?? -1);
	const [open, setOpen] = useState<number | null>(null);
	useEffect(() => {
		if (focus?.part === 'website' && focus.index !== undefined) setPageIndex(focus.index);
	}, [focus?.at]);
	const page = value.pages[pageIndex];
	const blocks = page?.contents || [];
	const issues = [...(doc.validation?.errors || []), ...(doc.validation?.warnings || [])].filter(
		(i: any) => i.part === 'website' && i.path.startsWith(`website.pages[${pageIndex}].contents`)
	);

	const setBlocks = (contents: Block[]) => onChange({ ...value, pages: value.pages.map((p, j) => (j === pageIndex ? { ...p, contents } : p)) });
	const move = (i: number, by: number) => {
		const j = i + by;
		if (j < 0 || j >= blocks.length) return;
		const next = [...blocks];
		[next[i], next[j]] = [next[j], next[i]];
		setBlocks(next);
		setOpen(j);
	};

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='content'>
				Each page’s content blocks, in the order the page shows them — a hero, a list of services, cards for the team, a block of
				formatted text. They become the site’s Contents records; the site’s code finds each by its page and slug, so keep slugs
				stable. Any text can hold a question’s {'{{key}}'}, filled when the template is used.
			</Intro>

			{!value.pages.length ? (
				<Text
					fontSize='13px'
					color='fg.muted'>
					Add pages on the Pages tab first — blocks belong to a page.
				</Text>
			) : (
				<Panel
					title='Blocks'
					subtitle={page ? `On ${page.name || page.path}` : 'Pick a page'}
					flush
					actions={
						<Flex
							align='center'
							gap={3}>
							<Box w={{ base: '180px', md: '260px' }}>
								<Dropdown
									size='sm'
									value={String(pageIndex)}
									onChange={v => {
										setPageIndex(Number(v));
										setOpen(null);
									}}
									items={tree.map(({ page: p, index, depth }) => ({ value: String(index), label: `${'— '.repeat(depth)}${pageLabel(p)} (${p.contents.length})` }))}
								/>
							</Box>
							<GuideLink section='content' />
						</Flex>
					}>
					{blocks.map((b, i) => {
						const isOpen = open === i;
						const mine = issues.filter((x: any) => x.path.startsWith(`website.pages[${pageIndex}].contents[${i}]`));
						return (
							<Box
								key={i}
								borderTopWidth='1px'
								borderColor='border.muted'
								_first={{ borderTopWidth: 0 }}>
								<Flex
									align='center'
									gap={2.5}
									px={4}
									py={2.5}>
									<Flex
										align='center'
										gap={2.5}
										flex={1}
										minW={0}
										cursor='pointer'
										onClick={() => setOpen(isOpen ? null : i)}>
										<Box color='fg.muted'>{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</Box>
										<Text
											fontSize='12.5px'
											fontFamily='mono'
											fontWeight='600'>
											{b.slug || '(no slug)'}
										</Text>
										<Badge
											size='sm'
											variant='subtle'>
											{BLOCK_CATEGORIES.find(x => x.value === b.category)?.label || b.category}
										</Badge>
										<Text
											fontSize='12.5px'
											color='fg.muted'
											truncate>
											{summary(b)}
										</Text>
									</Flex>
									{mine.some((x: any) => x.severity === 'error') && (
										<Badge
											size='sm'
											colorPalette='red'>
											Fix
										</Badge>
									)}
									<IconButton
										aria-label='Move up'
										size='xs'
										variant='ghost'
										disabled={i === 0}
										onClick={() => move(i, -1)}>
										<ArrowUp size={13} />
									</IconButton>
									<IconButton
										aria-label='Move down'
										size='xs'
										variant='ghost'
										disabled={i === blocks.length - 1}
										onClick={() => move(i, 1)}>
										<ArrowDown size={13} />
									</IconButton>
									<IconButton
										aria-label='Remove the block'
										size='xs'
										variant='ghost'
										onClick={() => {
											setBlocks(blocks.filter((_, j) => j !== i));
											setOpen(null);
										}}>
										<Trash2 size={13} />
									</IconButton>
								</Flex>
								{isOpen && (
									<Box
										px={4}
										pb={4}
										pl={{ base: 4, md: '42px' }}>
										<BlockEditor
											b={b}
											onChange={nb => setBlocks(blocks.map((x, j) => (j === i ? nb : x)))}
										/>
										{mine.map((x: any, k: number) => (
											<Text
												key={k}
												mt={2}
												fontSize='12px'
												color={x.severity === 'error' ? 'red.fg' : 'orange.fg'}>
												{x.message} {x.fix}
											</Text>
										))}
									</Box>
								)}
							</Box>
						);
					})}
					{page && !blocks.length && (
						<Text
							px={4}
							py={3}
							fontSize='13px'
							color='fg.muted'>
							No blocks on this page yet.
						</Text>
					)}
					{page && (
						<Flex
							px={4}
							py={3}
							borderTopWidth='1px'
							borderColor='border.muted'>
							<Button
								size='sm'
								variant='outline'
								onClick={() => {
									const taken = new Set(blocks.map(b => b.slug));
									let slug = blocks.length ? 'block' : 'hero';
									for (let n = 2; taken.has(slug); n++) slug = `block-${n}`;
									setBlocks([...blocks, blankBlock(slug)]);
									setOpen(blocks.length);
								}}>
								<Plus size={14} />
								Add a block
							</Button>
						</Flex>
					)}
				</Panel>
			)}
		</Flex>
	);
};

export default WebsiteContentTab;
