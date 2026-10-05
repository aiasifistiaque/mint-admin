'use client';

import UserGuide from '../_components/UserGuide';
import { A, C, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/** Projects: kinds, creating, switching, editing, archiving and deleting. `projects` is a GuideLink target. */

const SECTIONS = [
	{ id: 'projects', title: 'What a project is' },
	{ id: 'kinds', title: 'Apps, websites and APIs' },
	{ id: 'api', title: 'API projects' },
	{ id: 'create', title: 'Creating a project' },
	{ id: 'get-started', title: 'Getting started' },
	{ id: 'history', title: 'History' },
	{ id: 'switching', title: 'Switching projects' },
	{ id: 'edit', title: 'Editing a project' },
	{ id: 'media-library', title: 'Media library' },
	{ id: 'address', title: 'Its public address' },
	{ id: 'archive', title: 'Archiving and deleting' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Projects = () => (
	<UserGuide
		href='/user-docs/projects'
		sections={SECTIONS}
		open={{ href: '/projects', label: 'Open Projects' }}>
		<Section
			id='projects'
			title='What a project is'
			lead='A workspace of its own inside your organization.'>
			<P>
				Each project has its own models and records, pages, sidebar, dashboard, media, AI keys, public API, customers and —
				for a website — analytics. Nothing in one project shows in another, so a client’s website and your internal CRM can sit
				side by side without touching.
			</P>
			<P>
				Each member opens every project, or only the ones chosen for them when they were invited (or later, on{' '}
				<A href='/user-docs/organization#project-access'>Members</A>). Projects someone can’t open don’t show for them at all.
			</P>
		</Section>

		<Section
			id='kinds'
			title='Apps, websites and APIs'
			lead='Picked when you create a project; it can’t change later.'>
			<Terms
				head={['Kind', 'Starts with']}
				rows={[
					[
						'App',
						'An empty sidebar section and dashboard. Build whatever you need: a CRM, bookings, inventory, an internal tool, the back end of a mobile app.',
					],
					[
						'Website',
						<>
							The <A href='/user-docs/websites#kit'>website kit</A> — site settings, pages, SEO and content blocks, already
							readable by your site — plus a site API and <A href='/user-docs/analytics'>analytics</A>.
						</>,
					],
					[
						'API',
						<>
							An empty start, like an app, but laid out as a back end for your own app or site: its{' '}
							<A href='/user-docs/projects#api'>API</A> leads the sidebar and its dashboard.
						</>,
					],
				]}
			/>
			<P>All three get the same builders, public API, webhooks and customer sign-in. A website just starts further along.</P>
		</Section>

		<Section
			id='api'
			title='API projects'
			lead='For when the project is the back end of something you build yourself — a mobile app, a booking site, a partner integration.'>
			<P>
				An API project has the same models and records as an app; what changes is what it puts first. Its sidebar starts with{' '}
				<strong>API</strong>: <A href='/user-docs/public-api'>Public API</A> (which models are open, and the reference with
				example requests), <A href='/user-docs/public-api#webhooks'>Webhooks</A> and{' '}
				<A href='/user-docs/customers'>Customers</A>. Its dashboard opens on the API itself:
			</P>
			<List
				items={[
					<>
						The <strong>base address</strong> your app calls, to copy.
					</>,
					<>The endpoints that are on, with their methods, and which need a signed-in customer.</>,
					<>Calls in the last 24 hours and how many failed, and the 20 latest calls (kept a week — method, path, answer, never what was sent).</>,
					<>How many webhooks are on, and their latest deliveries.</>,
				]}
			/>
			<P>
				Widgets from the <A href='/user-docs/dashboard'>dashboard builder</A> go underneath. An API template starts the project
				with its models, endpoints and webhooks already set up.
			</P>
		</Section>

		<Section
			id='create'
			title='Creating a project'
			lead='Needs the Create projects permission (Members have it).'>
			<List
				ordered
				items={[
					<>
						On <A href='/projects'>Projects</A> press <strong>New project</strong>.
					</>,
					<>
						Give it a name and choose <strong>App</strong> or <strong>Website</strong>. A description is optional.
					</>,
					<>
						For a website, list its <strong>domains</strong> — <C>example.com, www.example.com</C>. Only visits from them are
						counted in analytics. You can add them later.
					</>,
					<>
						Choose its <A href='#media-library'>media library</A>: its own, or the organization’s shared one.
					</>,
					<>
						Press <strong>Create project</strong>. It opens straight away.
					</>,
				]}
			/>
		</Section>

		<Section
			id='get-started'
			title='Getting started'
			lead='A new project opens on its Get started page.'>
			<List
				items={[
					<>
						<strong>An app</strong> — start from a template (<em>Clients & invoices</em>, <em>Projects & tasks</em>,{' '}
						<em>Leads pipeline</em>, <em>Products & stock</em>), build your first model step by step, or{' '}
						<A href='/user-docs/connect-ai'>describe it to your AI</A>. A template makes ordinary models you can change like
						any other.
					</>,
					<>
						<strong>A website</strong> — start from a website template, or set it up yourself in three steps: its name, logo,
						favicon and colour; its home page (headline, introduction, a button and the search description); and, if you know
						them, its domain and Google Analytics ID. Then build the rest yourself, or{' '}
						<A href='/user-docs/websites#ai-site'>with your AI</A>.
					</>,
					<>
						<strong>An API</strong> — start from an API template when there is one, or build your models as for an app.
					</>,
				]}
			/>
			<P>
				A website or API template asks a few questions first (your business name, say) and can add sample records to try it
				with. It then makes its pages, models, settings and sidebar in the background, usually within a minute; you can leave
				the page while it works. A template only goes into a new project, once.
			</P>
			<P>
				Every step can be skipped. Come back any time from the dashboard (<em>Get started</em>) or at{' '}
				<C>/&lt;project&gt;/get-started</C>. Setting a project up needs the Build permission.
			</P>
		</Section>

		<Section
			id='history'
			title='History'
			lead='Activity → History: everything done in the project, newest first.'>
			<P>
				Every record created, changed or deleted — who did it, when, and for a change each field’s before and after — and
				the project’s building: models built, changed or deleted, features and templates, the public API switched on or off,
				the site setup changed. Filter by kind, by what was done, by person and by date, or search for a name or code.{' '}
				<em>Open</em> goes to the record, unless it was deleted.
			</P>
			<P>
				A record’s own history is on its page, in the <strong>History</strong> tab. Anyone whose role has{' '}
				<em>Records: View</em> can read the History; nobody can change it.
			</P>
		</Section>

		<Section
			id='switching'
			title='Switching projects'
			lead='The address says which project you’re in.'>
			<P>
				Inside a project every address starts with its public name: <C>/acme-store</C> is its dashboard,{' '}
				<C>/acme-store/clients</C> its Clients table, <C>/acme-store/clients/…</C> one client, and{' '}
				<C>/acme-store/model-builder</C> its models. Bookmark or share any of them — they open in that project. Organization
				pages (<A href='/projects'>Projects</A>, Members, Roles, Settings) have no project in the address.
			</P>
			<P>
				Open another project from the switcher at the top right, or from its card on <A href='/projects'>Projects</A>. Each tab
				keeps its own project, so two projects can be open side by side. <strong>Dashboard</strong> on the home page takes you
				back to the project you worked in last.
			</P>
		</Section>

		<Section
			id='edit'
			title='Editing a project'
			lead='The ⋯ menu on its card. Needs Manage projects.'>
			<P>
				<strong>Edit…</strong> changes the name, description, media library and, for a website, its domains.
			</P>
		</Section>

		<Section
			id='media-library'
			title='Media library'
			lead='Where a project’s images and files live — chosen per project.'>
			<Terms
				head={['Choice', 'Means']}
				rows={[
					['This project only', 'Its own library, apart from every other project. The default.'],
					[
						'Shared with the organization',
						'One library for every project that chooses it — your logo and brand images uploaded once, used by the shop and the website alike.',
					],
				]}
			/>
			<P>
				Switching later moves nothing: files stay in the library they were uploaded to, and switching back shows them again.
				Deleting a project deletes its own library, never the shared one. Either way the media is your organization’s alone.
			</P>
		</Section>

		<Section
			id='address'
			title='Its public address'
			lead='Every project has a short public name used in its API.'>
			<P>
				It’s made from your organization’s and the project’s names when you create it — <C>acme-store</C> for the “Store”
				project of Acme — and doesn’t change when you rename either, so your site keeps working. Your site and the snippets use
				it:
			</P>
			<Terms
				head={['Where', 'Looks like']}
				rows={[
					['The public API', <C key='a'>/public/api/acme-store/products</C>],
					['The sign-in widget', <C key='w'>data-project="acme-store"</C>],
					['The analytics tracker', <C key='t'>data-project="acme-store"</C>],
				]}
			/>
			<P>
				The <A href='/public-api'>Public API</A> page shows the full addresses for the open project, ready to copy.
			</P>
		</Section>

		<Section
			id='archive'
			title='Archiving and deleting'>
			<P>
				<strong>Archive</strong> (card menu) puts a project away without losing anything: it disappears from the switcher, its
				public API and widget stop answering, and AI keys can’t build in it. <strong>Show archived</strong> on Projects lists
				it again, and <strong>Restore</strong> brings it back exactly as it was.
			</P>
			<P>
				<strong>Delete…</strong> removes a project for good. A project without models can be deleted by anyone with Manage
				projects. Once it has models, only the organization’s owner can delete it, by typing its name to confirm.
			</P>
			<Note tone='warn'>
				Deleting a project deletes its models, every record in them, its pages, sidebar, dashboard, files, customers, analytics
				and AI keys. It can’t be undone — archive instead if you might want it back.
			</Note>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['There’s no New project button', 'Your role lacks Create projects.'],
					['There’s no ⋯ menu on the cards', 'Your role lacks Manage projects.'],
					['Delete… is missing', 'The project has models, and only the owner can delete it. Archive it instead.'],
					['The panel jumped to Projects', 'The project you had open was archived or deleted, or you no longer have access to it.'],
					['A project a teammate mentions isn’t listed', 'It isn’t among your projects. Ask someone who manages members.'],
					['My site gets 404 everywhere', 'The project is archived. Restore it.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Projects;
