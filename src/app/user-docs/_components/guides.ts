import {
	Boxes,
	Building2,
	ChartLine,
	FolderKanban,
	Globe,
	Images,
	LayoutDashboard,
	LayoutTemplate,
	LifeBuoy,
	PanelLeft,
	Plug,
	Rocket,
	ShieldCheck,
	Table2,
	UserRound,
	Webhook,
} from 'lucide-react';
import type { Guide } from '../../docs/_components/guides';
import type { DocsNav } from '../../docs/_components/DocsNavbar';
import { HOME } from '@/components/library/config/lib/constants/panel';

/**
 * The user guides (/user-docs): everything someone using the platform needs —
 * their account, organization, projects, the builders, records, and taking a
 * project live (public API, customers, websites, analytics). The tenant panel
 * links here and nowhere else (panel.ts docsPath); /docs is the super
 * admin's.
 *
 * Add a guide here when you add one under /user-docs, or it can't be found.
 * Topic ids must match the guide's own SECTIONS.
 */
export const USER_GUIDES: Guide[] = [
	{
		href: '/user-docs/getting-started',
		title: 'Get started',
		name: 'Getting started',
		description: 'Sign up, find your way around, and go from an empty project to your first page of records.',
		icon: Rocket,
		group: 'Start here',
		topics: [
			{ id: 'sign-up', title: 'Signing up' },
			{ id: 'tour', title: 'Finding your way around' },
			{ id: 'first-project', title: 'Your first project' },
			{ id: 'first-model', title: 'Your first model' },
		],
	},
	{
		href: '/user-docs/account',
		title: 'Account',
		name: 'Your account & security',
		description: 'Your profile and password, two-step sign-in with passkeys and codes, your signed-in devices, and how the panel looks.',
		icon: ShieldCheck,
		group: 'Start here',
		topics: [
			{ id: 'profile', title: 'Profile' },
			{ id: 'password', title: 'Password' },
			{ id: 'overview', title: 'Two-factor sign-in' },
			{ id: 'devices', title: 'Signed-in devices' },
		],
	},
	{
		href: '/user-docs/organization',
		title: 'Organization',
		name: 'Your organization',
		description: 'Your company or team: inviting people, which projects they open, what each role may do, and several organizations.',
		icon: Building2,
		group: 'Organization & projects',
		topics: [
			{ id: 'organizations', title: 'Organizations' },
			{ id: 'invitations', title: 'Inviting people' },
			{ id: 'project-access', title: 'Which projects people open' },
			{ id: 'roles', title: 'Roles and permissions' },
		],
	},
	{
		href: '/user-docs/projects',
		title: 'Projects',
		name: 'Projects',
		description: 'Apps and websites — each a workspace of its own, with its own models, pages, sidebar, dashboard and API.',
		icon: FolderKanban,
		group: 'Organization & projects',
		topics: [
			{ id: 'kinds', title: 'Apps and websites' },
			{ id: 'create', title: 'Creating a project' },
			{ id: 'media-library', title: 'Media library' },
			{ id: 'archive', title: 'Archiving and deleting' },
		],
	},
	{
		href: '/user-docs/models',
		title: 'Models',
		name: 'Models',
		description: 'Describe the things your project keeps — customers, orders, bookings — and get a table, form, filters and detail page for each.',
		icon: Boxes,
		group: 'Build',
		topics: [
			{ id: 'models-wizard', title: 'Creating a model' },
			{ id: 'models-fields', title: 'Fields' },
			{ id: 'models-links', title: 'Linking models' },
			{ id: 'models-access', title: 'Private records' },
		],
	},
	{
		href: '/user-docs/pages',
		title: 'Pages',
		name: 'Pages: tables, forms & detail pages',
		description: 'Fine-tune how each model looks and works — its table, filters, form and detail page — with drafts you publish.',
		icon: LayoutTemplate,
		group: 'Build',
		topics: [
			{ id: 'workflow', title: 'Drafts and publishing' },
			{ id: 'table', title: 'Table' },
			{ id: 'form', title: 'Form' },
			{ id: 'view', title: 'Detail page and tabs' },
		],
	},
	{
		href: '/user-docs/sidebar',
		title: 'Sidebar',
		name: 'Sidebar',
		description: 'Arrange your project’s sidebar: its sections, its pages, their icons, and who sees each one.',
		icon: PanelLeft,
		group: 'Build',
		topics: [
			{ id: 'arrange', title: 'Arranging' },
			{ id: 'icons', title: 'Icons' },
			{ id: 'access', title: 'Who sees a page' },
		],
	},
	{
		href: '/user-docs/dashboard',
		title: 'Dashboard',
		name: 'Dashboard',
		description: 'Choose the numbers, charts and recent lists on your project’s home page.',
		icon: LayoutDashboard,
		group: 'Build',
		topics: [
			{ id: 'widgets', title: 'Widgets' },
			{ id: 'charts', title: 'Charts' },
			{ id: 'access', title: 'Who sees what' },
		],
	},
	{
		href: '/user-docs/media',
		title: 'Media',
		name: 'Media',
		description: 'Your project’s images, videos and files — folders, uploads, links and the trash.',
		icon: Images,
		group: 'Build',
		topics: [
			{ id: 'folders', title: 'Folders' },
			{ id: 'upload', title: 'Uploading' },
			{ id: 'trash', title: 'Trash' },
		],
	},
	{
		href: '/user-docs/connect-ai',
		title: 'Connect AI',
		name: 'Build with your own AI',
		description: 'Connect Claude, ChatGPT or another AI assistant to a project and build models by describing them.',
		icon: Plug,
		group: 'Build',
		topics: [
			{ id: 'mcp-keys', title: 'Project keys' },
			{ id: 'mcp-connect', title: 'Connecting your assistant' },
			{ id: 'conversation', title: 'What to ask' },
		],
	},
	{
		href: '/user-docs/records',
		title: 'Records',
		name: 'Working with records',
		description: 'The everyday work: adding, finding, editing, exporting and importing the records in your project.',
		icon: Table2,
		group: 'Everyday work',
		topics: [
			{ id: 'tables', title: 'Tables' },
			{ id: 'find', title: 'Search and filters' },
			{ id: 'bulk', title: 'Working on many rows' },
			{ id: 'history', title: 'History and undo' },
		],
	},
	{
		href: '/user-docs/public-api',
		title: 'Public API',
		name: 'Public API',
		description: 'Let your own website or app read and write your models — you choose the actions and who may call them.',
		icon: Webhook,
		group: 'Go live',
		topics: [
			{ id: 'turn-on', title: 'Making a model public' },
			{ id: 'requests', title: 'Requests' },
			{ id: 'list', title: 'Listing and filtering' },
			{ id: 'errors', title: 'Errors and limits' },
		],
	},
	{
		href: '/user-docs/customers',
		title: 'Customers',
		name: 'Customers & sign-in',
		description: 'Let the people who use your site or app create an account and sign in — with a ready-made widget or your own form.',
		icon: UserRound,
		group: 'Go live',
		topics: [
			{ id: 'widget', title: 'The sign-in widget' },
			{ id: 'mint-auth', title: 'MintAuth in your code' },
			{ id: 'own-form', title: 'Your own sign-in form' },
			{ id: 'manage', title: 'Managing customers' },
		],
	},
	{
		href: '/user-docs/websites',
		title: 'Websites',
		name: 'Website projects',
		description: 'Site setup, pages, per-page SEO and content blocks — and rendering them on your site in two calls.',
		icon: Globe,
		group: 'Go live',
		topics: [
			{ id: 'kit', title: 'The website kit' },
			{ id: 'build-a-page', title: 'Building a page' },
			{ id: 'site-api', title: 'The site API' },
			{ id: 'render', title: 'Rendering your site' },
		],
	},
	{
		href: '/user-docs/analytics',
		title: 'Analytics',
		name: 'Analytics',
		description: 'Count visits to your website without cookies: page views, visitors, where they came from, clicks and your own events.',
		icon: ChartLine,
		group: 'Go live',
		topics: [
			{ id: 'install', title: 'Adding the tracker' },
			{ id: 'reports', title: 'The Analytics page' },
			{ id: 'events', title: 'Clicks and events' },
			{ id: 'privacy', title: 'Privacy' },
		],
	},
	{
		href: '/user-docs/faq',
		title: 'FAQ',
		name: 'Questions & troubleshooting',
		description: 'Quick answers to what people ask most, and what to do when something doesn’t work.',
		icon: LifeBuoy,
		group: 'Help',
		topics: [
			{ id: 'account', title: 'Signing in' },
			{ id: 'team', title: 'Teammates and access' },
			{ id: 'building', title: 'Building' },
			{ id: 'live', title: 'Your site and API' },
		],
	},
];

export const USER_GUIDE_GROUPS = ['Start here', 'Organization & projects', 'Build', 'Everyday work', 'Go live', 'Help'];

/** The guides linked from the navbar — the rest are a click away on the home page. */
const IN_NAVBAR = ['getting-started', 'organization', 'projects', 'models', 'records', 'public-api', 'websites', 'analytics', 'faq'];

export const USER_DOCS_NAV: DocsNav = {
	home: '/user-docs',
	brand: 'MINT Guides',
	guides: USER_GUIDES.filter(g => IN_NAVBAR.includes(g.href.split('/').pop() || '')),
	open: { href: HOME, label: 'Open MINT' },
};

/** The guide at `href`. */
export const userGuide = (href: string) => USER_GUIDES.find(g => g.href === href);
