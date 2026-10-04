'use client';

import { FC, useMemo } from 'react';
import { Box, Button, Flex, Grid, IconButton, Input, Text } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { LucideIcon } from '@/components/library';
import { Dropdown, Panel } from '@/components/library/cl';
import { IconField, isIconName } from '@/app/sidebar-builder/_components/ui';
import { GuideLink, Intro, Label } from '../../_components/ui';
import { templateModels } from './models';
import type { TabProps } from './types';

/**
 * The Sidebar tab: the sections a new project's sidebar starts with, in
 * order, and which of the template's pages sit in each. Pages not placed go to
 * the section named on the Models tab (or the project's first).
 */

export type Section = { name: string; icon: string; description: string; items: { model: string; label: string }[] };

const move = <T,>(list: T[], i: number, by: number) => {
	const j = i + by;
	if (j < 0 || j >= list.length) return list;
	const next = [...list];
	[next[i], next[j]] = [next[j], next[i]];
	return next;
};

const SidebarTab: FC<TabProps<Section[]>> = ({ doc, value, onChange }) => {
	const models = useMemo(() => templateModels(doc), [doc]);
	const placed = new Set(value.flatMap(s => s.items.map(i => i.model)));
	const loose = models.filter(m => !placed.has(m.name));
	const titleOf = (name: string) => models.find(m => m.name === name)?.title || name;
	const fallback = doc.draft?.models?.sidebarCategory;

	const set = (i: number, patch: Partial<Section>) => onChange(value.map((s, j) => (j === i ? { ...s, ...patch } : s)));
	const setItem = (i: number, k: number, patch: any) => set(i, { items: value[i].items.map((it, j) => (j === k ? { ...it, ...patch } : it)) });

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='sidebar'>
				The sidebar a new project starts with: sections in order, and which of the template’s pages sit in each, so people
				find their way on day one. A page you don’t place goes to {fallback ? `“${fallback}”` : 'the project’s first section'}
				{fallback ? ' (set on the Models tab)' : ''}. The project can rearrange it all later in its own sidebar builder.
			</Intro>

			<Grid
				templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 280px' }}
				gap={4}
				alignItems='start'>
				<Flex
					direction='column'
					gap={4}
					minW={0}>
					{value.map((s, i) => (
						<Panel
							key={i}
							title={s.name || `Section ${i + 1}`}
							actions={
								<Flex>
									<IconButton
										aria-label='Move up'
										size='xs'
										variant='ghost'
										disabled={i === 0}
										onClick={() => onChange(move(value, i, -1))}>
										<ArrowUp size={13} />
									</IconButton>
									<IconButton
										aria-label='Move down'
										size='xs'
										variant='ghost'
										disabled={i === value.length - 1}
										onClick={() => onChange(move(value, i, 1))}>
										<ArrowDown size={13} />
									</IconButton>
									<IconButton
										aria-label='Remove the section'
										size='xs'
										variant='ghost'
										onClick={() => onChange(value.filter((_, j) => j !== i))}>
										<Trash2 size={13} />
									</IconButton>
								</Flex>
							}>
							<Flex
								direction='column'
								gap={4}>
								<Grid
									templateColumns={{ base: '1fr', md: '1fr 1fr' }}
									gap={4}>
									<Box>
										<Label
											required
											hint='The heading its pages are grouped under.'>
											Name
										</Label>
										<Input
											size='sm'
											value={s.name}
											maxLength={60}
											placeholder='Money'
											onChange={e => set(i, { name: e.target.value })}
										/>
										<Box mt={3}>
											<Label hint='Shown when the pointer rests on it.'>Description</Label>
											<Input
												size='sm'
												value={s.description}
												maxLength={200}
												onChange={e => set(i, { description: e.target.value })}
											/>
										</Box>
									</Box>
									<IconField
										value={s.icon}
										onChange={icon => set(i, { icon })}
										hint='Beside the section name.'
									/>
								</Grid>
								<Box>
									<Label hint='In the order they’re listed. A label replaces the page’s title in the sidebar only.'>Pages</Label>
									<Flex
										direction='column'
										gap={2}>
										{s.items.map((it, k) => (
											<Flex
												key={`${it.model}-${k}`}
												gap={2}
												align='center'>
												<Text
													fontSize='sm'
													w='160px'
													flexShrink={0}
													truncate
													color={models.some(m => m.name === it.model) ? 'fg' : 'red.fg'}>
													{titleOf(it.model)}
												</Text>
												<Input
													size='sm'
													value={it.label}
													placeholder={titleOf(it.model)}
													onChange={e => setItem(i, k, { label: e.target.value })}
												/>
												<IconButton
													aria-label='Move up'
													size='xs'
													variant='ghost'
													disabled={k === 0}
													onClick={() => set(i, { items: move(s.items, k, -1) })}>
													<ArrowUp size={13} />
												</IconButton>
												<IconButton
													aria-label='Move down'
													size='xs'
													variant='ghost'
													disabled={k === s.items.length - 1}
													onClick={() => set(i, { items: move(s.items, k, 1) })}>
													<ArrowDown size={13} />
												</IconButton>
												<IconButton
													aria-label='Take it out of the section'
													size='xs'
													variant='ghost'
													onClick={() => set(i, { items: s.items.filter((_, j) => j !== k) })}>
													<Trash2 size={13} />
												</IconButton>
											</Flex>
										))}
										{loose.length > 0 && (
											<Box maxW='280px'>
												<Dropdown
													value=''
													placeholder='Add a page'
													onChange={model => model && set(i, { items: [...s.items, { model, label: '' }] })}>
													{loose.map(m => (
														<option
															key={m.name}
															value={m.name}>
															{m.title}
														</option>
													))}
												</Dropdown>
											</Box>
										)}
									</Flex>
								</Box>
							</Flex>
						</Panel>
					))}
					<Flex
						gap={3}
						align='center'>
						<Button
							size='sm'
							variant='outline'
							onClick={() => onChange([...value, { name: '', icon: '', description: '', items: [] }])}>
							<Plus size={14} />
							Add a section
						</Button>
						<GuideLink section='sidebar' />
					</Flex>
				</Flex>

				<Panel
					title='As the project shows it'
					subtitle='Its own pages first; the project’s built-in pages come after.'>
					<Flex
						direction='column'
						gap={3}>
						{value.map((s, i) => (
							<Box key={i}>
								<Flex
									align='center'
									gap={2}
									fontSize='xs'
									fontWeight='600'
									color='fg.muted'
									textTransform='uppercase'
									letterSpacing='0.04em'>
									{isIconName(s.icon) && (
										<LucideIcon
											name={s.icon}
											size={13}
											color='currentColor'
										/>
									)}
									{s.name || 'Untitled'}
								</Flex>
								{s.items.map((it, k) => (
									<Text
										key={k}
										fontSize='sm'
										pl={5}
										py={0.5}>
										{it.label || titleOf(it.model)}
									</Text>
								))}
							</Box>
						))}
						{loose.length > 0 && (
							<Box>
								<Text
									fontSize='xs'
									fontWeight='600'
									color='fg.muted'
									textTransform='uppercase'
									letterSpacing='0.04em'>
									{fallback || 'First section'}
								</Text>
								{loose.map(m => (
									<Text
										key={m.name}
										fontSize='sm'
										pl={5}
										py={0.5}
										color='fg.muted'>
										{m.title}
									</Text>
								))}
							</Box>
						)}
						{!models.length && (
							<Text
								fontSize='sm'
								color='fg.muted'>
								Add and save models first — the sidebar lists their pages.
							</Text>
						)}
					</Flex>
				</Panel>
			</Grid>
		</Flex>
	);
};

export default SidebarTab;
