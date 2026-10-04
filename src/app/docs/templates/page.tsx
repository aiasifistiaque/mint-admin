'use client';

import { Box, Flex, Grid } from '@chakra-ui/react';
import DocsShell from '../_components/DocsShell';
import GuideNav from '../_components/GuideNav';
import GuideHeader from '../_components/GuideHeader';
import { C, CodeBlock, H3, List, Note, P, Section, Terms, useHashScroll } from '../_components/prose';

/**
 * Template Studio, explained for the super admins who make templates
 * (backend docs/templates). Every tab, dialog and empty state in
 * /templates links here (`/docs/templates#<section>`), in a new tab.
 *
 * Section ids are link targets in app/templates; rename one there too.
 */

const SECTIONS = [
	{ id: 'what', title: 'What templates are' },
	{ id: 'types', title: 'App, API, website' },
	{ id: 'new', title: 'Making a template' },
	{ id: 'overview', title: 'Overview' },
	{ id: 'models', title: 'Models' },
	{ id: 'questions', title: 'Questions' },
	{ id: 'sample-data', title: 'Sample data' },
	{ id: 'setup-guide', title: 'Setup guide' },
	{ id: 'sidebar', title: 'Sidebar' },
	{ id: 'dashboard', title: 'Dashboard' },
	{ id: 'roles', title: 'Roles' },
	{ id: 'endpoints', title: 'Public API' },
	{ id: 'webhooks', title: 'Webhooks' },
	{ id: 'pages', title: 'Website pages' },
	{ id: 'content', title: 'Content blocks' },
	{ id: 'seo', title: 'SEO' },
	{ id: 'site-defaults', title: 'Site settings' },
	{ id: 'starter-code', title: 'Starter code' },
	{ id: 'validate', title: 'Checks' },
	{ id: 'explanations', title: 'Explanations' },
	{ id: 'preview', title: 'Previews' },
	{ id: 'publish', title: 'Publishing' },
	{ id: 'versions', title: 'Versions' },
	{ id: 'visibility', title: 'Who can use it' },
	{ id: 'capture', title: 'Save a project as a template' },
	{ id: 'import-export', title: 'Duplicate, export, import' },
	{ id: 'mcp', title: 'Writing templates with Claude' },
	{ id: 'mcp-keys', title: 'Templates MCP keys' },
	{ id: 'mcp-prompts', title: 'Prompts that work' },
];

const TemplatesDocs = () => {
	useHashScroll();
	return (
		<Flex
			direction='column'
			gap={6}
			pb={16}>
			<GuideHeader
				href='/docs/templates'
				title='Template Studio'
				description='How to make, check, preview and publish the templates tenants start their projects from.'
				open={{ href: '/templates', label: 'Open Template Studio' }}
				mb={2}
			/>
			<Grid
				templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
				gap={10}
				alignItems='start'>
				<GuideNav sections={SECTIONS} />
				<Box
					maxW='760px'
					minW={0}>
					<Section
						id='what'
						title='What templates are'
						lead='A template is a blueprint for a new project. Saving one builds nothing.'>
						<P>
							When a tenant starts a project, they can start empty or pick a published template. Picking one builds
							everything the template describes into their new project — models, pages, sidebar, dashboard, roles, public
							API, website pages — and from then on it’s their project, to change as they like. Publishing a newer version
							of the template never touches projects already made from it.
						</P>
						<P>
							Templates live in <strong>Config → Templates</strong> (<C>/templates</C>). You can make them in the studio, or
							let Claude write them through the Templates MCP — both edit the same drafts.
						</P>
						<Note>
							Nothing in a template is built until a tenant uses it, or until you preview it. That’s why the studio checks
							every change: problems are caught before anyone builds anything.
						</Note>
					</Section>

					<Section
						id='types'
						title='App, API, website'
						lead='The type is chosen when the template is made and decides which parts it has.'>
						<Terms
							head={['Type', 'What a project from it is']}
							rows={[
								['App', 'A business app: models with tables, forms and detail pages, a sidebar, a dashboard and roles. Finance management, CRM, HR.'],
								[
									'API',
									'A backend for the tenant’s own app or site: models with public endpoints, customer sign-in and webhooks. A booking or orders API. The project is an API project — its sidebar leads with Public API, Webhooks and Customers, and its dashboard opens on the base address, endpoints and recent calls.',
								],
								['Website', 'A site’s content: pages with SEO and content blocks, site settings, starter code, plus models for longer lists (blog posts, products).'],
							]}
						/>
					</Section>

					<Section
						id='new'
						title='Making a template'
						lead='New template → pick the type, a name, a category and one sentence on what it does.'>
						<List
							ordered
							items={[
								'Agree with yourself (or the team) who it’s for and what a project made from it should do on day one.',
								'Overview: the name, summary, description and who it’s for.',
								'Questions: anything that changes from one project to the next (a currency, a company name).',
								'Models: the records it keeps, and how they link.',
								'The type’s own parts: sidebar, dashboard and roles for apps; endpoints and webhooks for APIs; pages and settings for websites.',
								'Sample data, so a new project isn’t empty, and the setup guide — the first things to do.',
								'Preview it, click around, fix what you find. Then publish.',
							]}
						/>
						<P>
							Edits stay in the page until you press <strong>Save</strong> in the bar that appears — you can move between
							tabs without losing them. Each save checks the draft again.
						</P>
					</Section>

					<Section
						id='overview'
						title='Overview'
						lead='How the template introduces itself in the gallery, and what tenants read before they choose.'>
						<Terms
							rows={[
								['Summary', 'One sentence, under the name. Needed to publish.'],
								['Description', 'A few short paragraphs: what’s inside, how people use it day to day. Markdown works. Needed to publish.'],
								['Who it’s for', '“Small agencies that bill clients monthly.” Needed to publish.'],
								['Category, tags', 'How it’s found in the gallery.'],
								['Icon, colour, cover, screenshots', 'The card in the gallery and the template’s page. The icon is a Lucide name typed in.'],
								['What’s inside', 'Worked out from the saved draft: models, links, pages, sample records. Tenants see this list.'],
							]}
						/>
					</Section>

					<Section
						id='models'
						title='Models'
						lead='The records a project keeps — each becomes a page with a table, a form and a detail page.'>
						<P>
							Models are edited with the model builder’s own panels: title and name, display field, record codes, per-record
							access and fields. Link models with a <strong>Link</strong> field on the “many” side — a Transaction links to its
							Account — and the Account page gets a tab of its transactions.
						</P>
						<P>
							A project starts empty, so every model in a template is new; names only need to be unique within the template.
							A website template can also link to the website kit every website project has (Pages, SEO, Content).
						</P>
						<Note>
							The models are built together, as one plan, all or nothing. If any of them can’t be built, nothing is — and the
							check tells you which model and why before it ever comes to that.
						</Note>
					</Section>

					<Section
						id='questions'
						title='Questions'
						lead='What’s asked when someone starts a project from the template.'>
						<P>
							Each question has a key. Write <C>{'{{key}}'}</C> anywhere in the template — a field’s default, a page’s text,
							the site’s name — and the answer replaces it. <C>{'{{project}}'}</C> (the project’s name), <C>{'{{slug}}'}</C> and{' '}
							<C>{'{{api}}'}</C> (its public API address) are filled in for you and never asked.
						</P>
						<P>
							The tab shows where each key is used, and warns about a <C>{'{{key}}'}</C> the template uses but doesn’t ask
							for — that one is a problem, because the project would be built with the braces in it.
						</P>
					</Section>

					<Section
						id='sample-data'
						title='Sample data'
						lead='Example records, so a new project — and its preview — isn’t empty on day one.'>
						<P>
							Records are kept per model, up to 50 each. A link is written as the linked record’s name (its display field),
							so add the records others link to first. <strong>Generate with AI</strong> writes believable records from the
							model’s fields and the overview; they’re added to the list for you to check, and saved only when you save.
						</P>
						<P>
							A date can be written relative to the day the project is built: <code>now</code>, <code>now-12d</code>,{' '}
							<code>now+3w</code>, <code>now-2m</code> or <code>now+1y</code> (days, weeks, months, years). Use these for
							anything the dashboard counts by date, so “this month” still has numbers long after the template was written.
						</P>
						<P>Tenants choose whether to include sample data when they start a project.</P>
					</Section>

					<Section
						id='setup-guide'
						title='Setup guide'
						lead='The checklist a new project opens with.'>
						<P>
							Write each step as an action (“Add your accounts”), with a line on how and why, and the page its button opens —
							one of the template’s models or a project page such as Site setup. At least one step is needed to publish. The
							questions people ask go underneath.
						</P>
					</Section>

					<Section
						id='sidebar'
						title='Sidebar'
						lead='The sections of a new project’s sidebar, in order, and the template’s pages in each.'>
						<P>
							Add a section, give it a name and an icon, and pick which of the template’s pages sit in it, in order. A label
							replaces a page’s title in the sidebar only. The preview beside the sections shows the sidebar as a new project gets
							it: the template’s sections first, then the project’s own.
						</P>
						<P>Models not placed in a section go to the section named on the Models tab, or the project’s first one.</P>
					</Section>

					<Section
						id='dashboard'
						title='Dashboard'
						lead='The project’s home page: numbers, charts and recent lists from the template’s models.'>
						<P>
							Widgets are the dashboard builder’s, pointed at the template’s models by name; the build swaps in the routes the
							models get. A <strong>Number</strong> counts records or adds up (or averages) a number field over a period; a <strong>Chart</strong>{' '}
							does the same per day, week or month, or broken down by a choice, yes/no or link field; <strong>Recent items</strong> lists
							the latest records with the columns picked.
						</P>
						<P>
							Nothing exists to draw yet, so each widget is described in a sentence — “Total of Amount in Transactions by Kind,
							last 30 days” — and the layout sketch shows how wide each one sits. Give every widget a title; one without is a
							warning.
						</P>
					</Section>

					<Section
						id='roles'
						title='Roles'
						lead='Organization roles the template suggests, besides Owner, Admin and Member.'>
						<P>
							Each role has a name, a description and the organization permissions it grants, grouped as Records, Projects and
							Organization with what each one allows. An Accountant who records transactions but can’t invite anyone gets View,
							Add and Edit under Records and nothing else.
						</P>
						<P>
							A role that already exists in the tenant’s organization is left as it is; only new names are added. Owner, Admin
							and Member are in every organization, so those names are never added.
						</P>
					</Section>

					<Section
						id='endpoints'
						title='Public API'
						lead='Which models the project’s public API opens, for the tenant’s own site or app.'>
						<P>
							Per model: the actions (list, read, create, update, delete), whether customers must sign in, whether they only
							see their own records, and a note on what the endpoint is for — shown in the project’s API reference.
						</P>
						<P>
							Each public model has <strong>Example requests</strong>: every endpoint as curl and as fetch, with the model’s
							fields filled in by example — the same the project’s reference shows, with the project’s own address in place of{' '}
							<code>&lt;project&gt;</code>. Writing to a model open to anyone is a warning: fine for a contact form, otherwise
							require signed-in customers. An API template with no endpoints is a warning too.
						</P>
					</Section>

					<Section
						id='webhooks'
						title='Webhooks'
						lead='API templates: calls the project makes to the tenant’s server when records change.'>
						<P>
							Each webhook: a model, the events that send it (a record created, changed, deleted) and the address. Every
							tenant’s server is different, so the address is usually a question: add one of kind “A web address” on the
							Questions tab (key e.g. <code>orders_webhook_url</code>), save, and pick it as the address — it becomes{' '}
							<code>{'{{orders_webhook_url}}'}</code>. A fixed <code>https://</code> address works when every tenant sends to the
							same place.
						</P>
						<P>
							Without an address the webhook is made <strong>switched off</strong> (a warning, not an error) and the project
							fills it in on its Webhooks page. Deliveries are signed with a secret made for each project (HMAC-SHA256,{' '}
							<code>x-mint-signature</code>) and retried 3 times; the tenant’s guide explains checking them. A preview makes the
							webhooks too, so Send test works there.
						</P>
					</Section>

					<Section
						id='pages'
						title='Website pages'
						lead='Website templates: the site’s pages, by path, with their place in the menu.'>
						<P>A page has a path (“/”, “/about”), a name, a status, a page template, a menu position and a parent page.</P>
						<P>
							The <strong>Pages</strong> tab shows them as a tree, each child under its parent. Open a page to change it;{' '}
							<strong>Add a page under it</strong> makes a child. Changing a path carries its children with it, and removing a
							page moves its children up a level. Draft and archived pages are made but not served to the site. Without a “/” page
							there’s a warning — every site needs a home.
						</P>
					</Section>

					<Section
						id='content'
						title='Content blocks'
						lead='The editable pieces of a page: a hero, a list of features, a gallery.'>
						<P>Each block has a slug unique on its page and a category that tells the site how to show it.</P>
						<P>
							On the <strong>Content</strong> tab, pick a page and add its blocks in the order the page shows them. The category
							decides which fields a block uses — Content: text, the line under it, a button and an image; Rich content: HTML;
							List and List of links: one item per line; Cards: image, title, sub title and text each; Image, Gallery, Video:
							their addresses. They become the kit’s Contents records; the site’s code finds each by page and slug, so pick
							slugs a developer would (“hero”, “services”, “team”).
						</P>
					</Section>

					<Section
						id='seo'
						title='SEO'
						lead='Each page’s title and description in search results.'>
						<P>Give both or neither — half an entry is a problem. Pages without SEO are a warning.</P>
						<P>
							The <strong>SEO</strong> tab has a card per page: title and description with their lengths, a share image, a
							canonical address, keywords and “keep it out of search results”, beside a preview of the search result. The preview
							shows placeholders as written; they’re filled for each project.
						</P>
					</Section>

					<Section
						id='site-defaults'
						title='Site settings'
						lead='The site’s name, colours, contact details, social links and default SEO.'>
						<P>
							Use <C>{'{{project}}'}</C> or a question’s key where the tenant’s own name belongs, e.g. a title template{' '}
							<C>{'%s · {{project}}'}</C>.
						</P>
						<P>
							The <strong>Site settings</strong> tab has the cards of a project’s Site setup page — Branding, Theme, Contact,
							Social, SEO defaults — writing the template instead of a project. Images are addresses here; the tenant uploads their
							own later. Leave a field empty and the project keeps its own default.
						</P>
					</Section>

					<Section
						id='starter-code'
						title='Starter code'
						lead='Where the site’s code starts from: a repository, a framework, a deploy button and environment variables.'>
						<P>
							<C>{'{{api}}'}</C> and <C>{'{{slug}}'}</C> in the environment variables are filled in for each project, so the
							deployed site talks to the right API.
						</P>
						<P>
							On the <strong>Starter code</strong> tab: the repository’s https address, the framework, and a deploy link —{' '}
							<strong>Make a Vercel link</strong> builds one that asks for the variables. Variable names are capitals, digits
							and <C>_</C>; a bad or repeated name is an error, an empty value a warning. The project’s website home shows a
							Starter code card with the repository, a Deploy it button and the variables, filled in.
						</P>
					</Section>

					<Section
						id='validate'
						title='Checks'
						lead='Every save checks the draft the way it would be built — without building it.'>
						<Terms
							head={['Kind', 'What it means']}
							rows={[
								['Problems', 'It wouldn’t build, or would build wrong: a link to a model that isn’t there, a {{key}} nobody is asked for, a widget on a missing field. They block previews and publishing.'],
								['Still to explain', 'Missing explanations tenants need. They block publishing, not previews.'],
								['Worth a look', 'Warnings: fields without help text, pages without SEO, endpoints without notes. They block nothing.'],
							]}
						/>
						<P>Each comes with its fix. “Go there” opens the tab — and the model or item — it’s about.</P>
					</Section>

					<Section
						id='explanations'
						title='Explanations'
						lead='Tenants read everything a template says about itself. It has to explain itself to be published.'>
						<List
							items={[
								'A summary, a description and who it’s for (Overview).',
								'A description on every model — it’s the line under the page title.',
								'At least one setup step.',
								'Help text on fields that aren’t obvious, notes on endpoints, SEO on pages — warnings, but worth it.',
							]}
						/>
					</Section>

					<Section
						id='preview'
						title='Previews'
						lead='The template built into a throwaway project, opened in the tenant panel.'>
						<P>
							<strong>Preview</strong> answers the questions as a tenant would, builds the saved draft (or the published
							version) into a project in a private sandbox organization, and opens it in a new tab with a link that works
							once, for five minutes. Nobody else sees it. Previews are deleted after 24 hours; open one again or delete it
							early from the Preview dialog.
						</P>
						<Note>The preview uses the saved draft — save first. A draft with problems can’t be previewed.</Note>
					</Section>

					<Section
						id='publish'
						title='Publishing'
						lead='The draft becomes the next version, with a note on what changed.'>
						<P>
							New projects get the published version. Projects already made from the template keep what they were built with
							— publishing never changes a tenant’s project. Publishing needs no problems, every explanation, saved changes,
							and something changed since the last version. It needs the <C>edit-template-publishing</C> permission.
						</P>
						<List
							ordered
							items={[
								<>
									Save your changes, and check the list at the top is clear of <strong>Problems</strong> and{' '}
									<strong>Still to explain</strong> (warnings don’t matter here).
								</>,
								<>Preview it once more — the preview builds the draft exactly as a tenant would get it.</>,
								<>
									Press <strong>Publish</strong> (top of the editor, or on Versions &amp; publish). The dialog lists anything still
									blocking it and says what publishing will and won’t change.
								</>,
								<>Write what changed — “Added budgets”, “Clearer setup guide” — and publish. The version number goes up by one.</>,
							]}
						/>
					</Section>

					<Section
						id='versions'
						title='Versions'
						lead='Every published version is kept, with its notes.'>
						<P>
							<strong>Restore into draft</strong> copies a version into the draft. Nothing is published until you publish
							again.
						</P>
						<P>
							Versions &amp; publish lists them newest first — number, notes, who published it and when. The draft is marked{' '}
							<em>changed</em> while it differs from the latest version, and the gallery shows it. Previews can be built from the
							draft or from the published version, to compare.
						</P>
					</Section>

					<Section
						id='visibility'
						title='Who can use it'
						lead='Everyone, only some organizations, or nobody for now.'>
						<P>
							Changes apply at once. The key — the template’s address in the API and the MCP — can change until the template
							is first published. Archiving takes a published template out of the gallery without losing it.
						</P>
						<Terms
							head={['Choice', 'Who can start a project from it']}
							rows={[
								['Everyone', 'Every organization. The default.'],
								['Only some organizations', 'The ones you pick below it — for a client’s own template, or to try one with a few tenants first.'],
								['Hidden — nobody, for now', 'Nobody, though it stays published; projects already made from it are unaffected.'],
							]}
						/>
						<P>
							A key is lowercase letters, digits and hyphens. A few words are the studio’s own pages and can’t be keys:{' '}
							<C>connect</C>, <C>new</C>, <C>keys</C>, <C>meta</C>, <C>stats</C>, <C>import</C>, <C>previews</C>, <C>mcp</C>,{' '}
							<C>capture</C>.
						</P>
					</Section>

					<Section
						id='capture'
						title='Save a project as a template'
						lead='A project’s structure, copied into a new draft.'>
						<P>
							Models and fields, sidebar, dashboard, public API, and for a website its pages, SEO, content and settings. A
							tenant’s records are never copied — sample data comes only from a template’s own preview.
						</P>
					</Section>

					<Section
						id='import-export'
						title='Duplicate, export, import'
						lead='Variants, backups and moving templates between e-mint installs.'>
						<Terms
							head={['Action', 'What it does']}
							rows={[
								['Duplicate', 'A new draft with the same blueprint, to start a variant from.'],
								['Export', 'The draft as a JSON file (format emint-template@1), for a repository or another e-mint.'],
								['Import', 'A new draft from such a file. A key that’s taken gets a suffix.'],
								['Delete', 'A never-published draft is deleted with its previews; a published template is archived instead.'],
							]}
						/>
					</Section>

					<Section
						id='mcp'
						title='Writing templates with Claude'
						lead='The Templates MCP: Claude writes drafts with you, part by part, checks and previews them.'>
						<P>
							It’s a separate MCP server from the builder’s (<C>/mcp</C>): it only ever writes templates and builds nothing
							outside the preview sandbox. Claude agrees what the template is for, writes one part at a time and shows it to
							you, fixes what the checks report, previews it and gives you the link — and publishes only when you say so.
						</P>
						<CodeBlock
							label='Claude Code'
							code={'claude mcp add --transport http emint-templates https://<your-api>/templates/mcp/emt_…'}
						/>
						<P>
							<strong>Connect Claude</strong> (top of the gallery, <C>/templates/connect</C>) makes the keys and shows this
							command — and the Claude Desktop / claude.ai connector URL — with the key filled in, plus prompts to start with.
							claude.ai and Claude Desktop reach the backend from the internet, so they need its deployed https address; Claude
							Code on the same computer can use localhost. Check it’s connected with <C>/mcp</C> in Claude Code, then ask it to
							list the templates.
						</P>
						<P>
							The dashboard builder’s <strong>Templates overview</strong> widget puts the studio on the home page: published,
							drafts, with problems, the most used and the recently changed.
						</P>
					</Section>

					<Section
						id='mcp-keys'
						title='Templates MCP keys'
						lead='Claude connects with an emt_ key, acting as the admin who made it.'>
						<Terms
							head={['Scope', 'Lets Claude']}
							rows={[
								['read', 'List and read templates, check them, export.'],
								['write', 'Create and change drafts, import.'],
								['preview', 'Build a draft into a throwaway preview.'],
								['publish', 'Publish a version — only with your explicit yes, and only if you may publish.'],
							]}
						/>
						<P>A key never does more than its admin’s role allows. Revoking one stops it at once.</P>
					</Section>

					<Section
						id='mcp-prompts'
						title='Prompts that work'
						lead='Say who it’s for and what a project should do on day one.'>
						<CodeBlock
							label='prompt'
							code={
								'Make an app template for small bookkeeping firms: clients, their invoices and payments, with a dashboard of what’s overdue. Ask me before each part, add sample data, and preview it when it checks clean.'
							}
						/>
						<P>Ask for one template at a time, and review each part as Claude shows it.</P>
					</Section>
				</Box>
			</Grid>
		</Flex>
	);
};

const TemplatesDocsPage = () => (
	<DocsShell
		current='/docs/templates'
		requireLogin>
		<TemplatesDocs />
	</DocsShell>
);

export default TemplatesDocsPage;
