'use client';

import { FC, ReactNode, useEffect } from 'react';
import { Box, Flex, Grid, Link, Table, Text } from '@chakra-ui/react';
import { Layout } from '@/components/library';
import { PageHeader } from '@/components/library/cl';

/**
 * The dashboard builder, explained for the people who arrange the dashboard.
 * Linked from the builder's header, its dialog and the save bar
 * (`/docs/dashboard-builder#<section>`), in a new tab.
 *
 * Section ids are link targets in dashboard-builder/_components; rename one
 * there too.
 */

const SECTIONS = [
	{ id: 'what', title: 'What it is' },
	{ id: 'layout', title: 'Arranging the dashboard' },
	{ id: 'widgets', title: 'Widgets' },
	{ id: 'numbers', title: 'Numbers' },
	{ id: 'charts', title: 'Charts' },
	{ id: 'recent', title: 'Recent items' },
	{ id: 'filters', title: 'Conditions' },
	{ id: 'access', title: 'Who sees what' },
	{ id: 'preview', title: 'The preview' },
	{ id: 'saving', title: 'Saving and resetting' },
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

const DashboardBuilderDocs = () => {
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
					{ href: '/dashboard-builder', title: 'Dashboard Builder' },
					{ href: '/docs/dashboard-builder', title: 'Guide' },
				]}
				title='Dashboard builder guide'
				meta='How to choose the numbers, charts and lists on the admin dashboard'
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
						lead='One screen to choose what the dashboard — the admin home page — shows: numbers, charts and lists of recent records, from any page of the admin.'>
						<P>
							Open it from <strong>Admin Sidebar → Dashboard Builder</strong>, or go to <C>/dashboard-builder</C>.
							It shows the dashboard as it will look, with live numbers, and lets you add, change, reorder and
							remove what&apos;s on it. Until a dashboard is saved here, the home page keeps its built-in cards.
						</P>
					</Section>

					<Section
						id='layout'
						title='Arranging the dashboard'
						lead='Widgets fill rows left to right, in order.'>
						<List
							items={[
								<>
									<strong>Add</strong> a widget with the buttons at the top: <em>Add number</em>,{' '}
									<em>Add chart</em> or <em>Add recent items</em>.
								</>,
								<>
									<strong>Move</strong> one by dragging it onto another widget&apos;s place.
								</>,
								<>
									<strong>Edit</strong> (pencil), <strong>duplicate</strong> (two squares) or{' '}
									<strong>remove</strong> (bin) with the buttons in its corner.
								</>,
								<>
									<strong>Size</strong> is set in the widget: a quarter, a third, half, two thirds or the full
									width of the dashboard. On a tablet a quarter or a third takes half the width; on a phone every
									widget is full width.
								</>,
							]}
						/>
					</Section>

					<Section
						id='widgets'
						title='Widgets'
						lead='Every widget reads one model — the records behind a page, like Projects or Invoices.'>
						<Terms
							rows={[
								['What it shows', 'Number, Chart or Recent items. Switching keeps the model, title and conditions.'],
								[
									'Model',
									'Where its records come from, picked by name, with its page beside it (Software · /projects). A model shown on more than one page gets a Served on choice.',
								],
								['Title', 'Its heading. Empty: one is made up from what it shows, like “Total amount · Invoices”.'],
								['Size', 'Its share of the dashboard’s width.'],
							]}
						/>
					</Section>

					<Section
						id='numbers'
						title='Numbers'
						lead='A single figure: how many records, or the total or average of a number field.'>
						<Terms
							rows={[
								['Measure', 'How many records, the total of a number field (revenue, quantity) or its average.'],
								['Time range', 'Today, the last 7, 30 or 90 days, this month, the last 12 months, this year, or all time.'],
								[
									'Dated by',
									'Which date the range reads — when the record was created, or another date field such as a due date.',
								],
								['Prefix / Suffix', 'Text around the number, e.g. BDT before a total or kg after a weight.'],
								[
									'Compare with the period before',
									'Adds how it moved against the same length of time just before (“12% up on the period before”). Not for all time.',
								],
							]}
						/>
						<P>
							Days, months and “today” follow each viewer&apos;s own time zone.
						</P>
					</Section>

					<Section
						id='charts'
						title='Charts'
						lead='The same measures, drawn either over time or broken down by a field.'>
						<Terms
							rows={[
								[
									'Over time',
									'One column (or point on a line) per day, week or month across the time range — new sign-ups a day, revenue a month. Empty days show as zero.',
								],
								[
									'Broken down by a field',
									'One slice or bar per value of a field — projects by status, invoices by client. Linked records show by their name; empty values as “Not set”.',
								],
								['Show the top', 'How many values get their own slice; the rest are added up as “Other”. A donut shows up to 7.'],
								['Drawn as', 'Columns or a line over time; a donut or bars for a breakdown.'],
							]}
						/>
						<P>
							Hover a column, a point or a slice to read its exact value.
						</P>
					</Section>

					<Section
						id='recent'
						title='Recent items'
						lead='A short table of records — the newest by default.'>
						<Terms
							rows={[
								[
									'Columns',
									'Up to six, in the order you pick them (the number on each button). None picked: the first columns of the page’s own table.',
								],
								['How many', 'From 3 to 20 rows.'],
								['Order', 'Newest or oldest first, or highest first by a number or date field — the biggest orders, the nearest due dates.'],
							]}
						/>
						<P>
							On the dashboard, the first column links to the record&apos;s page.
						</P>
					</Section>

					<Section
						id='filters'
						title='Conditions'
						lead='Count or list only some records.'>
						<P>
							Add conditions on the model&apos;s fields — <em>is</em>, <em>is not</em> or <em>is one of</em> a
							value: open projects only (<C>status is in-progress</C>), paid invoices, active admins. A record
							counts only when every condition holds. Hidden fields and secrets (passwords, tokens) can&apos;t be
							used.
						</P>
					</Section>

					<Section
						id='access'
						title='Who sees what'
						lead='A widget never shows anyone more than they could already open.'>
						<P>
							Everyone who opens the dashboard sees the same widgets, but each one fetches its numbers with the
							viewer&apos;s own permissions. Someone who can&apos;t open a page doesn&apos;t see its widgets at all;
							on records that are private to their owner, the numbers only include what that person may see.
						</P>
						<Note>
							Changing the dashboard needs the <C>edit-builder</C> permission (the same as the route builder).
							Every signed-in admin can view it.
						</Note>
					</Section>

					<Section
						id='preview'
						title='The preview'
						lead='The widget dialog shows the widget as you set it up, with real numbers.'>
						<P>
							It updates as you change the settings, so you can try a measure or a chart type before adding it.
							A widget you can&apos;t read says so here; on the dashboard it would just be left out for you.
						</P>
					</Section>

					<Section
						id='saving'
						title='Saving and resetting'
						lead='Nothing changes on the dashboard until you save.'>
						<List
							items={[
								<>
									While something is unsaved, a bar at the bottom offers <strong>Save changes</strong> and{' '}
									<strong>Discard</strong>. Saving replaces the dashboard for every admin straight away.
								</>,
								<>
									<strong>Built-in dashboard</strong> (at the top, once one is saved) deletes the saved widgets
									and brings back the original cards. It can&apos;t be undone.
								</>,
								<>Leaving the page with unsaved changes asks first.</>,
							]}
						/>
					</Section>

					<Section
						id='faq'
						title='Troubleshooting'>
						<Terms
							head={['Symptom', 'Why, and what to do']}
							rows={[
								[
									'A colleague doesn’t see a widget',
									'Their role can’t open that page. Give the role read permission for it, or accept that it’s hidden for them.',
								],
								['“Isn’t a number field”', 'The field picked for a total or average doesn’t store numbers. Pick another.'],
								[
									'“More than 400 days”',
									'An over-time chart over all time, by day, would be too long. Pick a shorter range or one bar per week or month.',
								],
								['A breakdown shows ids', 'The field links to records the dashboard can’t name. Pick a choice field instead.'],
								['I can’t save', 'Your role needs the edit-builder permission.'],
							]}
						/>
					</Section>
				</Box>
			</Grid>
		</Flex>
	);
};

const DashboardBuilderDocsPage = () => (
	<Layout
		title='Dashboard builder guide'
		path='dashboard-builder'>
		<DashboardBuilderDocs />
	</Layout>
);

export default DashboardBuilderDocsPage;
