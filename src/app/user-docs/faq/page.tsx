'use client';

import UserGuide from '../_components/UserGuide';
import { A, P, Section, Terms } from '../../docs/_components/prose';

/** Questions and troubleshooting across the user guides, each pointing at the guide with the full answer. */

const SECTIONS = [
	{ id: 'general', title: 'General' },
	{ id: 'account', title: 'Signing in' },
	{ id: 'team', title: 'Teammates and access' },
	{ id: 'building', title: 'Building' },
	{ id: 'live', title: 'Your site and API' },
];

const Faq = () => (
	<UserGuide
		href='/user-docs/faq'
		sections={SECTIONS}>
		<Section
			id='general'
			title='General'>
			<Terms
				head={['Question', 'Answer']}
				rows={[
					[
						'What’s the difference between an organization and a project?',
						<>
							The organization is your company: its people and roles. Projects are what you build in it — each app or website
							on its own. <A href='/user-docs/projects'>Projects</A>
						</>,
					],
					[
						'Can a client see only their project?',
						<>
							Yes — invite them with <strong>Only these</strong> projects and tick theirs. Nothing else in your organization
							shows for them. <A href='/user-docs/organization#project-access'>Which projects people open</A>
						</>,
					],
					[
						'Do I need to write code?',
						<>
							Not to build: models, pages, the sidebar and dashboard are all point and click, or ask{' '}
							<A href='/user-docs/connect-ai'>your own AI</A>. Showing your data on your own site needs a little — the guides
							have examples to copy.
						</>,
					],
					[
						'Is there a limit on records?',
						'Not a fixed one. Exports go up to 20,000 rows and imports up to 2,000 at a time.',
					],
				]}
			/>
		</Section>

		<Section
			id='account'
			title='Signing in'>
			<Terms
				head={['Symptom', 'What to do']}
				rows={[
					['I forgot my password', <A key='p' href='/user-docs/account#password'>Reset it from the sign-in page.</A>],
					['I lost my phone with my passkey', <A key='l' href='/user-docs/account#locked-out'>Use an email code or a backup code.</A>],
					['I was signed out suddenly', 'Someone signed your device out, or you were removed from the organization. Sign in again.'],
					['I don’t recognise a device', <A key='d' href='/user-docs/account#devices'>Sign it out and change your password.</A>],
				]}
			/>
		</Section>

		<Section
			id='team'
			title='Teammates and access'>
			<Terms
				head={['Symptom', 'What to do']}
				rows={[
					['The invitation link expired', <A key='i' href='/user-docs/organization#invitations'>Resend it from Members — links last 7 days.</A>],
					['A teammate can’t see a project', <A key='r' href='/user-docs/organization#project-access'>Add it to their projects on Members.</A>],
					['An invitation isn’t in the app', <A key='v' href='/user-docs/organization#invited'>Verify your email, or open the emailed link.</A>],
					['A teammate can’t build', 'Their role needs the Build permission.'],
					['I want to leave an organization', <A key='o' href='/user-docs/organization#leaving'>Leave from your own row in Members.</A>],
				]}
			/>
		</Section>

		<Section
			id='building'
			title='Building'>
			<Terms
				head={['Symptom', 'What to do']}
				rows={[
					['My page change doesn’t show', <A key='w' href='/user-docs/pages#workflow'>Publish the draft.</A>],
					['A new field isn’t in the table', <A key='t' href='/user-docs/pages#table'>Add it to the table’s columns.</A>],
					['A new page isn’t in the sidebar', <A key='s' href='/user-docs/sidebar#pages'>Add it in Build → Sidebar.</A>],
					['My AI can’t connect', <A key='a' href='/user-docs/connect-ai#faq'>Check the key and the address.</A>],
				]}
			/>
		</Section>

		<Section
			id='live'
			title='Your site and API'>
			<Terms
				head={['Symptom', 'What to do']}
				rows={[
					['My site gets 404', <A key='4' href='/user-docs/public-api#errors'>The model isn’t public, the action is off, or the project is archived.</A>],
					['My site gets 401', <A key='1' href='/user-docs/customers'>The model is for signed-in customers.</A>],
					['A page isn’t on my website', <A key='p' href='/user-docs/websites#build-a-page'>Publish it, and check its path.</A>],
					['Analytics shows nothing', <A key='n' href='/user-docs/analytics#install'>Check the snippet and the project’s domains.</A>],
				]}
			/>
			<P>
				Still stuck? Ask your organization’s owner or admin — they can see your role and the project’s settings.
			</P>
		</Section>
	</UserGuide>
);

export default Faq;
