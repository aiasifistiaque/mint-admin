'use client';

import UserGuide from '../_components/UserGuide';
import { A, C, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/** Getting started: sign-up, the panel's layout, and a first project and model. */

const SECTIONS = [
	{ id: 'sign-up', title: 'Signing up' },
	{ id: 'joining', title: 'Joining by invitation' },
	{ id: 'tour', title: 'Finding your way around' },
	{ id: 'first-project', title: 'Your first project' },
	{ id: 'first-model', title: 'Your first model' },
	{ id: 'first-records', title: 'Adding records' },
	{ id: 'invite', title: 'Bringing in your team' },
	{ id: 'next', title: 'Where to go next' },
];

const GettingStarted = () => (
	<UserGuide
		href='/user-docs/getting-started'
		sections={SECTIONS}
		open={{ href: '/projects', label: 'Open your projects' }}>
		<Section
			id='sign-up'
			title='Signing up'
			lead='Two short steps: your account, then a few questions about your business.'>
			<List
				ordered
				items={[
					<>
						On the <A href='/'>MINT home page</A> press <strong>Sign up</strong> (or open{' '}
						<A href='/auth/register'>Create account</A>). Enter your name, your work email, a password of at least 8
						characters, and the name of your organization — your company or team.
					</>,
					<>
						Tell us about your business: industry, team size, your role, your website and country, what you want to build and
						how you heard about us. Every question is optional — skip any of them.
					</>,
					<>
						Press <strong>Create account</strong>. You’re signed in, as the owner of your new organization, on its projects
						page. Later, the home page’s <strong>Dashboard</strong> button brings you straight back in.
					</>,
				]}
			/>
			<P>
				Your answers help us set things up for you. You can change them later under{' '}
				<A href='/user-docs/organization#organizations'>Organization → Settings</A>.
			</P>
			<Note>
				Forgot your password? <A href='/auth/forgot-password'>Reset it</A> from the sign-in page — we email you a link.
			</Note>
		</Section>

		<Section
			id='joining'
			title='Joining by invitation'
			lead='Someone invited you? You don’t need to sign up first.'>
			<P>
				Open the link in the invitation email. If you’re new, choose your name and a password and you’re in. If you already
				have an account, press <strong>Join</strong> (or sign in with your password) — the organization is added to the ones
				you belong to, and both are listed under <strong>Your organizations</strong>. The link works for 7 days.
			</P>
			<P>
				With a verified email, invitations also show on <A href='/projects'>Projects</A> under{' '}
				<strong>Invitations for you</strong>. See <A href='/user-docs/organization#invited'>When you’re invited</A>.
			</P>
		</Section>

		<Section
			id='tour'
			title='Finding your way around'
			lead='Everything happens inside a project; the switcher at the top tells you which.'>
			<Terms
				head={['Where', 'What it is']}
				rows={[
					[
						'The switcher (top right)',
						'The project you’re in and its organization. Open it to jump to another project, see all projects, switch organization or start a new one.',
					],
					['Home', 'The project’s dashboard. With no project open, your organization’s projects.'],
					['Your project’s sections', 'At the top of the sidebar: the pages of the models you build, arranged how you like.'],
					['Files', 'The media library: the project’s images, videos and documents, in folders.'],
					['Audience', 'Analytics (websites), the Public API, and the customers who sign in to your site or app.'],
					['Build', 'Models, Pages, Sidebar, Dashboard and Connect AI — the tools for shaping the project.'],
					['Organization', 'Projects, Members, Roles and the organization’s Settings.'],
					['Your avatar', 'Your settings — profile, password, two-step sign-in, signed-in devices, theme — and signing out.'],
				]}
			/>
			<P>
				You only see the parts your role allows: someone without the Build permission has no Build section, for example. See{' '}
				<A href='/user-docs/organization#roles'>Roles and permissions</A>.
			</P>
		</Section>

		<Section
			id='first-project'
			title='Your first project'
			lead='A project is an app or a website. Start one from the projects page.'>
			<List
				ordered
				items={[
					<>
						On <A href='/projects'>Projects</A>, press <strong>New project</strong>.
					</>,
					<>
						Name it and pick its kind: <strong>App</strong> for an empty workspace (a CRM, a booking system, an API for your
						mobile app) or <strong>Website</strong> to start with pages, SEO and content blocks ready.
					</>,
					<>
						Press <strong>Create project</strong>. It opens, with an empty dashboard and sidebar waiting for you.
					</>,
				]}
			/>
			<P>
				More in <A href='/user-docs/projects'>Projects</A>.
			</P>
		</Section>

		<Section
			id='first-model'
			title='Your first model'
			lead='A model is a kind of thing you keep track of. Build one and it gets its own page.'>
			<P>
				Say you take bookings. Open <strong>Build → Models</strong> and press <strong>New model</strong>:
			</P>
			<List
				ordered
				items={[
					<>
						Title it <C>Bookings</C> and add its fields: <em>Guest name</em> (text, required), <em>Date</em> (date),{' '}
						<em>Guests</em> (number), <em>Status</em> (options: pending, confirmed, cancelled).
					</>,
					<>
						Step through the rest — what the table shows, the form, the detail page, the filters. The suggestions are already
						sensible, so <strong>Next</strong> is fine for a first model.
					</>,
					<>
						On the last step, choose the sidebar section for it and press <strong>Create model</strong>.
					</>,
				]}
			/>
			<P>
				Bookings now has a page in the sidebar with a table, search, filters, an add form and a page for each booking. Prefer to
				describe it in words? <A href='/user-docs/connect-ai'>Connect your own AI</A> and ask it to build the model.
			</P>
		</Section>

		<Section
			id='first-records'
			title='Adding records'
			lead='Open the model’s page from the sidebar and press the add button.'>
			<P>
				Fill in the form and save. The record appears in the table; click its row to open it. From there you can edit it, see
				its history, and — once models link to each other — its related records. Everything about tables is in{' '}
				<A href='/user-docs/records'>Working with records</A>.
			</P>
		</Section>

		<Section
			id='invite'
			title='Bringing in your team'
			lead='Invite people by email and choose a role for each.'>
			<P>
				Open <A href='/org/members'>Organization → Members</A>, press <strong>Invite</strong>, enter their email, pick a role
				and choose their projects — all, or only some. They get an email with a link. A <strong>Member</strong> views, adds,
				edits and deletes records; an <strong>Admin</strong> can do everything but hand over the organization. Make your own
				roles for anything in between — see <A href='/user-docs/organization'>Your organization</A>.
			</P>
		</Section>

		<Section
			id='next'
			title='Where to go next'>
			<Terms
				head={['To…', 'Read']}
				rows={[
					['Change a page’s columns, form or detail page', <A key='p' href='/user-docs/pages'>Pages</A>],
					['Put numbers and charts on the home page', <A key='d' href='/user-docs/dashboard'>Dashboard</A>],
					['Show your models on your own site or app', <A key='a' href='/user-docs/public-api'>Public API</A>],
					['Let your customers sign in', <A key='c' href='/user-docs/customers'>Customers & sign-in</A>],
					['Run a website’s pages and SEO', <A key='w' href='/user-docs/websites'>Website projects</A>],
					['Protect your account', <A key='s' href='/user-docs/account#turn-on'>Two-factor sign-in</A>],
				]}
			/>
		</Section>
	</UserGuide>
);

export default GettingStarted;
