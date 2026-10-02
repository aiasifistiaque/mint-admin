'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge, Box, Button, Center, Flex, Grid, Input, Skeleton, Text, Textarea } from '@chakra-ui/react';
import { Bot, Boxes, Check, Filter, ListChecks, Package, ReceiptText, Sparkles } from 'lucide-react';
import {
	Layout,
	VColor,
	VImage,
	useBuildStarterMutation,
	useGetAllQuery,
	useGetStartersQuery,
	usePostMutation,
	useUpdateByIdMutation,
	useUpdateSiteConfigMutation,
} from '@/components/library';
import { Panel } from '@/components/library/cl';
import { pagePath, projectHref } from '@/components/library/config/lib/constants/panel';
import { useWorkspace } from '@/components/library/tenant';
import GuideLink from '@/components/library/tenant/GuideLink';

/**
 * A new project's first stop (WO-35), opened right after it's created:
 * an app picks a starter template, the model wizard or its own AI; a website
 * gets its name, logo, favicon and colour, a home page, and (optionally) its
 * domain and Google Analytics — then the overview takes over. Skippable;
 * everything it makes is ordinary and changes later in the usual places.
 */

const errorText = (e: any) => e?.data?.message || e?.data?.problems?.[0] || 'Something went wrong — try again.';
const idOf = (res: any) => res?.data?.doc?._id || res?.data?._id;
const imageValue = (v: any) => (typeof v === 'string' ? v : v?.url || '');

const STARTER_ICONS: Record<string, any> = { 'receipt-text': ReceiptText, 'list-checks': ListChecks, funnel: Filter, package: Package };

const Shell: FC<{ title: string; lead: string; children: ReactNode }> = ({ title, lead, children }) => (
	<Layout
		title='Get started'
		path='get-started'>
		<Flex
			direction='column'
			gap={5}
			maxW='860px'
			mx='auto'
			w='full'
			py={4}>
			<Box>
				<Text
					fontSize='22px'
					fontWeight='600'>
					{title}
				</Text>
				<Text
					fontSize='13.5px'
					color='fg.muted'
					mt={1}>
					{lead}
				</Text>
			</Box>
			{children}
			<Flex justify='center'>
				<Button
					asChild
					size='sm'
					variant='ghost'
					color='fg.muted'>
					<NextLink href={projectHref('/dashboard')}>Skip for now — go to the dashboard</NextLink>
				</Button>
			</Flex>
		</Flex>
	</Layout>
);

/* ---------------------------------------------------------------- app */

const Choice: FC<{ icon: any; title: string; text: string; href: string; cta: string }> = ({ icon: Icon, title, text, href, cta }) => (
	<Panel>
		<Flex
			direction='column'
			gap={3}
			h='full'>
			<Center
				boxSize='36px'
				borderRadius='md'
				bg='bg.muted'
				color='fg.muted'>
				<Icon size={18} />
			</Center>
			<Box flex={1}>
				<Text
					fontSize='14px'
					fontWeight='600'>
					{title}
				</Text>
				<Text
					fontSize='12.5px'
					color='fg.muted'
					mt={1}>
					{text}
				</Text>
			</Box>
			<Box>
				<Button
					asChild
					size='sm'
					variant='outline'>
					<NextLink href={href}>{cta}</NextLink>
				</Button>
			</Box>
		</Flex>
	</Panel>
);

const AppStart: FC<{ name: string }> = ({ name }) => {
	const router = useRouter();
	const { data, isLoading } = useGetStartersQuery();
	const [build, { isLoading: building, error, originalArgs }] = useBuildStarterMutation();

	const use = async (key: string) => {
		const res: any = await build(key);
		const first = res?.data?.created?.[0]?.route;
		if (first) router.push(pagePath(first));
	};

	return (
		<Shell
			title={`Set up ${name}`}
			lead='Start with the records you’ll keep. Pick a template, build your first model step by step, or describe it to your AI.'>
			<Panel
				title='Start from a template'
				subtitle='Ready-made models you can change afterwards — fields, pages and all.'
				actions={<GuideLink section='projects' />}>
				{isLoading ? (
					<Skeleton h='160px' />
				) : (
					<Grid
						templateColumns={{ base: '1fr', md: '1fr 1fr' }}
						gap={3}>
						{(data?.doc || []).map(s => {
							const Icon = STARTER_ICONS[s.icon] || Boxes;
							const busy = building && originalArgs === s.key;
							return (
								<Flex
									key={s.key}
									direction='column'
									gap={2}
									p={4}
									borderWidth='1px'
									borderColor='border.muted'
									borderRadius='md'>
									<Flex
										align='center'
										gap={2}>
										<Icon size={16} />
										<Text
											fontSize='14px'
											fontWeight='600'>
											{s.title}
										</Text>
									</Flex>
									<Text
										fontSize='12.5px'
										color='fg.muted'
										flex={1}>
										{s.description}
									</Text>
									<Flex
										align='center'
										gap={1.5}
										wrap='wrap'>
										{s.models.map(m => (
											<Badge
												key={m}
												size='sm'
												variant='subtle'>
												{m}
											</Badge>
										))}
										<Button
											ml='auto'
											size='xs'
											loading={busy}
											disabled={building && !busy}
											onClick={() => use(s.key)}>
											Use this
										</Button>
									</Flex>
								</Flex>
							);
						})}
					</Grid>
				)}
				{error && (
					<Text
						mt={3}
						fontSize='12.5px'
						color='red.fg'>
						{errorText(error)}
					</Text>
				)}
			</Panel>
			<Grid
				templateColumns={{ base: '1fr', md: '1fr 1fr' }}
				gap={4}>
				<Choice
					icon={Boxes}
					title='Build your first model'
					text='A step-by-step wizard: name it, add its fields, and its table, form and page are made for you.'
					href={projectHref('/model-builder/new')}
					cta='Build a model'
				/>
				<Choice
					icon={Bot}
					title='Describe it to your AI'
					text='Connect Claude, ChatGPT or another assistant, tell it what you need, and it builds the models with you.'
					href={projectHref('/model-builder/connect')}
					cta='Connect AI'
				/>
			</Grid>
		</Shell>
	);
};

/* ------------------------------------------------------------ website */

const STEPS = ['Your brand', 'Home page', 'Go live'];

const Steps: FC<{ step: number }> = ({ step }) => (
	<Flex
		gap={2}
		align='center'
		wrap='wrap'>
		{STEPS.map((label, i) => (
			<Flex
				key={label}
				align='center'
				gap={2}>
				<Center
					boxSize='22px'
					borderRadius='full'
					fontSize='11.5px'
					fontWeight='600'
					bg={i < step ? 'green.solid' : i === step ? 'fg' : 'bg.muted'}
					color={i <= step ? 'bg' : 'fg.muted'}>
					{i < step ? <Check size={12} /> : i + 1}
				</Center>
				<Text
					fontSize='13px'
					fontWeight={i === step ? '600' : '400'}
					color={i === step ? 'fg' : 'fg.muted'}>
					{label}
				</Text>
				{i < STEPS.length - 1 && (
					<Box
						w='24px'
						h='1px'
						bg='border'
					/>
				)}
			</Flex>
		))}
	</Flex>
);

const Label: FC<{ children: ReactNode; help?: string }> = ({ children, help }) => (
	<Box mb={1}>
		<Text
			fontSize='13px'
			fontWeight='600'>
			{children}
		</Text>
		{help && (
			<Text
				fontSize='12px'
				color='fg.muted'>
				{help}
			</Text>
		)}
	</Box>
);

const Footer: FC<{ onBack?: () => void; onNext: () => void; next: string; busy?: boolean; disabled?: boolean; error?: any; skip?: () => void }> = ({
	onBack,
	onNext,
	next,
	busy,
	disabled,
	error,
	skip,
}) => (
	<Flex
		align='center'
		gap={2}
		pt={4}
		mt={4}
		borderTopWidth='1px'
		borderColor='border.muted'>
		<Text
			flex={1}
			fontSize='12.5px'
			color='red.fg'>
			{error ? errorText(error) : ''}
		</Text>
		{onBack && (
			<Button
				size='sm'
				variant='ghost'
				onClick={onBack}>
				Back
			</Button>
		)}
		{skip && (
			<Button
				size='sm'
				variant='outline'
				onClick={skip}>
				Skip
			</Button>
		)}
		<Button
			size='sm'
			onClick={onNext}
			loading={busy}
			disabled={disabled}>
			{next}
		</Button>
	</Flex>
);

const WebsiteStart: FC<{ name: string }> = ({ name }) => {
	const { can } = useWorkspace();
	const [step, setStep] = useState(0);
	const { data: settingsList, isLoading: loadingSettings } = useGetAllQuery({ path: 'site-settings', limit: 1, sort: 'createdAt' });
	const { data: pageList } = useGetAllQuery({ path: 'pages', limit: 100 });
	const { data: seoList } = useGetAllQuery({ path: 'seo', limit: 100 });
	const { data: blockList } = useGetAllQuery({ path: 'web-contents', limit: 100 });
	const settings = settingsList?.doc?.[0] || null;
	const home = (pageList?.doc || []).find((p: any) => p.path === '/') || null;
	const [post, posting] = usePostMutation();
	const [update, updating] = useUpdateByIdMutation();
	const [saveConfig, configuring] = useUpdateSiteConfigMutation();
	const [failure, setFailure] = useState<any>(null);

	const [brand, setBrand] = useState({ siteName: name, logo: '', favicon: '', primaryColor: '#111827' });
	useEffect(() => {
		if (settings) setBrand(b => ({ siteName: settings.siteName || b.siteName, logo: settings.logo || '', favicon: settings.favicon || '', primaryColor: settings.primaryColor || b.primaryColor }));
	}, [settings?._id]);
	const [hero, setHero] = useState({ headline: '', intro: '', btnText: '', url: '', description: '' });
	const [live, setLive] = useState({ domain: '', ga4: '' });
	const busy = posting.isLoading || updating.isLoading || configuring.isLoading;

	const fail = (res: any) => {
		if ('error' in res) {
			setFailure(res.error);
			return true;
		}
		return false;
	};

	const saveBrand = async () => {
		setFailure(null);
		const body = { ...brand, metaTitle: settings?.metaTitle || brand.siteName };
		const res: any = settings ? await update({ path: 'site-settings', id: settings._id, body }) : await post({ path: 'site-settings', body });
		if (!fail(res)) setStep(1);
	};

	const saveHome = async () => {
		setFailure(null);
		const pageBody = { name: 'Home', path: '/', status: 'published', template: 'home', showInMenu: true };
		let pageId = home?._id;
		if (!pageId) {
			const res: any = await post({ path: 'pages', body: pageBody });
			if (fail(res)) return;
			pageId = idOf(res);
		}
		// One SEO record and one hero block per page: updated if they're there, made if not.
		const refId = (v: any) => (typeof v === 'object' ? v?._id : v);
		const seoBody = { page: pageId, title: brand.siteName || name, description: hero.description || hero.intro || brand.siteName || name };
		const oldSeo = (seoList?.doc || []).find((x: any) => refId(x.page) === pageId);
		const seo: any = oldSeo ? await update({ path: 'seo', id: oldSeo._id, body: seoBody }) : await post({ path: 'seo', body: seoBody });
		if (fail(seo)) return;
		if (hero.headline.trim()) {
			const blockBody = {
				name: 'Home — hero',
				page: pageId,
				slug: 'hero',
				section: 'hero',
				category: 'content',
				content: hero.headline,
				subContent: hero.intro,
				btnText: hero.btnText,
				url: hero.url,
				priority: 100,
			};
			const oldBlock = (blockList?.doc || []).find((b: any) => refId(b.page) === pageId && b.slug === 'hero');
			const block: any = oldBlock ? await update({ path: 'web-contents', id: oldBlock._id, body: blockBody }) : await post({ path: 'web-contents', body: blockBody });
			if (fail(block)) return;
		}
		setStep(2);
	};

	const saveLive = async () => {
		setFailure(null);
		const body: any = {};
		if (live.ga4.trim()) body.tracking = { ga4: live.ga4.trim() };
		if (live.domain.trim() && can('manage-projects')) body.domains = [live.domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')];
		if (Object.keys(body).length) {
			const res: any = await saveConfig(body);
			if (fail(res)) return;
		}
		setStep(3);
	};

	if (step === 3)
		return (
			<Shell
				title='Your website is set up'
				lead='Its brand and home page are in place. Build the rest of the site — or let your AI build it from here.'>
				<Grid
					templateColumns={{ base: '1fr', md: '1fr 1fr' }}
					gap={4}>
					<Choice
						icon={Sparkles}
						title='Build the site with AI'
						text='Connect Claude Code or another assistant: it writes the site and fills its pages, images and lists here, so you edit it all from this panel.'
						href={projectHref('/model-builder/connect')}
						cta='Connect AI'
					/>
					<Choice
						icon={Boxes}
						title='Your website’s home'
						text='Traffic, what’s left to set up, and your pages — tags, SEO and domains are in Site setup.'
						href={projectHref('/dashboard')}
						cta='Open the overview'
					/>
				</Grid>
			</Shell>
		);

	return (
		<Shell
			title={`Set up ${name}`}
			lead='Three short steps: how your site looks, its home page, and where it goes live. Everything changes later in Site setup and Pages.'>
			<Steps step={step} />
			{step === 0 && (
				<Panel
					title='Your brand'
					subtitle='The name, logo and favicon your site shows.'
					actions={<GuideLink section='site-general' />}>
					{loadingSettings ? (
						<Skeleton h='200px' />
					) : (
						<Grid
							templateColumns={{ base: '1fr', md: '1fr 1fr' }}
							gap={4}>
							<Box>
								<Label>Site name</Label>
								<Input
									size='sm'
									value={brand.siteName}
									onChange={e => setBrand({ ...brand, siteName: e.target.value })}
								/>
							</Box>
							<VColor
								label='Main colour'
								name='primaryColor'
								value={brand.primaryColor}
								onChange={(e: any) => setBrand({ ...brand, primaryColor: e.target.value })}
							/>
							<VImage
								label='Logo'
								value={brand.logo}
								onChange={(v: any) => setBrand({ ...brand, logo: imageValue(v) })}
								folder='website'
							/>
							<VImage
								label='Favicon'
								helper='A square image — 512×512 works everywhere'
								value={brand.favicon}
								onChange={(v: any) => setBrand({ ...brand, favicon: imageValue(v) })}
								folder='website'
							/>
						</Grid>
					)}
					<Footer
						onNext={saveBrand}
						next='Next'
						busy={busy}
						disabled={!brand.siteName.trim()}
						error={failure}
					/>
				</Panel>
			)}
			{step === 1 && (
				<Panel
					title='Home page'
					subtitle={home ? 'Your home page exists — this adds its opening section and SEO.' : 'Your site’s first page, published at /.'}
					actions={<GuideLink section='build-a-page' />}>
					<Flex
						direction='column'
						gap={4}>
						<Box>
							<Label help='The first thing visitors read.'>Headline</Label>
							<Input
								size='sm'
								placeholder='Fresh bread, every morning'
								value={hero.headline}
								onChange={e => setHero({ ...hero, headline: e.target.value })}
							/>
						</Box>
						<Box>
							<Label>Introduction</Label>
							<Textarea
								size='sm'
								rows={3}
								placeholder='A sentence or two about what you do.'
								value={hero.intro}
								onChange={e => setHero({ ...hero, intro: e.target.value })}
							/>
						</Box>
						<Grid
							templateColumns={{ base: '1fr', md: '1fr 1fr' }}
							gap={4}>
							<Box>
								<Label>Button text</Label>
								<Input
									size='sm'
									placeholder='Contact us'
									value={hero.btnText}
									onChange={e => setHero({ ...hero, btnText: e.target.value })}
								/>
							</Box>
							<Box>
								<Label>Button link</Label>
								<Input
									size='sm'
									placeholder='/contact'
									value={hero.url}
									onChange={e => setHero({ ...hero, url: e.target.value })}
								/>
							</Box>
						</Grid>
						<Box>
							<Label help='What search engines show under your site’s name — about 160 characters.'>Search description</Label>
							<Textarea
								size='sm'
								rows={2}
								value={hero.description}
								onChange={e => setHero({ ...hero, description: e.target.value })}
							/>
						</Box>
					</Flex>
					<Footer
						onBack={() => setStep(0)}
						onNext={saveHome}
						next='Next'
						busy={busy}
						error={failure}
						skip={() => setStep(2)}
					/>
				</Panel>
			)}
			{step === 2 && (
				<Panel
					title='Go live'
					subtitle='Optional — both can be added later in Site setup.'
					actions={<GuideLink section='site-domains' />}>
					<Grid
						templateColumns={{ base: '1fr', md: '1fr 1fr' }}
						gap={4}>
						<Box>
							<Label help={can('manage-projects') ? 'Where the site will live. Analytics only counts visits from it.' : 'Setting the domain needs Manage projects.'}>Domain</Label>
							<Input
								size='sm'
								placeholder='example.com'
								disabled={!can('manage-projects')}
								value={live.domain}
								onChange={e => setLive({ ...live, domain: e.target.value })}
							/>
						</Box>
						<Box>
							<Label help='Admin → Data streams → Measurement ID.'>Google Analytics 4</Label>
							<Input
								size='sm'
								fontFamily='mono'
								placeholder='G-XXXXXXXXXX'
								value={live.ga4}
								onChange={e => setLive({ ...live, ga4: e.target.value })}
							/>
						</Box>
					</Grid>
					<Footer
						onBack={() => setStep(1)}
						onNext={saveLive}
						next='Finish'
						busy={busy}
						error={failure}
					/>
				</Panel>
			)}
		</Shell>
	);
};

/* --------------------------------------------------------------- page */

export default function GetStartedPage() {
	const { project, can, isLoading } = useWorkspace();
	if (isLoading || !project)
		return (
			<Layout
				title='Get started'
				path='get-started'>
				<Skeleton
					h='320px'
					mt={4}
				/>
			</Layout>
		);
	if (!can('build'))
		return (
			<Shell
				title={`Welcome to ${project.name}`}
				lead='Setting up a project needs the Build permission — ask whoever runs your organization, or carry on to the dashboard.'>
				<Box />
			</Shell>
		);
	return project.type === 'website' ? <WebsiteStart name={project.name} /> : <AppStart name={project.name} />;
}
