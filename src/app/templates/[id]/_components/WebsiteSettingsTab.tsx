'use client';

import { FC } from 'react';
import { Flex, Grid } from '@chakra-ui/react';
import { VColor } from '@/components/library';
import { Panel } from '@/components/library/cl';
import { TextField } from '@/app/site-setup/_components/parts';
import { CONTACT, SOCIAL } from '@/app/site-setup/_components/General';
import { GuideLink, Intro } from '../../_components/ui';
import { Site, SiteSettings } from './website';
import type { TabProps } from './types';

/**
 * The Site settings tab (website templates): the new site's defaults — the
 * Site setup page's Branding, Theme, Contact, Social and SEO cards in
 * template mode: they write the blueprint, and the project gets them when it's
 * made. Images are addresses here (the project uploads its own later); any
 * text can hold a question's {{key}}.
 */

type Group = keyof SiteSettings;

const WebsiteSettingsTab: FC<TabProps<Site>> = ({ value, onChange }) => {
	const s = value.settings;
	const get = (g: Group, k: string) => String(s[g]?.[k] ?? '');
	const set = (g: Group, k: string) => (v: string) => onChange({ ...value, settings: { ...s, [g]: { ...s[g], [k]: v } } });
	const sample = (get('seo', 'titleTemplate') || '').replace('%s', 'About us');

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='site-defaults'>
				The settings the new site starts with — the same cards as a project’s Site setup page, but here they write the template.
				Put the business’s name in with a question’s {'{{key}}'} (“{'{{business}}'}”) rather than a made-up one. Everything
				left empty keeps the project’s own default, and the tenant can change it all later in Site setup.
			</Intro>

			<Panel
				title='Branding'
				subtitle='The site’s name, logo and favicon — in its header, its browser tab and its footer'
				actions={<GuideLink section='site-defaults' />}>
				<Grid
					templateColumns={{ base: '1fr', md: '1fr 1fr' }}
					gap={4}>
					<TextField
						label='Site name'
						placeholder='{{business}}'
						value={get('identity', 'siteName')}
						onChange={set('identity', 'siteName')}
					/>
					<TextField
						label='Tagline'
						help='A line under the name, if the design has one'
						value={get('identity', 'tagline')}
						onChange={set('identity', 'tagline')}
					/>
					<TextField
						label='Logo'
						help='An image address'
						mono
						value={get('identity', 'logo')}
						onChange={set('identity', 'logo')}
					/>
					<TextField
						label='Favicon'
						help='A square image address — 512×512 works everywhere'
						mono
						value={get('identity', 'favicon')}
						onChange={set('identity', 'favicon')}
					/>
					<TextField
						label='Footer text'
						help='e.g. © {{business}}'
						value={get('identity', 'footerText')}
						onChange={set('identity', 'footerText')}
					/>
				</Grid>
			</Panel>

			<Panel
				title='Theme'
				subtitle='The colours and font the site’s design uses'>
				<Grid
					templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
					gap={4}>
					<VColor
						label='Primary colour'
						name='primaryColor'
						value={get('identity', 'primaryColor')}
						onChange={(e: any) => set('identity', 'primaryColor')(e.target.value)}
					/>
					<VColor
						label='Secondary colour'
						name='secondaryColor'
						value={get('identity', 'secondaryColor')}
						onChange={(e: any) => set('identity', 'secondaryColor')(e.target.value)}
					/>
					<TextField
						label='Font'
						help='A Google Font name, e.g. Inter'
						value={get('identity', 'fontFamily')}
						onChange={set('identity', 'fontFamily')}
					/>
				</Grid>
			</Panel>

			<Panel
				title='Contact'
				subtitle='Where the site sends people — usually questions, since every business differs'>
				<Grid
					templateColumns={{ base: '1fr', md: '1fr 1fr' }}
					gap={4}>
					{CONTACT.map(f => (
						<TextField
							key={f.key}
							label={f.label}
							help={f.help}
							placeholder={f.placeholder}
							long={f.long}
							value={get('contact', f.key)}
							onChange={set('contact', f.key)}
						/>
					))}
				</Grid>
			</Panel>

			<Panel
				title='Social'
				subtitle='Links in the site’s header or footer'>
				<Grid
					templateColumns={{ base: '1fr', md: '1fr 1fr' }}
					gap={4}>
					{SOCIAL.map(f => (
						<TextField
							key={f.key}
							label={f.label}
							placeholder={f.placeholder}
							mono
							value={get('social', f.key)}
							onChange={set('social', f.key)}
						/>
					))}
				</Grid>
			</Panel>

			<Panel
				title='SEO defaults'
				subtitle='What a page without its own SEO shows, and how every title reads'>
				<Grid
					templateColumns={{ base: '1fr', md: '1fr 1fr' }}
					gap={4}>
					<TextField
						label='Default title'
						help={`${get('seo', 'metaTitle').length}/60 characters — the home page’s title in search results`}
						value={get('seo', 'metaTitle')}
						onChange={set('seo', 'metaTitle')}
					/>
					<TextField
						label='Title template'
						help={sample && sample !== get('seo', 'titleTemplate') ? `A page called “About us” shows as “${sample}”` : '%s is where each page’s own title goes, e.g. %s · {{business}}'}
						value={get('seo', 'titleTemplate')}
						onChange={set('seo', 'titleTemplate')}
					/>
					<TextField
						label='Default description'
						help={`${get('seo', 'metaDescription').length}/160 characters`}
						long
						rows={2}
						value={get('seo', 'metaDescription')}
						onChange={set('seo', 'metaDescription')}
					/>
					<TextField
						label='Default share image'
						help='An image address; 1200×630'
						mono
						value={get('seo', 'ogImage')}
						onChange={set('seo', 'ogImage')}
					/>
					<TextField
						label='Keywords'
						help='Comma-separated'
						value={(s.seo.keywords || []).join(', ')}
						onChange={v => onChange({ ...value, settings: { ...s, seo: { ...s.seo, keywords: v.split(',').map(k => k.trimStart()).slice(0, 20) } } })}
					/>
				</Grid>
			</Panel>
		</Flex>
	);
};

export default WebsiteSettingsTab;
