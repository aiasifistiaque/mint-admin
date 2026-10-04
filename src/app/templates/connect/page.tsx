'use client';

import { FC, ReactNode, useState } from 'react';
import NextLink from 'next/link';
import { Badge, Box, Button, Checkbox, Code, Flex, Input, Text } from '@chakra-ui/react';
import { Plus, Sparkles } from 'lucide-react';
import { Layout, PromptDialog } from '@/components/library';
import { ConsoleTabs, CopyValue, Dropdown, EmptyState, PageHeader, Panel, TableSkeleton, when } from '@/components/library/cl';
import { HOME } from '@/components/library/config/lib/constants/panel';
import { toaster } from '@/components/ui/toaster';
import { useCreateTemplateKeyMutation, useGetTemplateKeysQuery, useRevokeTemplateKeyMutation } from '@/components/library/store/services/templatesApi';
import { GuideLink } from '../_components/ui';

/**
 * Connect Claude to Template Studio (docs/templates T-11): the Templates MCP
 * (`/templates/mcp`, backend controllers/templates/mcp.router.ts) — what it
 * is and how it differs from the builder's MCP, its `emt_` keys (scopes
 * explained, shown once, revoke), setup for Claude Code, Claude Desktop and
 * claude.ai, and prompts to start with.
 */

/** The Templates MCP's address, from the admin API base (…/admin/api → …/templates/mcp). */
const mcpUrl = () => `${(process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000/admin/api').replace(/\/$/, '').replace(/\/admin\/api$/, '')}/templates/mcp`;

const SCOPES: { value: string; label: string; does: string; on: boolean }[] = [
	{ value: 'read', label: 'Read', does: 'List and read templates, run the checks, export them.', on: true },
	{ value: 'write', label: 'Write', does: 'Create drafts and change them part by part, import.', on: true },
	{ value: 'preview', label: 'Preview', does: 'Build a draft into a throwaway sandbox project and hand you the link.', on: true },
	{ value: 'publish', label: 'Publish', does: 'Publish a version tenants can use — only when you say so, and only if your role may publish.', on: false },
];

const PROMPTS = [
	'Make an app template for small bookkeeping firms: clients, their invoices and payments, with a dashboard of what’s overdue. Ask me before each part, add sample data, and preview it when it checks clean.',
	'Make a website template for a yoga studio: home, classes, teachers, pricing and contact pages with real-looking content, SEO for each page, and the studio’s name as a question.',
	'Make an API template for table bookings: tables, time slots and bookings, bookings created through the public API by signed-in customers, and a webhook to the restaurant’s system on each new booking.',
	'Read the template “finance-management”, tell me what’s missing for a tenant to understand it, and fix it part by part.',
];

const Snippet: FC<{ value: string }> = ({ value }) => (
	<Box
		position='relative'
		borderWidth='1px'
		borderColor='border'
		borderRadius='md'
		bg='bg.subtle'
		px={3}
		py={2.5}>
		<Code
			display='block'
			whiteSpace='pre-wrap'
			wordBreak='break-all'
			bg='transparent'
			fontSize='12px'
			pr={8}>
			{value}
		</Code>
		<Box
			position='absolute'
			top={1.5}
			right={1.5}>
			<CopyValue
				value={value}
				display=''
				ariaLabel='Copy'
			/>
		</Box>
	</Box>
);

const Steps: FC<{ items: ReactNode[] }> = ({ items }) => (
	<Box
		as='ol'
		pl={5}
		fontSize='sm'
		listStyleType='decimal'
		display='flex'
		flexDirection='column'
		gap={2}>
		{items.map((x, i) => (
			<li key={i}>{x}</li>
		))}
	</Box>
);

/** How to connect each client, with the key filled in when there's one to show. */
const ConnectGuide: FC<{ secret?: string }> = ({ secret }) => {
	const [tab, setTab] = useState('code');
	const key = secret || 'emt_YOUR_KEY';
	const url = mcpUrl();
	const local = /localhost|127\.0\.0\.1/.test(url);
	return (
		<Flex
			direction='column'
			gap={3}>
			{local && (
				<Text
					fontSize='xs'
					color='orange.fg'>
					The backend is on {url.replace(/\/templates\/mcp$/, '')}. claude.ai and Claude Desktop connectors reach it from the internet, so they need the
					deployed backend’s https address; Claude Code on this computer can use localhost.
				</Text>
			)}
			<ConsoleTabs
				value={tab}
				onChange={setTab}
				tabs={[
					{ value: 'code', label: 'Claude Code' },
					{ value: 'claude', label: 'Claude Desktop / claude.ai' },
					{ value: 'other', label: 'Other MCP clients' },
				]}>
				<Box pt={3}>
					{tab === 'code' && (
						<Steps
							items={[
								<>
									Run in a terminal:
									<Box mt={1.5}>
										<Snippet value={`claude mcp add --transport http emint-templates ${url}/${key}`} />
									</Box>
								</>,
								<>
									Start Claude Code and check it’s there with <Code fontSize='xs'>/mcp</Code> — “emint-templates” lists its tools.
								</>,
								<>Ask it to list the templates, or to make one (prompts below).</>,
							]}
						/>
					)}
					{tab === 'claude' && (
						<Steps
							items={[
								<>Open Claude → Settings → Connectors → Add custom connector.</>,
								<>
									Name it “e-mint templates” and paste this URL (the key is part of it, so keep it private):
									<Box mt={1.5}>
										<Snippet value={`${url}/${key}`} />
									</Box>
								</>,
								<>Leave the OAuth fields empty and add it. In a chat, switch the connector on from the tools menu.</>,
								<>Ask Claude to make a template — it agrees the plan with you, then writes one part at a time.</>,
							]}
						/>
					)}
					{tab === 'other' && (
						<Steps
							items={[
								<>
									Any MCP client that speaks Streamable HTTP. Endpoint:
									<Box mt={1.5}>
										<Snippet value={url} />
									</Box>
								</>,
								<>
									Send the key as a header — or, when the client only takes a URL, append it: <Code fontSize='xs'>{url}/{'<key>'}</Code>
									<Box mt={1.5}>
										<Snippet value={`Authorization: Bearer ${key}`} />
									</Box>
								</>,
							]}
						/>
					)}
				</Box>
			</ConsoleTabs>
		</Flex>
	);
};

const NewKeyDialog: FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
	const [create, { isLoading }] = useCreateTemplateKeyMutation();
	const [name, setName] = useState('');
	const [scopes, setScopes] = useState<string[]>(SCOPES.filter(s => s.on).map(s => s.value));
	const [days, setDays] = useState('');
	const [made, setMade] = useState<{ secret: string; name: string } | null>(null);

	const close = () => {
		setName('');
		setScopes(SCOPES.filter(s => s.on).map(s => s.value));
		setDays('');
		setMade(null);
		onClose();
	};
	const run = async () => {
		try {
			const res = await create({ name: name.trim(), scopes, ...(days && { expiresInDays: Number(days) }) }).unwrap();
			setMade({ secret: res.secret, name: res.doc.name });
		} catch (e: any) {
			toaster.create({ type: 'error', title: 'Could not create the key', description: e?.data?.message });
		}
	};

	return (
		<PromptDialog
			open={open}
			onClose={() => !isLoading && close()}
			tone='default'
			size='md'
			title={made ? `“${made.name}” is ready` : 'New Templates MCP key'}
			description={
				made
					? 'Copy it into Claude now — it isn’t stored in a form that can be shown again. If it’s lost, revoke it and make another.'
					: 'Claude connects with it, acting as you — it can never do more than your role allows.'
			}
			confirmLabel={made ? 'Done' : 'Create key'}
			cancelLabel={made ? 'Close' : 'Cancel'}
			loading={isLoading}
			disabled={!made && (!name.trim() || !scopes.length)}
			onConfirm={made ? close : run}
			aside={<GuideLink section='mcp-keys' />}>
			{made ? (
				<Flex
					direction='column'
					gap={4}>
					<Snippet value={made.secret} />
					<ConnectGuide secret={made.secret} />
				</Flex>
			) : (
				<Flex
					direction='column'
					gap={4}>
					<Box>
						<Text
							fontSize='xs'
							fontWeight='600'
							mb={1.5}>
							Name
						</Text>
						<Input
							size='sm'
							autoFocus
							value={name}
							placeholder='e.g. Claude Code — laptop'
							onChange={e => setName(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && name.trim() && scopes.length && run()}
						/>
					</Box>
					<Box>
						<Text
							fontSize='xs'
							fontWeight='600'
							mb={1.5}>
							What Claude may do with it
						</Text>
						<Flex
							direction='column'
							gap={2}>
							{SCOPES.map(s => (
								<Checkbox.Root
									key={s.value}
									size='sm'
									alignItems='flex-start'
									checked={scopes.includes(s.value)}
									onCheckedChange={e => setScopes(list => SCOPES.map(x => x.value).filter(v => (v === s.value ? !!e.checked : list.includes(v))))}>
									<Checkbox.HiddenInput />
									<Checkbox.Control mt='2px' />
									<Checkbox.Label>
										<Text fontSize='sm'>{s.label}</Text>
										<Text
											fontSize='xs'
											color='fg.muted'
											fontWeight='400'>
											{s.does}
										</Text>
									</Checkbox.Label>
								</Checkbox.Root>
							))}
						</Flex>
						{scopes.includes('publish') && (
							<Text
								fontSize='xs'
								color='orange.fg'
								mt={2}>
								Publishing reaches every tenant. Claude is told to publish only when you say so in the chat — leave it off if you’d rather press
								Publish yourself.
							</Text>
						)}
					</Box>
					<Box maxW='240px'>
						<Text
							fontSize='xs'
							fontWeight='600'
							mb={1.5}>
							Expires
						</Text>
						<Dropdown
							size='sm'
							value={days}
							onChange={setDays}
							items={[
								{ value: '', label: 'Never' },
								{ value: '7', label: 'In 7 days' },
								{ value: '30', label: 'In 30 days' },
								{ value: '90', label: 'In 90 days' },
								{ value: '365', label: 'In a year' },
							]}
						/>
					</Box>
				</Flex>
			)}
		</PromptDialog>
	);
};

const statusOf = (k: any) =>
	k.revokedAt ? { label: 'Revoked', tone: 'gray' } : k.expiresAt && new Date(k.expiresAt) < new Date() ? { label: 'Expired', tone: 'orange' } : { label: 'Active', tone: 'green' };

const ConnectTemplatesPage = () => {
	const { data, isLoading } = useGetTemplateKeysQuery();
	const [revoke, { isLoading: revoking }] = useRevokeTemplateKeyMutation();
	const [creating, setCreating] = useState(false);
	const [toRevoke, setToRevoke] = useState<any>(null);
	const keys = data?.doc || [];

	return (
		<Layout
			title='Templates'
			path='templates'>
			<Flex
				direction='column'
				gap={5}
				pb={10}
				maxW='960px'>
				<PageHeader
					breadcrumbs={[
						{ href: HOME, title: 'Home' },
						{ href: '/templates', title: 'Templates' },
						{ href: '/templates/connect', title: 'Connect Claude' },
					]}
					title='Connect Claude'
					meta='Let Claude write templates with you through the Templates MCP'
					actions={
						<Button
							size='sm'
							onClick={() => setCreating(true)}>
							<Plus size={14} />
							New key
						</Button>
					}
				/>

				<Panel
					title='How it works'
					actions={<GuideLink section='mcp' />}>
					<Flex
						direction='column'
						gap={2}
						fontSize='sm'>
						<Text>Claude connects with a key from this page and works on templates with you, in your own chat:</Text>
						<Steps
							items={[
								'agrees with you what the template is for and who uses it,',
								'writes one part at a time — overview, questions, models, sidebar, dashboard, roles, endpoints or pages, sample data, setup guide — showing you each,',
								'runs the same checks as the editor and fixes what they report,',
								'builds a preview and gives you the link — and publishes only when you say so.',
							]}
						/>
						<Text color='fg.muted'>
							It’s a different MCP from the one under Models → Connect your AI: that one builds inside a project; this one only ever writes templates and
							builds nothing outside the preview sandbox. Its keys start with <Code fontSize='xs'>emt_</Code>, and one kind of key never opens the other.
							Everything Claude writes shows up in the{' '}
							<NextLink
								href='/templates'
								style={{ textDecoration: 'underline' }}>
								gallery
							</NextLink>
							, marked “By Claude”.
						</Text>
					</Flex>
				</Panel>

				<Panel
					title='Keys'
					subtitle='Each key acts as the admin who made it, within the scopes ticked. Revoke one and it stops working at once.'
					actions={<GuideLink section='mcp-keys' />}
					flush>
					{isLoading ? (
						<Box p={4}>
							<TableSkeleton rows={3} />
						</Box>
					) : !keys.length ? (
						<Box p={4}>
							<EmptyState
								title='No keys yet'
								description='Make one for each place you use Claude.'
								action={
									<Button
										size='sm'
										onClick={() => setCreating(true)}>
										<Plus size={14} />
										New key
									</Button>
								}
							/>
						</Box>
					) : (
						keys.map((k: any, i: number) => {
							const status = statusOf(k);
							return (
								<Flex
									key={k._id}
									align='center'
									gap={3}
									px={4}
									py={3}
									borderTopWidth={i ? '1px' : 0}
									borderColor='border.muted'
									flexWrap='wrap'>
									<Box
										flex={1}
										minW='200px'>
										<Flex
											align='center'
											gap={2}>
											<Text
												fontSize='sm'
												fontWeight='600'>
												{k.name}
											</Text>
											<Badge
												size='sm'
												colorPalette={status.tone}
												variant='subtle'>
												{status.label}
											</Badge>
										</Flex>
										<Text
											fontSize='xs'
											color='fg.muted'>
											<Text
												as='span'
												fontFamily='mono'>
												{k.prefix}…
											</Text>{' '}
											· {(k.scopes || []).join(', ')} · by {k.createdBy?.name || k.createdBy?.email || 'someone'} · last used{' '}
											{k.lastUsedAt ? when(k.lastUsedAt) : 'never'}
											{k.expiresAt ? ` · expires ${when(k.expiresAt)}` : ''}
										</Text>
									</Box>
									{!k.revokedAt && (
										<Button
											size='xs'
											variant='ghost'
											colorPalette='red'
											onClick={() => setToRevoke(k)}>
											Revoke
										</Button>
									)}
								</Flex>
							);
						})
					)}
				</Panel>

				<Panel
					title='Connect Claude'
					subtitle='Make a key first — the instructions then show it filled in. These use a placeholder.'
					actions={<GuideLink section='mcp' />}>
					<ConnectGuide />
				</Panel>

				<Panel
					title='Prompts to start with'
					subtitle='Say who it’s for and what a project should do on day one'
					actions={<GuideLink section='mcp-prompts' />}>
					<Flex
						direction='column'
						gap={3}>
						{PROMPTS.map(p => (
							<Flex
								key={p}
								align='flex-start'
								gap={2}
								fontSize='sm'>
								<Box
									color='fg.muted'
									mt='3px'>
									<Sparkles size={14} />
								</Box>
								<Text flex={1}>“{p}”</Text>
								<CopyValue
									value={p}
									display=''
									ariaLabel='Copy the prompt'
								/>
							</Flex>
						))}
					</Flex>
				</Panel>
			</Flex>

			<NewKeyDialog
				open={creating}
				onClose={() => setCreating(false)}
			/>
			<PromptDialog
				open={!!toRevoke}
				onClose={() => setToRevoke(null)}
				title={`Revoke “${toRevoke?.name}”?`}
				description='Claude stops reaching Template Studio with it straight away. This can’t be undone — make a new key to reconnect.'
				confirmLabel='Revoke'
				loading={revoking}
				onConfirm={async () => {
					try {
						await revoke({ id: toRevoke._id }).unwrap();
						toaster.create({ type: 'success', title: `“${toRevoke.name}” revoked` });
					} catch (e: any) {
						toaster.create({ type: 'error', title: 'Could not revoke the key', description: e?.data?.message });
					}
					setToRevoke(null);
				}}
			/>
		</Layout>
	);
};

export default ConnectTemplatesPage;
