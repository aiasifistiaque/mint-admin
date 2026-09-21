'use client';

import Link from 'next/link';
import { List, Text } from '@chakra-ui/react';
import { Layout, Section, Column } from '@/components/library';
import { Crumbs } from '@/components/library/cl';

const HerokuDocPage = () => {
	return (
		<Layout
			title='Heroku Accounts — Guide'
			path='herokus'>
			<Column
				gap={{ base: 4, md: 6 }}
				pt={{ base: 3, md: 5 }}>
				<Crumbs
					data={[
						{ href: '/dashboard', title: 'Home' },
						{ href: '/herokus', title: 'Heroku Accounts' },
						{ href: '/heroku-doc', title: 'Guide' },
					]}
				/>

				<Column gap={1}>
					<Text
						fontSize='lg'
						fontWeight='600'>
						Heroku Accounts — Guide
					</Text>
					<Text
						fontSize='sm'
						color='fg.muted'>
						Where to get a Heroku API key, and what each part of the console does.
					</Text>
				</Column>

				<Section heading='What this is'>
					<Text fontSize='sm'>
						A console for the Heroku apps we host, built on a connected account&apos;s API key.
						Beyond viewing accounts, apps and config vars, it can also restart and redeploy apps,
						roll back or build releases, scale dynos, edit config vars, toggle maintenance mode,
						and rename or permanently delete an app. Every write is checked against Heroku first
						and logged to the account&apos;s Activity tab; nothing here touches the GitHub
						auto-deploy connection, which stays out of scope.
					</Text>
				</Section>

				<Section heading='1. Get a Heroku API key'>
					<Column
						gap={3}
						fontSize='sm'>
						<Text fontWeight='600'>Option A — from the Heroku dashboard (simplest)</Text>
						<List.Root
							as='ol'
							ps={4}
							gap={1}>
							<List.Item>
								Log in at{' '}
								<Link
									href='https://dashboard.heroku.com/account'
									target='_blank'>
									dashboard.heroku.com/account
								</Link>
								.
							</List.Item>
							<List.Item>Scroll to the "API Key" section.</List.Item>
							<List.Item>Click "Reveal", then copy the key.</List.Item>
						</List.Root>
						<Text
							color='fg.muted'
							fontSize='xs'>
							This key has the same access as your Heroku login — every app and team you can see,
							and every action you can take, it can too. Given what this console can now do
							(restart, redeploy, rename, delete), only connect a key for an account you trust
							whoever holds "Edit"/"Delete" access here with that level of control.
						</Text>

						<Text
							fontWeight='600'
							mt={2}>
							Option B — a scoped authorization (safer for a shared/agency account)
						</Text>
						<Text>If the Heroku CLI is installed, run:</Text>
						<Text
							as='pre'
							p={2}
							borderRadius='md'
							bg='bg.subtle'
							fontFamily='mono'
							fontSize='xs'
							overflowX='auto'>
							heroku authorizations:create --description "e-mint admin"
						</Text>
						<Text>
							This prints a token scoped to that authorization, which can be revoked on its own
							later ({' '}
							<Link
								href='https://dashboard.heroku.com/account/applications/authorizations'
								target='_blank'>
								dashboard.heroku.com/account/applications/authorizations
							</Link>
							) without touching your main account password or other tokens.
						</Text>
					</Column>
				</Section>

				<Section heading='2. Connect an account'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>
							On the{' '}
							<Link
								href='/herokus'
								target='_blank'>
								Heroku Accounts
							</Link>{' '}
							list, click "Connect Account". Paste the key, give it a Label (e.g. the client or
							team it belongs to), and save.
						</Text>
						<Text>
							The key is checked against Heroku before anything is saved — a bad or revoked key is
							rejected right there, nothing gets written. Once saved, the key itself is never
							shown again anywhere in this app; only the last 4 characters are displayed, as a
							reminder of which key is connected. Use "Rotate Key" on the account page to replace
							a key later — it goes through the same check before it overwrites the old one.
						</Text>
					</Column>
				</Section>

				<Section heading='3. Account page'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>
							Click a row on the list to open the account. "Sync" refreshes the live snapshot and
							app list from Heroku; "Rotate Key" replaces the stored key.
						</Text>
						<List.Root
							ps={4}
							gap={1}>
							<List.Item>
								<b>Overview</b> — account email, name, verification, 2FA, default team, client
								and project it&apos;s linked to.
							</List.Item>
							<List.Item>
								<b>Apps</b> — every app the key can see, personal and team alike, with dyno hours
								for the current period. Click an app to open it.
							</List.Item>
							<List.Item>
								<b>Billing</b> — recent invoices (period, charges, credits, total, state).
							</List.Item>
							<List.Item>
								<b>Usage</b> — this month&apos;s dynos, add-ons, data and partner usage per app.
							</List.Item>
							<List.Item>
								<b>Activity</b> — every change made through this console for the account: config
								var edits (key names only, never values), restarts, deploys, scaling, and more.
							</List.Item>
						</List.Root>
					</Column>
				</Section>

				<Section heading='4. App page'>
					<Column
						gap={2}
						fontSize='sm'>
						<List.Root
							ps={4}
							gap={1}>
							<List.Item>
								<b>Overview</b> — web URL, git remote (copyable), buildpack, stack, region,
								owner, team, slug size, last release.
							</List.Item>
							<List.Item>
								<b>Config Vars</b> — view, edit, add, and delete keys. Values are masked by
								default with a per-row reveal and copy, plus "Reveal all". Edits are staged and
								only sent to Heroku when you save (which restarts the app) — paste a whole
								.env block in at once instead of adding keys one at a time. "Download .env" and
								"Download .json" save the current values as a file.
							</List.Item>
							<List.Item>
								<b>Deploys</b> — release history with rollback (re-releases a past slug — it
								does not fetch new code), and builds from a source tarball URL.
							</List.Item>
							<List.Item>
								<b>Dynos</b> — formation (scale process types up/down — bills immediately) and
								running dynos, with restart per-dyno or for the whole app.
							</List.Item>
							<List.Item>
								<b>Logs</b> — recent log lines. Treat this as secrets: apps routinely print
								tokens and connection strings to stdout.
							</List.Item>
							<List.Item>
								<b>Resources</b> — add-ons, custom domains, and collaborators (read-only).
							</List.Item>
							<List.Item>
								<b>Settings</b> — maintenance mode, rename (breaks the app&apos;s old URL and git
								remote), and the danger zone to permanently delete the app.
							</List.Item>
						</List.Root>
						<Text
							color='fg.muted'
							fontSize='xs'>
							"Restart" and "Redeploy" in the header, and every action in the Deploys, Dynos and
							Settings tabs, change something live on Heroku. Anything marked destructive asks
							for a typed confirmation (usually the app&apos;s name) before it runs.
						</Text>
					</Column>
				</Section>

				<Section heading='Permissions'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>Five permissions gate the console, checked independently:</Text>
						<List.Root
							ps={4}
							gap={1}>
							<List.Item>
								<b>Heroku Accounts — View</b>: see the account, its apps, billing, usage,
								activity, release/build/dyno lists, and resources.
							</List.Item>
							<List.Item>
								<b>Heroku Accounts — Create</b>: verify a key and connect a new account.
							</List.Item>
							<List.Item>
								<b>Heroku Accounts — Edit</b>: rotate a key, restart or redeploy, roll back or
								build a release, scale dynos, toggle maintenance mode, rename an app.
							</List.Item>
							<List.Item>
								<b>Heroku Accounts — Delete</b>: permanently delete an app.
							</List.Item>
							<List.Item>
								<b>Heroku Config Vars — View</b>: read config vars and logs — both can hold
								secrets, so this is separate from just knowing the account exists.
							</List.Item>
							<List.Item>
								<b>Heroku Config Vars — Edit</b>: set or delete config vars.
							</List.Item>
							<List.Item>
								<b>Heroku Config Download</b> (labelled "Create" on the role form — there is no
								dedicated download permission slot): download a .env/.json of config vars.
							</List.Item>
						</List.Root>
						<Text>All of these are managed the usual way, under Admin Roles.</Text>
					</Column>
				</Section>
			</Column>
		</Layout>
	);
};

export default HerokuDocPage;
