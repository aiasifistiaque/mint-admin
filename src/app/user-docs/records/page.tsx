'use client';

import UserGuide from '../_components/UserGuide';
import { A, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/** Everyday work with a model's records: tables, search, forms, the record page, bulk actions, import/export, history. */

const SECTIONS = [
	{ id: 'tables', title: 'Tables' },
	{ id: 'find', title: 'Search and filters' },
	{ id: 'add', title: 'Adding and editing' },
	{ id: 'record', title: 'A record’s page' },
	{ id: 'bulk', title: 'Working on many rows' },
	{ id: 'export', title: 'Exporting' },
	{ id: 'import', title: 'Importing from a file' },
	{ id: 'history', title: 'History and undo' },
	{ id: 'permissions', title: 'What you can do' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Records = () => (
	<UserGuide
		href='/user-docs/records'
		sections={SECTIONS}>
		<Section
			id='tables'
			title='Tables'
			lead='Each model’s page in the sidebar opens its table.'>
			<P>
				Rows are records, newest first unless the page says otherwise. Click a column header to sort by it, click a row to
				open the record, and use the ⋯ on a row for quick view, edit, duplicate, delete and whatever else the page offers.
				Move between pages at the bottom and choose how many rows a page shows.
			</P>
			<P>
				The settings button above the table chooses which columns <em>you</em> see. That’s saved for you only — your teammates
				keep theirs. What columns exist at all is set in <A href='/user-docs/pages#table'>Pages</A>.
			</P>
		</Section>

		<Section
			id='find'
			title='Search and filters'>
			<List
				items={[
					'The search box matches the fields the page makes searchable.',
					'Filter chips narrow the table — by status, by date (on, before, after, between, in the last…), by a linked record, by a number range. The first four show; the rest are under “Show more filters”.',
					'Filters and search combine. Clear a chip to drop it.',
					'Exports and totals use what the filters and search show, not just the current page.',
				]}
			/>
		</Section>

		<Section
			id='add'
			title='Adding and editing'>
			<P>
				The add button opens the form in a side panel that keeps the table in view (a sheet from the bottom on a phone), or
				on a page of its own if the page is set up that way.
				Required fields are marked; the server checks everything again on save and points at what’s wrong.
			</P>
			<List
				items={[
					'Pickers for linked records search as you type. A + beside one adds a new linked record without leaving the form.',
					'Some fields only appear when others have certain values — choose “Business” and the company name field shows.',
					'Calculated fields fill themselves in as you type and can’t be edited.',
					'Images and files upload straight into the project’s Media, or pick one already there.',
				]}
			/>
		</Section>

		<Section
			id='record'
			title='A record’s page'
			lead='Click a row to open it.'>
			<P>
				<strong>Overview</strong> lays the record out in sections. Linked records show as chips — hover for a card, click to
				open. Further tabs list records linked to this one (a client’s invoices), each with search and an <em>Add</em> button
				that fills in the link for you. <strong>History</strong> shows every change. <strong>Edit</strong> opens the form.
			</P>
		</Section>

		<Section
			id='bulk'
			title='Working on many rows'
			lead='When the page allows selecting rows, tick them and use the menu that appears.'>
			<Terms
				head={['Action', 'What it does']}
				rows={[
					['Export', 'The ticked rows, or every row matching the filters, to Excel, CSV or PDF.'],
					['Delete', 'Deletes them after you confirm — with Undo for 10 seconds.'],
					['Duplicate', 'A copy of each, optionally with some fields set (a status back to Draft).'],
					['Archive', 'Hides them from the list, counts and dashboard without deleting. The Archive switch above the table shows them again.'],
					['Change status', 'Moves them to another status, following the allowed moves.'],
					['Compare', '2–4 records side by side, differences marked.'],
					['Merge duplicates', 'Keeps one record, picks which values win, and moves everything linked to the others onto it.'],
					['Print / PDF', 'One record per page.'],
					['Set a field', 'The same value on every ticked row.'],
					['View total', 'Totals, averages and counts across the ticked rows.'],
				]}
			/>
		</Section>

		<Section
			id='export'
			title='Exporting'>
			<P>
				<strong>Export</strong> (in the page header, or for ticked rows) lets you pick the columns and their order, then
				downloads Excel, CSV or PDF — up to 20,000 rows, every row matching the filters and search, not just the page you see.
				Linked records come out as names and dates as dates.
			</P>
		</Section>

		<Section
			id='import'
			title='Importing from a file'
			lead='When the page has Bulk upload switched on: the ⋯ menu beside the add button.'>
			<List
				ordered
				items={[
					'Download the template, or use your own file — Excel, CSV or JSON. The first row names the columns: a field’s key or its label.',
					<>
						<strong>Check file</strong>. Every row is checked like the add form; problems come back row by row, and nothing is
						saved yet.
					</>,
					<>
						Fix them and check again. When every row passes, <strong>Import</strong> saves them all — or none, if something
						still fails.
					</>,
				]}
			/>
			<P>Up to 2,000 rows or 10 MB at a time. Linked records can be given by name, code, title or email.</P>
		</Section>

		<Section
			id='history'
			title='History and undo'>
			<List
				items={[
					'Every create, edit, status change and bulk action is written to the record’s History tab: who, when, and what changed.',
					'Deleting offers Undo for 10 seconds, which puts the records back exactly as they were.',
					'Archived rows are never lost — switch Archive on above the table and restore them.',
				]}
			/>
		</Section>

		<Section
			id='permissions'
			title='What you can do'
			lead='Your role decides, the same for every model in the projects you can open.'>
			<Terms
				head={['Permission', 'Lets you']}
				rows={[
					['View', 'See the page, its records, exports and totals.'],
					['Add', 'Create records, duplicate them, import from a file.'],
					['Edit', 'Change records, archive them, change their status.'],
					['Delete', 'Delete and merge records.'],
				]}
			/>
			<P>
				Each is a switch under <em>Records</em> in your role. Buttons you can’t use are hidden. Which projects you open is set
				on your membership. See <A href='/user-docs/organization#roles'>Roles and permissions</A>.
			</P>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['There’s no add button', 'Your role lacks Records: Add, or the page hides the button.'],
					['A record seems to have vanished', 'It may be archived — turn the Archive switch on above the table.'],
					['A column is missing', 'You may have hidden it — the settings button above the table brings it back.'],
					['Saving says a value already exists', 'That field is unique; another record has the same value.'],
				]}
			/>
			<Note>Records belong to the open project. Looking for something from another project? Switch to it first.</Note>
		</Section>
	</UserGuide>
);

export default Records;
