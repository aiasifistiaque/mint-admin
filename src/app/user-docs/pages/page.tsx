'use client';

import UserGuide from '../_components/UserGuide';
import { A, C, H3, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * The page builder (Build → Pages, /builder) for projects. Section ids mirror
 * the platform's builder guide (workflow, settings, settings-linked, table,
 * table-status, table-totals, table-upload, filters, form, view) — the
 * builder's "How it works" links land here through panel.ts docsPath.
 */

const SECTIONS = [
	{ id: 'what', title: 'What it is' },
	{ id: 'workflow', title: 'Drafts and publishing' },
	{ id: 'settings', title: 'Settings' },
	{ id: 'settings-linked', title: 'Linked-record pickers' },
	{ id: 'table', title: 'Table' },
	{ id: 'table-status', title: 'Status moves' },
	{ id: 'table-totals', title: 'Totals' },
	{ id: 'table-upload', title: 'Bulk upload' },
	{ id: 'filters', title: 'Filters' },
	{ id: 'form', title: 'Form' },
	{ id: 'view', title: 'Detail page and tabs' },
	{ id: 'source', title: 'Versions' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Pages = () => (
	<UserGuide
		href='/user-docs/pages'
		sections={SECTIONS}
		open={{ href: '/builder', label: 'Open Pages' }}>
		<Section
			id='what'
			title='What it is'
			lead='Build → Pages: every model’s page, and how it looks and behaves.'>
			<P>
				Creating a <A href='/user-docs/models'>model</A> gives it a page. Pages lets you refine that page without touching the
				model: which columns the table shows, the filter chips, the form’s layout and rules, the record’s detail page and its
				tabs, the ⋯ menu on each row, bulk actions. Click a page in the list to open its editor; its tabs are below.
			</P>
			<Note>
				A model’s <em>fields</em> are changed in Models. Pages changes how those fields are shown and used.
			</Note>
		</Section>

		<Section
			id='workflow'
			title='Drafts and publishing'
			lead='Nothing changes for your team until you publish.'>
			<List
				ordered
				items={[
					<>
						<strong>Edit</strong> in any tab. <em>Undo changes</em> drops them.
					</>,
					<>
						<strong>Save draft</strong> keeps them on the server — they survive a reload and a teammate can carry on. Saving is
						refused while a tab shows an error (a menu item without a title, a filter without a field…).
					</>,
					<>
						<strong>Publish</strong>, with an optional note, makes the draft live. Each publish is a new version you can go
						back to.
					</>,
					<>
						<strong>Discard draft</strong> throws the draft away; the live page is untouched.
					</>,
				]}
			/>
			<P>
				The <strong>Overview</strong> tab sums the page up — its fields, columns, filters and sections, and whether a draft is
				waiting — with each card opening its tab.
			</P>
		</Section>

		<Section
			id='settings'
			title='Settings'
			lead='How the server treats each field.'>
			<Terms
				head={['Switch', 'Once published']}
				rows={[
					['Required', 'Must be filled in when a record is added.'],
					['Unique', 'A second record with the same value is refused.'],
					['Editable', 'Can be changed after the record is created.'],
					['Sortable', 'The table can sort by it.'],
					['Searchable', 'The search box matches it.'],
					['Hidden', 'Never shown or returned — not even to you.'],
					['Trim', 'Spaces around the value are removed.'],
				]}
			/>
			<P>
				Each field’s expanded options set its label, the input the form uses (text, rich text, dropdown, tags, image picker,
				record picker…), how the table draws it, whether the column shows by default, and min/max. <C>createdAt</C> is always
				there and read-only.
			</P>
		</Section>

		<Section
			id='settings-linked'
			title='Linked-record pickers'
			lead='For a field that picks records of another model.'>
			<P>
				<strong>Add new from the form</strong> puts a <strong>+</strong> beside the picker: adding a booking for a guest who
				isn’t in the list yet, press +, fill in the guest, and they’re picked.
			</P>
			<P>
				<strong>Which records are offered</strong> narrows the list with conditions — <em>is</em>, <em>is not</em>,{' '}
				<em>is one of</em> — against a fixed value or another field of the same form. On an invoice: offer only the projects
				whose <C>client</C> is this form’s <C>client</C>; pick another client and a project that no longer fits is cleared.
			</P>
		</Section>

		<Section
			id='table'
			title='Table'
			lead='The page’s list: its header, columns, row menu and bulk actions.'>
			<Terms
				head={['Setting', 'What it does']}
				rows={[
					['Title / Subtitle', 'The page heading and the line under it.'],
					['Add button', 'Its label, and whether it opens the form in a dialog or on a page of its own.'],
					['Export button', 'Download the table as Excel, CSV or PDF.'],
					['Search / Filter row', 'The search box (matching Searchable fields) and the filter chips.'],
					['Clickable rows', 'Clicking a row opens the record.'],
					['Rows per page', 'The default page size.'],
					['Columns', 'Which columns the table can show, in order — drag to reorder. Each person can still hide columns for themselves.'],
				]}
			/>
			<H3>Row menu</H3>
			<P>
				The ⋯ on every row: quick view, the detail page, edit in a dialog or on a page, duplicate, delete, a link, quick-edit
				of one field, and more. Drag to reorder.
			</P>
			<H3>Bulk actions</H3>
			<P>
				<strong>Select rows</strong> adds checkboxes and a menu for what’s ticked: export, delete (with undo), duplicate,
				archive, change status, compare, merge duplicates, print, set a field, and totals. Each needs the matching permission —
				see <A href='/user-docs/records#bulk'>Working on many rows</A>.
			</P>
		</Section>

		<Section
			id='table-status'
			title='Status moves'
			lead='Which moves “Change status” allows.'>
			<P>
				Under Bulk actions, <strong>Status</strong> picks the model’s status field (any options field). Every move is allowed
				until you switch one off — from <em>Paid</em>, switch off the rest so a paid invoice can’t go back.{' '}
				<strong>Ask for a reason</strong> makes each move need one; it’s kept in the record’s history.
			</P>
		</Section>

		<Section
			id='table-totals'
			title='Totals'
			lead='“View total” for the ticked rows.'>
			<P>
				With rows selectable, the selection bar can add up the ticked rows: <em>Total amount</em>, <em>Average amount</em>,
				lowest, highest or count — across pages, counting only rows the person may see. Preset the calculations here, and
				choose whether people may calculate other number fields themselves.
			</P>
		</Section>

		<Section
			id='table-upload'
			title='Bulk upload'
			lead='Many records from a file.'>
			<P>
				Switch on <strong>Bulk upload</strong> and the table’s ⋯ menu offers it. Upload Excel (its first sheet), CSV or JSON,
				then <strong>Check file</strong>. The first row names the columns — a field’s key or its label, any case — and the
				dialog downloads a template.
			</P>
			<List
				items={[
					'Every row is checked like the add form would: required fields, allowed values, formulas, unique fields — against the table and within the file.',
					'Problems come back row by row, with the file’s row numbers, and nothing is saved until every row passes.',
					'Import then saves them all, or none: if one still fails, the ones saved are removed again.',
					'A linked record is found by its id, or by its name, code, title or email.',
					'Up to 2,000 rows or 10 MB at a time; it needs the Add permission on the model.',
				]}
			/>
		</Section>

		<Section
			id='filters'
			title='Filters'
			lead='The chips above the table.'>
			<P>
				Each card is one chip; drag to order them. The first four show, the rest go under “Show more filters”. Picking a field
				fills in a sensible type and options.
			</P>
			<Terms
				head={['Type', 'Lets people']}
				rows={[
					['Multi select', 'Pick any number of values'],
					['Select', 'Pick one value'],
					['Text', 'Match typed text'],
					['Yes / No', 'True or false'],
					['Number range', 'Equal, above, below, between'],
					['Date', 'On, before, after, between, in the last…'],
				]}
			/>
			<P>
				A select’s options can be typed on the card, be every record of another model, or every value the field currently
				holds.
			</P>
		</Section>

		<Section
			id='form'
			title='Form'
			lead='The add and edit form, in titled sections.'>
			<P>
				A section has a title, an optional description and rows; a row holds one field or several side by side. Drag sections
				and rows to reorder. Fields not placed anywhere are listed, so none are forgotten.
			</P>
			<H3>Conditional fields</H3>
			<P>
				<em>Make a field conditional…</em> shows it only when others hold certain values — “Company name when Type is Business”.
				Tests include is, is not, is one of, more/less than, is filled in, is empty, is on and is off; several conditions can
				all have to hold, or any one. Rules chain: a hidden field counts as empty to the rules that depend on it.
			</P>
			<P>
				The server applies the same rules: a hidden field’s value isn’t saved, and a required field is only required while
				it’s shown.
			</P>
		</Section>

		<Section
			id='view'
			title='Detail page and tabs'
			lead='The record’s own page and its quick-view dialog.'>
			<P>
				A list of sections, each with a title and 1–3 columns. Start from the form’s layout or from all fields. A section can
				hold the record’s own fields, chosen fields of a linked record (“Guest · Email”), or a list of related records (a
				guest’s bookings, newest first).
			</P>
			<H3>Tabs</H3>
			<P>
				After <em>Overview</em>, add tabs that list records of another model linked to this one — a client’s invoices, an
				author’s posts. Choose the columns, rows per page, and table or cards. Each tab has its own search, and an{' '}
				<em>Add</em> button that opens the other model’s form with this record already filled in.
			</P>
			<P>
				Every detail page also has a <strong>History</strong> tab: who changed what, and when.
			</P>
		</Section>

		<Section
			id='source'
			title='Versions'
			lead='Every publish is kept.'>
			<P>
				The <strong>Versions</strong> tab lists each published version with its note, who published it and when.{' '}
				<strong>Load as draft</strong> puts an older one in the draft; publish it to roll back.
			</P>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['My change doesn’t show', 'It’s still a draft. Publish it.'],
					['I can’t save the draft', 'A tab shows an error — look for the red marks.'],
					['A field can’t be added to the form', 'It isn’t Editable in Settings, or it’s a formula (worked out, not typed).'],
					['A new field isn’t in the table', 'Add it under Table → Columns, or turn on “In the table by default”.'],
					['Bulk upload says a linked record wasn’t found', 'Use the record’s id, or a name, code, title or email that matches one record.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Pages;
