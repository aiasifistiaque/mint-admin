'use client';

import UserGuide from '../_components/UserGuide';
import { A, C, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * The sidebar builder for projects. Section ids mirror the platform's guide
 * (arrange, sections, pages, icons, access, preview, saving) — the builder's
 * links land here through panel.ts docsPath.
 */

const SECTIONS = [
	{ id: 'what', title: 'What it is' },
	{ id: 'arrange', title: 'Arranging' },
	{ id: 'sections', title: 'Sections' },
	{ id: 'pages', title: 'Pages' },
	{ id: 'icons', title: 'Icons' },
	{ id: 'access', title: 'Who sees a page' },
	{ id: 'preview', title: 'The preview' },
	{ id: 'saving', title: 'Saving and discarding' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Sidebar = () => (
	<UserGuide
		href='/user-docs/sidebar'
		sections={SECTIONS}
		open={{ href: '/sidebar-builder', label: 'Open Sidebar' }}>
		<Section
			id='what'
			title='What it is'
			lead='Build → Sidebar: your project’s sections and the pages in them.'>
			<P>
				The top of the sidebar is yours: <strong>sections</strong> (headings with an icon, like “Sales”) and{' '}
				<strong>pages</strong> (links under them, like “Orders”). New models add their page to the section you chose when
				creating them; here you rename, reorder, hide and restrict them. Each project has its own sidebar.
			</P>
			<P>
				The <em>Audience</em>, <em>Build</em> and <em>Organization</em> sections below yours are fixed — they follow each
				person’s role.
			</P>
		</Section>

		<Section
			id='arrange'
			title='Arranging'
			lead='Top to bottom, exactly as it shows.'>
			<List
				items={[
					<>
						<strong>Move a page</strong>: drag it by its grip (⠿) — higher, lower, or into another section.
					</>,
					<>
						<strong>Move a section</strong>: drag its heading; its pages move with it.
					</>,
					<>
						<strong>No mouse?</strong> The ⋯ menu on a row has <em>Move up</em> and <em>Move down</em>.
					</>,
					<>
						<strong>Hide without deleting</strong>: the eye button. Hidden rows stay here, faded, ready to show again.
					</>,
				]}
			/>
			<P>
				Rows you changed are marked <strong>Edited</strong>; ones not saved yet, <strong>New</strong>.
			</P>
		</Section>

		<Section
			id='sections'
			title='Sections'
			lead='“Add section” at the top; click a section’s name to edit it.'>
			<Terms
				rows={[
					['Name', 'The heading in the sidebar.'],
					[
						'Icon',
						<>
							Beside the name — see <A href='#icons'>Icons</A>.
						</>,
					],
					['Show in the sidebar', 'Off hides it and its pages. Nothing is deleted.'],
					['Tooltip', 'Shown when the pointer rests on it.'],
				]}
			/>
			<P>A section with no visible pages doesn’t show at all.</P>
			<Note tone='warn'>Deleting a section deletes the links in it. Drag pages elsewhere first, or hide the section instead.</Note>
		</Section>

		<Section
			id='pages'
			title='Pages'
			lead='“Add page” at the top or under a section; click a page to edit it.'>
			<Terms
				rows={[
					['Label', 'The link’s text.'],
					[
						'Page address',
						<>
							Which page it opens: the model’s address, like <C>orders</C>. (The panel shows that page at <C>/t/orders</C> —
							type just <C>orders</C> here.)
						</>,
					],
					['Section', 'The heading it sits under.'],
					['Show in the sidebar', 'Off hides the link; the page itself still works.'],
					['Only people who can view records', <A key='a' href='#access'>Who sees a page</A>],
				]}
			/>
			<P>Deleting a page here only removes the link. The model and its records are untouched.</P>
		</Section>

		<Section
			id='icons'
			title='Icons'
			lead='From the free Lucide set, chosen by name.'>
			<List
				ordered
				items={[
					<>
						Click <strong>Browse icon names on lucide.dev</strong> under the icon field.
					</>,
					<>Search (“money”, “users”, “calendar”) and click an icon.</>,
					<>
						Copy its name — lowercase with dashes, like <C>circle-dollar-sign</C> — into the field. The square beside it shows
						the icon; if it stays empty, the name is misspelt.
					</>,
				]}
			/>
		</Section>

		<Section
			id='access'
			title='Who sees a page'
			lead='Everyone sees every visible link, unless you restrict it.'>
			<P>
				Turn on <strong>Only people who can view records</strong> and the link shows only to roles with{' '}
				<em>Records: View</em>. Pages your models made start that way; a link to somewhere else can be left open to everyone
				who can open the project.
			</P>
			<P>
				This only hides the link. The page checks access itself, whatever the sidebar shows. Roles are set on{' '}
				<A href='/user-docs/organization#roles'>Organization → Roles</A>.
			</P>
		</Section>

		<Section
			id='preview'
			title='The preview'
			lead='On the right: the sidebar as it will look once saved.'>
			<List
				items={[
					'Hidden rows and empty sections are left out, as in the real sidebar.',
					'Restricted pages show a small lock.',
					'Dashboard is always first and can’t be moved.',
				]}
			/>
		</Section>

		<Section
			id='saving'
			title='Saving and discarding'>
			<P>
				A bar appears at the bottom as soon as something is unsaved. <strong>Save changes</strong> updates the sidebar at once
				for you, and for others next time their panel loads it. <strong>Discard</strong> throws away everything since the last
				save. Leaving with unsaved changes asks first.
			</P>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['A section doesn’t show', 'It has no visible pages, or it’s hidden.'],
					['A teammate can’t see a link', 'Their role lacks Records: View, or the project isn’t one of theirs.'],
					['An icon doesn’t appear', 'The name doesn’t match a Lucide icon — copy it again.'],
					['A link opens a “not found” page', <>The address doesn’t match a model’s. Type the model’s address alone, like <C>orders</C>.</>],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Sidebar;
