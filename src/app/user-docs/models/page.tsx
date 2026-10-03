'use client';

import UserGuide from '../_components/UserGuide';
import { A, C, H3, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * The model builder for projects. Section ids mirror the platform's builder
 * guide (models, models-*, features) — the model builder's "How it works"
 * links land here through panel.ts docsPath. Keep them.
 */

const SECTIONS = [
	{ id: 'models', title: 'What a model is' },
	{ id: 'models-wizard', title: 'Creating a model' },
	{ id: 'models-names', title: 'Names and addresses' },
	{ id: 'models-code', title: 'Record codes' },
	{ id: 'models-fields', title: 'Fields' },
	{ id: 'models-password', title: 'Password fields' },
	{ id: 'models-sections', title: 'Sections and lists' },
	{ id: 'formulas', title: 'Calculated fields' },
	{ id: 'models-links', title: 'Linking models' },
	{ id: 'models-access', title: 'Who sees the records' },
	{ id: 'changing', title: 'Changing a model' },
	{ id: 'features', title: 'Features built by AI' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Models = () => (
	<UserGuide
		href='/user-docs/models'
		sections={SECTIONS}
		open={{ href: '/model-builder', label: 'Open Models' }}>
		<Section
			id='models'
			title='What a model is'
			lead='A kind of thing your project keeps — customers, products, bookings, invoices.'>
			<P>
				A model is a list of fields. Creating one gives your project everything around it at once: a page in the sidebar with
				a table, search and filters, an add and edit form, a page for each record, a place on the dashboard builder, a
				permission for roles, and — if you want it — a <A href='/user-docs/public-api'>public API</A>. Nothing to deploy;
				it’s live as soon as it’s created.
			</P>
			<P>
				Models live under <strong>Build → Models</strong> and need the <em>Build</em> permission. They belong to the open
				project only.
			</P>
		</Section>

		<Section
			id='models-wizard'
			title='Creating a model'
			lead='New model opens a step-by-step wizard. Nothing is created until the last step.'>
			<List
				ordered
				items={[
					<>
						<strong>Model</strong> — its title, record code and fields.
					</>,
					<>
						<strong>Settings</strong> — which fields are required, editable, searchable and sortable.
					</>,
					<>
						<strong>Config</strong> — the page: its heading, add and export buttons, the ⋯ menu on each row, bulk actions.
					</>,
					<>
						<strong>Form</strong> — the add/edit form’s sections and rows.
					</>,
					<>
						<strong>Table</strong> — the columns and their order.
					</>,
					<>
						<strong>View</strong> — the record’s own page: its sections and the records linked to it.
					</>,
					<>
						<strong>Filters</strong> — the filter chips above the table.
					</>,
					<>
						<strong>Sidebar & create</strong> — the sidebar section for its page, a summary, and <strong>Create model</strong>
						.
					</>,
				]}
			/>
			<P>
				Every step after the first starts from sensible suggestions made from your fields, so you can press{' '}
				<strong>Next</strong> through them and change things later in <A href='/user-docs/pages'>Pages</A>. Going back and
				adding a field adds it everywhere; your other changes stay. Progress is kept in your browser, so a reload carries on
				where you were — <em>Start over</em> clears it.
			</P>
			<Note>
				Rather describe it? <A href='/user-docs/connect-ai'>Connect your own AI</A> — Claude, ChatGPT and others can plan and
				build models in your project from a conversation.
			</Note>
		</Section>

		<Section
			id='models-names'
			title='Names and addresses'>
			<P>
				From a title like “Invoices” the builder makes the name <C>Invoice</C> and the address <C>invoices</C> — the page’s
				address in the panel and the model’s in the public API. Names belong to your project alone: other projects, and the
				platform itself, can have a <C>Client</C> or an <C>Invoice</C> without touching yours. Only if this project already
				has a model by that name is a number added (<C>Invoice2</C>), shown before you save. A few addresses are the
				project’s own — <C>customers</C> is your site’s signed-in customers — so a <C>Customer</C> model keeps its name and
				gets the address <C>customers2</C>.
			</P>
			<P>The name and address are fixed once the model exists. The title can change any time.</P>
		</Section>

		<Section
			id='models-code'
			title='Record codes'>
			<P>
				<strong>Give every record a code</strong> numbers records as they’re created: a prefix, a dash and a padded number,
				like <C>INV-0001</C>. Two records created at the same moment never share one. Turning codes on for a model that has
				records gives them codes, oldest first; a new prefix applies from then on.
			</P>
			<P>
				Switching codes on fills in a prefix from the title (Invoices → <C>INV</C>); change it, or clear it for plain
				numbers (<C>0001</C>). <strong>First code</strong> beside it shows exactly what the next record gets.
			</P>
		</Section>

		<Section
			id='models-fields'
			title='Fields'
			lead='Each field has a label, a key, a kind, and whether it’s required.'>
			<P>
				The key is the field’s name in the API — filled in from the label until you change it. The chevron opens more:
				unique, searchable, shown in the table, min/max, allowed values, a default and help text for the form.
			</P>
			<Terms
				head={['Kind', 'Holds · shows as']}
				rows={[
					['Text', 'A line of text · searchable, sortable'],
					['Long text / Rich text', 'Paragraphs / formatted text with headings, lists and links'],
					['Email', 'An email address, checked and lower-cased'],
					['Link', 'A web address, checked · opens in a new tab'],
					['Number', 'A number, with optional min/max'],
					['Formula', 'A number worked out from other fields (see below)'],
					['Yes / No', 'A switch · a Yes/No filter'],
					['Date', 'A date; the default can be “when created”'],
					['Color', 'A colour, with a picker'],
					['Options', 'One of the values you list (a dropdown) — or several, with “Allow several”'],
					['Tags', 'A list of words, free or from allowed values'],
					['Image / Images', 'One uploaded picture / a gallery · from your Media'],
					['File / Files', 'Uploaded documents · download links'],
					['Video', 'An uploaded video'],
					['Link to a record / records', 'One or more records of another model — a booking’s guest, a post’s tags'],
					['Section / Section list', 'A group of fields, or rows of them (see below)'],
					['Password', 'A login or key you keep for someone — stored encrypted, hidden until you re-enter your password (see below)'],
				]}
			/>
			<List
				items={[
					<>
						<strong>Allowed values</strong>: the only values the field takes; the form offers them as a list. Anything else is
						refused.
					</>,
					<>
						<strong>Default</strong>: what a new record starts with — prefilled in the form, and used when your API call
						leaves it out.
					</>,
					<>
						Some keys are reserved: <C>_id</C>, <C>code</C>, <C>createdAt</C>, <C>updatedAt</C>, <C>customer</C>, and
						secret-looking names like <C>password</C> or <C>token</C>. Every model gets <C>createdAt</C> and <C>updatedAt</C>{' '}
						on its own.
					</>,
				]}
			/>
		</Section>

		<Section
			id='models-password'
			title='Password fields'
			lead='For a credential you keep on a record — a client’s portal login, a Wi-Fi key, a supplier account.'>
			<P>
				A field of the kind <strong>Password</strong> is stored encrypted. It’s never in a table’s data, a record, an export,
				the public API or an AI’s answers — tables and record pages show dots. The eye beside them asks for{' '}
				<strong>your own sign-in password</strong>, then shows the value, with copy, for a minute.
			</P>
			<List
				items={[
					<>The edit form starts empty: leave it empty to keep the stored value, or type a new one to replace it.</>,
					<>Only people who can see the record can reveal it — the role’s View permission and the record’s own access still apply.</>,
					<>History says the password changed, never what it was or is.</>,
					<>
						It can’t be unique, searched, sorted or filtered, and has no default. A key that says what it holds (
						<C>password</C>, <C>pin</C>, <C>token</C>) needs this kind — any other kind refuses it.
					</>,
					<>Not for your app’s own sign-in passwords: your site’s customers sign in through the public API’s customer accounts.</>,
				]}
			/>
		</Section>

		<Section
			id='models-sections'
			title='Sections and lists'>
			<P>
				A <strong>Section</strong> groups fields under one key — an address with street, city and postcode. A{' '}
				<strong>Section list</strong> is rows of the same fields, as many as needed — an invoice’s lines, each with an item,
				quantity, rate and total. Choosing either opens its own field editor, starting from an example you can change; the
				row’s “5 fields: …” button opens it again. Inside, fields can be text, long text, email, link, colour, number,
				formula, yes/no, date, options, image or file.
			</P>
		</Section>

		<Section
			id='formulas'
			title='Calculated fields'
			lead='A Formula field works itself out from other number fields.'>
			<P>
				Build it from the field list, the operators (+ − × ÷ %, brackets) and functions (<C>round</C>, <C>floor</C>,{' '}
				<C>ceil</C>, <C>abs</C>, <C>min</C>, <C>max</C>), or type it: <C>total - paid</C>,{' '}
				<C>round(price * qty * 1.05, 2)</C>. Over a section list, <C>sum(items.total)</C>, <C>avg(items.total)</C> and{' '}
				<C>count(items)</C>; a formula inside a row uses that row’s values (<C>quantity * rate</C>). <em>Try it</em> works it
				out on sample numbers.
			</P>
			<P>
				A formula field can’t be typed into: forms show the result as you type, and the server calculates it on every save —
				from the panel and from your API alike. Changing a formula recalculates existing records. Empty counts as 0; dividing
				by 0 leaves it empty.
			</P>
		</Section>

		<Section
			id='models-links'
			title='Linking models'
			lead='A “Link to a record” field connects two models.'>
			<P>
				A booking links to its guest; an order to its customer; a page to its parent page. The form shows a picker, the table
				shows the linked record by its <strong>display field</strong> (the first text field unless you choose), and the linked
				record’s page can list everything pointing at it as a tab — a guest’s bookings. A model others link to can’t be
				deleted until those fields are removed.
			</P>
		</Section>

		<Section
			id='models-access'
			title='Who sees the records'
			lead='Your role and your projects decide — and, where a model needs it, each record.'>
			<P>
				In your organization, a model’s records are open to everyone who can open the project and whose role has{' '}
				<em>Records: View</em> (Add, Edit and Delete likewise). To keep people to some work, give them only the projects it’s
				in — see <A href='/user-docs/organization#project-access'>Which projects people open</A>.
			</P>
			<P>
				For confidential records — salaries, contracts, personal notes — switch on{' '}
				<strong>Access → Restrict access to each record</strong> in the model. Every record then has an owner (whoever
				created it) and a privacy, chosen in the form’s <em>Manage access</em> section:
			</P>
			<Terms
				head={['Privacy', 'Who sees the record']}
				rows={[
					['Only me', 'Its owner alone.'],
					['Private', 'Its owner and the people they add — anyone in the organization who can open this project.'],
					['Public', 'Everyone who can view the model’s records.'],
				]}
			/>
			<P>
				Only the owner can change who has access, or delete the record. The table gains Privacy and Owner columns and filters.
				Records that existed before you switched it on become Public, so nobody loses sight of them. Your{' '}
				<A href='/user-docs/public-api'>public API</A> only ever reaches records marked Public, and anything your site sends in
				is Public.
			</P>
			<P>
				For the people using your site or app it’s different: a public model can be set to{' '}
				<A href='/user-docs/public-api#who'>customers’ own records only</A>, so each customer sees just what they created.
			</P>
		</Section>

		<Section
			id='changing'
			title='Changing a model'
			lead='Open it from Build → Models. Changes apply as soon as you save.'>
			<List
				items={[
					'Adding a field is always safe; it appears in the table, form, detail page and filters straight away.',
					'Removing a field hides it: the values stay in the records but aren’t shown or returned. Add it back to see them.',
					'Changing a field’s kind is flagged: old values stay as they were and may not read correctly as the new kind.',
					'Making a field unique fails if records already share a value — you’re told which.',
					'Every change is kept as a version before it’s applied.',
				]}
			/>
			<H3>Disabling and deleting</H3>
			<P>
				<strong>Disable</strong> takes the page away but keeps the model and its records. <strong>Delete</strong> removes the
				model, its page and its sidebar entry; its records stay unless you tick “Also delete its records” and type the model’s
				name.
			</P>
		</Section>

		<Section
			id='features'
			title='Features built by AI'
			lead='Several linked models at once — a whole feature from one description.'>
			<P>
				When your <A href='/user-docs/connect-ai'>connected AI</A> builds a feature — say “bookings with guests, rooms and
				payments” — it makes the models, the links between them and the tabs on their pages in one go, all or nothing.{' '}
				<strong>Models → Features</strong> lists every feature built, with links to what it made. Everything it made can be
				changed afterwards like any other model.
			</P>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['There’s no Build section', 'Your role lacks the Build permission.'],
					['The name got a 2 on the end', 'The project already has a model by that name. Change the title, or keep it.'],
					['“Isn’t a number field” in a formula', 'Formulas only use number (and formula) fields.'],
					['Making a field unique failed', 'Some records share a value. Fix them, then try again.'],
					['I can’t delete a model', 'Another model links to it. Remove that link field first.'],
					['A teammate doesn’t see the new page', 'Their role needs Records: View, and the project must be one of theirs.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Models;
