'use client';

import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Grid, Link, Text } from '@chakra-ui/react';
import ViewRow from '@/components/library/components/view/view-page/ViewRow';
import Panel from '@/components/library/cl/Panel';
import DetailRow from '@/components/library/cl/DetailRow';
import DocsShell from '../../_components/DocsShell';
import GuideHeader from '../../_components/GuideHeader';
import GuideNav from '../../_components/GuideNav';
import { C, Code, H3, P, Props, Section } from '../_components/ui';
import { LibraryTabs } from '../_components/LibraryTabs';
import SafeDemo from '../_components/SafeDemo';

/**
 * Detail pages (/view/<route>/<id>): every way a field's value is shown there —
 * live, through the same ViewRow the page uses — then the parts a page is
 * built from: sections, linked-record panels, related lists and tabs.
 */

type ViewType = { type: string; label: string; what: string; value: any; field?: Record<string, any> };

const RICH = '<p>Our <strong>summer sale</strong> starts on Monday, with <em>free delivery</em> over ৳2,000.</p>';

const GROUPS: { group: string; types: ViewType[] }[] = [
	{
		group: 'Text',
		types: [
			{ type: 'text', label: 'Text', what: 'The value as text.', value: 'Acme Trading Ltd' },
			{ type: 'textarea', label: 'Long text', what: 'Keeps its line breaks.', value: 'Leave at the front desk.\nCall on arrival.' },
			{ type: 'editor', label: 'Rich text', what: 'The formatted HTML, rendered.', value: RICH },
			{ type: 'basic-editor', label: 'Rich text (basic)', what: 'The same, from the basic editor.', value: RICH },
			{ type: 'password', label: 'Password', what: 'Masked until the eye is pressed; copying never reveals it.', value: 'correct-horse' },
			{ type: 'external-link', label: 'Link', what: 'Opens in a new tab.', value: 'https://mintapp.shop' },
		],
	},
	{
		group: 'Values',
		types: [
			{ type: 'number', label: 'Number', what: 'With thousands separators.', value: 1250000 },
			{ type: 'price', label: 'Price', what: 'In the store’s currency.', value: 1250 },
			{ type: 'date', label: 'Date and time', what: 'A readable date and time.', value: '2026-09-28T14:30:00.000Z' },
			{ type: 'date-only', label: 'Date', what: 'The date alone.', value: '2026-10-01' },
			{ type: 'boolean', label: 'Yes / no', what: 'Yes or No.', value: true },
			{ type: 'checkbox', label: 'Checkbox', what: 'A coloured badge.', value: true, field: { colorPalette: (v: boolean) => (v ? 'green' : 'red') } },
		],
	},
	{
		group: 'Lists',
		types: [
			{ type: 'tag', label: 'Tags', what: 'Badges.', value: ['summer', 'sale'] },
			{ type: 'array-tag', label: 'List of texts', what: 'Badges, one per item.', value: ['Free delivery', 'Gift wrap'] },
			{ type: 'data-array-count', label: 'Count', what: 'How many items the list holds.', value: [1, 2, 3] },
			{
				type: 'custom-attribute',
				label: 'Attributes',
				what: 'Name and value pairs.',
				value: [
					{ label: 'Size', value: 'XL' },
					{ label: 'Colour', value: 'Blue' },
				],
			},
		],
	},
	{
		group: 'Media',
		types: [
			{ type: 'image', label: 'Image', what: 'The picture; opens full size.', value: '/logo.png' },
			{ type: 'image-array', label: 'Images', what: 'A row of pictures.', value: ['/logo.png', '/tc-logo.svg'] },
			{ type: 'image-text', label: 'Image with text', what: 'A small picture beside the text.', value: 'Mint Store' },
			{ type: 'file', label: 'File', what: 'The file’s name, linking to it.', value: '/tc-logo.svg' },
			{ type: 'file-array', label: 'Files', what: 'Each file, linked.', value: ['/tc-logo.svg', '/logo.svg'] },
		],
	},
	{
		group: 'Structured',
		types: [
			{
				type: 'section-data-array',
				label: 'Section list',
				what: 'Rows of the section’s fields, as a table; number columns are totalled.',
				value: [
					{ item: 'Coffee beans', qty: 2, price: 900 },
					{ item: 'Filters', qty: 1, price: 250 },
				],
				field: {
					dataModel: [
						{ name: 'item', label: 'Item', type: 'text' },
						{ name: 'qty', label: 'Qty', type: 'number' },
						{ name: 'price', label: 'Price', type: 'number' },
					],
				},
			},
			{
				type: 'section-object',
				label: 'Section',
				what: 'The section’s fields, each with its label.',
				value: { street: '12 Lake Road', city: 'Dhaka' },
				field: {
					dataModel: [
						{ name: 'street', label: 'Street', type: 'text' },
						{ name: 'city', label: 'City', type: 'text' },
					],
				},
			},
			{ type: 'object', label: 'Object', what: 'Any other object: its keys and values.', value: { title: 'Summer sale', slug: 'summer-sale' } },
		],
	},
];

const NAV = [
	{ group: 'Field types', items: GROUPS.map(g => ({ id: `view-group-${g.group.toLowerCase()}`, title: g.group })) },
	{
		group: 'Page parts',
		items: [
			{ id: 'rows', title: 'Rows' },
			{ id: 'sections', title: 'Sections' },
			{ id: 'linked', title: 'Linked records' },
			{ id: 'related', title: 'Related lists' },
			{ id: 'tabs', title: 'Tabs' },
		],
	},
];

const TypeRow: FC<{ t: ViewType }> = ({ t }) => (
	<Box
		id={`view-${t.type}`}
		scrollMarginTop='80px'>
		<SafeDemo name={t.type}>
			<ViewRow
				field={{ title: t.label, type: t.type, noLink: true, ...(t.field || {}) }}
				value={t.value}
			/>
		</SafeDemo>
		<Text
			fontSize='11px'
			color='fg.muted'
			mt={-1}
			mb={2}>
			<C>{t.type}</C> — {t.what}
		</Text>
	</Box>
);

const ViewDocs = () => (
	<Flex
		direction='column'
		gap={6}
		pb={16}>
		<GuideHeader
			href='/docs/components'
			title='Detail pages'
			description='How each kind of field shows on a record’s page, and the parts a detail page is built from.'
			mb={0}
		/>
		<LibraryTabs current='/docs/components/view' />

		<Grid
			templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
			gap={10}
			alignItems='start'>
			<GuideNav groups={NAV} />

			<Box
				maxW='800px'
				minW={0}>
				<Section
					id='overview'
					title='How a detail page is drawn'
					lead='Each value goes through ViewRow, which picks the renderer for the field’s view type.'>
					<P>
						A field&apos;s view type follows its input (a Tags input shows as <C>tag</C>) unless its settings set{' '}
						<C>viewType</C>. The examples below are the real row the page uses, with sample values. What goes on
						the page, and in what order, is set in the route builder&apos;s{' '}
						<Link asChild>
							<NextLink href='/docs/builder#view'>View tab</NextLink>
						</Link>
						.
					</P>
				</Section>

				{GROUPS.map(g => (
					<Section
						key={g.group}
						id={`view-group-${g.group.toLowerCase()}`}
						title={g.group}>
						<Panel>
							{g.types.map(t => (
								<TypeRow
									key={t.type}
									t={t}
								/>
							))}
						</Panel>
					</Section>
				))}

				<Section
					id='rows'
					title='Rows'
					lead='ViewRow for a field; DetailRow for anything else.'>
					<P>
						<C>ViewRow</C> takes a field (<C>title</C>, <C>type</C>, and the options its renderer reads) and the
						value. It sits on <C>DetailRow</C> — label left, value right — the same row the Heroku and Vercel pages
						use, so detail pages look like the rest of the admin.
					</P>
					<Panel title='DetailRow'>
						<DetailRow
							label='Plan'
							value='Pro'
						/>
						<DetailRow
							label='Region'
							value='Europe'
						/>
					</Panel>
					<Code label='tsx'>{`import ViewRow from '@/components/library/components/view/view-page/ViewRow';
import DetailRow from '@/components/library/cl/DetailRow';

<ViewRow field={{ title: 'Tags', type: 'tag' }} value={['summer', 'sale']} />
<DetailRow label='Plan' value='Pro' />`}</Code>
					<H3>Field options ViewRow reads</H3>
					<Props
						rows={[
							{ name: 'title', type: 'string', required: true, description: 'The label.' },
							{ name: 'type', type: 'view type', required: true, description: 'Picks the renderer (the types above).' },
							{ name: 'copy', type: 'boolean', description: 'A copy button beside the value.' },
							{ name: 'colorPalette', type: '(value) => string', description: <>For <C>checkbox</C> and <C>tag</C>: the badge colour.</> },
							{ name: 'dataModel', type: 'field[]', description: <>For sections: their fields, so rows show as a table.</> },
							{ name: 'model / path', type: 'string', description: 'The route a linked value opens in.' },
						]}
					/>
				</Section>

				<Section
					id='sections'
					title='Sections'
					lead='The Overview tab is made of sections: a title, a line of description, and fields in one to three columns.'>
					<Code label='view config'>{`view: [
	{
		title: 'Contact',
		description: 'How to reach them',
		columns: 2,
		fields: ['name', 'email', 'phone', 'address'],
	},
]`}</Code>
					<P>
						Without a view config the page falls back to its default layout, listing the route&apos;s fields.
					</P>
				</Section>

				<Section
					id='linked'
					title='Linked records'
					lead='A reference field shown with fields of the record it points to.'>
					<Code label='view config'>{`fields: [
	{ field: 'client', label: 'Client', show: ['name', 'email', 'phone'] },
]`}</Code>
					<P>
						The linked record&apos;s fields appear under the label, and its name is a chip that opens it. Fields
						the reader may not see in that route stay hidden.
					</P>
				</Section>

				<Section
					id='related'
					title='Related lists'
					lead='Records of another route that point at this one, listed inside a section.'>
					<Code label='view config'>{`fields: [
	{ related: 'invoices', foreignField: 'client', columns: ['code', 'total', 'status'], limit: 10 },
]`}</Code>
				</Section>

				<Section
					id='tabs'
					title='Tabs'
					lead='After Overview, each tab lists records of a linked route — as a table or cards, with search, paging and an add button.'>
					<Code label='view config'>{`viewTabs: [
	{
		related: 'documents',
		foreignField: 'client',
		title: 'Documents',
		display: 'table',          // or 'cards'
		columns: ['title', 'type', 'createdAt'],
		pageSize: 20,
		allowAdd: true,            // default on
		addLabel: 'Upload document',
	},
]`}</Code>
					<P>
						The add button opens that route&apos;s own create form with the link to this record filled in, and is
						disabled for anyone without create permission there. See{' '}
						<Link asChild>
							<NextLink href='/docs/builder#view'>the route builder guide</NextLink>
						</Link>{' '}
						for setting tabs up.
					</P>
				</Section>
			</Box>
		</Grid>
	</Flex>
);

const ViewDocsPage = () => (
	<DocsShell
		current='/docs/components'
		requireLogin>
		<ViewDocs />
	</DocsShell>
);

export default ViewDocsPage;
