'use client';

import UserGuide from '../_components/UserGuide';
import { A, List, P, Section, Terms } from '../../docs/_components/prose';

/**
 * Organizations, members, project access, invitations (by email and in the
 * app), the standard roles, ownership. Section ids are targets of the tenant
 * panel's GuideLink (organizations, switching, members, invitations, roles,
 * ownership) — keep them.
 */

const SECTIONS = [
	{ id: 'organizations', title: 'Organizations' },
	{ id: 'switching', title: 'Several organizations' },
	{ id: 'members', title: 'Members' },
	{ id: 'project-access', title: 'Which projects people open' },
	{ id: 'invitations', title: 'Inviting people' },
	{ id: 'invited', title: 'When you’re invited' },
	{ id: 'roles', title: 'Roles and permissions' },
	{ id: 'ownership', title: 'The owner' },
	{ id: 'leaving', title: 'Leaving and removing' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Organization = () => (
	<UserGuide
		href='/user-docs/organization'
		sections={SECTIONS}
		open={{ href: '/org/members', label: 'Open Members' }}>
		<Section
			id='organizations'
			title='Organizations'
			lead='Your company or team. Its members, roles and projects belong to it.'>
			<P>
				Signing up makes an organization with you as its owner. Everything you build lives in one of its projects, and
				everyone you invite joins the organization — not a single project. Nothing in one organization can be seen from
				another.
			</P>
			<P>
				<A href='/org/settings'>Organization → Settings</A> holds its name and the business details you gave at sign-up:
				business name, industry, team size, website, country, how you heard about us, and what you’re building. Changing them
				needs the <em>Edit the organization</em> permission.
			</P>
		</Section>

		<Section
			id='switching'
			title='Several organizations'
			lead='One account can belong to any number of organizations.'>
			<P>
				Your own organization and every one you’ve been invited to are listed under <strong>Your organizations</strong> on{' '}
				<A href='/projects'>Projects</A>, with your role in each, and in the switcher at the top right under{' '}
				<strong>Organization</strong>. Pick one to work in it — the panel reloads with its projects.{' '}
				<strong>New organization</strong> (in the switcher) starts another, with you as its owner.
			</P>
			<P>
				Your account, password and two-step sign-in are the same in all of them; your role, and the projects you can open,
				can differ in each.
			</P>
		</Section>

		<Section
			id='members'
			title='Members'
			lead='Organization → Members lists everyone in the organization and their role.'>
			<P>
				Each member shows their name, email, role, the projects they can open, and whether they use two-factor sign-in. With
				the <em>Manage members</em> permission you can change someone’s role and projects from the list — it takes effect on
				their next click — or remove them.
			</P>
		</Section>

		<Section
			id='project-access'
			title='Which projects people open'
			lead='Each member opens every project, or only the ones you choose.'>
			<Terms
				head={['Choice', 'Means']}
				rows={[
					['All projects', 'Every project of the organization, including ones made later. The default.'],
					['Only these', 'Just the projects ticked. Others don’t appear for them anywhere — not in the switcher, not by address.'],
				]}
			/>
			<P>
				Change it from the member’s row on <A href='/org/members'>Members</A> (the line with the folder icon). Their role still
				decides what they can do <em>inside</em> those projects. Owner and Admin always open every project.
			</P>
			<List
				items={[
					'Someone limited to some projects who creates a project gets access to it automatically.',
					'Deleting a project removes it from everyone’s list.',
					'An AI key stops working for a project its maker can no longer open.',
				]}
			/>
		</Section>

		<Section
			id='invitations'
			title='Inviting people'
			lead='Invite by email; they join with the role you choose.'>
			<List
				ordered
				items={[
					<>
						On <A href='/org/members'>Members</A>, press <strong>Invite</strong>.
					</>,
					<>
						Enter their email, pick a role, and choose their projects — all of them, or only some. They get an email with a link
						that works for 7 days.
					</>,
					<>
						Someone new chooses a name and password from the link. Someone with an account joins in one click if they’re signed
						in, or signs in with their password. Either way, they land in your organization with that role and those projects.
					</>,
				]}
			/>
			<P>
				Waiting invitations are listed under <strong>Pending invitations</strong>. <strong>Resend</strong> sends a fresh link
				(the old one stops working) and gives it another 7 days; <strong>Cancel</strong> withdraws it.
			</P>
		</Section>

		<Section
			id='invited'
			title='When you’re invited'
			lead='Invited to someone else’s organization? It joins the ones you already have.'>
			<P>
				Open the link in the email — signed in to the invited account, <strong>Join</strong> is all it takes. Or find it in the
				app: <strong>Invitations for you</strong> on <A href='/projects'>Projects</A> lists every invitation sent to your
				email, with who sent it, your role and your projects — <strong>Join</strong> or <strong>Decline</strong>.
			</P>
			<P>
				Invitations show in the app once your email is verified, so nobody can sign up with your address and see them. Press{' '}
				<strong>Send a code</strong> there and type the 6-digit code we email you. Joining from an emailed link, or resetting
				your password by email, verifies it too.
			</P>
		</Section>

		<Section
			id='roles'
			title='Roles and permissions'
			lead='A role is a set of permissions. Every organization starts with three.'>
			<Terms
				head={['Role', 'Can']}
				rows={[
					['Owner', 'Everything. There is exactly one owner — you, if you signed up.'],
					['Admin', 'Everything except handing the organization over or deleting a project that holds data.'],
					['Member', 'View, add, edit and delete records in their projects, and start new projects. You can change what Member allows.'],
				]}
			/>
			<P>
				Make your own on <A href='/org/roles'>Organization → Roles</A> — a “Viewer” that only reads, an “Editor” that changes
				records and builds. A role is a name, a description and the standard permissions, records first:
			</P>
			<Terms
				head={['Permission', 'Allows']}
				rows={[
					['Records: View', 'Seeing every model’s records, the media, the customers and the analytics'],
					['Records: Add', 'Adding records, importing them from a file, uploading files'],
					['Records: Edit', 'Changing records, archiving them, moving their status'],
					['Records: Delete', 'Deleting and merging records, deleting files'],
					['Build', 'Models, pages, the sidebar, the dashboard, media and the public API'],
					['AI keys', 'Making and revoking the keys AI assistants connect with'],
					['Create projects', 'Starting new apps and websites'],
					['Manage projects', 'Renaming, archiving and deleting the projects they can open'],
					['Manage members', 'Inviting people, changing their roles and projects, removing them'],
					['Manage roles', 'Creating, editing and deleting roles'],
					['Edit the organization', 'Its name and business details'],
				]}
			/>
			<P>
				Record permissions apply to every model alike, in the projects the member can open — to keep someone to some work,
				give them only the projects it’s in. Owner and Admin always have every permission; Member’s can be changed. A role
				can’t be deleted while members have it or a pending invitation uses it — move them to another role first.
			</P>
		</Section>

		<Section
			id='ownership'
			title='The owner'
			lead='One person owns the organization.'>
			<P>
				Only the owner can delete a project that still has models and records in it, and hand the organization to someone
				else: <A href='/org/settings'>Settings → Ownership</A>, choose a member, confirm. They become the owner and you become
				an Admin.
			</P>
		</Section>

		<Section
			id='leaving'
			title='Leaving and removing'>
			<List
				items={[
					<>
						<strong>Leave</strong> is on your own row in Members. The owner can’t leave — hand ownership over first.
					</>,
					'Removing someone signs them out of the organization at once. What they added stays.',
					'Their account itself stays: they keep any other organizations they belong to.',
				]}
			/>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['The invitation link says it has expired', 'Links last 7 days. Ask for it to be resent.'],
					['The invitation email never came', 'Check spam, then ask for it to be resent — or check the address on Pending invitations.'],
					['A teammate can’t see a project', 'It isn’t among their projects. Change it on their row in Members.'],
					['A teammate can’t see any records', 'Their role lacks Records: View. Edit the role.'],
					['I don’t see an invitation in the app', 'Verify your email on Projects, or open the link in the email.'],
					['A teammate has no Build section', 'Their role lacks the Build permission.'],
					['I was signed out suddenly', 'You were removed from the organization, or it was switched off. Sign in again.'],
					['I can’t delete a role', 'Members or a pending invitation still use it. Give them another role first.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Organization;
