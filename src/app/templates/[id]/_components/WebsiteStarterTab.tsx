'use client';

import { FC } from 'react';
import { Box, Button, Flex, Grid, IconButton, Input, Text } from '@chakra-ui/react';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { Dropdown, Panel } from '@/components/library/cl';
import { GuideLink, Intro, Label } from '../../_components/ui';
import { Site, Starter } from './website';
import type { TabProps } from './types';

/**
 * The Starter code tab (website templates): the repository the tenant's site
 * starts from, its framework, a one-click deploy link, and the environment
 * variables it needs — `{{api}}` (the project's public API address) and
 * `{{slug}}` (its public name) are filled in when the project is made, then
 * shown on the project's dashboard ready to copy.
 */

const FRAMEWORKS = ['Next.js', 'Astro', 'Nuxt', 'SvelteKit', 'Remix', 'Plain HTML', 'Other'];

/** A Vercel "clone and deploy" link that asks for the variables. */
const vercelLink = (s: Starter) => {
	const params = new URLSearchParams({ 'repository-url': s.repoUrl });
	const keys = s.env.map(e => e.key).filter(Boolean);
	if (keys.length) params.set('env', keys.join(','));
	return `https://vercel.com/new/clone?${params.toString()}`;
};

const EXAMPLE = { api: 'https://api.mint.example/public/api/acme-site', slug: 'acme-site' };

const WebsiteStarterTab: FC<TabProps<Site>> = ({ doc, value, onChange }) => {
	const s = value.starter;
	const set = (patch: Partial<Starter>) => onChange({ ...value, starter: { ...s, ...patch } });
	const setEnv = (i: number, patch: Partial<Starter['env'][number]>) => set({ env: s.env.map((e, j) => (j === i ? { ...e, ...patch } : e)) });
	const issues = [...(doc.validation?.errors || []), ...(doc.validation?.warnings || [])].filter((i: any) => i.part === 'website' && i.path.startsWith('website.starter'));
	const filled = s.env
		.filter(e => e.key)
		.map(e => `${e.key}=${e.value.replace(/\{\{\s*api\s*\}\}/g, EXAMPLE.api).replace(/\{\{\s*slug\s*\}\}/g, EXAMPLE.slug)}`)
		.join('\n');

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='starter-code'>
				The code the tenant’s site starts from: a repository they copy, the framework it’s written in, a deploy button, and the
				settings it needs. Use {'{{api}}'} for the project’s public API address and {'{{slug}}'} for its public name — they’re
				filled in when the project is made, and the project’s dashboard shows them ready to copy. Optional: without it, the
				tenant builds their own site against the site API.
			</Intro>

			<Panel
				title='Repository'
				actions={<GuideLink section='starter-code' />}>
				<Grid
					templateColumns={{ base: '1fr', md: '2fr 1fr' }}
					gap={4}>
					<Box>
						<Label hint='The https address of a public repository.'>Repository URL</Label>
						<Input
							size='sm'
							fontFamily='mono'
							placeholder='https://github.com/you/site-starter'
							value={s.repoUrl}
							onChange={e => set({ repoUrl: e.target.value })}
						/>
					</Box>
					<Box>
						<Label>Framework</Label>
						<Dropdown
							size='sm'
							value={s.framework}
							placeholder='Pick one'
							onChange={framework => set({ framework })}
							items={FRAMEWORKS.map(f => ({ value: f, label: f }))}
						/>
					</Box>
				</Grid>
				<Box mt={4}>
					<Label hint='A host’s “clone and deploy” link — the button the dashboard shows.'>Deploy link</Label>
					<Flex gap={2}>
						<Input
							size='sm'
							fontFamily='mono'
							placeholder='https://vercel.com/new/clone?repository-url=…'
							value={s.deployUrl}
							onChange={e => set({ deployUrl: e.target.value })}
						/>
						<Button
							size='sm'
							variant='outline'
							flexShrink={0}
							disabled={!/^https:\/\//.test(s.repoUrl)}
							onClick={() => set({ deployUrl: vercelLink(s) })}>
							<Wand2 size={13} />
							Make a Vercel link
						</Button>
					</Flex>
				</Box>
			</Panel>

			<Panel
				title='Environment variables'
				subtitle='What the site’s code reads — with the project’s own values filled in'>
				<Flex
					direction='column'
					gap={2}>
					{s.env.map((e, i) => (
						<Flex
							key={i}
							gap={2}
							align='center'>
							<Input
								size='sm'
								w='240px'
								fontFamily='mono'
								placeholder='NEXT_PUBLIC_API'
								value={e.key}
								onChange={x => setEnv(i, { key: x.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_') })}
							/>
							<Input
								size='sm'
								flex={1}
								fontFamily='mono'
								placeholder='{{api}}'
								value={e.value}
								onChange={x => setEnv(i, { value: x.target.value })}
							/>
							<Button
								size='xs'
								variant='ghost'
								onClick={() => setEnv(i, { value: `${e.value}{{api}}` })}>
								{'{{api}}'}
							</Button>
							<Button
								size='xs'
								variant='ghost'
								onClick={() => setEnv(i, { value: `${e.value}{{slug}}` })}>
								{'{{slug}}'}
							</Button>
							<IconButton
								aria-label='Remove the variable'
								size='xs'
								variant='ghost'
								onClick={() => set({ env: s.env.filter((_, j) => j !== i) })}>
								<Trash2 size={13} />
							</IconButton>
						</Flex>
					))}
					<Flex gap={2}>
						<Button
							size='xs'
							variant='outline'
							onClick={() => set({ env: [...s.env, { key: '', value: '' }] })}>
							<Plus size={12} />
							Add a variable
						</Button>
						{!s.env.some(e => e.value.includes('{{api}}')) && (
							<Button
								size='xs'
								variant='ghost'
								onClick={() => set({ env: [...s.env, { key: 'NEXT_PUBLIC_MINT_API', value: '{{api}}' }] })}>
								Add the API address
							</Button>
						)}
					</Flex>
					{filled && (
						<Box mt={2}>
							<Text
								fontSize='12px'
								color='fg.muted'
								mb={1}>
								For a project “Acme site” the dashboard shows:
							</Text>
							<Box
								as='pre'
								m={0}
								p={2.5}
								fontSize='12px'
								fontFamily='mono'
								bg='bg.subtle'
								borderWidth='1px'
								borderColor='border.muted'
								borderRadius='md'
								whiteSpace='pre-wrap'
								wordBreak='break-all'>
								{filled}
							</Box>
						</Box>
					)}
				</Flex>
				{issues.map((x: any, k: number) => (
					<Text
						key={k}
						mt={2}
						fontSize='12px'
						color={x.severity === 'error' ? 'red.fg' : 'orange.fg'}>
						{x.message} {x.fix}
					</Text>
				))}
			</Panel>
		</Flex>
	);
};

export default WebsiteStarterTab;
