'use client';

import UserGuide, { API_ORIGIN } from '../_components/UserGuide';
import { A, C, CodeBlock, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * Building with your own AI over MCP (Build → Connect AI). Section ids mirror
 * the platform's builder guide (mcp, mcp-keys, mcp-connect) — the Connect AI
 * page's links land here through panel.ts docsPath. `connect-ai` is a
 * GuideLink target.
 */

const SECTIONS = [
	{ id: 'mcp', title: 'What it does' },
	{ id: 'mcp-keys', title: 'Project keys' },
	{ id: 'mcp-connect', title: 'Connecting your assistant' },
	{ id: 'conversation', title: 'What to ask' },
	{ id: 'tools', title: 'What the AI can do' },
	{ id: 'safety', title: 'Staying in control' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const MCP = `${API_ORIGIN}/tenant/mcp`;

const ConnectAi = () => (
	<UserGuide
		href='/user-docs/connect-ai'
		sections={SECTIONS}
		open={{ href: '/model-builder/connect', label: 'Open Connect AI' }}>
		<Section
			id='mcp'
			title='What it does'
			lead='Describe what you need in your AI chat; it builds it in your project.'>
			<P>
				Connect Claude, ChatGPT, Cursor or any assistant that speaks MCP (the Model Context Protocol) to one of your projects.
				Then say what you need — “a booking system with rooms, guests and payments” — and it looks at the models you have,
				plans new ones with you, and builds them in <strong>that project</strong> once you say go. Your own AI subscription
				does the thinking; MINT does the building, with the same checks as the model builder.
			</P>
			<P>It can also answer questions about your records — “which clients haven’t paid this month?” — if you let it.</P>
		</Section>

		<Section
			id='mcp-keys'
			title='Project keys'
			lead='Build → Connect AI. Making keys needs the AI keys permission.'>
			<P>
				Press <strong>New key</strong>, name it after where it’ll be used (“Claude on my laptop”) and choose:
			</P>
			<Terms
				head={['Option', 'Means']}
				rows={[
					['Can build', 'On: it can create and change models and pages. Off: it can only look at your models and check plans.'],
					['Can read records', 'It can read records to answer questions — only pages you can view, never changing anything.'],
					['Expires', 'Never, or in 7, 30, 90 days or a year.'],
				]}
			/>
			<List
				items={[
					'A key belongs to one project and acts as you: it can never do more than your role allows, and stops working if you leave the organization or lose access to the project.',
					'The key is shown once. Copy it straight into your assistant; if it’s lost, revoke it and make another.',
					<>
						<strong>Revoke</strong> stops it at once. The list shows each key’s scope, who made it and when it was last used.
					</>,
				]}
			/>
		</Section>

		<Section
			id='mcp-connect'
			title='Connecting your assistant'
			lead='The Connect AI page shows these steps with your key already filled in.'>
			<Terms
				head={['Assistant', 'How']}
				rows={[
					[
						'Claude (claude.ai, Desktop)',
						'Settings → Connectors → Add custom connector. Paste the connector URL (it ends in your key), leave OAuth empty, and switch it on in a chat.',
					],
					[
						'ChatGPT',
						'Settings → Apps & Connectors → Advanced → Developer mode on. Create a connector with the URL, no authentication, then pick it under “+” in a chat.',
					],
					['Claude Code', 'One command in a terminal (below).'],
					['Cursor', 'Add the server to its MCP settings (below); the tools appear in Agent mode.'],
					['Others', 'Any client that speaks Streamable HTTP, with the key as a Bearer header — or at the end of the URL.'],
				]}
			/>
			<P>The address, for this MINT:</P>
			<CodeBlock
				label='MCP address'
				code={`${MCP}\n# or, for assistants that only take a URL:\n${MCP}/<your key>`}
			/>
			<CodeBlock
				label='Claude Code command'
				code={`claude mcp add --transport http mint ${MCP} --header "Authorization: Bearer <your key>"`}
			/>
			<CodeBlock
				label='Cursor settings'
				code={JSON.stringify({ mcpServers: { mint: { url: MCP, headers: { Authorization: 'Bearer <your key>' } } } }, null, 2)}
			/>
			<Note>
				A URL with the key in it is as secret as a password — don’t paste it anywhere public. Claude on the web and ChatGPT
				reach MINT over the internet, so they need its public address, never <C>localhost</C>.
			</Note>
		</Section>

		<Section
			id='conversation'
			title='What to ask'
			lead='Talk about the business, not the database.'>
			<List
				items={[
					<>
						<em>“I run a dental clinic. I need patients, appointments with a dentist and a time, and invoices for each
						visit.”</em>
					</>,
					<>
						<em>“Add a loyalty points field to customers, and show their orders as a tab on their page.”</em>
					</>,
					<>
						<em>“On the orders table, show the code, customer, total and status, newest first.”</em>
					</>,
					<>
						<em>“How many bookings did we have last month, by room?”</em> (with Can read records on)
					</>,
				]}
			/>
			<P>
				It goes one step at a time: it proposes the models and their fields, links and tabs, waits for your changes, and only
				builds when you agree. Everything it makes shows up straight away — in the sidebar, under{' '}
				<A href='/user-docs/models#features'>Models → Features</A>, and in Pages for fine-tuning by hand.
			</P>
		</Section>

		<Section
			id='tools'
			title='What the AI can do'>
			<Terms
				head={['Tool', 'What it’s for']}
				rows={[
					['describe_platform', 'Learn the field kinds and rules for models here.'],
					['list_models · get_model', 'See your project’s models, fields, pages and links.'],
					['list_sidebar_categories', 'See where new pages can go.'],
					['plan_feature', 'Check a plan exactly as the build would. Changes nothing.'],
					['build_feature', 'Build an agreed plan — models, fields, links, tabs, sidebar — all or nothing.'],
					['update_page', 'Change a page’s columns, form, detail page or add button.'],
					['query_records', 'Read records to answer a question (keys with Can read records).'],
				]}
			/>
		</Section>

		<Section
			id='safety'
			title='Staying in control'>
			<List
				items={[
					'The AI is told to plan with you and never build without a clear yes; Claude and ChatGPT also ask before any tool that writes.',
					'A build is all or nothing: if any part fails, nothing is left half made.',
					'It can’t delete models or records, and it only ever works in the key’s project.',
					'Everything it builds is yours to change or remove in Models and Pages.',
				]}
			/>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Message or symptom', 'Why, and what to do']}
				rows={[
					['“This API key was revoked or doesn’t exist”', 'Make a new key and update the connector.'],
					['“This key’s project is archived”', 'Restore the project on Projects.'],
					['“The person who made this key no longer has access”', 'Whoever made it left the organization. Make a new key.'],
					['It can look but not build', 'The key’s Can build is off, or your role lacks Build.'],
					['ChatGPT or claude.ai can’t connect', 'They need MINT’s public https address, and the URL must end in the key.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default ConnectAi;
