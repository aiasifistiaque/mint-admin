'use client';

import { FC, ReactNode, useEffect } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Grid, Link, Table, Text } from '@chakra-ui/react';
import { Layout } from '@/components/library';
import { PageHeader } from '@/components/library/cl';

/**
 * The route builder, explained — what it is, how a route is served, and what
 * every tab of the editor does. Linked from the Routes page and from each
 * overview card (`/docs/builder#<section>`), always in a new tab, so it reads
 * beside the editor.
 *
 * Section ids are the link targets; rename one and the overview card that
 * points at it lands at the top of the page instead.
 */

const SECTIONS = [
	{ id: 'what', title: 'What the builder is' },
	{ id: 'serving', title: 'How a route is served' },
	{ id: 'routes-page', title: 'The Routes page' },
	{ id: 'workflow', title: 'Drafts and publishing' },
	{ id: 'settings', title: 'Settings' },
	{ id: 'table', title: 'Table' },
	{ id: 'filters', title: 'Filters' },
	{ id: 'form', title: 'Form' },
	{ id: 'view', title: 'View' },
	{ id: 'source', title: 'Source & versions' },
	{ id: 'models', title: 'Model builder' },
	{ id: 'safety', title: 'Safety rules and access' },
	{ id: 'api', title: 'API and scripts' },
	{ id: 'faq', title: 'Troubleshooting' },
];

/* ---------- small typographic pieces ---------- */

const Section: FC<{ id: string; title: string; lead?: ReactNode; children: ReactNode }> = ({ id, title, lead, children }) => (
	<Box
		as='section'
		id={id}
		scrollMarginTop='24px'
		pt={8}
		pb={2}
		borderTopWidth='1px'
		borderColor='border.muted'
		_first={{ borderTopWidth: 0, pt: 0 }}>
		<Text
			as='h2'
			fontSize='lg'
			fontWeight='600'
			mb={lead ? 1 : 3}>
			<Link
				href={`#${id}`}
				color='fg'
				_hover={{ textDecoration: 'none', color: 'fg.muted' }}>
				{title}
			</Link>
		</Text>
		{lead && (
			<Text
				fontSize='sm'
				color='fg.muted'
				mb={4}>
				{lead}
			</Text>
		)}
		<Flex
			direction='column'
			gap={3}>
			{children}
		</Flex>
	</Box>
);

const H3: FC<{ children: ReactNode }> = ({ children }) => (
	<Text
		as='h3'
		fontSize='sm'
		fontWeight='600'
		mt={3}>
		{children}
	</Text>
);

const P: FC<{ children: ReactNode }> = ({ children }) => (
	<Text
		fontSize='sm'
		lineHeight='1.7'>
		{children}
	</Text>
);

const C: FC<{ children: ReactNode }> = ({ children }) => (
	<Box
		as='code'
		fontFamily='mono'
		fontSize='0.85em'
		px={1}
		py={0.5}
		borderRadius='sm'
		bg='bg.muted'>
		{children}
	</Box>
);

const List: FC<{ items: ReactNode[]; ordered?: boolean }> = ({ items, ordered }) => (
	<Box
		as={ordered ? 'ol' : 'ul'}
		pl={5}
		fontSize='sm'
		lineHeight='1.7'
		listStyleType={ordered ? 'decimal' : 'disc'}>
		{items.map((item, i) => (
			<Box
				as='li'
				key={i}
				mb={1}>
				{item}
			</Box>
		))}
	</Box>
);

const Note: FC<{ children: ReactNode; tone?: 'warn' }> = ({ children, tone }) => (
	<Box
		px={4}
		py={3}
		borderLeftWidth='3px'
		borderColor={tone === 'warn' ? 'orange.solid' : 'border.emphasized'}
		bg='bg.subtle'
		borderRadius='sm'
		fontSize='sm'
		lineHeight='1.7'>
		{children}
	</Box>
);

/** Two-column reference table: a term and what it means. */
const Terms: FC<{ head?: [string, string]; rows: [ReactNode, ReactNode][] }> = ({ head = ['Option', 'What it does'], rows }) => (
	<Box
		borderWidth='1px'
		borderColor='border'
		borderRadius='md'
		overflowX='auto'>
		<Table.Root
			size='sm'
			variant='line'>
			<Table.Header>
				<Table.Row bg='bg.subtle'>
					{head.map(h => (
						<Table.ColumnHeader
							key={h}
							fontSize='11px'
							fontWeight='500'
							letterSpacing='0.04em'
							textTransform='uppercase'
							color='fg.muted'>
							{h}
						</Table.ColumnHeader>
					))}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{rows.map(([term, def], i) => (
					<Table.Row
						key={i}
						bg='transparent'>
						<Table.Cell
							fontSize='sm'
							fontWeight='500'
							verticalAlign='top'
							w='34%'
							minW='150px'>
							{term}
						</Table.Cell>
						<Table.Cell
							fontSize='sm'
							color='fg.muted'
							lineHeight='1.6'>
							{def}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	</Box>
);

/* ---------- the page ---------- */

const BuilderDocs = () => {
	// The page renders after the auth check, so the browser's own jump to
	// `#section` has already happened (to nothing). Do it once content exists.
	useEffect(() => {
		const id = decodeURIComponent(window.location.hash.slice(1));
		if (id) document.getElementById(id)?.scrollIntoView();
	}, []);

	return (
		<Flex
			direction='column'
			gap={6}
			pb={16}>
			<PageHeader
				breadcrumbs={[
					{ href: '/dashboard', title: 'Home' },
					{ href: '/builder', title: 'Routes' },
					{ href: '/docs/builder', title: 'Guide' },
				]}
				title='Route builder guide'
				meta='What the builder is, how routes are served from it, and what every part of the editor does'
			/>

			<Grid
				templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
				gap={10}
				alignItems='start'>
				<Box
					as='nav'
					display={{ base: 'none', lg: 'block' }}
					position='sticky'
					top='16px'>
					<Text
						fontSize='11px'
						fontWeight='500'
						letterSpacing='0.04em'
						textTransform='uppercase'
						color='fg.muted'
						mb={2}>
						On this page
					</Text>
					<Flex
						direction='column'
						gap={1}>
						{SECTIONS.map(s => (
							<Link
								key={s.id}
								href={`#${s.id}`}
								fontSize='sm'
								color='fg.muted'
								_hover={{ color: 'fg', textDecoration: 'none' }}>
								{s.title}
							</Link>
						))}
					</Flex>
				</Box>

				<Box
					maxW='760px'
					minW={0}>
					<Section
						id='what'
						title='What the builder is'
						lead='One place to change how any admin route behaves and looks, without editing code or deploying.'>
						<P>
							Every admin route (clients, orders, products…) is described by two files in the backend: a{' '}
							<strong>settings file</strong> and a <strong>config file</strong>. The builder keeps a copy of both
							in the database. Once a route has a published copy, the API and the admin panel run on that copy.
							The code files stay as the fallback.
						</P>
						<Terms
							head={['File', 'What it controls']}
							rows={[
								[
									'Settings',
									<>
										The record&apos;s fields: data type, required/unique, which fields can be edited after
										creation, which the table can sort and search on, which are never returned, and what gets
										joined in from other collections. <strong>It changes what the API accepts and returns.</strong>
									</>,
								],
								[
									'Config',
									'How the admin presents the route: the table page (columns, buttons, row menu, bulk actions), the filter chips, the create/edit form, and the record’s detail page (view).',
								],
							]}
						/>
						<P>
							Both copies are ordinary data. They have the same shape as the files, and the API returns the same
							responses whichever one it uses. A copy that hasn&apos;t been changed gives exactly the same result
							as the file. <C>scripts/checkRouteParity.js</C> checks this.
						</P>
					</Section>

					<Section
						id='serving'
						title='How a route is served'
						lead='For every request, the backend decides where the route’s settings and config come from.'>
						<List
							ordered
							items={[
								<>
									If the route is <strong>pinned</strong> to DB or Code (on its Source tab), that choice wins.
								</>,
								<>
									Otherwise it follows the <strong>global switch</strong> on the Routes page (settings and config
									are switched separately).
								</>,
								<>
									&ldquo;DB&rdquo; only applies if the route has a <strong>published</strong> copy. A route
									that has never been published always runs on its code file.
								</>,
							]}
						/>
						<P>
							Every admin API response has an <C>X-Route-Source</C> header saying which one served it. Drafts
							are never served. They exist only inside the builder until they&apos;re published.
						</P>
						<Note>
							The resolved route is cached for about 10 seconds. The server that handles a publish or a source
							switch clears its cache straight away. Other server instances pick up the change within 10
							seconds.
						</Note>
						<H3>Kinds of route</H3>
						<Terms
							head={['Kind', 'Meaning']}
							rows={[
								[
									'Generic page',
									'Its admin page is generated from the config: table, filters, buttons, form, view. Everything in the builder applies.',
								],
								[
									'API only',
									'The API is generated from the settings, but the admin page is hand-written. Settings, filters and view apply. Creating a table config (Table tab) replaces the hand-written page with a generated one.',
								],
								[
									'Custom',
									'A hand-written backend route. Only its filters can be configured; it has no settings file.',
								],
							]}
						/>
					</Section>

					<Section
						id='routes-page'
						title='The Routes page'
						lead='Config → Routes lists every admin route the builder knows about.'>
						<Terms
							head={['Column', 'Shows']}
							rows={[
								['Route', 'The page title and its address. Click a row to open the editor.'],
								['Model', 'The database model behind it.'],
								['Kind', 'Generic page, API only or Custom (see above). “Locked settings” marks an access-control route.'],
								[
									'Settings / Config',
									<>
										<C>DB v3</C>: served from published version 3. <C>Code</C>: served from the file (a
										version that exists but is unused is noted). <C>pinned</C>: ignores the global switch.{' '}
										<C>Draft</C>: unpublished changes are waiting.
									</>,
								],
								['Last published', 'The latest publish of either copy.'],
							]}
						/>
						<P>
							Click a column header (Route, Model, Kind, Last published) to sort by it. Click it again to reverse
							the order. Search matches the address, title and model. The segment next to it shows only routes
							with drafts, or only generic pages.
						</P>
						<H3>Source for every route</H3>
						<P>
							The global switch. <strong>DB copies</strong> runs every non-pinned route on its published copy,{' '}
							<strong>Code files</strong> on its file. It is live immediately and deletes nothing, so switching
							back restores everything. Use it to rule the builder out while debugging: switch to code, and if
							the problem stays, it isn&apos;t the builder.
						</P>
					</Section>

					<Section
						id='workflow'
						title='Drafts and publishing'
						lead='Nothing you do in the editor affects the live admin until you publish.'>
						<List
							ordered
							items={[
								<>
									<strong>Edit</strong> in any tab. Changes are kept in the page. <em>Undo changes</em> drops
									them.
								</>,
								<>
									<strong>Save draft</strong> stores them on the server, for settings and config together. A
									draft survives reloads and can be picked up by someone else. Saving is refused while a tab
									shows an error (a menu item without a title, a related list without columns, a filter without
									a field…).
								</>,
								<>
									<strong>Publish</strong> (with an optional note) makes the draft live. The version number goes
									up and a snapshot is kept, so any version can be brought back later.
								</>,
								<>
									<strong>Discard draft</strong> throws the saved draft away. The live version is untouched.
								</>,
							]}
						/>
						<Note tone='warn'>
							Editing a settings or config <em>file</em> does not change a route that runs on a published DB
							copy. Either make the same change in the builder and publish it, or delete the route&apos;s copy
							(Source tab) so it goes back to the file.
						</Note>
						<P>
							The <strong>Overview</strong> tab summarises every part of the route on one screen: how many
							fields, columns, filters and sections there are, whether the published settings still match the
							file, and whether a draft is waiting. Each card opens its tab.
						</P>
					</Section>

					<Section
						id='settings'
						title='Settings'
						lead='The fields of the record, in the order of the settings file. This tab changes backend behaviour.'>
						<P>
							Each row is one field: its key, title and data type, then switches. Only fields that exist on the
							model can be added (&ldquo;Add a field of this model…&rdquo;). Removing a field means the API stops
							validating, editing and returning it.
						</P>
						<P>
							<strong>System fields</strong> are generated and read-only, marked with a lock and a{' '}
							<em>system</em> badge: <C>createdAt</C> on every route, and on an access-restricted model{' '}
							<C>addedBy</C>, <C>privacy</C> and <C>access</C> (the owner and access list link to Admin). They
							always show exactly as generated, can&apos;t be edited, moved or removed, and the server puts them
							back that way whenever settings are saved or published.
							{' '}
							<strong>Secrets never show up</strong>: fields named like a password, token, secret, API key, OTP,
							salt or hash, and fields the model keeps out of queries, aren&apos;t offered anywhere in the builder
							(columns, filters, the form, or the fields of a linked record on the view). The view endpoint
							doesn&apos;t return them either. An admin&apos;s password is never returned by any query.
						</P>
						<Terms
							head={['Switch', 'Effect once published']}
							rows={[
								['Required', 'Must be sent when creating a record.'],
								['Unique', 'Creating a duplicate value is refused.'],
								['Editable', 'Can be changed after creation. A PUT that touches a non-editable field is rejected.'],
								['Sortable', 'The table can sort by it.'],
								['Searchable', 'The search box matches it.'],
								['Hidden', 'Never returned by the API, not even to admins.'],
								['Trim', 'Surrounding spaces are removed before saving.'],
							]}
						/>
						<H3>Data types</H3>
						<P>
							The type drives validation: <C>string</C>, <C>email</C>, <C>uri</C>, <C>text</C>, <C>number</C>,{' '}
							<C>boolean</C>, <C>date</C>, <C>date-only</C>, <C>object</C>, <C>array</C>, <C>array-string</C>,{' '}
							<C>array-number</C>, <C>array-object</C>, <C>tag</C>, <C>mixed</C>, <C>profit</C>.
						</P>
						<H3>Expanded options</H3>
						<Terms
							rows={[
								['Label in the admin', 'What forms, tables and the view page call the field.'],
								[
									'Form input',
									'The input used in forms, picked by name on the field’s row: text, rich text, select, multi-select, tags, image, images, file, files, video, colour, record pickers and more. Picking one also sets the data type it stores (images and files are a list of strings). Empty: chosen from the data type.',
								],
								['Table cell', 'How the value is drawn in a table cell. Empty: same as the form input.'],
								['In the table by default', 'Whether the column shows before an admin changes their preferences.'],
								['Min / Max', 'Length for text, value for numbers.'],
								['Populate path / fields', 'Join the referenced record in, and which of its fields to bring.'],
								['All presentation options', 'The field’s full schema as JSON, for options without a control of their own.'],
							]}
						/>
						<Note>
							Access-control routes (<C>admins</C>, <C>adminroles</C>, <C>permissions</C>, <C>roles</C>,{' '}
							<C>builder</C>) show their settings read-only. Fields that look like secrets (password, token,
							key, otp…) can be made stricter but never looser. See <NextLink href='#safety'>Safety rules</NextLink>.
						</Note>
					</Section>

					<Section
						id='table'
						title='Table'
						lead='The list page of a generic route: its header, columns, row menu and bulk actions.'>
						<P>
							A hand-written (API only) route has no table config. <em>Create table config from settings</em>{' '}
							builds one, with columns, a default row menu and a form taken from the settings. Publishing it
							replaces the hand-written page with the generated one.
						</P>
						<H3>Page</H3>
						<Terms
							rows={[
								['Title / Subtitle', 'The page heading and the line under it.'],
								[
									'Add button',
									'Shows the create button. Button text is its label. Opens: a modal with the form, or a page (Page address, default /<route>/create).',
								],
								['Export button', 'Download the table as CSV or PDF.'],
								['Search', 'The search box above the table. It searches the fields marked Searchable in Settings.'],
								['Filter row', 'The filter chips from the Filters tab.'],
								['Clickable rows', 'Clicking a row opens it. Row opens sets where to.'],
								['Rows per page', 'The default page size.'],
							]}
						/>
						<H3>Columns</H3>
						<P>
							The columns the table can show, in order. Drag to reorder. Each admin can still hide columns for
							themselves under Preferences.
						</P>
						<H3>Row menu</H3>
						<P>The ⋯ menu on every row, in order. Drag to reorder.</P>
						<Terms
							head={['Item', 'What it does']}
							rows={[
								['Quick view', 'Opens the record in a modal, laid out by the View config.'],
								['Details page', <>Opens <C>/view/&lt;route&gt;/&lt;id&gt;</C>.</>],
								['Edit in modal', 'Edits the record in a modal, laid out by the Form config.'],
								['Edit page', <>Goes to <C>/&lt;route&gt;/edit/&lt;id&gt;</C>.</>],
								['Record page', <>Goes to <C>/&lt;route&gt;/&lt;id&gt;</C>.</>],
								['Duplicate / Delete', 'Copies the record / deletes it after confirming.'],
								['Link with id / Link', <>Goes to <C>&lt;href&gt;/&lt;id&gt;</C>, or to a fixed address.</>],
								['Quick edit a field', 'Edits one field in place: as text, a number, or a pick from another route.'],
								['Call the API', 'PUTs a fixed JSON body to the record, optionally after a confirmation prompt.'],
								['Quick view (fields)', 'A modal showing just the fields listed.'],
							]}
						/>
						<P>
							Items the builder can&apos;t describe as data (custom components written in code) are shown
							read-only and kept exactly as they are on publish.
						</P>
						<H3>Bulk actions</H3>
						<P>
							<strong>Select rows</strong> adds a checkbox to each row and a menu for the selection:
						</P>
						<Terms
							head={['Action', 'What it does']}
							rows={[
								['Export', 'Downloads the selected rows.'],
								['Set a field', 'Sets one field on every selected row to a fixed value.'],
								['Set a field from a list', 'Sets one field to an option picked from a list you define.'],
								['Set a field from another route', 'Sets a reference field to a record picked from another route.'],
								['Sum a field', 'Totals a numeric field across the selection.'],
								['Send SMS', 'Sends a bulk SMS to the selected customers.'],
							]}
						/>
					</Section>

					<Section
						id='filters'
						title='Filters'
						lead='The filter chips above the table. Every route with a filter row has them, custom routes included.'>
						<P>
							Each card is one chip. Drag cards to set their order. The first four show directly; the rest go
							under &ldquo;Show more filters&rdquo;. A filter can only use a field that exists on the model, and
							picking a field fills in a sensible type and options, all still editable.
						</P>
						<Terms
							head={['Type', 'The chip lets you']}
							rows={[
								['Multi select', 'Pick any number of values (sent as <field>_in).'],
								['Select', 'Pick one value.'],
								['Text', 'Match typed text.'],
								['Yes / No', 'True or false.'],
								['Number range', 'Equal, above, below, between.'],
								['Date', 'On, before, after, between, in the last…'],
							]}
						/>
						<H3>Where a select gets its options</H3>
						<Terms
							head={['Source', 'Options are']}
							rows={[
								['Listed here', 'Typed on the card: a value and a label per option.'],
								['From another model', 'Every record of a model, labelled by one of its fields (usually name).'],
								['Distinct values', 'Every value the field currently holds in the database.'],
							]}
						/>
						<P>
							<strong>Roles</strong> limit a chip to certain admin roles. <strong>Errors</strong> (no field, no
							type, no model) block saving. <strong>Warnings</strong> don&apos;t: a list with no options yet,
							or two chips writing the same query key (they would overwrite each other).
						</P>
					</Section>

					<Section
						id='form'
						title='Form'
						lead='The create and edit form, in titled sections. Used by the add modal and “Edit in modal”.'>
						<P>
							A section has a title, an optional description and rows. A row holds one field, or several side
							by side (&ldquo;+ beside&rdquo;). Drag sections and rows to reorder. Fields not placed in any
							section are listed so none are forgotten. A field in the form must also be Editable (or allowed
							on create) in Settings, or the API will refuse it.
						</P>
						<P>Hand-written routes get a form once they have a table config.</P>
					</Section>

					<Section
						id='view'
						title='View'
						lead='The record’s detail page (/view/<route>/<id>) and the Quick view modal.'>
						<P>
							A view is a list of sections, each with a title, an optional description and 1–3 columns. Without
							a view config the detail page uses its default layout. To start one, copy <em>the form layout</em>{' '}
							or take <em>all fields</em>. A section can hold three kinds of item:
						</P>
						<Terms
							head={['Item', 'Shows']}
							rows={[
								[
									'Field',
									'One of the record’s own fields, drawn the same way as everywhere else. Long text and rich text take the full width.',
								],
								[
									'Fields of a linked record',
									<>
										For a reference field (e.g. <C>client</C>): chosen fields of the record it points to. The
										first one names it under the field&apos;s label (&ldquo;Client&rdquo;), the rest read
										&ldquo;Client · Email&rdquo;.
									</>,
								],
								[
									'Related records',
									<>
										Records of another route that point at this one: pick the route, the field there that
										references this record (e.g. orders → <C>client</C>), the columns, and how many to show
										(1–50, newest first). Rows link to their own page, and there is a link to the full list.
									</>,
								],
							]}
						/>
						<Note>
							Linked and related data is filtered on the server. Fields that are hidden, marked{' '}
							<C>select: false</C> in the model, or look like secrets are never sent. A related list is only
							filled for admins who can view that route. Everyone else sees &ldquo;You don&apos;t have access
							to these records&rdquo;.
						</Note>
						<P>
							Linked records — a reference, a list of them, the owner, the people given access — show as
							chips with the record&apos;s name, on the detail page and in the Quick view modal. Hover a
							chip for a card of the record with a <em>View</em> button; clicking the chip opens its page
							too. The detail page&apos;s <em>Edit</em> button opens the same edit drawer as the
							table&apos;s row menu.
						</P>
						<H3>Tabs</H3>
						<P>
							The detail page opens on <em>Overview</em> — the sections above, or the default layout when
							there are none. Below the sections, <em>Tabs</em> adds one tab per link to records of another
							route that point at this one: on an author, <em>Blogs via author</em> lists that
							author&apos;s blogs. Only routes with a reference field to this model are offered; a route
							linking in two ways (author, editor) offers both. Each tab has a title, the columns to show
							and how many rows per page (5–100). Tabs appear in the order set here, each with a count, and
							their rows open their own page. Like related lists, a tab only lists records the reader may
							see; without view permission on that route it says so instead.
						</P>
					</Section>

					<Section
						id='source'
						title='Source & versions'
						lead='Which copy this route runs on, and its publish history.'>
						<H3>Source</H3>
						<Terms
							head={['Choice', 'Meaning']}
							rows={[
								['Global', 'Follow the switch on the Routes page (the default).'],
								['DB', 'Always run on the published copy, whatever the global switch says.'],
								['Code file', 'Always run on the file, whatever the global switch says.'],
							]}
						/>
						<P>
							Switching is live immediately and touches nothing else: drafts and versions stay.{' '}
							<strong>Delete copy</strong> removes the DB copy entirely. It is saved as a version first, so it
							can be restored. The route then runs on its code file until something is published again.
						</P>
						<H3>Versions</H3>
						<P>
							Every publish is kept, with who published it, when, and the note. Switch between config and
							settings history. <strong>Load as draft</strong> puts an old version in the draft. Publish it to
							roll back.
						</P>
					</Section>

					<Section
						id='models'
						title='Model builder'
						lead='Create a database model from fields, without code. Config → Models, or the Models button on the Routes page.'>
						<P>
							Creating a model does everything a developer would otherwise do by hand. It registers a Mongoose
							model, mounts an admin API at <C>/admin/api/&lt;route&gt;</C>, and generates the settings and config
							files, so the model gets a table page, a create/edit form, filter chips and a detail page. It also
							creates a permission and, if you pick a category, a sidebar entry. Nothing is deployed and nothing
							restarts. Every server picks the change up within 10 seconds.
						</P>
						<P>
							Built models appear on the Routes page marked <C>Built model</C>. Their table, filters, form and view
							are refined in the route builder like any other route. Their <em>fields</em> are only changed in
							the model builder.
						</P>

						<H3>Creating a model: the wizard</H3>
						<Box
							id='models-wizard'
							scrollMarginTop='24px'
						/>
						<P>
							<strong>New model</strong> opens a step-by-step wizard. <strong>Nothing is created until the last
							step.</strong> Each step after the first works on a preview the server generates from your fields.
						</P>
						<List
							ordered
							items={[
								<>
									<strong>Model</strong>: title, name (checked as you type), optional route, display field, record
									code and fields.
								</>,
								<>
									<strong>Settings</strong>: what the API validates, lets be edited, sorts, searches and returns,
									generated from the fields.
								</>,
								<>
									<strong>Config</strong>: the table page’s header, add and export buttons, row menu and bulk
									actions.
								</>,
								<>
									<strong>Form</strong>: the create/edit form sections.
								</>,
								<>
									<strong>Table</strong>: the columns and their order.
								</>,
								<>
									<strong>View</strong>: the detail page sections, fields of linked records and related lists.
								</>,
								<>
									<strong>Filters</strong>: the filter chips.
								</>,
								<>
									<strong>Sidebar &amp; create</strong>: whether to add the page to the sidebar and under which
									category, a summary, and <em>Create model</em>.
								</>,
							]}
						/>
						<P>
							Creating registers the model and its route, adds the permission and the sidebar entry, and publishes
							any settings or config you changed as version 1. If you changed nothing on a step, the route runs on
							what the model generates. The server checks everything before it creates anything. If something is
							refused, the wizard takes you to the step it concerns.
						</P>
						<P>
							<strong>Build with AI</strong>, at the top of the first step, fills in every step from a
							description. Claude picks the fields and their kinds, allowed values and defaults, the form
							sections, table columns, detail page, filters and sidebar category. The server checks the draft
							exactly like one made by hand. If it refuses something, the problems go back to Claude to fix. You
							then look through the steps and create the model as usual; nothing is saved before that. With a
							model already on the page, the description can change it instead (&ldquo;add a due date&rdquo;).
							It needs <C>ANTHROPIC_API_KEY</C> in the backend&apos;s <C>.env</C>, and <C>ANTHROPIC_MODEL</C>{' '}
							optionally picks the Claude model (<C>claude-opus-5-5</C> by default).
						</P>
						<P>
							Going back to the first step and changing the fields doesn&apos;t throw your later work away. New
							fields are added to the settings, form, table, view and filters, and removed ones are taken out.
							Everything else you set stays. Progress is saved in your browser, so a reload picks up where you left
							off. <em>Start over</em> clears it.
						</P>

						<H3>Names, and what happens when one is taken</H3>
						<Box
							id='models-names'
							scrollMarginTop='24px'
						/>
						<P>
							From a title like &ldquo;Invoices&rdquo; the builder derives the model name <C>Invoice</C>, the
							route <C>/invoices</C> and the collection <C>invoices</C>. As you type, it checks that the name is
							free. A name is taken if any model (code or built) already uses it, if the admin already has a route
							of that name, or if a collection of that name already holds data. When it&apos;s taken, the lowest
							free number is added and the new name is shown before you save. For example, if <C>Invoice</C> is
							taken, the model becomes <C>Invoice2</C> at <C>/invoices2</C>.
						</P>
						<P>
							The name, route and collection are fixed once the model is created. The collection holds the
							records, and other models link to this one by name. The title can change at any time.
						</P>

						<H3>Record code</H3>
						<Box
							id='models-code'
							scrollMarginTop='24px'
						/>
						<P>
							<strong>Give every record a code</strong> adds a <C>code</C> field filled in when a record is
							created. It is made of the <strong>prefix</strong>, a dash and a zero-padded number
							(<strong>digits</strong>), counting from <strong>start at</strong>, e.g. <C>INV-0001</C>. Codes come
							from an atomic counter, so two records created at the same moment never share one. A copied record
							gets a new code.
						</P>
						<List
							items={[
								'Turning codes on for a model that already has records gives those records codes, oldest first.',
								'A new prefix or length applies to records created afterwards; existing codes don’t change.',
								'The code can be the display field, and is searchable, sortable and shown in the table.',
							]}
						/>

						<H3>Fields</H3>
						<Box
							id='models-fields'
							scrollMarginTop='24px'
						/>
						<P>
							Each field has a label, a key (its name in the database and API, filled in from the label until you
							edit it), a kind and whether it&apos;s required. The chevron opens the rest: shown in the table,
							unique, index, searchable, min/max, allowed values, a default and help text. A field&apos;s allowed
							values and default also show as badges on its row.
						</P>
						<List
							items={[
								<>
									<strong>Allowed values (enum)</strong>: the only values the field takes. Options fields
									need them (they&apos;re typed straight into the field&apos;s row). Text, Number and Tags can have them too, and the form then offers them as a list.
									Anything else is refused with a 400.
								</>,
								<>
									<strong>Default</strong>: the value a new record starts with. It is prefilled in the create form
									and applied by the model when nothing is sent. A list kind takes a list, a date takes
									&ldquo;when created&rdquo; or a fixed date, and a field with allowed values takes one of them. A
									required field with a default can be left out of an API request.
								</>,
							]}
						/>
						<Terms
							head={['Kind', 'Stored as · in the admin']}
							rows={[
								['Text', 'String · text input, searchable, sortable'],
								['Long text / Rich text', 'String · textarea / editor, full width on the detail page'],
								['Email', 'String, lower-cased and checked · copyable in the table'],
								['Link', 'String, checked to be a URL · opens in a new tab'],
								['Number', 'Number, with optional min/max · sortable'],
								['Yes / No', 'Boolean · checkbox, Yes/No filter'],
								['Date', 'Date (default can be “when created”) · date filter'],
								['Color', 'String · colour picker'],
								[
									'Options',
									'Choosing it opens an input in the row to type the options (Enter adds one). String limited to them · dropdown, multi-select filter. With “Allow several”: a list of them · multi-select.',
								],
								['Tags', 'List of strings, optionally limited to allowed values · tag input'],
								['Image', 'String (the uploaded file’s URL) · image input; thumbnail in the table'],
								['Images', 'List of image URLs · gallery input; count in the table, gallery on the detail page'],
								['File / Files', 'URL / list of URLs · file upload; download links on the detail page'],
								['Video', 'String (the video’s URL) · video upload; link in the table'],
								['Link to a record', 'ObjectId with ref · record picker; shown by its display field; filter by record'],
								['Link to records', 'List of ObjectIds with ref · multi-picker'],
							]}
						/>
						<P>
							Some keys are reserved and refused: <C>_id</C>, <C>code</C>, <C>createdAt</C>, <C>updatedAt</C> and
							Mongoose&apos;s own names like <C>collection</C>, <C>save</C> or <C>schema</C>. So are
							secret-looking names like <C>password</C> and <C>token</C>. Every model gets <C>createdAt</C> and{' '}
							<C>updatedAt</C> on its own.
						</P>

						<H3>Linking models</H3>
						<Box
							id='models-links'
							scrollMarginTop='24px'
						/>
						<P>
							A <em>Link to a record</em> field stores the id of a record in another model, and saves the model it
							points to by its <strong>name</strong> (Mongoose&apos;s <C>ref</C>). It can point at any model with an
							admin route, whether built or in code, or at the model itself (for a parent/child tree). The list
							shows it by that model&apos;s <strong>display field</strong>: the first text field unless you choose
							one. Change a display field and every model linking to it follows.
						</P>
						<P>
							Because the name is registered with Mongoose, links work the other way too. Code models can use{' '}
							<C>ref: &apos;Invoice&apos;</C>, and any route&apos;s View can list a built model&apos;s records as
							related records. A model that others link to can&apos;t be deleted until those fields are removed.
						</P>

						<H3>Restricting access to records</H3>
						<Box
							id='models-access'
							scrollMarginTop='24px'
						/>
						<P>
							<strong>Restrict access to each record</strong> (the <em>Access</em> panel, when creating a model or
							later) is just an on/off switch: it lets every record decide who can see it, in the record&apos;s own
							form. This comes on top of the page permission, never
							instead of it: without <C>view-&lt;route&gt;</C> an admin sees no records at all. Each record gets
							three fields:
						</P>
						<Terms
							head={['Field', 'What it does']}
							rows={[
								['Owner (addedBy)', 'Whoever created the record. Set by the server; it can’t be sent or changed.'],
								[
									'Privacy',
									'Chosen for each record in its form, as in Documents. Only me: the owner alone. Private: the owner and the people in Access. Public: everyone who can open the page. A new record starts as Private.',
								],
								[
									'Access',
									'The people a private record is shared with. The form shows the picker only while Privacy is Private.',
								],
							]}
						/>
						<P>
							The form gets a <em>Manage access</em> section, the table gets Privacy and Owner columns and filters,
							and the detail page an <em>Access</em> section. On the server, the access rule applies to every way
							of reaching a record:
						</P>
						<List
							items={[
								'Lists, search, counts, exports and filters only include records you may see. Search can’t widen that.',
								'Opening, or opening the detail page of, a record you may not see answers 404, as if it didn’t exist.',
								'Anyone who can see a record can edit it, given the edit permission. Only the owner can change Privacy or Access, or delete it.',
								'Bulk edits only touch the records you may see, and can’t change access.',
								'On other pages, linked records and related lists you may not see are left out.',
							]}
						/>
						<P>
							Turning access on for a model with records makes those records Public, so nobody loses sight of
							them. Turning it off shows every record to everyone with the page permission again. The owners and
							access lists stay in the records, for if you turn it back on. With access on, no field can be called{' '}
							<C>privacy</C>, <C>access</C> or <C>addedBy</C>.
						</P>

						<H3>Notifications</H3>
						<Box
							id='notifications'
							scrollMarginTop='24px'
						/>
						<P>
							When someone is given access to a private record, they get a notification. This happens when a
							record is created with them in Access, when they are added later, and when a record already shared
							with them goes from Only me to Private. The owner isn&apos;t notified, and nobody is notified twice
							for the same record. The bell in the navbar, between search and your profile, shows the unread
							count and opens <C>/notifications</C>. Opening a notification marks it read and takes you to the
							record&apos;s detail page. Shared Documents send the same notification.
						</P>

						<H3>Changing a model that has records</H3>
						<List
							items={[
								'Adding a field is always safe. It’s added to the route’s published settings and config too (table, form, view, filters), so it appears straight away.',
								'Removing a field hides it: values stay in the records, but aren’t shown, edited or returned. Add it back to see them again.',
								'Changing a field’s kind is flagged. Old values stay as they were and may not read correctly as the new kind.',
								'Making a field unique fails if records already share a value. You’re told, and the rest of the change still applies.',
								'Every change is kept as a version (RouteVersion, kind “model”) before it’s applied.',
							]}
						/>

						<H3>Disabling and deleting</H3>
						<P>
							<strong>Disable</strong> takes the route and page away but keeps the model registered, so records of
							other models still show what they link to. <strong>Delete</strong> removes the model, route,
							route-builder copies, permission and sidebar entry. Its records stay unless you tick &ldquo;Also
							delete its records&rdquo; and type the model name. While records remain, the name stays taken.
						</P>
						<Note>
							A new model has its own permission (<C>view-</C>, <C>create-</C>, <C>edit-</C>, <C>delete-&lt;route&gt;</C>).
							Roles with <C>*</C> have it at once. Give other roles access on the Roles page.
						</Note>
					</Section>

					<Section
						id='safety'
						title='Safety rules and access'
						lead='Published settings change what the API accepts, so the server checks every draft before it goes live.'>
						<List
							items={[
								<>
									<strong>Locked routes</strong>: <C>admins</C>, <C>adminroles</C>, <C>permissions</C>,{' '}
									<C>roles</C> and <C>builder</C> control access, so their settings can&apos;t be changed here.
								</>,
								<>
									<strong>Sensitive fields</strong> (names matching password, token, secret, api key, private,
									otp, salt, hash) can be tightened but never loosened.
								</>,
								<>
									<strong>Real fields only</strong>: settings, filters, columns and view items must name fields
									of the model (or keys that were already in the code file).
								</>,
								<>
									<strong>No hidden-field joins</strong>: a populate can&apos;t ask for <C>+field</C>{' '}
									selects, which would pull hidden fields back in.
								</>,
								<>Every draft is validated on save and again on publish. Publish refuses if any part is invalid.</>,
							]}
						/>
						<H3>Who can use the builder</H3>
						<P>
							The <C>builder</C> permission: <C>view-builder</C> opens the Routes pages and history,{' '}
							<C>edit-builder</C> saves, publishes, restores and switches sources. Give it to roles with care.
							Publishing settings changes the API for every admin.
						</P>
					</Section>

					<Section
						id='api'
						title='API and scripts'
						lead='For developers.'>
						<Terms
							head={['Endpoint', 'Purpose']}
							rows={[
								[<C key='a'>GET /admin/api/builder/routes</C>, 'Every route with its copies’ state, plus the global switch.'],
								[<C key='b'>GET /admin/api/builder/route?route=clients</C>, 'The code files, both copies (published + draft), model fields.'],
								[<C key='c'>PUT / DELETE …/draft</C>, 'Save or discard a draft. Writes take the route (and kind) in the body; reads in the query.'],
								[<C key='d'>POST …/publish · reset · restore</C>, 'Publish, delete the copy, load a version as draft.'],
								[<C key='e'>GET …/versions · compare</C>, 'History; published copy vs the file.'],
								[<C key='f'>PUT /admin/api/builder/state · source</C>, 'The global switch; a route’s pin.'],
								[<C key='g'>GET /admin/api/&lt;route&gt;/get/view/:id</C>, 'A record laid out by its view config, with its tabs and their counts (404 when there is neither).'],
								[<C key='gt'>GET /admin/api/&lt;route&gt;/get/view/:id/tab/:index</C>, 'One page of a view tab (?page=, ?limit= up to 100).'],
								[<C key='bl'>GET /admin/api/builder/backlinks/:model</C>, 'Routes whose model has a field referencing that model — what a tab can list.'],
								[<C key='h'>GET · POST /admin/api/builder/models</C>, 'List built models; create one (registers it at once).'],
								[<C key='i'>GET · PUT · DELETE …/models/:id</C>, 'One model; change it; delete it (?dropData=true also drops its records).'],
								[<C key='j'>GET …/models/check?name=</C>, 'The name, route and collection a model would get.'],
								[<C key='k'>GET …/models/options</C>, 'Field kinds, models that can be linked to, sidebar categories.'],
							]}
						/>
						<Terms
							head={['Script (backend/scripts)', 'Does']}
							rows={[
								[<C key='a'>seedRouteBuilder.js [--dry-run] [--overwrite]</C>, 'Creates DB copies from the code files.'],
								[<C key='b'>seedBuilderAccess.js</C>, 'Adds the builder permission and sidebar entry.'],
								[
									<C key='c'>checkRouteParity.js [--verbose]</C>,
									'Compares the API on the DB copies and on the code files for every route. Exits 1 if unchanged copies give different output.',
								],
							]}
						/>
						<P>
							The models are <C>RouteSettings</C>, <C>RouteConfig</C>, <C>RouteVersion</C>, <C>BuilderState</C>{' '}
							and <C>ModelDefinition</C> in <C>backend/library/models/builder</C>. Built models are compiled and
							served by <C>library/functions/dynamicModels.function.ts</C>.
						</P>
					</Section>

					<Section
						id='faq'
						title='Troubleshooting'>
						<Terms
							head={['Symptom', 'Why, and what to do']}
							rows={[
								[
									'I changed a settings/config file and nothing happened',
									'The route runs on its published DB copy. Make the change in the builder and publish, or delete the copy on the Source tab.',
								],
								[
									'I saved but the admin looks the same',
									'Saving only stores a draft. Publish it. Other server instances can take up to 10 seconds to pick it up.',
								],
								[
									'A field isn’t offered in a dropdown',
									'Only fields that exist on the model are offered. Add it to the model (and settings) first.',
								],
								[
									'Something broke after a publish',
									'Source & versions → Versions → load the previous version as draft and publish it. Or pin the route to Code file to switch to the file at once.',
								],
								[
									'Is it the builder or the code?',
									'Switch the global source to Code files on the Routes page. If the problem stays, it is in the code.',
								],
								[
									'The model builder gave my model a different name',
									'The name was taken by another model, an admin route or an existing collection, so a number was added. The editor shows why before you save.',
								],
								[
									'A built model shows “Not registered”',
									'Its definition couldn’t be compiled; the reason is shown on its page. Usually a model in code now uses the same name.',
								],
								[
									'A new model’s page says I have no access',
									'Its permission is new. Give your role view/create/edit/delete for it on the Roles page (roles with * already have it).',
								],
								[
									'A related list says “no access”',
									'The viewer’s role lacks view permission on that route. This is intended.',
								],
							]}
						/>
					</Section>
				</Box>
			</Grid>
		</Flex>
	);
};

const BuilderDocsPage = () => (
	<Layout
		title='Builder guide'
		path='builder'>
		<BuilderDocs />
	</Layout>
);

export default BuilderDocsPage;
