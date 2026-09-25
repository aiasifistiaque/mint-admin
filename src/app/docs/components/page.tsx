'use client';

import { useEffect } from 'react';
import { Box, Flex, Grid, Link, Text } from '@chakra-ui/react';

import { Layout, useAppDispatch, clearFilters } from '@/components/library';
import { PageHeader } from '@/components/library/cl';
import {
	BooleanFilter,
	DateFilter,
	MultiSelectFilter,
	RangeFilter,
	SelectFilter,
	TextFilter,
} from '@/components/library/dynamic-filters/filters';

import { C, Code, H3, P, Preview, Props, PropRow, Section } from './_components/ui';

/**
 * The admin's component library: every reusable component, with a live
 * example, its props and how to use it. Filters only for now — add a group to
 * `NAV` and its sections below to document more.
 */

const NAV: { group: string; items: { id: string; title: string }[] }[] = [
	{
		group: 'Filters',
		items: [
			{ id: 'filters', title: 'Overview' },
			{ id: 'multi-select-filter', title: 'Multi-select' },
			{ id: 'select-filter', title: 'Select' },
			{ id: 'boolean-filter', title: 'Boolean' },
			{ id: 'date-filter', title: 'Date' },
			{ id: 'range-filter', title: 'Range' },
			{ id: 'text-filter', title: 'Text' },
			{ id: 'filter-building-blocks', title: 'Building blocks' },
		],
	},
];

/* ---------- shared prop rows ---------- */

const FIELD: PropRow = {
	name: 'field',
	type: 'string',
	required: true,
	description: 'The query-string key the filter writes to the table store, and so to the API request.',
};
const LABEL: PropRow = {
	name: 'label',
	type: 'string',
	description: 'Text on the chip. The applied value is appended after a bar: “Status | Open”.',
};
const TITLE: PropRow = {
	name: 'title',
	type: 'string',
	description: 'Heading at the top of the popover (and of the bottom sheet on mobile).',
};
const OPTIONS: PropRow = {
	name: 'options',
	type: '{ value: string; label: string }[]',
	required: true,
	description: 'The choices. Searched by label.',
};

/* ---------- example data ---------- */

const STATUS_OPTIONS = [
	{ value: 'new', label: 'New' },
	{ value: 'open', label: 'Open' },
	{ value: 'contacted', label: 'Contacted' },
	{ value: 'qualified', label: 'Qualified' },
	{ value: 'won', label: 'Won' },
	{ value: 'lost', label: 'Lost' },
];

const CITY_OPTIONS = ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Sylhet', 'Barishal', 'Rangpur', 'Mymensingh', 'Cumilla'].map(
	city => ({ value: city.toLowerCase(), label: city })
);

const SOURCE_OPTIONS = [
	{ value: 'google', label: 'Google' },
	{ value: 'facebook', label: 'Facebook' },
	{ value: 'referral', label: 'Referral' },
];

/* ---------- the page ---------- */

const ComponentDocs = () => {
	const dispatch = useAppDispatch();

	// The examples write to the same table store real tables read, and nothing
	// resets it between pages — start clean, and don't leave example filters
	// applied to whichever table is opened next.
	useEffect(() => {
		dispatch(clearFilters());
		const id = decodeURIComponent(window.location.hash.slice(1));
		if (id) document.getElementById(id)?.scrollIntoView();
		return () => {
			dispatch(clearFilters());
		};
	}, [dispatch]);

	return (
		<Flex
			direction='column'
			gap={6}
			pb={16}>
			<PageHeader
				breadcrumbs={[
					{ href: '/dashboard', title: 'Home' },
					{ href: '/docs/components', title: 'Components' },
				]}
				title='Component library'
				meta='Reusable admin components, with live examples, their props and how to use them'
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
					{NAV.map(group => (
						<Box
							key={group.group}
							mb={6}>
							<Text
								fontSize='11px'
								fontWeight='500'
								letterSpacing='0.04em'
								textTransform='uppercase'
								color='fg.muted'
								mb={2}>
								{group.group}
							</Text>
							<Flex
								direction='column'
								gap={1}>
								{group.items.map(item => (
									<Link
										key={item.id}
										href={`#${item.id}`}
										fontSize='sm'
										color='fg.muted'
										_hover={{ color: 'fg', textDecoration: 'none' }}>
										{item.title}
									</Link>
								))}
							</Flex>
						</Box>
					))}
				</Box>

				<Box
					maxW='800px'
					minW={0}>
					<Section
						id='filters'
						title='Filters'
						lead='The chips above a table. Each opens a popover (a bottom sheet on mobile) and writes one key to the table’s query when applied.'>
						<P>
							Routes don&apos;t render filters by hand. A field declares one under <C>filter</C> in its backend
							settings file (or in the route builder&apos;s Filters tab), and <C>DynamicFilters</C> renders the
							matching component above the table. Applying a filter dispatches <C>applyFilters</C> into{' '}
							<C>state.table.filters</C>; the table sends those as query parameters, and the backend turns them
							into the Mongo query.
						</P>
						<Code label='backend — <model>/settings.ts'>{`status: {
	title: 'Status',
	type: 'string',
	filter: {
		name: 'status',
		field: 'status_in',       // query key; multi-selects use <name>_in
		type: 'multi-select',     // multi-select | select | boolean | date | range | text
		label: 'Status',          // chip text
		title: 'Filter by status', // popover heading
		options: [
			{ value: 'open', label: 'Open' },
			{ value: 'won', label: 'Won' },
		],
	},
},`}</Code>
						<P>
							Every filter shares the same popover: a title, the controls, and a footer with a clear action on the
							left and <strong>Cancel</strong> / <strong>Apply</strong> on the right. Nothing reaches the table
							until Apply. The × on an active chip removes that filter straight away. Try them below — the strip
							under each example shows the query it writes.
						</P>
					</Section>

					<Section
						id='multi-select-filter'
						title='Multi-select'
						lead='Pick any number of values. Checkbox rows with a search box.'>
						<Preview fields={['status']}>
							<MultiSelectFilter
								field='status_in'
								label='Status'
								title='Filter by status'
								options={STATUS_OPTIONS}
							/>
						</Preview>
						<P>
							Writes the chosen values as a comma list, <C>status_in=open,won</C>, which the backend reads as{' '}
							<C>$in</C> only under an <C>_in</C> key. <strong>Clear all</strong> and <strong>Select all</strong>{' '}
							act on the options the search is showing.
						</P>
						<H3>Props</H3>
						<Props rows={[FIELD, OPTIONS, LABEL, TITLE]} />
						<H3>Usage</H3>
						<Code label='tsx'>{`import { MultiSelectFilter } from '@/components/library/dynamic-filters/filters';

<MultiSelectFilter
	field='status_in'
	label='Status'
	title='Filter by status'
	options={[
		{ value: 'open', label: 'Open' },
		{ value: 'won', label: 'Won' },
	]}
/>`}</Code>
						<P>
							In a settings file, options can also come from another model (<C>category: &apos;model&apos;</C>,{' '}
							<C>model</C>, <C>key</C>) or from the values the field already holds (<C>category: &apos;distinct&apos;</C>
							). The backend resolves them into <C>options</C> before the admin sees the filter.
						</P>
					</Section>

					<Section
						id='select-filter'
						title='Select'
						lead='Pick exactly one value. Radio rows; a search box appears once there are more than seven options.'>
						<Preview fields={['source', 'city']}>
							<SelectFilter
								field='source'
								label='Source'
								title='Filter by source'
								options={SOURCE_OPTIONS}
							/>
							<SelectFilter
								field='city'
								label='City'
								title='Filter by city'
								options={CITY_OPTIONS}
							/>
						</Preview>
						<P>
							Writes the value as-is: <C>source=google</C>. Use it over a multi-select when the field can only ever
							match one value at a time.
						</P>
						<H3>Props</H3>
						<Props rows={[FIELD, OPTIONS, LABEL, TITLE]} />
						<H3>Usage</H3>
						<Code label='tsx'>{`import { SelectFilter } from '@/components/library/dynamic-filters/filters';

<SelectFilter
	field='source'
	label='Source'
	title='Filter by source'
	options={[
		{ value: 'google', label: 'Google' },
		{ value: 'referral', label: 'Referral' },
	]}
/>`}</Code>
					</Section>

					<Section
						id='boolean-filter'
						title='Boolean'
						lead='True or false. Two radio rows.'>
						<Preview fields={['hasWebsite']}>
							<BooleanFilter
								field='hasWebsite'
								label='Has website'
								title='Filter by website'
							/>
						</Preview>
						<P>
							Writes <C>hasWebsite=true</C> or <C>hasWebsite=false</C>. <strong>Clear</strong> un-picks the
							radio, so Apply then removes the filter.
						</P>
						<H3>Props</H3>
						<Props rows={[FIELD, LABEL, TITLE]} />
						<H3>Usage</H3>
						<Code label='tsx'>{`import { BooleanFilter } from '@/components/library/dynamic-filters/filters';

<BooleanFilter
	field='isActive'
	label='Is active'
	title='Filter by status'
/>`}</Code>
					</Section>

					<Section
						id='date-filter'
						title='Date'
						lead='Pick a condition from the dropdown, then fill in the inputs that appear under it.'>
						<Preview fields={['createdAt']}>
							<DateFilter
								field='createdAt'
								label='Created'
								title='Filter by created date'
							/>
						</Preview>
						<P>
							Opens on “Is in the last 7 days” when nothing is applied. The condition decides the key; Apply
							stays disabled until its inputs are complete, and <strong>Clear</strong> empties the dropdown so
							Apply removes the filter.
						</P>
						<Props
							head={['Comparison', 'Key', 'Example value']}
							plainNames
							rows={[
								{ name: 'Is in the last', type: 'createdAt_last', description: <C>days_7</C> },
								{ name: 'Is equal to', type: 'createdAt', description: <C>2026-09-01</C> },
								{ name: 'Is between', type: 'createdAt_btwn', description: <C>2026-09-01_2026-09-30</C> },
								{ name: 'Is on or after', type: 'createdAt_gte', description: <C>2026-09-01</C> },
								{ name: 'Is before', type: 'createdAt_lte', description: <C>2026-09-01</C> },
							]}
						/>
						<P>
							Switching comparisons replaces the old key rather than adding a second one, so only one date
							condition is ever applied per field.
						</P>
						<H3>Props</H3>
						<Props rows={[FIELD, LABEL, TITLE]} />
						<H3>Usage</H3>
						<Code label='tsx'>{`import { DateFilter } from '@/components/library/dynamic-filters/filters';

<DateFilter
	field='createdAt'
	label='Created'
	title='Filter by created date'
/>`}</Code>
					</Section>

					<Section
						id='range-filter'
						title='Range'
						lead='Numbers: equal to, between, at least or at most. Same structure as the date filter — a condition dropdown with its inputs under it.'>
						<Preview fields={['price']}>
							<RangeFilter
								field='price'
								label='Price'
								title='Filter by price'
							/>
						</Preview>
						<Props
							head={['Comparison', 'Key', 'Example value']}
							plainNames
							rows={[
								{ name: 'Is equal to', type: 'price', description: <C>500</C> },
								{ name: 'Is between', type: 'price_btwn', description: <C>100_500</C> },
								{ name: 'Is at least', type: 'price_gte', description: <C>100</C> },
								{ name: 'Is at most', type: 'price_lte', description: <C>500</C> },
							]}
						/>
						<P>
							The backend&apos;s <C>gte</C> and <C>lte</C> are inclusive, hence “at least” and “at most”.
						</P>
						<H3>Props</H3>
						<Props rows={[FIELD, LABEL, TITLE]} />
						<H3>Usage</H3>
						<Code label='tsx'>{`import { RangeFilter } from '@/components/library/dynamic-filters/filters';

<RangeFilter
	field='price'
	label='Price'
	title='Filter by price'
/>`}</Code>
					</Section>

					<Section
						id='text-filter'
						title='Text'
						lead='Match typed text. One input; Enter applies.'>
						<Preview fields={['email']}>
							<TextFilter
								field='email'
								label='Email'
								title='Find by email'
							/>
						</Preview>
						<P>
							Writes what was typed: <C>email=hello@example.com</C>. How it matches (exact or partial) is up to the
							backend for that field.
						</P>
						<H3>Props</H3>
						<Props rows={[FIELD, LABEL, TITLE]} />
						<H3>Usage</H3>
						<Code label='tsx'>{`import { TextFilter } from '@/components/library/dynamic-filters/filters';

<TextFilter
	field='email'
	label='Email'
	title='Find by email'
/>`}</Code>
					</Section>

					<Section
						id='filter-building-blocks'
						title='Building blocks'
						lead='What the filters above are made of — reach for these when a new filter type is needed, so it matches the rest.'>
						<Props
							head={['Component', 'Kind', 'What it is for']}
							rows={[
								{
									name: 'PopModal',
									type: 'component',
									description: (
										<>
											The shell: a popover on desktop, a bottom sheet on mobile. Pass <C>footerStart</C> for the
											split footer (your actions left, Cancel / Apply right), <C>width</C> for the popover width
											(filters use <C>330px</C>), and <C>applyDisabled</C> while inputs are incomplete.
										</>
									),
								},
								{
									name: 'PopModalHeader',
									type: 'component',
									description: 'The small uppercase title (a sheet title on mobile).',
								},
								{
									name: 'PopModalBody',
									type: 'component',
									description: 'Padded column for the controls, 12px between children.',
								},
								{
									name: 'PopModalFooterLink',
									type: 'component',
									description: 'Quiet button for the left of the footer: Clear, Clear all, Select all.',
								},
								{
									name: 'FilterOptionList',
									type: 'component',
									description:
										'Column for option rows. Its negative margin lets row hovers reach the popover edge while the boxes line up with the title.',
								},
								{
									name: 'FilterCheckbox',
									type: 'component',
									description: (
										<>
											Checkbox row. <C>labelProps</C> / <C>controlProps</C> style the text and the box.
										</>
									),
								},
								{
									name: 'FilterRadio',
									type: 'component',
									description: (
										<>
											Radio row for inside a <C>RadioGroup.Root</C>; the chosen row stays highlighted.
										</>
									),
								},
								{
									name: 'FilterInput',
									type: 'component',
									description: (
										<>
											Text, number or date (<C>date</C> prop) input at the shared filter control height.
										</>
									),
								},
								{
									name: 'FilterSelect',
									type: 'component',
									description: (
										<>
											Dropdown with the native <C>&lt;option&gt;</C> children API, same height as{' '}
											<C>FilterInput</C>. Prefer radio rows when the choices fit on screen.
										</>
									),
								},
							]}
						/>
						<H3>A new filter, from the blocks</H3>
						<Code label='tsx'>{`const [val, setVal] = useState('');
const { onOpen, onClose, open } = useDisclosure();
const isMobile = useIsMobile();

<PopModal
	isMobile={isMobile}
	isOpen={open}
	onOpen={onOpen}
	onClose={onClose}
	handleClick={apply}
	width='330px'
	footerStart={
		<PopModalFooterLink onClick={() => setVal('')} disabled={!val}>
			Clear
		</PopModalFooterLink>
	}
	trigger={<PopoverTrigger>{chip}</PopoverTrigger>}>
	<PopModalHeader isMobile={isMobile}>Filter by priority</PopModalHeader>
	<PopModalCloseButton isMobile={isMobile} />
	<PopModalBody isMobile={isMobile}>
		<RadioGroup.Root
			size={{ base: 'md', md: 'sm' }}
			colorPalette='gray'
			value={val || null}
			onValueChange={e => setVal(e.value ?? '')}>
			<FilterOptionList>
				<FilterRadio value='high'>High</FilterRadio>
				<FilterRadio value='low'>Low</FilterRadio>
			</FilterOptionList>
		</RadioGroup.Root>
	</PopModalBody>
</PopModal>`}</Code>
					</Section>
				</Box>
			</Grid>
		</Flex>
	);
};

const ComponentDocsPage = () => (
	<Layout
		title='Components'
		path='docs'>
		<ComponentDocs />
	</Layout>
);

export default ComponentDocsPage;
