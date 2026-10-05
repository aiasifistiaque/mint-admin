'use client';

import UserGuide from '../_components/UserGuide';
import { A, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * Starting a project from a template (backend docs/templates T-14): New
 * project's "Start from", Get started, the questions, the background build,
 * and what the project gets. The section ids are GuideLink targets
 * (GuideLink.tsx GUIDE_OF) — New project links `templates`.
 */

const SECTIONS = [
	{ id: 'templates', title: 'What a template is' },
	{ id: 'start-from', title: 'Choosing one' },
	{ id: 'template-questions', title: 'The questions' },
	{ id: 'template-build', title: 'While it builds' },
	{ id: 'after-template', title: 'After it’s built' },
	{ id: 'template-list', title: 'The templates' },
	{ id: 'template-faq', title: 'Troubleshooting' },
];

const Templates = () => (
	<UserGuide
		href='/user-docs/templates'
		sections={SECTIONS}
		open={{ href: '/projects', label: 'Open Projects' }}>
		<Section
			id='templates'
			title='What a template is'
			lead='A ready-made app, API or website, built into a new project in one go.'>
			<P>
				A template is a whole project made for a kind of business: a CRM, an online shop, a blog. Starting from one builds
				everything it holds into your new project at once:
			</P>
			<List
				items={[
					<>
						<strong>Models</strong> with their fields, links between them, filters and forms (see{' '}
						<A href='/user-docs/models'>Models</A>).
					</>,
					<>
						<strong>Pages</strong> with their content blocks and search titles, and the site’s settings (websites — see{' '}
						<A href='/user-docs/websites'>Websites</A>).
					</>,
					<>
						The <strong>sidebar</strong> in sections, and a <strong>dashboard</strong> of counts, charts and lists.
					</>,
					<>
						<strong>Roles</strong> for the people who’ll use it, added to your organization.
					</>,
					<>
						The <strong>public API</strong> and <strong>webhooks</strong> an app or site needs (see{' '}
						<A href='/user-docs/public-api'>Public API</A>).
					</>,
					<>
						<strong>Sample records</strong> so you can see it working, if you want them, and a <strong>set-up checklist</strong> on
						the project’s home page.
					</>,
				]}
			/>
			<P>
				What it builds is your project’s own copy. Rename anything, add fields, delete what you don’t need: it all changes
				like something you built yourself. A later version of the template never changes a project already made from it.
			</P>
		</Section>

		<Section
			id='start-from'
			title='Choosing one'
			lead='When you make the project, or on its Get started page.'>
			<P>
				In <em>Projects → New project</em>, pick the kind (app, website or API). <em>Start from</em> then lists that kind’s
				templates, with what each builds. Pick one, or <em>Set it up yourself</em>, or neither and decide on the next page.
				The project’s name defaults to the template’s if you leave it empty.
			</P>
			<P>
				A new project opens on <em>Get started</em>. If you picked a template, its questions are waiting there; if not,
				Get started shows the same templates, and <em>Set it up yourself</em> next to them.
			</P>
			<List
				items={[
					'A template only goes into a new project: one with no models of its own yet. A website’s own pages, SEO and content blocks don’t count.',
					'One template per project. To try another, make another project.',
					'Picking a template in New project builds nothing yet. If you change your mind, choose differently on Get started.',
				]}
			/>
			<Note>
				Making a project needs permission to create projects; building a template into it needs permission to build (see{' '}
				<A href='/user-docs/organization#roles'>Roles and permissions</A>). Owners and admins have both.
			</Note>
		</Section>

		<Section
			id='template-questions'
			title='The questions'
			lead='A few answers fill the template in before it’s built.'>
			<P>
				Most templates ask something first: your business’s name, the currency you sell in, your brand colour, the email
				your site shows. The answers go into page text, search titles, field hints and site settings, so the project
				starts with your details instead of placeholders. Questions marked required need an answer before{' '}
				<em>Use this template</em> works; the rest have sensible defaults.
			</P>
			<P>
				<em>What you get</em> lists the template’s pages, models, sidebar sections, dashboard and roles before you
				commit. <em>Include sample records</em> (on by default) adds example records to every model, so the tables,
				dashboard and API show something straight away. Switch it off to start empty.
			</P>
		</Section>

		<Section
			id='template-build'
			title='While it builds'
			lead='In the background: a few seconds for most, longer for big ones.'>
			<P>
				After <em>Use this template</em>, a progress screen shows until the build is done. You can leave the page: it
				carries on, and Get started shows where it is when you come back. When it’s ready you see what was made (pages,
				models, sidebar sections, dashboard widgets, roles, sample records) and <em>Open the project</em>.
			</P>
			<P>
				If something goes wrong, nothing is kept: the project is left as it was, the screen says why, and you can try
				again.
			</P>
		</Section>

		<Section
			id='after-template'
			title='After it’s built'
			lead='Work through the checklist, then make it yours.'>
			<List
				items={[
					<>
						<strong>The set-up checklist</strong> on the project’s home page walks through what to fill in first, each step
						linking to its page.
					</>,
					<>
						<strong>Sample records</strong> are ordinary records: select them in each table and delete them when you’re
						ready (see <A href='/user-docs/records'>Records</A>).
					</>,
					<>
						<strong>Roles</strong> join your organization’s roles. One you already have with the same name is left as it
						is.
					</>,
					<>
						<strong>Webhooks</strong> that need your server’s address are made switched off when you didn’t give one.
						Add the address on the Webhooks page, send a test, and switch them on.
					</>,
					<>
						<strong>Read-only fields</strong>: on models your customers write to (orders, bookings, contact forms),
						fields only your team should set — an order’s status, a payment reference — are{' '}
						<A href='/user-docs/public-api#read-only'>read-only</A> on the public API. Whatever a request sends for them is
						ignored.
					</>,
				]}
			/>
		</Section>

		<Section
			id='template-list'
			title='The templates'
			lead='What’s available today; the gallery always shows the current list.'>
			<Terms
				head={['Template', 'What it builds']}
				rows={[
					[<strong key='a'>Apps</strong>, ''],
					['Finance management', 'Accounts, transactions by category, invoices, bills, budgets and recurring costs.'],
					['CRM', 'Companies, people, products, deals and activities, with a pipeline dashboard.'],
					['HR & leave', 'Departments, employees, leave types and requests, public holidays and expiring documents.'],
					['Inventory', 'Products by category and location, suppliers, purchase orders, stock movements and counts.'],
					['Bookkeeping practice', 'Clients, deadlines, billing, expenses and your clients’ books.'],
					['Leads pipeline', 'Leads from first contact to won or lost, with their value and source.'],
					['Products & stock', 'A catalogue in categories, with prices and stock levels.'],
					['Projects & tasks', 'Projects with their tasks, who’s on them and when they’re due.'],
					[<strong key='p'>APIs</strong>, ''],
					['Booking API', 'Services, staff, hours and time off as an open API; bookings by signed-in customers; a bookings webhook.'],
					['Products & orders API', 'A catalogue and shipping options as an open API; orders and wishlists for signed-in customers; an orders webhook.'],
					[<strong key='w'>Websites</strong>, ''],
					['Blog', 'Posts, authors, categories and a newsletter form; home, blog, about and contact pages.'],
					['Business site', 'Services, team, testimonials, FAQs and a contact form; home, services, about, contact and privacy pages.'],
					['Portfolio', 'Case studies with galleries, disciplines, experience, testimonials and a contact form.'],
					['E-commerce', 'Collections, products with variants and stock, carts and orders for signed-in customers, a contact form; shop, shipping and cart pages.'],
				]}
			/>
		</Section>

		<Section
			id='template-faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					[
						'No “Start from” in New project',
						'No template is published for that kind yet, or you can’t create projects. Get started still lets you set it up yourself.',
					],
					['Get started shows no templates', <>The project already has models of its own, or was already made from a template. Make a new project.</>],
					['“Use this template” stays greyed out', 'A required question has no answer yet.'],
					['The build failed', 'Nothing was kept. Read the reason on the screen, then try again — or choose another template.'],
					[
						'A role wasn’t created',
						<>
							Your organization already had a role with that name, so it was left as it is. Check its permissions under{' '}
							<A href='/user-docs/organization#roles'>Roles</A>.
						</>,
					],
					[
						'A webhook shows as switched off',
						<>
							It needs your server’s address. Add it on the Webhooks page (see <A href='/user-docs/public-api#webhooks'>Webhooks</A>
							).
						</>,
					],
					[
						'The API ignores a field I send',
						<>
							It’s read-only: only your team sets it, in the panel or from your own server. See{' '}
							<A href='/user-docs/public-api#read-only'>Read-only fields</A>.
						</>,
					],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Templates;
