'use client';

import { FC, ReactNode, useMemo, useState } from 'react';
import { Badge, Box, Flex, Grid, Table, Text } from '@chakra-ui/react';
import TableData from '@/components/library/components/table/table-components/data/TableData';
import DataTable, { Column, SortDir } from '@/components/library/cl/DataTable';
import DocsShell from '../../_components/DocsShell';
import GuideHeader from '../../_components/GuideHeader';
import GuideNav from '../../_components/GuideNav';
import { C, Code, H3, P, Props, PropRow, Section } from '../_components/ui';
import { LibraryTabs } from '../_components/LibraryTabs';
import SafeDemo from '../_components/SafeDemo';

/**
 * Tables: the three table components, every cell type a column can use (live,
 * in a real table row, with its variations), the row menu's actions and the
 * route table's options.
 */

const NAV = [
	{
		group: 'Components',
		items: [
			{ id: 'components', title: 'The three tables' },
			{ id: 'data-table', title: 'DataTable' },
			{ id: 'route-table', title: 'Route table' },
		],
	},
	{
		group: 'Columns',
		items: [
			{ id: 'cells', title: 'Cell types' },
			{ id: 'cell-options', title: 'Column options' },
		],
	},
	{
		group: 'Route table',
		items: [
			{ id: 'row-menu', title: 'Row menu' },
			{ id: 'table-options', title: 'Table options' },
			{ id: 'layouts', title: 'List and card view' },
		],
	},
];

type CellExample = { label: string; value: any; props?: Record<string, any> };
type CellType = { type: string; what: string; examples: CellExample[] };

const CELLS: CellType[] = [
	{
		type: 'text',
		what: 'The value as text. The default for any column without a type.',
		examples: [
			{ label: 'Default', value: 'Acme Trading Ltd' },
			{ label: 'copy', value: 'INV-2026-0042', props: { copy: true } },
		],
	},
	{ type: 'number', what: 'A number with thousands separators.', examples: [{ label: 'Default', value: 1250000 }] },
	{ type: 'price', what: 'An amount in the store’s currency.', examples: [{ label: 'Default', value: 1250 }, { label: 'Empty', value: '' }] },
	{
		type: 'date',
		what: 'A date and time, relative when recent (“Today at 2:30 PM”).',
		examples: [{ label: 'Default', value: '2026-09-28T14:30:00.000Z' }],
	},
	{ type: 'date-only', what: 'A date, day first.', examples: [{ label: 'Default', value: '2026-10-01' }] },
	{ type: 'time', what: 'A time of day, as stored.', examples: [{ label: 'Default', value: '14:30' }] },
	{
		type: 'boolean',
		what: 'Yes or No.',
		examples: [
			{ label: 'true', value: true },
			{ label: 'false', value: false },
		],
	},
	{
		type: 'checkbox',
		what: 'A green or red dot with the value — for states like active/inactive.',
		examples: [
			{ label: 'true', value: true },
			{ label: 'false', value: false },
			{
				label: 'displayValue',
				value: true,
				props: { item: { displayValue: { true: 'Active', false: 'Inactive' } } },
			},
		],
	},
	{
		type: 'tag',
		what: 'A list as badges.',
		examples: [
			{ label: 'Default', value: ['summer', 'sale'] },
			{ label: 'colorPalette', value: ['paid'], props: { colorPalette: () => 'green' } },
		],
	},
	{
		type: 'image-text',
		what: 'A small image beside the text — a product or person with their picture.',
		examples: [{ label: 'Default', value: 'Mint Store', props: { imageKey: '/logo.png' } }],
	},
	{ type: 'external-link', what: 'A link that opens in a new tab.', examples: [{ label: 'Default', value: 'https://mintapp.shop' }] },
	{ type: 'file', what: 'A link to the file.', examples: [{ label: 'Default', value: '/tc-logo.svg' }] },
	{ type: 'password', what: 'Hidden, with a button to show it.', examples: [{ label: 'Default', value: 'correct-horse' }] },
	{
		type: 'data-array',
		what: 'How many items a list holds, in words.',
		examples: [{ label: 'Default', value: [{}, {}, {}] }],
	},
	{ type: 'data-array-count', what: 'How many items a list holds, as a number.', examples: [{ label: 'Default', value: [1, 2] }] },
	{
		type: 'invitation-status',
		what: 'An admin invitation’s state as a coloured badge.',
		examples: [
			{ label: 'pending', value: 'pending' },
			{ label: 'accepted', value: 'accepted' },
			{ label: 'cancelled', value: 'cancelled' },
		],
	},
];

const CELL_OPTIONS: PropRow[] = [
	{ name: 'dataKey', type: 'string', required: true, description: 'The field to show. A dotted path reads inside objects (customer.name).' },
	{ name: 'title', type: 'string', description: 'The column heading.' },
	{ name: 'type', type: 'cell type', description: <>How to draw the value — one of the types above. Default <C>text</C>.</> },
	{ name: 'copy', type: 'boolean', description: 'Click the cell to copy its value.' },
	{ name: 'colorPalette', type: '(value) => string', description: <>For <C>tag</C>: the badge colour, from the value.</> },
	{ name: 'displayValue', type: 'Record<string, string>', description: <>For <C>checkbox</C>: words for true and false.</> },
	{ name: 'imageKey', type: 'string', description: <>For <C>image-text</C>: the field holding the image.</> },
	{ name: 'editable', type: 'boolean', description: 'Edit the value in place, without opening the form.' },
	{ name: 'editType', type: 'string', description: <>With <C>editable</C>: the input to edit with (<C>text</C>, <C>number</C>, <C>date</C>, <C>select</C>…).</> },
	{ name: 'options', type: '{ label, value }[]', description: <>With <C>editType: &apos;select&apos;</C>: the choices.</> },
	{ name: 'default', type: 'boolean', description: 'Shown until the admin picks their own columns.' },
];

const MENU_ITEMS: PropRow[] = [
	{ name: 'view', type: 'page', description: 'Opens the record’s detail page.' },
	{ name: 'view-modal', type: 'modal', description: 'Shows the record in a quick-view dialog.' },
	{ name: 'edit-modal', type: 'drawer', description: 'Opens the edit form over the table.' },
	{ name: 'edit', type: 'page', description: 'Opens the edit form as its own page.' },
	{ name: 'duplicate', type: 'action', description: 'Copies the record.' },
	{ name: 'delete', type: 'action', description: 'Deletes after a confirm; undo from the toast.' },
	{ name: 'update-key', type: 'action', description: 'Sets one field to a fixed value (mark as paid).' },
	{ name: 'update-api', type: 'action', description: 'Calls an endpoint for the record.' },
	{ name: 'redirect', type: 'page', description: 'Goes to a path built from the record.' },
	{ name: 'custom-modal', type: 'modal', description: 'Opens a component of your own with the record.' },
];

const TABLE_OPTIONS: PropRow[] = [
	{ name: 'title', type: 'string', required: true, description: 'The page heading.' },
	{ name: 'path', type: 'string', required: true, description: 'The route the rows come from.' },
	{ name: 'button', type: 'object', description: <>The create button: <C>title</C>, and <C>isModal</C> with a form, or a <C>path</C> to go to.</> },
	{ name: 'menu', type: 'MenuItem[]', description: 'The row menu (above).' },
	{ name: 'select', type: '{ show, menu }', description: 'Checkboxes on rows, and the bulk actions for the selection.' },
	{ name: 'clickable / toPath', type: 'boolean / string', description: 'A click on a row opens toPath/<id>.' },
	{ name: 'export', type: 'boolean', description: 'The Export button (CSV).' },
	{ name: 'bulkUpload', type: '{ title }', description: 'Bulk upload from a spreadsheet, under the ⋯ menu.' },
	{ name: 'filters', type: 'boolean', description: 'The filter chips (defined per field). On by default.' },
	{ name: 'search', type: 'boolean', description: 'The search box. On by default.' },
	{ name: 'preferences / hidePreferences', type: 'string[] / boolean', description: 'Fixed columns, or hide the column picker.' },
	{ name: 'limit', type: 'number', description: 'Rows per page.' },
	{ name: 'preFilters', type: 'object', description: 'Filters always applied — the page only ever lists these rows.' },
];

/** One real table row: the type, then each example as a live cell. */
const CellRow: FC<{ cell: CellType }> = ({ cell }) => (
	<Table.Row
		id={`cell-${cell.type}`}
		scrollMarginTop='80px'
		bg='transparent'>
		<Table.Cell
			verticalAlign='top'
			w='200px'>
			<C>{cell.type}</C>
			<Text
				mt={1}
				fontSize='12px'
				color='fg.muted'
				whiteSpace='normal'>
				{cell.what}
			</Text>
		</Table.Cell>
		{[0, 1, 2].map(i => {
			const ex = cell.examples[i];
			if (!ex) return <Table.Cell key={i} />;
			return (
				<SafeDemo
					key={i}
					name={cell.type}>
					<TableData
						type={cell.type as any}
						{...(ex.props || {})}>
						{ex.value}
					</TableData>
				</SafeDemo>
			);
		})}
	</Table.Row>
);

const ExamplesHead: FC = () => (
	<Table.Header>
		<Table.Row bg='bg.subtle'>
			{['Type', 'Example', 'Variation', 'Variation'].map((h, i) => (
				<Table.ColumnHeader
					key={i}
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
);

/** Variation names, under the live table (a cell can't hold its own label). */
const VariationKey: FC = () => (
	<Flex
		direction='column'
		gap={1}
		mt={3}>
		{CELLS.filter(c => c.examples.length > 1).map(c => (
			<Text
				key={c.type}
				fontSize='12px'
				color='fg.muted'>
				<C>{c.type}</C>: {c.examples.map(e => e.label).join(' · ')}
			</Text>
		))}
	</Flex>
);

type Row = { id: string; name: string; plan: string; orders: number; joined: string };
const ROWS: Row[] = [
	{ id: '1', name: 'Acme Trading', plan: 'Pro', orders: 1240, joined: '2025-03-12' },
	{ id: '2', name: 'Blue Lake Café', plan: 'Basic', orders: 312, joined: '2026-01-04' },
	{ id: '3', name: 'Northwind', plan: 'Pro', orders: 88, joined: '2026-07-21' },
];

const DataTableDemo: FC = () => {
	const [sortKey, setSortKey] = useState('name');
	const [sortDir, setSortDir] = useState<SortDir>('asc');
	const rows = useMemo(
		() =>
			[...ROWS].sort((a: any, b: any) => {
				const d = typeof a[sortKey] === 'number' ? a[sortKey] - b[sortKey] : String(a[sortKey]).localeCompare(String(b[sortKey]));
				return sortDir === 'asc' ? d : -d;
			}),
		[sortKey, sortDir]
	);
	const columns: Column<Row>[] = [
		{ key: 'name', label: 'Name', sortable: true, render: r => <Text fontWeight='600'>{r.name}</Text> },
		{ key: 'plan', label: 'Plan', render: r => <Badge size='sm'>{r.plan}</Badge> },
		{ key: 'orders', label: 'Orders', numeric: true, sortable: true, render: r => r.orders.toLocaleString() },
		{ key: 'joined', label: 'Joined', sortable: true, render: r => r.joined },
	];
	return (
		<DataTable
			columns={columns}
			rows={rows}
			rowKey={r => r.id}
			sortKey={sortKey}
			sortDir={sortDir}
			onSort={key => {
				if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
				else {
					setSortKey(key);
					setSortDir('asc');
				}
			}}
		/>
	);
};

const Frame: FC<{ children: ReactNode }> = ({ children }) => (
	<Box
		borderWidth='1px'
		borderColor='border'
		borderRadius='md'
		overflowX='auto'>
		{children}
	</Box>
);

const TablesDocs = () => (
	<Flex
		direction='column'
		gap={6}
		pb={16}>
		<GuideHeader
			href='/docs/components'
			title='Tables'
			description='The table components, every cell type a column can use, and the route table’s row menu and options.'
			mb={0}
		/>
		<LibraryTabs current='/docs/components/tables' />

		<Grid
			templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
			gap={10}
			alignItems='start'>
			<GuideNav groups={NAV} />

			<Box
				maxW='800px'
				minW={0}>
				<Section
					id='components'
					title='The three tables'
					lead='Which one to use.'>
					<Props
						head={['Component', 'Where', 'Use it for']}
						plainNames
						rows={[
							{ name: 'Route table', type: 'Every route page', description: 'A route’s records: server paging, search, filters, row menu, selection, export. Configured, not coded.' },
							{ name: 'DataTable', type: 'Console pages', description: 'Rows you already have (Heroku apps, invoices): columns with your own render, sorting you own.' },
							{ name: 'View tab table', type: 'Detail pages', description: 'Linked records on a record’s tab, with search, paging and an add button.' },
						]}
					/>
				</Section>

				<Section
					id='data-table'
					title='DataTable'
					lead='Horizontal rules only; numbers right-aligned; the caller sorts.'>
					<Frame>
						<DataTableDemo />
					</Frame>
					<H3>Props</H3>
					<Props
						rows={[
							{ name: 'columns', type: 'Column[]', required: true, description: <><C>key</C>, <C>label</C>, <C>render(row)</C>; <C>numeric</C> right-aligns; <C>sortable</C> makes the heading a sort control; <C>width</C>.</> },
							{ name: 'rows', type: 'T[]', required: true, description: 'The rows, already sorted.' },
							{ name: 'rowKey', type: '(row) => string', required: true, description: 'A stable key per row.' },
							{ name: 'sortKey / sortDir / onSort', type: 'string / asc|desc / (key) => void', description: 'The current sort and the heading click. You sort the rows.' },
							{ name: 'onRowClick', type: '(row) => void', description: 'Makes rows clickable.' },
							{ name: 'rowActions', type: '(row) => ReactNode', description: 'A trailing cell, for a ⋯ menu.' },
						]}
					/>
					<Code label='tsx'>{`import DataTable from '@/components/library/cl/DataTable';

<DataTable
	columns={[
		{ key: 'name', label: 'Name', sortable: true, render: r => r.name },
		{ key: 'orders', label: 'Orders', numeric: true, render: r => r.orders },
	]}
	rows={rows}
	rowKey={r => r.id}
	sortKey={sortKey}
	sortDir={sortDir}
	onSort={onSort}
/>`}</Code>
				</Section>

				<Section
					id='route-table'
					title='Route table'
					lead='What every route page is: built from the route’s table config and its settings.'>
					<P>
						A route&apos;s page (<C>ServerPage</C>) reads its table config — columns, menu, buttons — from the
						route (the builder&apos;s <strong>Table</strong> tab) and draws each column with the cell for its
						type. Its parts are on this page: the cells, the row menu, the options. The filter chips above it are
						on <strong>Filters &amp; charts</strong>.
					</P>
				</Section>

				<Section
					id='cells'
					title='Cell types'
					lead='Every type a column can take — live, in a real table row. A column’s type comes from its field’s input unless the table config sets one.'>
					<Frame>
						<Table.Root
							size='sm'
							variant='line'>
							<ExamplesHead />
							<Table.Body>
								{CELLS.map(c => (
									<CellRow
										key={c.type}
										cell={c}
									/>
								))}
							</Table.Body>
						</Table.Root>
					</Frame>
					<VariationKey />
					<P>
						Two more are drawn by the table itself: <C>menu</C> (the row&apos;s ⋯ button, from <C>menu</C>) and{' '}
						<C>history</C> (a sentence about the record&apos;s last change, on the history table).
					</P>
				</Section>

				<Section
					id='cell-options'
					title='Column options'
					lead='A column in a table config (convertToTableFields, or the builder’s Table tab).'>
					<Props rows={CELL_OPTIONS} />
					<P>
						Function-valued options (<C>colorPalette</C>) belong in a route&apos;s schema in the admin code — the
						builder&apos;s settings travel as JSON and can&apos;t hold them.
					</P>
					<Code label='admin — models/<name>/<name>.schema.ts'>{`isPaid: {
	label: 'Is Paid',
	type: 'checkbox',
	displayInTable: true,
	colorPalette: (isPaid: boolean) => (isPaid ? 'green' : 'red'),
},
status: {
	label: 'Status',
	type: 'tag',
	tableType: 'tag',
	displayInTable: true,
},`}</Code>
				</Section>

				<Section
					id='row-menu'
					title='Row menu'
					lead='The ⋯ at the end of each row. Each entry has a title and a type.'>
					<Props
						head={['type', 'Opens', 'What it does']}
						rows={MENU_ITEMS}
					/>
					<Code label='table config'>{`menu: [
	{ title: 'View', type: 'view' },
	{ title: 'Edit', type: 'edit-modal', dataModel: formFields },
	{ title: 'Mark as paid', type: 'update-key', key: 'status', value: 'paid' },
	{ title: 'Delete', type: 'delete' },
],`}</Code>
				</Section>

				<Section
					id='table-options'
					title='Table options'
					lead='The route table’s config, as the builder’s Table tab edits it.'>
					<Props rows={TABLE_OPTIONS} />
				</Section>

				<Section
					id='layouts'
					title='List and card view'
					lead='The same table, two layouts.'>
					<P>
						Wide screens get rows and columns. On a phone the table turns each row into a card — every chosen
						column as a label and value, the ⋯ menu pinned to the card&apos;s corner — so nothing scrolls sideways.
						The columns shown are the admin&apos;s own choice (the column picker), saved per admin and per route.
					</P>
				</Section>
			</Box>
		</Grid>
	</Flex>
);

const TablesDocsPage = () => (
	<DocsShell
		current='/docs/components'
		requireLogin>
		<TablesDocs />
	</DocsShell>
);

export default TablesDocsPage;
