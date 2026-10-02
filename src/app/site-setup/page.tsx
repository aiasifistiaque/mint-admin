'use client';

import { FC, Suspense, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, Flex, Grid, Input, Skeleton, Switch, Tabs, Text, Textarea } from '@chakra-ui/react';
import { ExternalLink } from 'lucide-react';
import {
	Layout,
	VColor,
	VImage,
	useGetAllQuery,
	useGetSiteConfigQuery,
	usePostMutation,
	useUpdateByIdMutation,
	useUpdateSiteConfigMutation,
} from '@/components/library';
import { ConsoleTabs, CopyValue, Panel } from '@/components/library/cl';
import { API_ORIGIN, pagePath } from '@/components/library/config/lib/constants/panel';
import { useWorkspace } from '@/components/library/tenant';
import GuideLink from '@/components/library/tenant/GuideLink';
import type { SiteConfig } from '@/components/library/store/services/tenantApi';
import { Field, Rows, SaveBar } from './_components/parts';

/**
 * A website project's setup (WO-34) — one page, a tab per concern, never a
 * table: the site's identity (its Site settings record), tracking tags, code
 * for <head> and <body>, SEO & indexing, redirects and headers, domains.
 * Everything but General lives on the project (backend siteConfig.function.ts);
 * the live site reads it from the site API, and track.js injects the tags.
 */

const TABS = [
	{ value: 'general', label: 'General' },
	{ value: 'tracking', label: 'Tracking' },
	{ value: 'code', label: 'Code' },
	{ value: 'seo', label: 'SEO & indexing' },
	{ value: 'redirects', label: 'Redirects & headers' },
	{ value: 'domains', label: 'Domains' },
];

type Draft = Omit<SiteConfig, 'origin'>;
const pick = (c: SiteConfig): Draft => ({ tracking: c.tracking, code: c.code, seo: c.seo, redirects: c.redirects, headers: c.headers, domains: c.domains });
const same = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

/* ------------------------------------------------------------ General */

const SETTINGS_TEXT: { key: string; label: string; help?: string; long?: boolean }[] = [
	{ key: 'siteName', label: 'Site name' },
	{ key: 'fontFamily', label: 'Font', help: 'A Google Font name, e.g. Inter' },
	{ key: 'footerText', label: 'Footer text', long: true },
];
const CONTACT = ['email', 'phone', 'address', 'mapEmbedUrl'];
const SOCIAL = ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'];
const LABELS: Record<string, string> = {
	email: 'Email',
	phone: 'Phone',
	address: 'Address',
	mapEmbedUrl: 'Map embed URL',
	facebook: 'Facebook',
	twitter: 'X / Twitter',
	instagram: 'Instagram',
	youtube: 'YouTube',
	linkedin: 'LinkedIn',
};

const imageValue = (v: any) => (typeof v === 'string' ? v : v?.url || '');

const General: FC = () => {
	const { data, isLoading } = useGetAllQuery({ path: 'site-settings', limit: 1, sort: 'createdAt' });
	const record = data?.doc?.[0] || null;
	const [draft, setDraft] = useState<any>({});
	const [saved, setSaved] = useState(false);
	const [update, updating] = useUpdateByIdMutation();
	const [create, creating] = usePostMutation();
	useEffect(() => setDraft(record || {}), [record]);
	const dirty = !same({ ...(record || {}) }, draft);
	const set = (key: string, value: any) => {
		setSaved(false);
		setDraft((d: any) => ({ ...d, [key]: value }));
	};

	const save = async () => {
		const { _id, createdAt, updatedAt, __v, code, ...body } = draft;
		const res: any = record ? await update({ path: 'site-settings', id: record._id, body }) : await create({ path: 'site-settings', body });
		if ('data' in res) setSaved(true);
	};

	if (isLoading) return <Skeleton h='320px' />;
	const text = (key: string, label: string, help?: string, long?: boolean) => (
		<Field
			key={key}
			label={label}
			help={help}>
			{long ? (
				<Textarea
					size='sm'
					rows={3}
					value={draft[key] || ''}
					onChange={e => set(key, e.target.value)}
				/>
			) : (
				<Input
					size='sm'
					value={draft[key] || ''}
					onChange={e => set(key, e.target.value)}
				/>
			)}
		</Field>
	);

	return (
		<Flex
			direction='column'
			gap={4}>
			<Panel
				title='Identity'
				subtitle='Your site’s name, logo, favicon and look.'
				actions={<GuideLink section='site-general' />}>
				<Grid
					templateColumns={{ base: '1fr', md: '1fr 1fr' }}
					gap={4}>
					{SETTINGS_TEXT.map(f => text(f.key, f.label, f.help, f.long))}
					<VImage
						label='Logo'
						value={draft.logo || ''}
						onChange={(v: any) => set('logo', imageValue(v))}
						folder='website'
					/>
					<VImage
						label='Favicon'
						helper='A square image — 512×512 works everywhere'
						value={draft.favicon || ''}
						onChange={(v: any) => set('favicon', imageValue(v))}
						folder='website'
					/>
					<VColor
						label='Primary colour'
						name='primaryColor'
						value={draft.primaryColor || ''}
						onChange={(e: any) => set('primaryColor', e.target.value)}
					/>
					<VColor
						label='Secondary colour'
						name='secondaryColor'
						value={draft.secondaryColor || ''}
						onChange={(e: any) => set('secondaryColor', e.target.value)}
					/>
				</Grid>
			</Panel>
			<Panel
				title='Default SEO'
				subtitle='Used on any page without its own title, description or share image.'>
				<Grid
					templateColumns={{ base: '1fr', md: '1fr 1fr' }}
					gap={4}>
					{text('metaTitle', 'Default title', 'Up to about 60 characters')}
					<VImage
						label='Default share image'
						helper='1200×630 for links shared on social media'
						value={draft.ogImage || ''}
						onChange={(v: any) => set('ogImage', imageValue(v))}
						folder='website'
					/>
					<Box gridColumn={{ md: 'span 2' }}>{text('metaDescription', 'Default description', 'Up to about 160 characters', true)}</Box>
				</Grid>
			</Panel>
			<Panel
				title='Contact & social'
				subtitle='Shown in your site’s footer and contact page.'>
				<Grid
					templateColumns={{ base: '1fr', md: '1fr 1fr' }}
					gap={4}>
					{[...CONTACT, ...SOCIAL].map(k => text(k, LABELS[k], undefined, k === 'address'))}
				</Grid>
				<SaveBar
					dirty={dirty}
					saving={updating.isLoading || creating.isLoading}
					error={updating.error || creating.error}
					saved={saved}
					onSave={save}
					onReset={() => setDraft(record || {})}
				/>
			</Panel>
		</Flex>
	);
};

/* ----------------------------------------------------- config tabs */

const TRACKERS: { key: keyof SiteConfig['tracking']; label: string; placeholder: string; help: string }[] = [
	{ key: 'ga4', label: 'Google Analytics 4', placeholder: 'G-XXXXXXXXXX', help: 'Admin → Data streams → your web stream → Measurement ID.' },
	{ key: 'gtm', label: 'Google Tag Manager', placeholder: 'GTM-XXXXXXX', help: 'The container ID at the top of Tag Manager.' },
	{ key: 'googleAds', label: 'Google Ads', placeholder: 'AW-123456789', help: 'Tools → Conversions → Tag setup.' },
	{ key: 'metaPixel', label: 'Meta Pixel', placeholder: '1234567890123456', help: 'Events Manager → Data sources → your pixel’s ID.' },
	{ key: 'tiktokPixel', label: 'TikTok Pixel', placeholder: 'C1234567890ABCDEFGHI', help: 'TikTok Ads Manager → Events → Web events.' },
	{ key: 'linkedinPartner', label: 'LinkedIn Insight', placeholder: '1234567', help: 'Campaign Manager → Analyze → Insight tag → Partner ID.' },
	{ key: 'clarity', label: 'Microsoft Clarity', placeholder: 'abcd1234ef', help: 'Settings → Overview → Project ID.' },
	{ key: 'hotjar', label: 'Hotjar', placeholder: '1234567', help: 'Sites & Organizations → Site ID.' },
];

const Toggle: FC<{ label: string; help: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, help, checked, onChange }) => (
	<Flex
		gap={3}
		align='flex-start'>
		<Switch.Root
			checked={checked}
			colorPalette='brand'
			onCheckedChange={d => onChange(d.checked)}>
			<Switch.HiddenInput />
			<Switch.Control />
		</Switch.Root>
		<Box>
			<Text
				fontSize='13px'
				fontWeight='600'>
				{label}
			</Text>
			<Text
				fontSize='12px'
				color='fg.muted'>
				{help}
			</Text>
		</Box>
	</Flex>
);

const Code: FC<{ label: string; help: string; value: string; onChange: (v: string) => void }> = ({ label, help, value, onChange }) => (
	<Field
		label={label}
		help={help}>
		<Textarea
			size='sm'
			rows={6}
			fontFamily='mono'
			fontSize='12px'
			spellCheck={false}
			value={value}
			onChange={e => onChange(e.target.value)}
		/>
	</Field>
);

function SiteSetup() {
	const router = useRouter();
	const params = useSearchParams();
	const tab = TABS.some(t => t.value === params.get('tab')) ? String(params.get('tab')) : 'general';
	const { project, can } = useWorkspace();
	const { data, isLoading, isError } = useGetSiteConfigQuery();
	const [update, { isLoading: saving, error, reset }] = useUpdateSiteConfigMutation();
	const [draft, setDraft] = useState<Draft | null>(null);
	const [saved, setSaved] = useState(false);
	useEffect(() => {
		if (data) setDraft(pick(data));
	}, [data]);

	const base = project ? `${API_ORIGIN}/public/api/${project.publicSlug}` : '';
	const original = useMemo(() => (data ? pick(data) : null), [data]);
	const canBuild = can('build');
	const canDomains = can('manage-projects');

	const sectionDirty = (keys: (keyof Draft)[]) => !!draft && !!original && keys.some(k => !same(draft[k], original[k]));
	const change = (patch: Partial<Draft>) => {
		setSaved(false);
		reset();
		setDraft(d => (d ? { ...d, ...patch } : d));
	};
	const save = async (keys: (keyof Draft)[]) => {
		if (!draft) return;
		const body: any = Object.fromEntries(keys.map(k => [k, draft[k]]));
		if (body.redirects) body.redirects = body.redirects.filter((r: any) => r.from?.trim() || r.to?.trim());
		if (body.headers) body.headers = body.headers.filter((h: any) => h.name?.trim() || h.value?.trim());
		if (body.domains) body.domains = body.domains.map((d: string) => d.trim()).filter(Boolean);
		const res: any = await update(body);
		if ('data' in res) setSaved(true);
	};
	const bar = (keys: (keyof Draft)[], disabled = !canBuild) => (
		<SaveBar
			dirty={sectionDirty(keys)}
			saving={saving}
			error={error}
			saved={saved}
			disabled={disabled}
			onSave={() => save(keys)}
			onReset={() => original && setDraft(d => (d ? { ...d, ...Object.fromEntries(keys.map(k => [k, original[k]])) } : d))}
		/>
	);

	const body = () => {
		if (tab === 'general') return <General />;
		if (isError) return <Text color='red.fg'>Only website projects have a site setup.</Text>;
		if (isLoading || !draft) return <Skeleton h='320px' />;
		const t = draft.tracking;
		switch (tab) {
			case 'tracking':
				return (
					<Panel
						title='Tracking'
						subtitle='Paste the IDs — the tags are added to every page of your site by its analytics script, no code change.'
						actions={<GuideLink section='tracking' />}>
						<Flex
							direction='column'
							gap={5}>
							<Toggle
								label='MINT analytics'
								help='Counts visits for the Analytics page. Cookie-free.'
								checked={t.mintAnalytics}
								onChange={v => change({ tracking: { ...t, mintAnalytics: v } })}
							/>
							<Grid
								templateColumns={{ base: '1fr', md: '1fr 1fr' }}
								gap={4}>
								{TRACKERS.map(k => (
									<Field
										key={k.key}
										label={k.label}
										help={k.help}>
										<Input
											size='sm'
											fontFamily='mono'
											fontSize='12.5px'
											placeholder={k.placeholder}
											value={String(t[k.key] || '')}
											onChange={e => change({ tracking: { ...t, [k.key]: e.target.value.trim() } })}
										/>
									</Field>
								))}
							</Grid>
						</Flex>
						{bar(['tracking'])}
					</Panel>
				);
			case 'code':
				return (
					<Panel
						title='Code'
						subtitle='HTML added to every page — chat widgets, other tags, verification snippets. Scripts run.'
						actions={<GuideLink section='site-code' />}>
						<Flex
							direction='column'
							gap={4}>
							<Code
								label='In <head>'
								help='Meta tags, styles, scripts that must load first.'
								value={draft.code.head}
								onChange={v => change({ code: { ...draft.code, head: v } })}
							/>
							<Code
								label='At the start of <body>'
								help='e.g. a noscript fallback.'
								value={draft.code.bodyStart}
								onChange={v => change({ code: { ...draft.code, bodyStart: v } })}
							/>
							<Code
								label='At the end of <body>'
								help='Chat widgets and scripts that can wait.'
								value={draft.code.bodyEnd}
								onChange={v => change({ code: { ...draft.code, bodyEnd: v } })}
							/>
							<Text
								fontSize='12px'
								color='fg.muted'>
								Only add code you trust: it runs on your site with full access to the page.
							</Text>
						</Flex>
						{bar(['code'])}
					</Panel>
				);
			case 'seo':
				return (
					<Panel
						title='SEO & indexing'
						subtitle='How search engines see the whole site. Each page’s own title and description are in SEO.'
						actions={<GuideLink section='indexing' />}>
						<Flex
							direction='column'
							gap={5}>
							<Toggle
								label='Let search engines index the site'
								help='Off while you build: robots.txt then asks every search engine to stay away.'
								checked={draft.seo.indexing}
								onChange={v => change({ seo: { ...draft.seo, indexing: v } })}
							/>
							<Toggle
								label='Sitemap'
								help='A sitemap.xml of your published pages, named in robots.txt. Pages marked “Hide from search engines” are left out.'
								checked={draft.seo.sitemap}
								onChange={v => change({ seo: { ...draft.seo, sitemap: v } })}
							/>
							<Grid
								templateColumns={{ base: '1fr', md: '1fr 1fr' }}
								gap={4}>
								<Field
									label='Main domain'
									help='The address search engines should use, e.g. example.com.'>
									<Input
										size='sm'
										placeholder={draft.domains[0] || 'example.com'}
										value={draft.seo.canonicalDomain}
										onChange={e => change({ seo: { ...draft.seo, canonicalDomain: e.target.value.trim() } })}
									/>
								</Field>
								<Box />
								<Field
									label='Google Search Console'
									help='The content of the google-site-verification meta tag.'>
									<Input
										size='sm'
										fontFamily='mono'
										fontSize='12.5px'
										value={draft.seo.googleVerification}
										onChange={e => change({ seo: { ...draft.seo, googleVerification: e.target.value.trim() } })}
									/>
								</Field>
								<Field
									label='Bing Webmaster Tools'
									help='The content of the msvalidate.01 meta tag.'>
									<Input
										size='sm'
										fontFamily='mono'
										fontSize='12.5px'
										value={draft.seo.bingVerification}
										onChange={e => change({ seo: { ...draft.seo, bingVerification: e.target.value.trim() } })}
									/>
								</Field>
							</Grid>
							<Code
								label='Extra robots.txt rules'
								help='Added after the defaults, e.g. “Disallow: /private”.'
								value={draft.seo.robots}
								onChange={v => change({ seo: { ...draft.seo, robots: v } })}
							/>
							{base && (
								<Grid
									templateColumns={{ base: '1fr', md: '1fr 1fr' }}
									gap={4}>
									<Field label='robots.txt'>
										<CopyValue value={`${base}/site/robots.txt`} />
									</Field>
									<Field label='sitemap.xml'>
										<CopyValue value={`${base}/site/sitemap.xml`} />
									</Field>
								</Grid>
							)}
						</Flex>
						{bar(['seo'])}
					</Panel>
				);
			case 'redirects':
				return (
					<Flex
						direction='column'
						gap={4}>
						<Panel
							title='Redirects'
							subtitle='Send old addresses to new ones. Your site applies them from the site API.'
							actions={<GuideLink section='redirects' />}>
							<Rows
								rows={draft.redirects}
								onChange={redirects => change({ redirects })}
								blank={{ from: '', to: '', permanent: true }}
								columns={[
									{ key: 'from', placeholder: '/old-page', mono: true },
									{ key: 'to', placeholder: '/new-page or https://…', mono: true },
								]}
								extra={(row, set) => (
									<Button
										size='xs'
										variant='outline'
										flexShrink={0}
										onClick={() => set({ permanent: !row.permanent })}
										title='Permanent (301) tells search engines the page moved for good; temporary is 302'>
										{row.permanent ? '301 permanent' : '302 temporary'}
									</Button>
								)}
								addLabel='Add redirect'
								empty='No redirects.'
							/>
							{bar(['redirects'])}
						</Panel>
						<Panel
							title='Response headers'
							subtitle='Headers your site sends with its pages — security headers, caching.'>
							<Rows
								rows={draft.headers}
								onChange={headers => change({ headers })}
								blank={{ source: '/(.*)', name: '', value: '' }}
								columns={[
									{ key: 'source', placeholder: '/(.*)', width: '140px', mono: true },
									{ key: 'name', placeholder: 'X-Frame-Options', width: '220px', mono: true },
									{ key: 'value', placeholder: 'DENY', mono: true },
								]}
								addLabel='Add header'
								empty='No extra headers.'
							/>
							{bar(['headers'])}
						</Panel>
					</Flex>
				);
			case 'domains':
				return (
					<Panel
						title='Domains'
						subtitle='Where your site is live. Analytics only counts visits from these (and localhost while you build).'
						actions={<GuideLink section='site-domains' />}>
						<Rows
							rows={draft.domains.map(d => ({ domain: d }))}
							onChange={rows => change({ domains: rows.map(r => r.domain) })}
							blank={{ domain: '' }}
							columns={[{ key: 'domain', placeholder: 'example.com' }]}
							addLabel='Add domain'
							empty='No domains yet — visits from any site are counted.'
						/>
						{!canDomains && (
							<Text
								fontSize='12px'
								color='fg.muted'
								mt={2}>
								Changing domains needs the Manage projects permission.
							</Text>
						)}
						{bar(['domains'], !canDomains)}
					</Panel>
				);
		}
		return null;
	};

	return (
		<Layout
			title='Site setup'
			path='site-setup'>
			<Flex
				direction='column'
				gap={4}
				pt={2}>
				<Flex
					align='center'
					justify='space-between'
					gap={3}
					wrap='wrap'>
					<Box>
						<Text
							fontSize='18px'
							fontWeight='600'>
							Site setup
						</Text>
						<Text
							fontSize='12.5px'
							color='fg.muted'>
							Everything your website needs besides its pages — managed here, live on the site within a minute.
						</Text>
					</Box>
					<Flex
						gap={3}
						align='center'>
						<GuideLink section='site-setup' />
						<Button
							asChild
							size='xs'
							variant='outline'>
							<NextLink href={pagePath('pages')}>
								Pages
								<ExternalLink size={12} />
							</NextLink>
						</Button>
					</Flex>
				</Flex>
				<ConsoleTabs
					tabs={TABS}
					value={tab}
					onChange={v => {
						setSaved(false);
						reset();
						router.replace(`?tab=${v}`, { scroll: false });
					}}>
					{TABS.map(t => (
						<Tabs.Content
							key={t.value}
							value={t.value}
							pt={4}>
							{t.value === tab ? body() : null}
						</Tabs.Content>
					))}
				</ConsoleTabs>
			</Flex>
		</Layout>
	);
}

// useSearchParams (the ?tab=) needs a Suspense boundary to prerender.
export default function SiteSetupPage() {
	return (
		<Suspense>
			<SiteSetup />
		</Suspense>
	);
}
