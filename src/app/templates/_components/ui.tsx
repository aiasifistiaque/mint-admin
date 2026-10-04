'use client';

import { FC, ReactNode } from 'react';
import { Badge, Box, Flex, Link, Text } from '@chakra-ui/react';
import { AppWindow, ExternalLink, Globe, LucideIcon as LucideIconType, Webhook } from 'lucide-react';
import { LucideIcon } from '@/components/library';
import { docsPath } from '@/components/library/config/lib/constants/panel';
import type { TemplateType } from '@/components/library/store/services/templatesApi';
import { isIconName } from '@/app/sidebar-builder/_components/ui';

/**
 * Pieces every Template Studio screen shares: the guide links, the intro
 * each tab opens with, and how a template's type and status read.
 */

/** Template Studio's guide. Section ids are the anchors below. */
export const GUIDE = docsPath('/docs/templates');

/** A link into the guide, opened beside the studio rather than in place of it. */
export const GuideLink: FC<{ section: string; label?: string }> = ({ section, label = 'How this works' }) => (
	<Link
		href={`${GUIDE}#${section}`}
		target='_blank'
		rel='noopener noreferrer'
		display='inline-flex'
		alignItems='center'
		gap={1}
		fontSize='xs'
		color='fg.muted'
		flexShrink={0}
		_hover={{ color: 'fg', textDecoration: 'underline' }}>
		{label}
		<ExternalLink size={11} />
	</Link>
);

/** The paragraph a tab opens with: what this part is for, and where the guide explains it. */
export const Intro: FC<{ section: string; children: ReactNode }> = ({ section, children }) => (
	<Flex
		gap={4}
		align='flex-start'
		justify='space-between'
		px={4}
		py={3}
		borderRadius='md'
		bg='bg.subtle'
		borderWidth='1px'
		borderColor='border.muted'>
		<Text
			fontSize='sm'
			color='fg.muted'
			lineHeight='1.6'>
			{children}
		</Text>
		<GuideLink section={section} />
	</Flex>
);

export const Label: FC<{ children: ReactNode; hint?: ReactNode; required?: boolean }> = ({ children, hint, required }) => (
	<Box mb={1.5}>
		<Text
			fontSize='xs'
			fontWeight='600'>
			{children}
			{required && (
				<Text
					as='span'
					color='red.fg'
					ml={0.5}>
					*
				</Text>
			)}
		</Text>
		{hint && (
			<Text
				fontSize='xs'
				color='fg.muted'>
				{hint}
			</Text>
		)}
	</Box>
);

export const TYPES: { value: TemplateType; label: string; icon: LucideIconType; holds: string }[] = [
	{
		value: 'app',
		label: 'App',
		icon: AppWindow,
		holds: 'A business app: models with tables, forms and detail pages, a sidebar, a dashboard and roles — Finance management, CRM, HR.',
	},
	{
		value: 'api',
		label: 'API',
		icon: Webhook,
		holds: 'A backend for the tenant’s own app or site: models with public endpoints, customer sign-in and webhooks — a booking or orders API.',
	},
	{
		value: 'website',
		label: 'Website',
		icon: Globe,
		holds: 'A site’s content: pages with SEO and content blocks, site settings, starter code, and models for longer lists — a blog, a business site.',
	},
];

export const typeOf = (t: string) => TYPES.find(x => x.value === t) || TYPES[0];

export const TypeBadge: FC<{ type: string }> = ({ type }) => {
	const t = typeOf(type);
	const Icon = t.icon;
	return (
		<Badge
			size='sm'
			variant='outline'
			gap={1}>
			<Icon size={11} />
			{t.label}
		</Badge>
	);
};

/** Draft (never published), published vN (+ unpublished changes), or archived. */
export const StatusBadge: FC<{ doc: any }> = ({ doc }) => {
	if (doc.status === 'archived')
		return (
			<Badge
				size='sm'
				colorPalette='gray'>
				Archived
			</Badge>
		);
	if (!doc.version)
		return (
			<Badge
				size='sm'
				colorPalette='orange'
				variant='subtle'>
				Draft
			</Badge>
		);
	return (
		<Flex
			gap={1}
			align='center'>
			<Badge
				size='sm'
				colorPalette='green'
				variant='subtle'>
				Published v{doc.version}
			</Badge>
			{doc.changed && (
				<Badge
					size='sm'
					variant='outline'>
					Unpublished changes
				</Badge>
			)}
		</Flex>
	);
};

/** "3 problems" / "2 to explain" — from the counts the server keeps. */
export const ChecksBadge: FC<{ checks?: { errors?: number; explain?: number } }> = ({ checks }) => {
	if (!checks) return null;
	if (checks.errors)
		return (
			<Badge
				size='sm'
				colorPalette='red'
				variant='subtle'>
				{checks.errors} problem{checks.errors === 1 ? '' : 's'}
			</Badge>
		);
	if (checks.explain)
		return (
			<Badge
				size='sm'
				colorPalette='orange'
				variant='outline'>
				{checks.explain} to explain
			</Badge>
		);
	return null;
};

/** The template's icon, or its type's when it has none (or a misspelt one). */
export const TemplateIcon: FC<{ doc: any; size?: number }> = ({ doc, size = 18 }) => {
	const name = String(doc.icon || '').trim();
	if (name && isIconName(name))
		return (
			<LucideIcon
				name={name}
				size={size}
				color='currentColor'
			/>
		);
	const Icon = typeOf(doc.type).icon;
	return <Icon size={size} />;
};

/** The parts each tab edits, the tab's label and its guide anchor. */
export const TABS: { value: string; label: string; parts: string[]; types?: TemplateType[] }[] = [
	{ value: 'overview', label: 'Overview', parts: ['overview'] },
	{ value: 'models', label: 'Models', parts: ['models'] },
	{ value: 'sidebar', label: 'Sidebar', parts: ['sidebar'], types: ['app', 'api'] },
	{ value: 'dashboard', label: 'Dashboard', parts: ['dashboard'], types: ['app', 'api'] },
	{ value: 'roles', label: 'Roles', parts: ['roles'], types: ['app', 'api'] },
	{ value: 'endpoints', label: 'Public API', parts: ['endpoints'] },
	{ value: 'webhooks', label: 'Webhooks', parts: ['webhooks'], types: ['api'] },
	{ value: 'website', label: 'Website', parts: ['website'], types: ['website'] },
	{ value: 'questions', label: 'Questions', parts: ['questions'] },
	{ value: 'sampleData', label: 'Sample data', parts: ['sampleData'] },
	{ value: 'guide', label: 'Setup guide', parts: ['guide'] },
	{ value: 'versions', label: 'Versions & publish', parts: [] },
];

export const PART_LABEL: Record<string, string> = {
	overview: 'Overview',
	questions: 'Questions',
	models: 'Models',
	sidebar: 'Sidebar',
	dashboard: 'Dashboard',
	roles: 'Roles',
	endpoints: 'Public API',
	webhooks: 'Webhooks',
	website: 'Website',
	sampleData: 'Sample data',
	guide: 'Setup guide',
};

/** The tab a part is edited in. */
export const tabOfPart = (part: string) => TABS.find(t => t.parts.includes(part))?.value || 'overview';

export const errorMessage = (e: any, fallback: string) => {
	const d = e?.data;
	const problems: string[] = Array.isArray(d?.problems) ? d.problems : [];
	return [d?.message || e?.error || fallback, ...problems.map(p => `• ${p}`)].join('\n');
};
