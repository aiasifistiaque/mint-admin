'use client';

import { FC, ReactNode, useEffect } from 'react';
import { Box, Flex, Grid, Link, Table, Text } from '@chakra-ui/react';
import { Layout } from '@/components/library';
import { PageHeader } from '@/components/library/cl';

/**
 * The sidebar builder, explained for the people who arrange the sidebar —
 * not for developers. Linked from the builder's header, each panel, both
 * dialogs and the save bar (`/docs/sidebar-builder#<section>`), always in a
 * new tab so it reads beside the builder.
 *
 * Section ids are link targets in sidebar-builder/_components; rename one
 * there too.
 */

const SECTIONS = [
	{ id: 'what', title: 'What it is' },
	{ id: 'arrange', title: 'Arranging the sidebar' },
	{ id: 'sections', title: 'Sections' },
	{ id: 'pages', title: 'Pages' },
	{ id: 'icons', title: 'Icons' },
	{ id: 'access', title: 'Who sees a page' },
	{ id: 'preview', title: 'The preview' },
	{ id: 'saving', title: 'Saving and discarding' },
	{ id: 'tables', title: 'The Sidebar Items and Categories tables' },
	{ id: 'faq', title: 'Troubleshooting' },
];

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

const SidebarBuilderDocs = () => {
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
					{ href: '/sidebar-builder', title: 'Sidebar Builder' },
					{ href: '/docs/sidebar-builder', title: 'Guide' },
				]}
				title='Sidebar builder guide'
				meta='How to add, arrange, hide and restrict the links in the admin sidebar'
			/>

			<Grid
				templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
				gap={10}
				alignItems='start'>
				<Box
					as='nav'
					display={{ base: 'none', lg: 'block' }}>
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
						title='What it is'
						lead='One screen for everything in the admin sidebar: its sections, the pages in them, their order, and who sees them.'>
						<P>
							The sidebar is made of <strong>sections</strong> (the headings with an icon, like “Accounts”) and{' '}
							<strong>pages</strong> (the links under them, like “Invoices”). The builder shows them the way the
							sidebar does, top to bottom, with a live preview beside them.
						</P>
						<P>
							Open it from <strong>Admin Sidebar → Sidebar Builder</strong>, or go to <C>/sidebar-builder</C>.
						</P>
						<Note>
							Nothing you do in the builder changes the sidebar until you press <strong>Save changes</strong>.
							Try things freely — <strong>Discard</strong> puts everything back.
						</Note>
					</Section>

					<Section
						id='arrange'
						title='Arranging the sidebar'
						lead='Order is top to bottom, exactly as it appears.'>
						<List
							items={[
								<>
									<strong>Move a page:</strong> drag it by the grip (⠿) on its left. Drop it higher or lower in the
									same section, or in another section to move it there. A blue line shows where it will land.
								</>,
								<>
									<strong>Move a section:</strong> drag the grip on its heading row. Its pages move with it.
								</>,
								<>
									<strong>No mouse, or a long list?</strong> Use the <strong>⋯</strong> menu on a row:{' '}
									<em>Move up</em> and <em>Move down</em>. To send a page to another section, open it and change{' '}
									<em>Section</em>.
								</>,
								<>
									<strong>Hide without deleting:</strong> the eye button on any row. Hidden rows stay in the builder
									(faded, marked “Hidden”) and can be shown again at any time.
								</>,
							]}
						/>
						<P>
							Rows you changed are marked <strong>Edited</strong>; rows not saved yet are marked <strong>New</strong>.
						</P>
					</Section>

					<Section
						id='sections'
						title='Sections'
						lead='Add one with “Add section” at the top; click a section’s name to edit it.'>
						<Terms
							rows={[
								['Name', 'The heading shown in the sidebar. Required.'],
								['Icon', <>Shown beside the name. See <Link href='#icons'>Icons</Link>.</>],
								['Show in the sidebar', 'Off hides the section and every page in it. Nothing is deleted.'],
								['Tooltip', 'Text shown when the pointer rests on the section.'],
								['Description', 'A note for whoever manages the sidebar. Not shown in the sidebar.'],
							]}
						/>
						<Note>
							A section with no visible pages doesn’t appear in the sidebar at all — add a page to it first.
						</Note>
						<Note tone='warn'>
							Deleting a section deletes the pages in it too. To keep a page, drag it into another section before
							deleting — or hide the section instead.
						</Note>
					</Section>

					<Section
						id='pages'
						title='Pages'
						lead='Add one with “Add page” at the top or under any section; click a page to edit it.'>
						<Terms
							rows={[
								['Label', 'The text of the link. Required.'],
								[
									'Page address',
									<>
										Where the link goes — the part of the admin address after the domain. For{' '}
										<C>https://admin…/invoices</C> type <C>invoices</C>. Required.
									</>,
								],
								['Section', 'Which heading it sits under. Changing it moves the page to the top of that section.'],
								['Show in the sidebar', 'Off hides the link. The page itself still works if someone has the address.'],
								[
									'Only people with a permission',
									<>
										Limits who sees the link. See <Link href='#access'>Who sees a page</Link>.
									</>,
								],
								['More options → Tooltip', 'Text shown when the pointer rests on the link (up to 200 characters).'],
								['More options → Description', 'A note for whoever manages the sidebar.'],
								['More options → Icon', 'Kept with the page. The sidebar currently shows icons on sections only.'],
							]}
						/>
						<P>
							Deleting a page only removes the link from the sidebar. The page and its data are untouched.
						</P>
					</Section>

					<Section
						id='icons'
						title='Icons'
						lead='Icons come from the free Lucide set and are chosen by name.'>
						<List
							ordered
							items={[
								<>
									Click <strong>Browse icon names on lucide.dev</strong> under the icon field. The catalogue opens in a
									new tab.
								</>,
								<>Search for what you want (“money”, “users”, “calendar”) and click an icon.</>,
								<>
									Copy its name — lowercase with dashes, like <C>circle-dollar-sign</C> — and paste it into the icon
									field.
								</>,
								<>The square beside the field shows the icon. If it stays empty, the name is misspelt.</>,
							]}
						/>
						<P>
							The icon list isn’t built into the admin on purpose: loading every icon to pick from would slow the
							page down for a choice made once.
						</P>
					</Section>

					<Section
						id='access'
						title='Who sees a page'
						lead='By default everyone who can sign in sees every visible page. A permission narrows that down.'>
						<P>
							Turn on <strong>Only people with a permission</strong> and pick one. The link then shows only for
							roles that hold that permission, and for roles that hold every permission (such as super admins). The
							builder marks these pages with a lock and the permission’s name.
						</P>
						<P>
							Pick the <strong>View</strong> permission of the page the link opens — for an “Invoices” link, “View
							Invoices (view-invoices)”. That way nobody is shown a link to a page they aren’t allowed to open.
						</P>
						<Note>
							This only hides the link. Access to the page itself is still checked by the page, whatever the
							sidebar shows. Roles and their permissions are managed on the <Link href='/adminroles'>Roles</Link>{' '}
							page.
						</Note>
					</Section>

					<Section
						id='preview'
						title='The preview'
						lead='The panel on the right is the sidebar as it will look after you save.'>
						<List
							items={[
								'Hidden sections and pages are left out, and so are sections with no visible pages — just like the real sidebar.',
								'Pages behind a permission show a small lock: whether a person sees them depends on their role.',
								'Sections can be folded open and closed to check the layout; the links don’t go anywhere.',
								'Dashboard is always first in the sidebar and can’t be moved.',
							]}
						/>
					</Section>

					<Section
						id='saving'
						title='Saving and discarding'
						lead='A bar at the bottom of the screen appears as soon as something is unsaved.'>
						<List
							items={[
								<>
									<strong>Save changes</strong> sends only what changed and updates the sidebar straight away for you.
									Other people see it the next time their admin loads the sidebar.
								</>,
								<>
									<strong>Discard</strong> throws away everything since the last save.
								</>,
								<>Leaving the page with unsaved changes asks you first.</>,
								<>A page without a label or address can’t be saved; the save tells you which one.</>,
							]}
						/>
						<Note>
							If the server refuses a change part way through, the builder stops, says why, and shows what was
							saved. Make the remaining changes again and save.
						</Note>
					</Section>

					<Section
						id='tables'
						title='The Sidebar Items and Categories tables'
						lead='The builder and the two tables under Admin Sidebar edit the same records.'>
						<P>
							<Link href='/sidebaritems'>Sidebar Items</Link> (pages) and{' '}
							<Link href='/sidebarcategories'>Sidebar Categories</Link> (sections) are still there for bulk work —
							turning permission on for many pages at once, exporting, filtering. A change made in either place
							shows up in the other.
						</P>
						<P>
							Order is stored as a <strong>priority</strong> number on each record: higher comes first. The builder
							sets it for you when you move things, and only for the list you rearranged.
						</P>
					</Section>

					<Section
						id='faq'
						title='Troubleshooting'>
						<Terms
							head={['Symptom', 'Why, and what to do']}
							rows={[
								['I saved but a section doesn’t show', 'It has no visible pages, or it’s hidden. Check the eye buttons.'],
								[
									'A colleague can’t see a page I added',
									'The page needs a permission their role doesn’t have. Pick another permission, turn the restriction off, or give their role the permission on the Roles page.',
								],
								['An icon doesn’t appear', 'The name doesn’t match a Lucide icon. Copy it again from lucide.dev.'],
								['The link opens a “not found” page', 'The page address is wrong. Check it against the address bar on the real page.'],
								[
									'I can’t save at all',
									'Your role needs create/edit/delete permission for sidebar items and sidebar categories.',
								],
							]}
						/>
					</Section>
				</Box>
			</Grid>
		</Flex>
	);
};

const SidebarBuilderDocsPage = () => (
	<Layout
		title='Sidebar builder guide'
		path='sidebar-builder'>
		<SidebarBuilderDocs />
	</Layout>
);

export default SidebarBuilderDocsPage;
