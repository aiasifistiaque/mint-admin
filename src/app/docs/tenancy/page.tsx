'use client';

import DocsShell from '../_components/DocsShell';
import { FC, ReactNode, useEffect } from 'react';
import { Box, Flex, Grid, Link, Table, Text } from '@chakra-ui/react';
import GuideNav from '../_components/GuideNav';
import GuideHeader from '../_components/GuideHeader';

/**
 * Organizations, members, roles and projects — the tenant platform explained
 * for the people using it (docs: backend/docs/multi-tenancy). Linked from the
 * tenant panel's pages (`/docs/tenancy#<section>`), in a new tab.
 *
 * Section ids are link targets (components/library/tenant/GuideLink); rename
 * one there too.
 */
const Section: FC<{ id: string; title: string; lead?: ReactNode; children: ReactNode }> = ({ id, title, lead, children }) => (
	<Box
		as='section'
		id={id}
		scrollMarginTop='80px'
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

const Terms: FC<{ head?: [string, string]; rows: [ReactNode, ReactNode][] }> = ({ head = ['Field', 'What it does'], rows }) => (
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


const SECTIONS = [
	{ id: 'what', title: 'What it is' },
	{ id: 'organizations', title: 'Organizations' },
	{ id: 'members', title: 'Members and invitations' },
	{ id: 'roles', title: 'Roles' },
	{ id: 'projects', title: 'Projects' },
	{ id: 'building', title: 'Building a project' },
	{ id: 'connect-ai', title: 'Building with your own AI' },
	{ id: 'public-api', title: 'Public API' },
	{ id: 'customers', title: 'Customers and sign-in' },
	{ id: 'websites', title: 'Website projects' },
	{ id: 'analytics', title: 'Analytics' },
	{ id: 'security', title: 'Your account' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const TenancyDocs = () => {
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
			<GuideHeader
				href='/docs/tenancy'
				title='Organizations & projects'
				description='Your organization, its people and roles, and the apps and websites you build in it — with your own AI, a public API and analytics.'
				open={{ href: '/projects', label: 'Open Projects' }}
				mb={2}
			/>

			<Grid
				templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
				gap={10}
				alignItems='start'>
				<GuideNav sections={SECTIONS} />

				<Box
					maxW='760px'
					minW={0}>
					<Section
						id='what'
						title='What it is'
						lead='Everything you build lives in a project, and every project belongs to your organization.'>
						<P>
							An <strong>organization</strong> is your company or team. It has <strong>members</strong> (the people
							you invite), <strong>roles</strong> (what each of them may do) and <strong>projects</strong>. A project
							is an app or a website with its own models, pages, sidebar, dashboard and public API — nothing in one
							project is visible from another.
						</P>
						<P>
							The switcher at the top right shows where you are: the open project, and its organization under it.
							Use it to open another project or switch organization.
						</P>
					</Section>

					<Section
						id='organizations'
						title='Organizations'
						lead='Signing up makes one, with you as its owner. You can belong to several.'>
						<P>
							The answers you gave at sign-up — industry, team size, what you want to build — are on{' '}
							<Link href='/org/settings'>Organization → Settings</Link>, where the name and those answers can be
							changed. Make another organization from the switcher (<strong>New organization</strong>); switching
							signs you in to it on this device.
						</P>
						<P>
							Each organization has one <strong>owner</strong>. Only the owner can hand ownership to another member
							(Settings → Ownership; they become an Admin) and delete a project that holds records.
						</P>
					</Section>

					<Section
						id='members'
						title='Members and invitations'
						lead='Invite people by email; they join with the role you choose.'>
						<List
							ordered
							items={[
								<>
									Open <Link href='/org/members'>Members</Link> and press <strong>Invite</strong>.
								</>,
								<>Enter their email and pick a role. They get a link that works for 7 days.</>,
								<>
									Someone new makes an account from the link; someone who already has one signs in with their
									password. Either way they land in your organization.
								</>,
							]}
						/>
						<P>
							Waiting invitations are listed under the members — send one again or cancel it there. Changing a
							member’s role takes effect on their next click. Removing someone signs them out of your organization at
							once; their records stay.
						</P>
					</Section>

					<Section
						id='roles'
						title='Roles'
						lead='Owner, Admin and Member come with every organization; make others on the Roles page.'>
						<Terms
							head={['Permission', 'What it allows']}
							rows={[
								['Edit the organization', 'Its name and business details'],
								['Manage members', 'Invite people, change their roles, remove them'],
								['Manage roles', 'Create, edit and delete roles'],
								['Create projects', 'Start new apps and websites'],
								['Manage projects', 'Rename, archive and delete any project'],
								['Build', 'Models, pages, sidebar, dashboard and public API in every project'],
								['MCP keys', 'Create and revoke the keys AI assistants connect with'],
								['All records / Read all records', 'Every model’s records in every project — all actions, or only reading'],
							]}
						/>
						<P>
							Under <strong>Records, per model</strong> a role can instead get View / Add / Edit / Delete on single
							models. A model’s permission applies in every project that has a model at the same address.
						</P>
					</Section>

					<Section
						id='projects'
						title='Projects'
						lead='An app or a website, each a workspace of its own.'>
						<Terms
							head={['Kind', 'What you get']}
							rows={[
								['App', 'An empty workspace: build the models, pages and dashboard you need — a CRM, an internal tool, an API.'],
								['Website', 'The website kit: site settings, pages, per-page SEO and content blocks, a site API and analytics.'],
							]}
						/>
						<P>
							Make one from <Link href='/projects'>Projects</Link>. Its card menu edits the name, description and (for
							a website) its domains, archives it (read-only, its public API stops answering) or deletes it.
						</P>
						<Note tone='warn'>Deleting a project that has records deletes them, its files and its customers for good.</Note>
					</Section>

					<Section
						id='building'
						title='Building a project'
						lead='The Build section of the sidebar has the same tools the platform itself is built with.'>
						<Terms
							head={['Tool', 'What it does']}
							rows={[
								[<Link key='m' href='/model-builder'>Models</Link>, 'Define a model from fields; it gets a table, form, filters and detail page at once.'],
								[<Link key='p' href='/builder'>Pages</Link>, 'Fine-tune any model’s table columns, form, filters and detail page.'],
								[<Link key='s' href='/sidebar-builder'>Sidebar</Link>, 'Arrange the project’s sidebar.'],
								[<Link key='d' href='/dashboard-builder'>Dashboard</Link>, 'Numbers, charts and recent lists for the project’s home.'],
								[<Link key='i' href='/images'>Media</Link>, 'The project’s images and files.'],
							]}
						/>
						<P>
							Each tool has its own guide: <Link href='/docs/builder'>Route builder</Link>,{' '}
							<Link href='/docs/sidebar-builder'>Sidebar builder</Link>,{' '}
							<Link href='/docs/dashboard-builder'>Dashboard builder</Link>, <Link href='/docs/media'>Media</Link>.
						</P>
					</Section>

					<Section
						id='connect-ai'
						title='Building with your own AI'
						lead='Connect Claude, ChatGPT or any MCP client and describe what you need.'>
						<P>
							On <Link href='/model-builder/connect'>Connect AI</Link>, make a key for the project and follow the
							steps for your assistant. It plans the models with you step by step and builds them in{' '}
							<strong>this project</strong> only, acting with your role. Revoke the key there any time.
						</P>
						<Note>The platform doesn’t run AI on your behalf — your own assistant does the describing.</Note>
					</Section>

					<Section
						id='public-api'
						title='Public API'
						lead='Let your own site or app read and write a model — you choose which actions, and who may call them.'>
						<P>
							On <Link href='/public-api'>Public API</Link>, switch a model to <strong>Public</strong> and tick its
							actions (List, Read one, Create, Update, Delete). Then choose who may call it:
						</P>
						<Terms
							head={['Who', 'Meaning']}
							rows={[
								['Anyone', 'No sign-in — a product catalogue, a blog.'],
								['Signed-in customers', 'Only your customers, signed in (see below).'],
								['Customers — own records only', 'Each customer sees and changes only what they created — orders, bookings.'],
							]}
						/>
						<P>
							The address is <C>/public/api/&lt;project&gt;/&lt;model&gt;</C>. Only a model’s own fields go in and
							out; calculated fields are worked out on the server.
						</P>
					</Section>

					<Section
						id='customers'
						title='Customers and sign-in'
						lead='The people who use your site or app — separate from your organization’s members.'>
						<P>
							Add the sign-in widget (snippet on the Public API page) where people should sign in or create an
							account. After that your page’s code calls <C>MintAuth.fetch('orders')</C> as the signed-in customer.
							See and switch off customers under <Link href='/t/customers'>Customers</Link>.
						</P>
					</Section>

					<Section
						id='websites'
						title='Website projects'
						lead='A website project starts with the website kit — ordinary models you can change.'>
						<Terms
							head={['Model', 'Holds']}
							rows={[
								['Site settings', 'Name, logo, colours, contact details, social links, default SEO'],
								['Pages', 'Each page’s path, status, template and place in the menu'],
								['SEO', 'Title, description, share image and keywords for each page'],
								['Contents', 'The page’s content blocks — text, lists, cards, rich text, images, galleries, video'],
							]}
						/>
						<P>
							Your site renders a page with two calls: <C>/site</C> (settings and menu) and{' '}
							<C>/pages/by-path?path=/about</C> (the published page, its SEO and its visible contents in order).
						</P>
					</Section>

					<Section
						id='analytics'
						title='Analytics'
						lead='Visits to your website, without cookies.'>
						<P>
							Add the tracking snippet (Public API page) to every page of the site, and list its domains on the
							project — only visits from them count. <Link href='/analytics'>Analytics</Link> shows page views,
							visitors, visits, pages per visit and bounce rate against the previous period, page views per day,
							and the top pages, referrers, devices, countries, clicks and events.
						</P>
						<P>
							Links to other sites and anything marked <C>data-track="name"</C> count as clicks;{' '}
							<C>MintAnalytics.track('signup', {'{'} plan: 'pro' {'}'})</C> records your own events.
						</P>
					</Section>

					<Section
						id='security'
						title='Your account'
						lead='Two-step sign-in and your signed-in devices work as on the platform.'>
						<P>
							Turn on two-factor authentication and see where you’re signed in from{' '}
							<Link href='/settings'>Settings</Link> — the <Link href='/docs/two-factor'>Sign-in & security</Link>{' '}
							guide explains passkeys and backup codes.
						</P>
					</Section>

					<Section
						id='faq'
						title='Troubleshooting'>
						<Terms
							head={['Symptom', 'Why, and what to do']}
							rows={[
								['I was signed out suddenly', 'You were removed from the organization, or it was switched off. Sign in again.'],
								['A teammate can’t see a model', 'Their role lacks that model’s View (or All records). Edit the role.'],
								['My site gets 404 from the public API', 'The model isn’t Public, the action isn’t ticked, or the project is archived.'],
								['My site gets 401', 'The model is for signed-in customers — sign in with the widget first.'],
								['Analytics shows nothing', 'Check the snippet is on the pages and the site’s domain is listed on the project.'],
								['I can’t delete a project', 'It has records — only the owner can delete it, by typing its name.'],
							]}
						/>
					</Section>
				</Box>
			</Grid>
		</Flex>
	);
};

const TenancyDocsPage = () => (
	<DocsShell
		current='/docs/tenancy'
		requireLogin>
		<TenancyDocs />
	</DocsShell>
);

export default TenancyDocsPage;
