'use client';

import { FC } from 'react';
import { Box, Flex, Grid, Input, Switch, Text, Textarea } from '@chakra-ui/react';
import { Panel } from '@/components/library/cl';
import SerpPreview from '@/components/library/utils/inputs/VSeo/SerpPreview';
import { GuideLink, Intro, Label } from '../../_components/ui';
import { PageSeo, Site, pageTree } from './website';
import type { TabProps } from './types';

/**
 * The SEO tab (website templates): each page's search listing — title,
 * description, share image, canonical address, keywords, hidden from search —
 * beside a preview of how it reads in results. The kit needs a title and a
 * description together; a published page without them is an error.
 */

const Count: FC<{ n: number; max: number; ideal: [number, number] }> = ({ n, max, ideal }) => (
	<Text
		as='span'
		fontSize='11px'
		color={n > max ? 'red.fg' : n && (n < ideal[0] || n > ideal[1]) ? 'orange.fg' : 'fg.muted'}>
		{n}/{max}
	</Text>
);

const WebsiteSeoTab: FC<TabProps<Site>> = ({ doc, value, onChange }) => {
	const issues = [...(doc.validation?.errors || []), ...(doc.validation?.warnings || [])].filter((i: any) => i.part === 'website' && i.path.includes('.seo'));
	const setSeo = (i: number, patch: Partial<PageSeo>) =>
		onChange({ ...value, pages: value.pages.map((p, j) => (j === i ? { ...p, seo: { ...p.seo, ...patch } } : p)) });

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='seo'>
				How each page reads in search results and when it’s shared: the title, the sentence under it, the image a link preview
				shows. Write them for the business the template is for — a question’s {'{{key}}'} puts its name in. A published page
				needs both a title and a description; the site setup’s defaults (Site settings tab) fill the gaps on the tenant’s site.
			</Intro>

			{pageTree(value.pages).map(({ page: p, index: i, depth }) => {
				const s = p.seo;
				const mine = issues.filter((x: any) => x.path.startsWith(`website.pages[${i}].seo`));
				return (
					<Panel
						key={i}
						title={`${'— '.repeat(depth)}${p.name || 'Untitled'}`}
						subtitle={`${p.path}${p.status !== 'published' ? ` · ${p.status}` : ''}`}
						actions={i === 0 ? <GuideLink section='seo' /> : undefined}>
						<Grid
							templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1fr)' }}
							gap={5}>
							<Flex
								direction='column'
								gap={3}>
								<Box>
									<Flex justify='space-between'>
										<Label hint='50–60 characters show in full.'>Title</Label>
										<Count
											n={s.title.length}
											max={120}
											ideal={[30, 60]}
										/>
									</Flex>
									<Input
										size='sm'
										value={s.title}
										maxLength={120}
										onChange={e => setSeo(i, { title: e.target.value })}
									/>
								</Box>
								<Box>
									<Flex justify='space-between'>
										<Label hint='70–160 characters that make someone click.'>Description</Label>
										<Count
											n={s.description.length}
											max={320}
											ideal={[70, 160]}
										/>
									</Flex>
									<Textarea
										size='sm'
										rows={2}
										value={s.description}
										maxLength={320}
										onChange={e => setSeo(i, { description: e.target.value })}
									/>
								</Box>
								<Grid
									templateColumns={{ base: '1fr', md: '1fr 1fr' }}
									alignItems='end'
									gap={3}>
									<Box>
										<Label hint='Shown when the page is shared; 1200×630 works everywhere.'>Share image</Label>
										<Input
											size='sm'
											fontFamily='mono'
											placeholder='https://…'
											value={s.image}
											onChange={e => setSeo(i, { image: e.target.value })}
										/>
									</Box>
									<Box>
										<Label hint='Only when the same page lives at another address.'>Canonical address</Label>
										<Input
											size='sm'
											fontFamily='mono'
											value={s.canonical}
											onChange={e => setSeo(i, { canonical: e.target.value })}
										/>
									</Box>
								</Grid>
								<Box>
									<Label hint='Comma-separated, up to 20.'>Keywords</Label>
									<Input
										size='sm'
										value={s.keywords.join(', ')}
										onChange={e => setSeo(i, { keywords: e.target.value.split(',').map(k => k.trimStart()).slice(0, 20) })}
									/>
								</Box>
								<Switch.Root
									size='sm'
									checked={s.noIndex}
									onCheckedChange={e => setSeo(i, { noIndex: !!e.checked })}>
									<Switch.HiddenInput />
									<Switch.Control />
									<Switch.Label fontSize='12.5px'>Keep it out of search results (noindex)</Switch.Label>
								</Switch.Root>
								{mine.map((x: any, k: number) => (
									<Text
										key={k}
										fontSize='12px'
										color={x.severity === 'error' ? 'red.fg' : 'orange.fg'}>
										{x.message} {x.fix}
									</Text>
								))}
							</Flex>
							<Box>
								<Text
									fontSize='12px'
									color='fg.muted'
									mb={1.5}>
									In search results (placeholders as written)
								</Text>
								<SerpPreview
									title={s.title}
									description={s.description}
									path={p.path}
								/>
								{s.noIndex && (
									<Text
										fontSize='12px'
										color='orange.fg'
										mt={2}>
										Hidden from search — it won’t be listed.
									</Text>
								)}
							</Box>
						</Grid>
					</Panel>
				);
			})}
			{!value.pages.length && (
				<Text
					fontSize='13px'
					color='fg.muted'>
					Add pages on the Pages tab first.
				</Text>
			)}
		</Flex>
	);
};

export default WebsiteSeoTab;
