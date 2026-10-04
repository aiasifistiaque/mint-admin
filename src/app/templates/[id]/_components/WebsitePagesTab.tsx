'use client';

import { FC, useEffect, useState } from 'react';
import { Badge, Box, Button, Flex, Grid, IconButton, Input, Switch, Text } from '@chakra-ui/react';
import { ChevronDown, ChevronRight, CornerDownRight, EyeOff, Plus, Trash2 } from 'lucide-react';
import { Dropdown, Panel } from '@/components/library/cl';
import { GuideLink, Intro, Label } from '../../_components/ui';
import { PAGE_STATUSES, PAGE_TEMPLATES, Page, Site, blankPage, pageLabel, pageTree } from './website';
import type { TabProps } from './types';

/**
 * The Pages tab (website templates): the site's pages by path, as a tree —
 * name, status, page template, whether it's in the menu, its place among its
 * siblings, and its parent. Their blocks are on Content, their search
 * listing on SEO.
 */

const issuesOf = (doc: any) => [...(doc.validation?.errors || []), ...(doc.validation?.warnings || [])].filter((i: any) => i.part === 'website');

/** Every path under `path` (so a page can't become its own descendant's child). */
const descendants = (pages: Page[], path: string): Set<string> => {
	const out = new Set<string>();
	const walk = (p: string): void => {
		for (const x of pages) {
			if (x.parent !== p || out.has(x.path)) continue;
			out.add(x.path);
			walk(x.path);
		}
	};
	walk(path);
	return out;
};

const freePath = (pages: Page[], base: string) => {
	const taken = new Set(pages.map(p => p.path));
	if (!taken.has(base)) return base;
	for (let n = 2; ; n++) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
};

const WebsitePagesTab: FC<TabProps<Site>> = ({ doc, value, onChange, focus }) => {
	const pages = value.pages;
	const [open, setOpen] = useState<number | null>(null);
	useEffect(() => {
		if (focus?.part === 'website' && focus.index !== undefined) setOpen(focus.index);
	}, [focus?.at]);
	const issues = issuesOf(doc);

	const setPages = (next: Page[]) => onChange({ ...value, pages: next });
	const setPage = (i: number, patch: Partial<Page>) => {
		const old = pages[i];
		setPages(
			pages.map((p, j) => {
				if (j === i) return { ...p, ...patch };
				// A new path carries its children with it.
				if (patch.path !== undefined && old.path && p.parent === old.path) return { ...p, parent: patch.path };
				return p;
			})
		);
	};
	const add = (parent = '') => {
		const base = parent ? `${parent === '/' ? '' : parent}/new-page` : pages.some(p => p.path === '/') ? '/new-page' : '/';
		const page = { ...blankPage(freePath(pages, base), parent), name: base === '/' ? 'Home' : '', priority: pages.filter(p => p.parent === parent).length };
		setPages([...pages, page]);
		setOpen(pages.length);
	};
	const remove = (i: number) => {
		const gone = pages[i].path;
		setPages(pages.filter((_, j) => j !== i).map(p => (p.parent === gone ? { ...p, parent: pages[i].parent } : p)));
		setOpen(null);
	};

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='pages'>
				The pages the new site starts with, by path — “/” is the home page, “/about”, “/services/web” — with their place in the
				menu. A page under another (its parent) sits below it in the menu and the tree. Each page’s blocks are on the Content
				tab and its search listing on SEO. The tenant’s site reads them through the site API; they can change everything later.
			</Intro>

			<Panel
				title={`Pages (${pages.length})`}
				subtitle='In menu order — a child under its parent'
				flush
				actions={<GuideLink section='pages' />}>
				{pageTree(pages).map(({ page: p, index: i, depth }) => {
					const isOpen = open === i;
					const mine = issues.filter((x: any) => x.path.startsWith(`website.pages[${i}]`) && !x.path.includes('.seo') && !x.path.includes('.contents'));
					const exclude = descendants(pages, p.path);
					return (
						<Box
							key={i}
							borderTopWidth='1px'
							borderColor='border.muted'
							_first={{ borderTopWidth: 0 }}>
							<Flex
								align='center'
								gap={2}
								px={4}
								py={2.5}
								pl={`${16 + depth * 22}px`}
								cursor='pointer'
								_hover={{ bg: 'bg.subtle' }}
								onClick={() => setOpen(isOpen ? null : i)}>
								<Box color='fg.muted'>{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</Box>
								{depth > 0 && (
									<Box color='fg.subtle'>
										<CornerDownRight size={13} />
									</Box>
								)}
								<Text
									fontSize='13.5px'
									fontWeight='600'
									truncate>
									{p.name || 'Untitled'}
								</Text>
								<Text
									fontSize='12px'
									fontFamily='mono'
									color='fg.muted'
									truncate>
									{p.path}
								</Text>
								{p.status !== 'published' && (
									<Badge
										size='sm'
										variant='subtle'>
										{p.status}
									</Badge>
								)}
								{!p.showInMenu && (
									<Box
										color='fg.subtle'
										title='Not in the menu'>
										<EyeOff size={13} />
									</Box>
								)}
								<Box flex={1} />
								<Text
									fontSize='11.5px'
									color='fg.muted'
									display={{ base: 'none', md: 'block' }}>
									{p.contents.length} block{p.contents.length === 1 ? '' : 's'}
								</Text>
								{mine.some((x: any) => x.severity === 'error') && (
									<Badge
										size='sm'
										colorPalette='red'>
										Fix
									</Badge>
								)}
							</Flex>
							{isOpen && (
								<Flex
									direction='column'
									gap={4}
									px={4}
									pb={4}
									pl={{ base: 4, md: `${42 + depth * 22}px` }}>
									<Grid
										templateColumns={{ base: '1fr', md: '1fr 1fr' }}
										gap={4}>
										<Box>
											<Label
												required
												hint='As it reads in the menu, e.g. “About us”.'>
												Name
											</Label>
											<Input
												size='sm'
												value={p.name}
												maxLength={80}
												onChange={e => setPage(i, { name: e.target.value })}
											/>
										</Box>
										<Box>
											<Label
												required
												hint='Starts with “/”. Its children move with it.'>
												Path
											</Label>
											<Input
												size='sm'
												fontFamily='mono'
												value={p.path}
												maxLength={200}
												onChange={e => setPage(i, { path: e.target.value.replace(/\s+/g, '-').toLowerCase() })}
											/>
										</Box>
										<Box>
											<Label hint='The page it sits under in the menu.'>Parent</Label>
											<Dropdown
												size='sm'
												value={p.parent}
												placeholder='None — a top-level page'
												onChange={parent => setPage(i, { parent })}
												items={[
													{ value: '', label: 'None — a top-level page' },
													...pages.filter(x => x.path && x.path !== p.path && !exclude.has(x.path)).map(x => ({ value: x.path, label: pageLabel(x) })),
												]}
											/>
										</Box>
										<Box>
											<Label hint='Draft and archived pages aren’t served to the site.'>Status</Label>
											<Dropdown
												size='sm'
												value={p.status}
												onChange={status => setPage(i, { status })}
												items={PAGE_STATUSES}
											/>
										</Box>
										<Box>
											<Label hint='Which of the site’s layouts it uses — the site’s code decides what each looks like.'>Page template</Label>
											<Dropdown
												size='sm'
												value={p.template}
												onChange={template => setPage(i, { template })}
												items={PAGE_TEMPLATES}
											/>
										</Box>
										<Flex
											gap={4}
											align='flex-end'>
											<Box w='110px'>
												<Label hint='Lower first.'>Order</Label>
												<Input
													size='sm'
													type='number'
													value={p.priority}
													onChange={e => setPage(i, { priority: Number(e.target.value) || 0 })}
												/>
											</Box>
											<Switch.Root
												size='sm'
												pb={2}
												checked={p.showInMenu}
												onCheckedChange={e => setPage(i, { showInMenu: !!e.checked })}>
												<Switch.HiddenInput />
												<Switch.Control />
												<Switch.Label fontSize='12.5px'>In the menu</Switch.Label>
											</Switch.Root>
										</Flex>
									</Grid>
									{mine.map((x: any, k: number) => (
										<Text
											key={k}
											fontSize='12px'
											color={x.severity === 'error' ? 'red.fg' : 'orange.fg'}>
											{x.message} {x.fix}
										</Text>
									))}
									<Flex gap={2}>
										<Button
											size='xs'
											variant='outline'
											disabled={!p.path}
											onClick={() => add(p.path)}>
											<Plus size={12} />
											Add a page under it
										</Button>
										<Box flex={1} />
										<IconButton
											aria-label='Remove the page'
											size='xs'
											variant='ghost'
											onClick={() => remove(i)}>
											<Trash2 size={13} />
										</IconButton>
									</Flex>
								</Flex>
							)}
						</Box>
					);
				})}
				{!pages.length && (
					<Text
						px={4}
						py={3}
						fontSize='13px'
						color='fg.muted'>
						No pages yet — start with the home page.
					</Text>
				)}
				<Flex
					px={4}
					py={3}
					borderTopWidth='1px'
					borderColor='border.muted'>
					<Button
						size='sm'
						variant='outline'
						onClick={() => add()}>
						<Plus size={14} />
						{pages.some(p => p.path === '/') ? 'Add a page' : 'Add the home page'}
					</Button>
				</Flex>
			</Panel>
		</Flex>
	);
};

export default WebsitePagesTab;
