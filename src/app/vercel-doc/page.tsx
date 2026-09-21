'use client';

import Link from 'next/link';
import { List, Text } from '@chakra-ui/react';
import { Layout, Section, Column } from '@/components/library';
import { Crumbs } from '@/components/library/cl';

/**
 * Written as one section per thing someone actually wants to do, not as a tour
 * of the API. Two sections exist specifically because the API cannot do what
 * the console is expected to do — Usage and Logs — and both say so plainly.
 * Leaving those silent is how a half-complete number gets read as a whole one.
 */
const VercelDocPage = () => {
	return (
		<Layout
			title='Vercel Accounts — Guide'
			path='vercels'>
			<Column
				gap={{ base: 4, md: 6 }}
				pt={{ base: 3, md: 5 }}>
				<Crumbs
					data={[
						{ href: '/dashboard', title: 'Home' },
						{ href: '/vercels', title: 'Vercel Accounts' },
						{ href: '/vercel-doc', title: 'Guide' },
					]}
				/>

				<Column gap={1}>
					<Text
						fontSize='lg'
						fontWeight='600'>
						Vercel Accounts — Guide
					</Text>
					<Text
						fontSize='sm'
						color='fg.muted'>
						How to connect an account, ship a project, and read the numbers — including the
						two the API will not give us.
					</Text>
				</Column>

				<Section heading='What this is'>
					<Text fontSize='sm'>
						A console for the Vercel projects we host, built on a connected account&apos;s API
						token. It creates projects, connects them to GitHub, deploys branches, redeploys and
						promotes builds, reads and edits environment variables, manages domains, and shows
						what each project consumes. Every write is confirmed before it runs and recorded in
						the account&apos;s Activity tab. More than one account can be connected — each one
						is its own record with its own token.
					</Text>
				</Section>

				<Section heading='1. Get a Vercel API token'>
					<Column
						gap={3}
						fontSize='sm'>
						<List.Root
							as='ol'
							ps={4}
							gap={1}>
							<List.Item>
								Go to{' '}
								<Link
									href='https://vercel.com/account/tokens'
									target='_blank'>
									vercel.com/account/tokens
								</Link>
								.
							</List.Item>
							<List.Item>Create a token, give it a name that says where it is used.</List.Item>
							<List.Item>
								If the account has a <b>team</b>, scope the token to that team. Choose an
								expiry you will actually remember to renew.
							</List.Item>
							<List.Item>Copy it — Vercel shows it once.</List.Item>
						</List.Root>

						<Text color='fg.muted'>
							<b>On a personal account there is nothing to scope it to.</b> A personal token
							can do anything the account can, including deleting every project on it. That is
							a property of Vercel&apos;s tokens, not of this console, and it is why
							destructive actions here ask you to type the project name and why storefront
							projects cannot be deleted from this console at all.
						</Text>
						<Text color='fg.muted'>
							The token is encrypted before it is stored and is never sent back to the
							browser. Only the last four characters are ever displayed.
						</Text>
					</Column>
				</Section>

				<Section heading='2. Connect an account'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>
							<b>Vercel Accounts → Connect Account.</b> Give it a label, paste the token. The
							token is checked against Vercel before anything is saved, so a bad one is
							rejected at the form with Vercel&apos;s own message rather than saved and broken.
						</Text>
						<Text>
							If the token can see more than one team, a switcher appears in the account
							header and the choice rides in the URL, so a link to this page is a link to that
							scope. With one team or none there is nothing to switch between and no switcher
							is shown — that is the normal case, not a missing feature.
						</Text>
						<Text color='fg.muted'>
							<b>Rotate Token</b> replaces a stored token. A token belonging to a different
							Vercel account is refused: silently repointing a record — with its label, its
							client link and its history — at someone else&apos;s account is the kind of thing
							nobody notices until it matters.
						</Text>
					</Column>
				</Section>

				<Section heading='3. Create a project and deploy it'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>
							<b>New Project</b> on the account page. The name is lowercase, unique within the
							account, and awkward to change later — Vercel builds the default deployment URL
							from it. Give it <code>owner/repo</code> to connect GitHub; the Vercel GitHub app
							must already have access to that repository.
						</Text>
						<Text>
							Creating a project does not deploy it. Open the project, go to <b>Deployments</b>
							, and deploy a branch — preview or production. Without a connected repository
							there is no branch to deploy, and the only way forward is redeploying an existing
							build.
						</Text>
						<Text color='fg.muted'>
							Builds queue. On the Hobby plan only one runs at a time, so a second deploy
							genuinely waits its turn and is labelled <b>queued</b> rather than left looking
							stalled. There is also a daily deployment cap, shared with the storefront deploy
							flow — if you hit it, the console says so specifically instead of reporting a
							generic failure.
						</Text>
					</Column>
				</Section>

				<Section heading='4. Redeploy and promote — they are not the same'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>
							<b>Redeploy</b> builds the commit again. It picks up the current environment
							variables, takes as long as a build takes, and produces a new deployment.
						</Text>
						<Text>
							<b>Promote</b> moves the production alias to a deployment that already exists.
							Nothing is rebuilt, it is near-instant, and promoting the previous one back
							undoes it. This is what &quot;roll back&quot; means on Vercel — there is no
							separate rollback.
						</Text>
						<Text color='fg.muted'>
							So: to undo a bad release, <b>promote</b> the last good one. To pick up an
							environment change or a fixed dependency, <b>redeploy</b>. Cancelling a running
							build leaves whatever is currently deployed serving.
						</Text>
					</Column>
				</Section>

				<Section heading='5. Environment variables'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>
							Vercel does not hold one value per name. It holds a record per{' '}
							<b>name + target</b>, where target is production, preview or development — so the
							same key can have three different values, and a preview record can be narrowed
							further to one branch. The table shows a row per record for that reason.
						</Text>
						<Text>
							<b>Changes only take effect on the next deployment.</b> Saving does not restart
							or redeploy anything; the running deployment keeps the values it was built with.
							After a production save the console offers <b>Redeploy production now</b>, and if
							you decline, the project header keeps a reminder until the next production
							deployment lands.
						</Text>
						<Text>
							Values are masked in the list, because Vercel&apos;s list endpoint returns them
							encrypted however it is asked. <b>Reveal</b> fetches one value at a time. A
							variable of type <b>sensitive</b> can never be read back — not here, not by
							Vercel&apos;s own dashboard — so it offers <b>Replace</b> instead of Reveal.
						</Text>
						<Text color='fg.muted'>
							Edits stage locally and commit together, and the confirmation lists the names and
							targets that will change — never a value. Vercel has no atomic multi-record
							write, so a batch can land partway: if that happens the console reports exactly
							which changes applied and which did not, rather than calling it a success or a
							failure.
						</Text>
						<Text color='fg.muted'>
							<b>Download</b> asks which target, because a flat <code>.env</code> cannot hold
							three values for one key. The <code>.json</code> option carries every target at
							once and is lossless. A sensitive variable appears in a download as an empty key
							with a comment, so the file still documents the full set instead of looking
							complete when it is not.
						</Text>
					</Column>
				</Section>

				<Section heading='6. Domains'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>
							Add a domain on the project&apos;s <b>Domains</b> tab. It will be unverified until
							DNS points at Vercel, and the exact record to create is shown on screen — that is
							the only thing anyone needs from that tab, so it is not hidden behind a click.
						</Text>
						<Text color='fg.muted'>
							Verify re-checks DNS. A failed check usually means propagation, not a mistake;
							wait and try again. Removing a domain takes effect immediately and anyone with
							that address bookmarked gets an error.
						</Text>
					</Column>
				</Section>

				<Section heading='7. Usage — what these numbers are, and are not'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>
							<b>Read this before planning anything from the Usage tab.</b>
						</Text>
						<Text>
							Builds, build minutes, failures, what is queued right now, and the per-project
							breakdown are all <b>counted from the deployment list</b>. Every deployment
							carries the time it started building and the time it became ready, so these are
							measured, not estimated, and the per-project ranking is a reliable answer to
							&quot;what is consuming this account&quot;.
						</Text>
						<Text>
							<b>Bandwidth, function invocations, function duration, edge requests and image
							optimisations are not available.</b> Vercel exposes metered usage only to Pro and
							Enterprise teams; on any other plan the endpoint refuses the request. The tab
							lists each missing figure rather than omitting it, so the build numbers are never
							mistaken for the whole picture. Read those on the Vercel dashboard.
						</Text>
						<Text color='fg.muted'>
							The daily deployment cap shown next to a day that reached it is Vercel&apos;s
							published Hobby limit and is marked as assumed until an account actually hits it
							and the API tells us the real number.
						</Text>
					</Column>
				</Section>

				<Section heading='8. Logs'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>
							<b>Build logs</b> are available for every deployment, from the Deployments tab.
							They are gated behind the environment permission rather than the general view
							one, because a build prints environment values, tokens and connection strings to
							its output — being able to read build logs is being able to read the environment.
						</Text>
						<Text>
							<b>Runtime logs are not available through the API.</b> The endpoint that would
							serve them answers &quot;not found&quot; for this account, so there is no Logs
							tab rather than a tab that never works. Read runtime logs on the Vercel
							dashboard, or set up a <b>log drain</b> — those do work, and any configured drain
							is listed under Resources.
						</Text>
					</Column>
				</Section>

				<Section heading='9. Storefront projects'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>
							Some projects on this account are customer shop storefronts, created by the
							storefront deploy flow rather than by hand. They carry a{' '}
							<b>Storefront</b> tag wherever they appear, named with the shop they serve.
						</Text>
						<Text>
							Changing one reaches real customers, so production environment writes, promotes,
							production deploys and domain removals all ask you to type the project name
							first.
						</Text>
						<Text color='fg.muted'>
							<b>Deleting a storefront project from this console is refused outright.</b> The
							shop&apos;s own records point at that Vercel project; deleting it here would
							leave them pointing at nothing and the shop still believing it is deployed.
							Remove the storefront from the shop instead — that flow unwinds all of it.
						</Text>
					</Column>
				</Section>

				<Section heading='Permissions'>
					<Column
						gap={2}
						fontSize='sm'>
						<Text>Seven permissions gate the console, checked independently:</Text>
						<List.Root
							ps={4}
							gap={1}>
							<List.Item>
								<b>Vercel Accounts — View</b>: see accounts, projects, deployments, domains,
								usage, resources and activity.
							</List.Item>
							<List.Item>
								<b>Vercel Accounts — Create</b>: verify a token, connect an account, create a
								project.
							</List.Item>
							<List.Item>
								<b>Vercel Accounts — Edit</b>: rotate a token, deploy, redeploy, promote,
								cancel a build, change build configuration, add or remove domains.
							</List.Item>
							<List.Item>
								<b>Vercel Accounts — Delete</b>: delete a project or a deployment.
							</List.Item>
							<List.Item>
								<b>Vercel Env Download — View</b>: read environment variables{' '}
								<i>and build logs</i> — both can hold secrets, so this is deliberately
								separate from knowing the account exists.
							</List.Item>
							<List.Item>
								<b>Vercel Env Download — Edit</b>: add, change or remove environment
								variables.
							</List.Item>
							<List.Item>
								<b>Vercel Env Download — Create</b> (labelled &quot;Create&quot; on the role
								form because there is no dedicated download slot): download a{' '}
								<code>.env</code> or <code>.json</code> of environment variables.
							</List.Item>
						</List.Root>
						<Text>All of these are managed the usual way, under Admin Roles.</Text>
					</Column>
				</Section>
			</Column>
		</Layout>
	);
};

export default VercelDocPage;
