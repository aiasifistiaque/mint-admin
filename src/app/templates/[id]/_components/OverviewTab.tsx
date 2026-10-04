'use client';

import { FC } from 'react';
import { Badge, Box, Flex, Grid, Input, Text, Textarea } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { VImage, VImageArray } from '@/components/library';
import { Panel } from '@/components/library/cl';
import { IconField } from '@/app/sidebar-builder/_components/ui';
import { GuideLink, Intro, Label } from '../../_components/ui';
import type { TabProps } from './types';

/**
 * The Overview tab: how the template introduces itself in the gallery — and
 * the explanations publishing needs (summary, description, who it's for) —
 * plus "What's inside", worked out from the draft.
 */

export type Overview = {
	name: string;
	summary: string;
	description: string;
	audience: string;
	category: string;
	tags: string[];
	icon: string;
	color: string;
	cover: string;
	screenshots: string[];
};

const Need: FC<{ missing: boolean }> = ({ missing }) =>
	missing ? (
		<Badge
			size='xs'
			colorPalette='orange'
			variant='subtle'
			ml={1.5}>
			needed to publish
		</Badge>
	) : null;

const OverviewTab: FC<TabProps<Overview>> = ({ doc, value, onChange }) => {
	const set = (patch: Partial<Overview>) => onChange({ ...value, ...patch });
	const inside = doc.whatsInside || {};
	const c = inside.counts || {};

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='overview'>
				How the template introduces itself when a tenant picks a starting point for a new project. Write it for them: what a
				project made from it does, who it suits, how it’s used day to day. A template can’t be published until it has a
				summary, a description and says who it’s for.
			</Intro>

			<Grid
				templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 340px' }}
				gap={4}
				alignItems='start'>
				<Flex
					direction='column'
					gap={4}
					minW={0}>
					<Panel
						title='Introduction'
						subtitle='The words tenants read before they choose.'
						actions={<GuideLink section='overview' />}>
						<Flex
							direction='column'
							gap={4}>
							<Grid
								templateColumns={{ base: '1fr', md: '2fr 1fr' }}
								gap={4}>
								<Box>
									<Label
										required
										hint='Short and recognisable.'>
										Name
									</Label>
									<Input
										size='sm'
										value={value.name}
										maxLength={80}
										onChange={e => set({ name: e.target.value })}
									/>
								</Box>
								<Box>
									<Label hint='Groups it in the gallery: Finance, Sales, Blog…'>Category</Label>
									<Input
										size='sm'
										value={value.category}
										maxLength={60}
										onChange={e => set({ category: e.target.value })}
									/>
								</Box>
							</Grid>
							<Box>
								<Label hint='One sentence — the line under the name in the gallery.'>
									Summary
									<Need missing={!value.summary.trim()} />
								</Label>
								<Input
									size='sm'
									value={value.summary}
									maxLength={300}
									placeholder='Accounts, transactions and budgets for a small team.'
									onChange={e => set({ summary: e.target.value })}
								/>
							</Box>
							<Box>
								<Label hint='A few short paragraphs: what’s inside, and how people use it day to day. Markdown works (**bold**, lists).'>
									Description
									<Need missing={!value.description.trim()} />
								</Label>
								<Textarea
									size='sm'
									rows={7}
									value={value.description}
									maxLength={8000}
									placeholder={'Keep every account in one place and record each transaction against it.\n\nThe dashboard shows the month’s money in and out…'}
									onChange={e => set({ description: e.target.value })}
								/>
							</Box>
							<Box>
								<Label hint='Who should pick it — e.g. “Small agencies that bill clients monthly”.'>
									Who it’s for
									<Need missing={!value.audience.trim()} />
								</Label>
								<Input
									size='sm'
									value={value.audience}
									maxLength={500}
									onChange={e => set({ audience: e.target.value })}
								/>
							</Box>
							<Box>
								<Label hint='Comma-separated words people might search for.'>Tags</Label>
								<Input
									size='sm'
									value={value.tags.join(', ')}
									placeholder='accounting, budgets'
									onChange={e =>
										set({
											tags: e.target.value
												.split(',')
												.map(t => t.trimStart())
												.slice(0, 12),
										})
									}
									onBlur={() => set({ tags: value.tags.map(t => t.trim()).filter(Boolean) })}
								/>
							</Box>
						</Flex>
					</Panel>

					<Panel
						title='Look'
						subtitle='The card in the gallery: a cover image, or the icon on the colour.'
						actions={<GuideLink section='overview' />}>
						<Flex
							direction='column'
							gap={4}>
							<Grid
								templateColumns={{ base: '1fr', md: '1fr 1fr' }}
								gap={4}>
								<IconField
									value={value.icon}
									onChange={icon => set({ icon })}
									hint='Shown on the card when there’s no cover. A Lucide icon name.'
								/>
								<Box>
									<Label hint='The card’s background behind the icon.'>Colour</Label>
									<Flex
										gap={2}
										align='center'>
										<Input
											type='color'
											size='sm'
											w='44px'
											p={0.5}
											value={/^#[0-9a-f]{6}$/i.test(value.color) ? value.color : '#64748b'}
											onChange={e => set({ color: e.target.value })}
										/>
										<Input
											size='sm'
											fontFamily='mono'
											value={value.color}
											placeholder='None'
											maxLength={30}
											onChange={e => set({ color: e.target.value })}
										/>
									</Flex>
								</Box>
							</Grid>
							<Grid
								templateColumns={{ base: '1fr', md: '220px minmax(0, 1fr)' }}
								gap={4}>
								<VImage
									label='Cover'
									helper='The card’s picture, about 16:9.'
									value={value.cover || undefined}
									onChange={(url: any) => set({ cover: typeof url === 'string' ? url : '' })}
									style={{ w: '200px', h: '120px' }}
								/>
								<Box minW={0}>
									<VImageArray
										label='Screenshots'
										helper='What a project made from it looks like — shown when a tenant opens the template.'
										value={value.screenshots}
										onChange={(v: any, how?: string) => {
											const list = value.screenshots;
											if (how === 'delete') set({ screenshots: list.filter(s => s !== v) });
											else if (how === 'reorder' && Array.isArray(v)) set({ screenshots: v });
											else if (Array.isArray(v)) set({ screenshots: [...list, ...v.filter(x => !list.includes(x))].slice(0, 10) });
											else if (v && !list.includes(v)) set({ screenshots: [...list, v].slice(0, 10) });
										}}
									/>
								</Box>
							</Grid>
							{value.cover && (
								<Text
									fontSize='xs'
									color='fg.muted'
									cursor='pointer'
									textDecoration='underline'
									onClick={() => set({ cover: '' })}>
									Remove the cover
								</Text>
							)}
						</Flex>
					</Panel>
				</Flex>

				<Panel
					title='What’s inside'
					subtitle='Worked out from the saved draft — tenants see this list.'
					actions={<GuideLink section='overview' />}>
					<Flex
						direction='column'
						gap={3}
						fontSize='sm'>
						<Flex
							gap={1.5}
							flexWrap='wrap'>
							<Badge variant='outline'>{c.models || 0} models</Badge>
							<Badge variant='outline'>{c.fields || 0} fields</Badge>
							<Badge variant='outline'>{c.links || 0} links</Badge>
							{doc.type === 'website' && <Badge variant='outline'>{c.pages || 0} pages</Badge>}
							<Badge variant='outline'>{c.sampleRecords || 0} sample records</Badge>
						</Flex>
						{(inside.models || []).map((m: any) => (
							<Box key={m.name}>
								<Text fontWeight='600'>{m.title || m.name}</Text>
								{m.description && (
									<Text
										fontSize='xs'
										color='fg.muted'>
										{m.description}
									</Text>
								)}
								{m.links.map((l: any) => (
									<Flex
										key={l.field}
										fontSize='xs'
										color='fg.muted'
										align='center'
										gap={1}>
										{l.field} <ArrowRight size={10} /> {l.to}
										{l.many ? ' (several)' : ''}
									</Flex>
								))}
							</Box>
						))}
						{[
							inside.sidebar?.length ? `${inside.sidebar.length} sidebar section(s)` : '',
							inside.widgets ? `${inside.widgets} dashboard widget(s)` : '',
							inside.roles?.length ? `Roles: ${inside.roles.join(', ')}` : '',
							inside.endpoints?.length ? `${inside.endpoints.length} public endpoint(s)` : '',
							inside.webhooks ? `${inside.webhooks} webhook(s)` : '',
							inside.questions ? `${inside.questions} question(s) asked when it’s used` : '',
							inside.guideSteps ? `${inside.guideSteps} setup step(s)` : '',
						]
							.filter(Boolean)
							.map(line => (
								<Text
									key={line}
									fontSize='xs'
									color='fg.muted'>
									{line}
								</Text>
							))}
						{!c.models && !c.pages && (
							<Text
								fontSize='xs'
								color='fg.muted'>
								Nothing yet — start with the Models tab.
							</Text>
						)}
					</Flex>
				</Panel>
			</Grid>
		</Flex>
	);
};

export default OverviewTab;
