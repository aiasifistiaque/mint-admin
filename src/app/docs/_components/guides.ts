import { Blocks, Building2, Component, Images, LayoutDashboard, LayoutTemplate, LucideIcon, Palette, PanelLeft, ShieldCheck } from 'lucide-react';

export type Guide = {
	href: string;
	/** Short name, for the docs navbar. */
	title: string;
	/** Full name, for the docs home page. */
	name: string;
	description: string;
	icon: LucideIcon;
	/** The heading it's listed under on the docs home. */
	group: string;
	/** A few of the guide's sections — ids must match the guide's own SECTIONS. */
	topics: { id: string; title: string }[];
	/** Pages of their own inside the guide, listed after the topics. */
	pages?: { href: string; title: string }[];
};

/**
 * Every guide, in the order people reach for them — the docs navbar's links
 * and the docs home page's cards. Add a guide here when you add one under
 * /docs, or it can't be found from either.
 */
export const GUIDES: Guide[] = [
	{
		href: '/docs/two-factor',
		title: 'Sign-in & security',
		name: 'Sign-in & security',
		description: 'Protect your account with a second step after your password, and see the devices you’re signed in on.',
		icon: ShieldCheck,
		group: 'Account & security',
		topics: [
			{ id: 'turn-on', title: 'Turning it on' },
			{ id: 'passkeys', title: 'Passkeys' },
			{ id: 'backup-codes', title: 'Backup codes' },
			{ id: 'devices', title: 'Signed-in devices' },
		],
	},
	{
		href: '/docs/builder',
		title: 'Route builder',
		name: 'Route builder',
		description: 'Create and change the admin’s pages without code: models, tables, filters, forms, detail pages — or let AI build a feature.',
		icon: Blocks,
		group: 'Build your admin',
		topics: [
			{ id: 'workflow', title: 'Drafts and publishing' },
			{ id: 'form', title: 'Form' },
			{ id: 'view', title: 'Detail page and tabs' },
			{ id: 'features', title: 'Feature builder' },
		],
	},
	{
		href: '/docs/sidebar-builder',
		title: 'Sidebar builder',
		name: 'Sidebar builder',
		description: 'Add, arrange, hide and restrict the links in the admin sidebar.',
		icon: PanelLeft,
		group: 'Build your admin',
		topics: [
			{ id: 'arrange', title: 'Arranging the sidebar' },
			{ id: 'icons', title: 'Icons' },
			{ id: 'access', title: 'Who sees a page' },
		],
	},
	{
		href: '/docs/dashboard-builder',
		title: 'Dashboard builder',
		name: 'Dashboard builder',
		description: 'Choose the numbers, charts and recent lists on the dashboard, and who sees each one.',
		icon: LayoutDashboard,
		group: 'Build your admin',
		topics: [
			{ id: 'widgets', title: 'Widgets' },
			{ id: 'charts', title: 'Charts' },
			{ id: 'access', title: 'Who sees what' },
		],
	},
	{
		href: '/docs/templates',
		title: 'Templates',
		name: 'Template Studio',
		description: 'Make the templates tenants start projects from — apps, APIs and websites — check, preview and publish them, or let Claude write them.',
		icon: LayoutTemplate,
		group: 'Build your admin',
		topics: [
			{ id: 'new', title: 'Making a template' },
			{ id: 'preview', title: 'Previews' },
			{ id: 'publish', title: 'Publishing' },
			{ id: 'mcp', title: 'Writing templates with Claude' },
		],
	},
	{
		href: '/docs/media',
		title: 'Media',
		name: 'Media library',
		description: 'Organise, upload, find and clean up the images and files your site uses.',
		icon: Images,
		group: 'Everyday tools',
		topics: [
			{ id: 'folders', title: 'Folders' },
			{ id: 'upload', title: 'Uploading' },
			{ id: 'trash', title: 'Trash' },
			{ id: 'shortcuts', title: 'Keyboard shortcuts' },
		],
	},
	{
		href: '/docs/themes',
		title: 'Themes',
		name: 'Themes',
		description: 'Colour themes for the admin panel — choosing one, light and dark, and how they work.',
		icon: Palette,
		group: 'Everyday tools',
		topics: [
			{ id: 'choose', title: 'Choosing a theme' },
			{ id: 'modes', title: 'Light, dark and system' },
			{ id: 'developers', title: 'For developers' },
		],
	},
	{
		href: '/docs/components',
		title: 'Components',
		name: 'Component library',
		description: 'Every form input, table cell, detail-page field and dashboard widget — live, in their variations — plus filters and charts.',
		icon: Component,
		group: 'Reference',
		topics: [
			{ id: 'filters', title: 'Filters' },
			{ id: 'charts', title: 'Charts' },
		],
		pages: [
			{ href: '/docs/components/inputs', title: 'Form inputs' },
			{ href: '/docs/components/tables', title: 'Tables' },
			{ href: '/docs/components/view', title: 'Detail pages' },
			{ href: '/docs/components/dashboard', title: 'Dashboard' },
		],
	},
	{
		href: '/user-docs',
		title: 'User guides',
		name: 'User guides (tenants)',
		description: 'What tenants read: organizations, projects, the builders, the public API, customer sign-in, websites and analytics. The tenant panel links only there.',
		icon: Building2,
		group: 'Reference',
		topics: [],
		pages: [
			{ href: '/user-docs/getting-started', title: 'Getting started' },
			{ href: '/user-docs/public-api', title: 'Public API' },
			{ href: '/user-docs/websites', title: 'Website projects' },
		],
	},
];

export const GUIDE_GROUPS: string[] = ['Account & security', 'Build your admin', 'Everyday tools', 'Reference'];
