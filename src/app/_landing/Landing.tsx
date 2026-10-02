'use client';

import { FC, ReactNode } from 'react';
import NextLink from 'next/link';
import { Badge, Box, Button, Flex, Grid, Link, Text } from '@chakra-ui/react';
import {
	ArrowRight,
	Boxes,
	Building2,
	Check,
	FolderKanban,
	Globe,
	History,
	Images,
	KeyRound,
	LayoutDashboard,
	LayoutTemplate,
	Plug,
	ShieldCheck,
	UserRound,
	Users,
	Webhook,
} from 'lucide-react';
import { useAuth } from '@/components/library';
import Footer from '@/components/library/nav/Footer';
import { API_ORIGIN, HOME } from '@/components/library/config/lib/constants/panel';
import { CodeBlock } from '../docs/_components/prose';

/**
 * The tenant panel's landing page (/): what MINT is, and the way in — sign up
 * or sign in, or straight to the dashboard (HOME) when already signed in.
 * Public, so no admin layout. One page for now; every section links to the
 * user guide (/user-docs) that covers it.
 */

const MAX_W = '1120px';
const PX = { base: 4, md: 8 };

const NAV = [
	{ href: '#features', label: 'Features' },
	{ href: '#how', label: 'How it works' },
	{ href: '#teams', label: 'Teams' },
	{ href: '#developers', label: 'Developers' },
	{ href: '/user-docs', label: 'Guides' },
];

const FEATURES = [
	{
		icon: Boxes,
		title: 'Models',
		body: 'Describe what you keep track of — customers, orders, bookings. Each gets a table, a form, filters and a page per record.',
		href: '/user-docs/models',
	},
	{
		icon: LayoutTemplate,
		title: 'Pages',
		body: 'Choose the columns, lay out the forms and detail pages, add filters, bulk actions, import and export.',
		href: '/user-docs/pages',
	},
	{
		icon: LayoutDashboard,
		title: 'Dashboard',
		body: 'Numbers, charts and recent records from your models on the home page — arranged how you like.',
		href: '/user-docs/dashboard',
	},
	{
		icon: Images,
		title: 'Media',
		body: 'A drive for images and files, kept per project or shared across your organization.',
		href: '/user-docs/media',
	},
	{
		icon: Webhook,
		title: 'Public API',
		body: 'Open any model to your own website or mobile app — list, read, create — with no server to run.',
		href: '/user-docs/public-api',
	},
	{
		icon: UserRound,
		title: 'Customer sign-in',
		body: 'Drop a sign-in widget on your site. Your customers get accounts, and see only their own records.',
		href: '/user-docs/customers',
	},
	{
		icon: Globe,
		title: 'Websites',
		body: 'Start a website project with pages, SEO and content blocks ready — and analytics for its visitors.',
		href: '/user-docs/websites',
	},
	{
		icon: Plug,
		title: 'Connect your AI',
		body: 'Let Claude, ChatGPT and others plan and build models in your project from a conversation.',
		href: '/user-docs/connect-ai',
	},
];

const STEPS = [
	{ title: 'Create a project', body: 'An app for your data, or a website. Each project is a workspace of its own.' },
	{ title: 'Build your models', body: 'Add fields step by step, or ask your AI. The pages appear as soon as you save.' },
	{ title: 'Bring in your team', body: 'Invite people by email, pick their role and the projects they work in.' },
	{ title: 'Go live', body: 'Open models to your site or app, with sign-in for your customers.' },
];

const USE_CASES = ['CRM', 'Bookings', 'Inventory', 'Orders', 'Invoices', 'Support desk', 'Company website', 'Mobile app back end'];

const TEAM_POINTS = [
	{ icon: Building2, text: 'An organization for your company, with as many projects as you need.' },
	{ icon: Users, text: 'Roles with plain permissions — view, add, edit, delete — plus building and managing.' },
	{ icon: FolderKanban, text: 'Give each person every project, or only the ones they work on.' },
	{ icon: Check, text: 'Belong to several organizations and switch between them in a click.' },
];

const SECURITY_POINTS = [
	{ icon: ShieldCheck, text: 'Two-step sign-in with email codes or passkeys.' },
	{ icon: KeyRound, text: 'See every signed-in device and sign any of them out.' },
	{ icon: History, text: 'Every change to a record is kept, with who made it and when.' },
];

/* ------------------------------------------------------------------ page */

const Landing = () => {
	const { isLoading, isLoggedIn } = useAuth();
	const signedIn = !isLoading && !!isLoggedIn;

	return (
		<Box
			minH='100vh'
			bg='bg'
			color='fg'
			display='flex'
			flexDirection='column'>
			<Header
				ready={!isLoading}
				signedIn={signedIn}
			/>
			<Box
				as='main'
				flex={1}>
				<Hero signedIn={signedIn} />
				<Features />
				<HowItWorks />
				<Teams />
				<Developers />
				<FinalCta signedIn={signedIn} />
			</Box>
			<Footer />
		</Box>
	);
};

/* ---------------------------------------------------------------- pieces */

const Container: FC<{ children: ReactNode }> = ({ children }) => (
	<Box
		maxW={MAX_W}
		mx='auto'
		px={PX}>
		{children}
	</Box>
);

const Section: FC<{ id?: string; eyebrow: string; title: string; lead?: string; muted?: boolean; children: ReactNode }> = ({
	id,
	eyebrow,
	title,
	lead,
	muted,
	children,
}) => (
	<Box
		as='section'
		id={id}
		scrollMarginTop='56px'
		py={{ base: 14, md: 20 }}
		bg={muted ? 'bg.subtle' : 'bg'}
		borderTopWidth='1px'
		borderColor='border.muted'>
		<Container>
			<Box
				maxW='640px'
				mb={{ base: 8, md: 10 }}>
				<Text
					fontSize='13px'
					fontWeight='600'
					color='fg.muted'
					mb={2}>
					{eyebrow}
				</Text>
				<Text
					as='h2'
					fontSize={{ base: '2xl', md: '3xl' }}
					fontWeight='600'
					letterSpacing='-0.02em'
					lineHeight='1.2'>
					{title}
				</Text>
				{lead && (
					<Text
						mt={3}
						fontSize='md'
						color='fg.muted'
						lineHeight='1.7'>
						{lead}
					</Text>
				)}
			</Box>
			{children}
		</Container>
	</Box>
);

const AuthButtons: FC<{ signedIn: boolean; size?: 'sm' | 'md' | 'lg' }> = ({ signedIn, size = 'md' }) =>
	signedIn ? (
		<Button
			asChild
			size={size}>
			<NextLink href={HOME}>
				Go to your dashboard
				<ArrowRight size={16} />
			</NextLink>
		</Button>
	) : (
		<>
			<Button
				asChild
				size={size}>
				<NextLink href='/auth/register'>
					Create your account
					<ArrowRight size={16} />
				</NextLink>
			</Button>
			<Button
				asChild
				size={size}
				variant='outline'>
				<NextLink href='/user-docs/getting-started'>Read the guides</NextLink>
			</Button>
		</>
	);

/* ---------------------------------------------------------------- header */

const Header: FC<{ ready: boolean; signedIn: boolean }> = ({ ready, signedIn }) => (
	<Box
		as='header'
		position='sticky'
		top={0}
		zIndex={10}
		bg='bg'
		borderBottomWidth='1px'
		borderColor='border.muted'>
		<Flex
			maxW={MAX_W}
			mx='auto'
			px={PX}
			h='56px'
			align='center'
			gap={6}>
			<Link
				asChild
				fontWeight='700'
				fontSize='16px'
				letterSpacing='-0.01em'
				color='fg'
				_hover={{ textDecoration: 'none' }}>
				<NextLink href='/'>MINT</NextLink>
			</Link>
			<Flex
				as='nav'
				gap={1}
				flex={1}
				display={{ base: 'none', md: 'flex' }}>
				{NAV.map(n => (
					<Link
						key={n.href}
						asChild
						px={2.5}
						py={1.5}
						borderRadius='md'
						fontSize='13px'
						color='fg.muted'
						_hover={{ color: 'fg', bg: 'bg.muted', textDecoration: 'none' }}>
						<NextLink href={n.href}>{n.label}</NextLink>
					</Link>
				))}
			</Flex>
			<Flex
				gap={2}
				ml='auto'
				align='center'
				// Hidden until the stored session is read, so the buttons don't swap after a flash.
				visibility={ready ? 'visible' : 'hidden'}>
				{signedIn ? (
					<Button
						asChild
						size='sm'>
						<NextLink href={HOME}>
							<LayoutDashboard size={14} />
							Dashboard
						</NextLink>
					</Button>
				) : (
					<>
						<Button
							asChild
							size='sm'
							variant='ghost'>
							<NextLink href='/auth/login'>Sign in</NextLink>
						</Button>
						<Button
							asChild
							size='sm'>
							<NextLink href='/auth/register'>Sign up</NextLink>
						</Button>
					</>
				)}
			</Flex>
		</Flex>
	</Box>
);

/* ------------------------------------------------------------------ hero */

const Hero: FC<{ signedIn: boolean }> = ({ signedIn }) => (
	<Box
		pt={{ base: 12, md: 20 }}
		pb={{ base: 14, md: 20 }}>
		<Container>
			<Grid
				templateColumns={{ base: '1fr', lg: '1fr 1.1fr' }}
				gap={{ base: 10, lg: 12 }}
				alignItems='center'>
				<Box>
					<Badge
						variant='outline'
						size='lg'
						borderRadius='full'
						px={3}
						mb={5}>
						Apps and websites, without the build
					</Badge>
					<Text
						as='h1'
						fontSize={{ base: '3xl', md: '5xl' }}
						fontWeight='650'
						letterSpacing='-0.03em'
						lineHeight='1.08'
						mb={5}>
						Describe your business. Get the app that runs it.
					</Text>
					<Text
						fontSize={{ base: 'md', md: 'lg' }}
						color='fg.muted'
						lineHeight='1.7'
						mb={8}
						maxW='520px'>
						MINT turns the things you keep track of into a ready panel — tables, forms, dashboards — for your whole team. Then
						open it to your own website or app, with sign-in for your customers. Nothing to code, nothing to deploy.
					</Text>
					<Flex
						gap={3}
						wrap='wrap'>
						<AuthButtons
							signedIn={signedIn}
							size='lg'
						/>
					</Flex>
				</Box>
				<PanelPreview />
			</Grid>
		</Container>
	</Box>
);

/** A drawing of the panel — a bookings table — made of the theme's own tokens. */
const ROWS = [
	{ guest: 'Amira Khan', date: 'Oct 4', guests: 2, status: 'Confirmed', tone: 'green' },
	{ guest: 'Leo Martins', date: 'Oct 5', guests: 4, status: 'Pending', tone: 'orange' },
	{ guest: 'Sara Ito', date: 'Oct 5', guests: 1, status: 'Confirmed', tone: 'green' },
	{ guest: 'Noah Berg', date: 'Oct 7', guests: 3, status: 'Cancelled', tone: 'red' },
	{ guest: 'Priya Das', date: 'Oct 8', guests: 2, status: 'Pending', tone: 'orange' },
];

const SIDEBAR = [
	{ icon: LayoutDashboard, label: 'Home' },
	{ icon: Boxes, label: 'Bookings', active: true },
	{ icon: Users, label: 'Guests' },
	{ icon: Building2, label: 'Rooms' },
];

const PanelPreview = () => (
	<Box
		aria-hidden
		borderWidth='1px'
		borderColor='border'
		borderRadius='xl'
		bg='bg.panel'
		shadow='lg'
		overflow='hidden'
		fontSize='12px'>
		<Flex
			h='32px'
			align='center'
			gap={1.5}
			px={3}
			bg='bg.subtle'
			borderBottomWidth='1px'
			borderColor='border.muted'>
			{[0, 1, 2].map(i => (
				<Box
					key={i}
					boxSize='9px'
					borderRadius='full'
					bg='bg.emphasized'
				/>
			))}
		</Flex>
		<Flex minH='280px'>
			<Box
				w='150px'
				flexShrink={0}
				display={{ base: 'none', sm: 'block' }}
				p={3}
				bg='bg.subtle'
				borderRightWidth='1px'
				borderColor='border.muted'>
				<Text
					fontWeight='600'
					mb={3}
					px={2}>
					Seaside Inn
				</Text>
				{SIDEBAR.map(({ icon: Icon, label, active }) => (
					<Flex
						key={label}
						align='center'
						gap={2}
						px={2}
						py={1.5}
						borderRadius='md'
						bg={active ? 'bg.muted' : undefined}
						color={active ? 'fg' : 'fg.muted'}
						fontWeight={active ? '500' : '400'}>
						<Icon size={13} />
						{label}
					</Flex>
				))}
			</Box>
			<Box
				flex={1}
				minW={0}
				p={4}>
				<Flex
					align='center'
					justify='space-between'
					mb={3}>
					<Text
						fontSize='14px'
						fontWeight='600'>
						Bookings
					</Text>
					<Box
						px={2.5}
						py={1}
						borderRadius='md'
						bg='bg.inverted'
						color='fg.inverted'
						fontWeight='500'>
						Add booking
					</Box>
				</Flex>
				<Flex
					gap={1.5}
					mb={3}>
					{['Status', 'Date', 'Room'].map(f => (
						<Box
							key={f}
							px={2}
							py={0.5}
							borderWidth='1px'
							borderColor='border'
							borderStyle='dashed'
							borderRadius='full'
							color='fg.muted'>
							{f}
						</Box>
					))}
				</Flex>
				<Box
					borderWidth='1px'
					borderColor='border.muted'
					borderRadius='md'
					overflow='hidden'>
					<Grid
						templateColumns='1.5fr 0.9fr 0.8fr 1.1fr'
						gap={2}
						px={3}
						py={2}
						bg='bg.subtle'
						color='fg.muted'
						fontWeight='500'>
						<Text>Guest</Text>
						<Text>Date</Text>
						<Text>Guests</Text>
						<Text>Status</Text>
					</Grid>
					{ROWS.map(r => (
						<Grid
							key={r.guest}
							templateColumns='1.5fr 0.9fr 0.8fr 1.1fr'
							gap={2}
							alignItems='center'
							px={3}
							py={2}
							borderTopWidth='1px'
							borderColor='border.muted'>
							<Text
								truncate
								fontWeight='500'>
								{r.guest}
							</Text>
							<Text color='fg.muted'>{r.date}</Text>
							<Text color='fg.muted'>{r.guests}</Text>
							<Box>
								<Badge
									size='sm'
									colorPalette={r.tone}>
									{r.status}
								</Badge>
							</Box>
						</Grid>
					))}
				</Box>
			</Box>
		</Flex>
	</Box>
);

/* -------------------------------------------------------------- sections */

const Features = () => (
	<Section
		id='features'
		eyebrow='Features'
		title='Everything a business panel needs, already built'
		lead='Start from your data, not from code. Each part below has a guide that walks through it.'>
		<Grid
			templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
			gap={4}>
			{FEATURES.map(({ icon: Icon, title, body, href }) => (
				<Link
					key={title}
					asChild
					display='flex'
					flexDirection='column'
					alignItems='flex-start'
					gap={2}
					p={5}
					borderWidth='1px'
					borderColor='border.muted'
					borderRadius='xl'
					bg='bg'
					color='fg'
					transition='border-color .15s ease'
					_hover={{ textDecoration: 'none', borderColor: 'border.emphasized' }}>
					<NextLink href={href}>
						<Flex
							boxSize='34px'
							align='center'
							justify='center'
							borderRadius='lg'
							bg='bg.muted'
							mb={1}>
							<Icon size={17} />
						</Flex>
						<Text
							fontSize='15px'
							fontWeight='600'>
							{title}
						</Text>
						<Text
							fontSize='13.5px'
							color='fg.muted'
							lineHeight='1.6'>
							{body}
						</Text>
					</NextLink>
				</Link>
			))}
		</Grid>
	</Section>
);

const HowItWorks = () => (
	<Section
		id='how'
		muted
		eyebrow='How it works'
		title='From sign-up to live in an afternoon'>
		<Grid
			templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
			gap={6}
			mb={12}>
			{STEPS.map((step, i) => (
				<Box key={step.title}>
					<Flex
						boxSize='28px'
						align='center'
						justify='center'
						borderRadius='full'
						bg='bg.inverted'
						color='fg.inverted'
						fontSize='13px'
						fontWeight='600'
						mb={3}>
						{i + 1}
					</Flex>
					<Text
						fontSize='15px'
						fontWeight='600'
						mb={1}>
						{step.title}
					</Text>
					<Text
						fontSize='14px'
						color='fg.muted'
						lineHeight='1.6'>
						{step.body}
					</Text>
				</Box>
			))}
		</Grid>
		<Text
			fontSize='13px'
			fontWeight='600'
			color='fg.muted'
			mb={3}>
			What people build
		</Text>
		<Flex
			gap={2}
			wrap='wrap'>
			{USE_CASES.map(u => (
				<Box
					key={u}
					px={3}
					py={1.5}
					borderWidth='1px'
					borderColor='border'
					borderRadius='full'
					bg='bg'
					fontSize='13px'>
					{u}
				</Box>
			))}
		</Flex>
	</Section>
);

const PointList: FC<{ title: string; points: { icon: any; text: string }[]; href: string; link: string }> = ({
	title,
	points,
	href,
	link,
}) => (
	<Box
		p={{ base: 5, md: 7 }}
		borderWidth='1px'
		borderColor='border.muted'
		borderRadius='xl'>
		<Text
			fontSize='16px'
			fontWeight='600'
			mb={5}>
			{title}
		</Text>
		<Flex
			direction='column'
			gap={4}
			mb={6}>
			{points.map(({ icon: Icon, text }) => (
				<Flex
					key={text}
					gap={3}
					align='flex-start'>
					<Flex
						boxSize='28px'
						flexShrink={0}
						align='center'
						justify='center'
						borderRadius='md'
						bg='bg.muted'>
						<Icon size={15} />
					</Flex>
					<Text
						fontSize='14px'
						lineHeight='1.6'
						pt='3px'>
						{text}
					</Text>
				</Flex>
			))}
		</Flex>
		<Link
			asChild
			fontSize='13px'
			fontWeight='500'
			color='fg.muted'
			_hover={{ color: 'fg' }}>
			<NextLink href={href}>
				{link}
				<ArrowRight size={13} />
			</NextLink>
		</Link>
	</Box>
);

const Teams = () => (
	<Section
		id='teams'
		eyebrow='Teams'
		title='Your whole team, each with the right access'
		lead='Invite people by email. Their role decides what they can do; their projects decide where.'>
		<Grid
			templateColumns={{ base: '1fr', md: '1fr 1fr' }}
			gap={4}>
			<PointList
				title='Organizations, roles and projects'
				points={TEAM_POINTS}
				href='/user-docs/organization'
				link='Your organization'
			/>
			<PointList
				title='Safe by default'
				points={SECURITY_POINTS}
				href='/user-docs/account'
				link='Your account and sign-in'
			/>
		</Grid>
	</Section>
);

const Developers = () => (
	<Section
		id='developers'
		muted
		eyebrow='Developers'
		title='Your data, on your own site or app'
		lead='Switch on the public API for a model and read it from anywhere — a website, a mobile app, a script. Customers can sign in with a drop-in widget and keep their own records.'>
		<Grid
			templateColumns={{ base: '1fr', lg: '1.2fr 1fr' }}
			gap={6}
			alignItems='start'>
			<Box minW={0}>
				<CodeBlock
					label='List products'
					code={`const res = await fetch('${API_ORIGIN}/public/api/acme-store/products?limit=12');
const { doc, total } = await res.json();`}
				/>
			</Box>
			<Flex
				direction='column'
				gap={3}>
				{[
					'Pick which models are public and what each allows: list, read, create.',
					'Open to everyone, to signed-in customers, or to each customer’s own records.',
					'Websites count visits from their own domains in analytics.',
				].map(t => (
					<Flex
						key={t}
						gap={2.5}
						align='flex-start'>
						<Box
							pt='3px'
							color='fg.muted'>
							<Check size={15} />
						</Box>
						<Text
							fontSize='14px'
							lineHeight='1.6'>
							{t}
						</Text>
					</Flex>
				))}
				<Link
					asChild
					mt={2}
					fontSize='13px'
					fontWeight='500'
					color='fg.muted'
					_hover={{ color: 'fg' }}>
					<NextLink href='/user-docs/public-api'>
						The public API guide
						<ArrowRight size={13} />
					</NextLink>
				</Link>
			</Flex>
		</Grid>
	</Section>
);

const FinalCta: FC<{ signedIn: boolean }> = ({ signedIn }) => (
	<Box
		as='section'
		py={{ base: 16, md: 24 }}
		borderTopWidth='1px'
		borderColor='border.muted'>
		<Container>
			<Flex
				direction='column'
				align='center'
				textAlign='center'>
				<Text
					as='h2'
					fontSize={{ base: '2xl', md: '4xl' }}
					fontWeight='650'
					letterSpacing='-0.02em'
					lineHeight='1.15'
					mb={3}
					maxW='640px'>
					{signedIn ? 'Pick up where you left off' : 'Start with one project'}
				</Text>
				<Text
					fontSize='md'
					color='fg.muted'
					mb={8}
					maxW='520px'>
					{signedIn
						? 'Your projects and your team are waiting in the dashboard.'
						: 'Sign up, name your organization, and build your first model in minutes.'}
				</Text>
				<Flex
					gap={3}
					wrap='wrap'
					justify='center'>
					<AuthButtons
						signedIn={signedIn}
						size='lg'
					/>
				</Flex>
			</Flex>
		</Container>
	</Box>
);

export default Landing;
