'use client';

import UserGuide from '../_components/UserGuide';
import { A, C, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/** Projects: kinds, creating, switching, editing, archiving and deleting. `projects` is a GuideLink target. */

const SECTIONS = [
	{ id: 'projects', title: 'What a project is' },
	{ id: 'kinds', title: 'Apps and websites' },
	{ id: 'create', title: 'Creating a project' },
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
			title='Apps and websites'
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
				]}
			/>
			<P>Both get the same builders, public API and customer sign-in. A website just starts further along.</P>
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
			id='switching'
			title='Switching projects'
			lead='One project is open at a time, per browser.'>
			<P>
				Open another from the switcher at the top right, or from its card on <A href='/projects'>Projects</A>. The panel reloads
				inside it. The browser remembers the open project, so you come back to it next time. Two tabs of the same browser are
				in the same project.
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
