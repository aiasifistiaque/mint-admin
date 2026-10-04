'use client';

import { FC } from 'react';
import { Box, Code, Flex, Text } from '@chakra-ui/react';
import { Panel } from '@/components/library/cl';
import { Intro, PART_LABEL } from '../../_components/ui';

/**
 * A part whose own editor isn't in the studio yet (sidebar, dashboard, roles,
 * public API, webhooks, website): what the draft holds, read-only, and how
 * to change it meanwhile — Claude writes every part through the Templates
 * MCP, and it's checked and previewed like the rest.
 */

const INTRO: Record<string, { section: string; text: string; tool: string }> = {
	sidebar: {
		section: 'sidebar',
		text: 'The sidebar a new project starts with: sections in order, and which of the template’s pages sit in each.',
		tool: 'set_sidebar',
	},
	dashboard: {
		section: 'dashboard',
		text: 'The project’s home dashboard: numbers, charts and lists of recent records from the template’s models.',
		tool: 'set_dashboard',
	},
	roles: {
		section: 'roles',
		text: 'Organization roles the template suggests, besides Owner, Admin and Member — e.g. an Accountant who can edit records but not invite people.',
		tool: 'set_roles',
	},
	endpoints: {
		section: 'endpoints',
		text: 'Which models the project’s public API opens up, for the tenant’s own site or app: list, read, create, update, delete — with or without customer sign-in.',
		tool: 'set_endpoints',
	},
	webhooks: {
		section: 'webhooks',
		text: 'Calls the project makes to the tenant’s own server when records change. The receiving address is asked when the template is used.',
		tool: 'set_webhooks',
	},
	website: {
		section: 'pages',
		text: 'The site’s pages with their SEO and content blocks, the site settings, and the starter code.',
		tool: 'upsert_page, set_site_defaults, set_starter_code',
	},
};

const isEmpty = (v: any): boolean =>
	v === undefined || v === null || (Array.isArray(v) && !v.length) || (typeof v === 'object' && !Array.isArray(v) && !Object.values(v).some(x => !isEmpty(x)));

const PartSummary: FC<{ doc: any; part: string }> = ({ doc, part }) => {
	const info = INTRO[part];
	const value = doc.draft?.[part];
	const issues = [...(doc.validation?.errors || []), ...(doc.validation?.explain || []), ...(doc.validation?.warnings || [])].filter(
		(i: any) => i.part === part
	);
	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section={info?.section || part}>{info?.text}</Intro>
			<Panel
				title={PART_LABEL[part] || part}
				subtitle='Read-only here for now.'>
				<Flex
					direction='column'
					gap={3}>
					<Text
						fontSize='sm'
						color='fg.muted'>
						This part’s editor is on its way to the studio. Until then, Claude writes it through the Templates MCP (
						<Code fontSize='xs'>{info?.tool}</Code>), or it comes with a template saved from a project — and it’s checked,
						previewed and published like every other part.
					</Text>
					{issues.map((i: any, n: number) => (
						<Box
							key={n}
							fontSize='sm'
							px={3}
							py={2}
							borderRadius='md'
							bg={i.severity === 'error' ? 'red.subtle' : i.severity === 'explain' ? 'orange.subtle' : 'bg.subtle'}>
							<Text>{i.message}</Text>
							<Text
								fontSize='xs'
								color='fg.muted'>
								{i.fix}
							</Text>
						</Box>
					))}
					{isEmpty(value) ? (
						<Text fontSize='sm'>Nothing in this part yet.</Text>
					) : (
						<Box
							as='pre'
							fontSize='xs'
							fontFamily='mono'
							p={3}
							bg='bg.subtle'
							borderRadius='md'
							overflow='auto'
							maxH='480px'>
							{JSON.stringify(value, null, 2)}
						</Box>
					)}
				</Flex>
			</Panel>
		</Flex>
	);
};

export default PartSummary;
