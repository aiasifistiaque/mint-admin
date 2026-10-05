'use client';

import UserGuide from '../_components/UserGuide';
import { List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * Email (backend docs/messaging M-02): the organization's own email server
 * (SMTP, sent with nodemailer), testing it, the log, and what MINT itself
 * sends. Section ids are targets of the tenant panel's GuideLink (email,
 * email-server, email-test, email-log) — keep them.
 */

const SECTIONS = [
	{ id: 'email', title: 'Who sends what' },
	{ id: 'email-server', title: 'Your email server' },
	{ id: 'providers', title: 'Common providers' },
	{ id: 'email-test', title: 'Testing it' },
	{ id: 'email-log', title: 'What was sent' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Email = () => (
	<UserGuide
		href='/user-docs/email'
		sections={SECTIONS}
		open={{ href: '/org/email', label: 'Open Email' }}>
		<Section
			id='email'
			title='Who sends what'
			lead='Emails to your customers come from you, through your own email server. Emails to you and your team come from MINT.'>
			<Terms
				head={['Email', 'Sent by']}
				rows={[
					['A welcome to each customer who signs up on your sites', 'You — through your email server, from your address'],
					['Emails from a record, newsletters, automations (coming next)', 'You — the same way'],
					['Your welcome to MINT, invitations to your organization', 'MINT'],
					['Password resets, sign-in and verification codes', 'MINT'],
				]}
			/>
			<P>
				Until you add your email server, your customers get no emails from you — signing up on your sites still works.
				MINT doesn’t send anything to your customers in its own name.
			</P>
		</Section>

		<Section
			id='email-server'
			title='Your email server'
			lead='Organization → Email. One server for the whole organization; every project uses it.'>
			<P>Your email host gives you these details (often under “SMTP”, “outgoing mail” or “email clients”):</P>
			<Terms
				head={['Setting', 'What to put']}
				rows={[
					['Server', <>The outgoing (SMTP) server, e.g. <code>smtp.gmail.com</code>. Pick your provider to fill it in.</>],
					['Port and SSL', 'Usually 587 with SSL off (the connection is secured after it starts), or 465 with SSL on.'],
					['Username and password', 'Usually your full email address and its password — or an app password, see below.'],
					['From name', 'What customers see as the sender. Empty: your organization’s name.'],
					['From address', 'The address emails come from. Most servers only send as the account you sign in with.'],
					['Replies go to', 'Where customers’ replies land, if not the from address — e.g. a shared inbox.'],
					['Welcome customers', 'On: a short welcome to everyone who creates an account on your sites.'],
				]}
			/>
			<Note>
				The password is stored encrypted and never shown again, to anyone. To change it, type a new one; leave the box
				empty to keep the stored one.
			</Note>
		</Section>

		<Section
			id='providers'
			title='Common providers'>
			<Terms
				head={['Provider', 'Server · port · SSL']}
				rows={[
					['Gmail / Google Workspace', 'smtp.gmail.com · 587 · off. Turn on 2-step verification, then make an app password (Google Account → Security → App passwords) and use that.'],
					['Outlook / Microsoft 365', 'smtp.office365.com · 587 · off. Your Microsoft 365 admin may have to allow “Authenticated SMTP” for the mailbox.'],
					['Zoho Mail', 'smtp.zoho.com · 465 · on (smtp.zoho.eu or smtp.zoho.in for accounts in Europe or India).'],
					['Namecheap Private Email', 'mail.privateemail.com · 465 · on'],
					['Hostinger', 'smtp.hostinger.com · 465 · on'],
				]}
			/>
			<P>
				Sending a lot? Gmail and Outlook limit how many emails a mailbox sends a day (a few hundred to two thousand). For
				newsletters, a sending service with SMTP (Brevo, Mailgun, Postmark, SendGrid, Amazon SES) works the same way:
				put in its SMTP server and the username and password it gives you.
			</P>
		</Section>

		<Section
			id='email-test'
			title='Testing it'
			lead='After saving, send a test — to yourself, or to any address.'>
			<P>
				The test goes out exactly like your customers’ emails. If it works, the page says <em>Working</em>; if not, it
				says why in plain words — a wrong password, a wrong port, a server that can’t be reached — and the same reason
				is kept until the next email goes out.
			</P>
		</Section>

		<Section
			id='email-log'
			title='What was sent'
			lead='The Email page lists the last 50 emails sent through your server: when, what kind, to whom, the subject, and whether it went.'>
			<P>Only the subject is kept, never the message itself. Entries go after 180 days.</P>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['It says', 'What to do']}
				rows={[
					['refused the username or password', 'Check both. Gmail and Outlook usually need an app password, not your normal password.'],
					['didn’t answer on port …', 'Try 587 with SSL off, or 465 with SSL on.'],
					['The secure connection failed', 'Switch SSL: on for 465, off for 587.'],
					['wouldn’t take this address', 'The address may not exist, or the server won’t send to it. Check the spelling.'],
					['The test arrived in spam', <>Your domain needs SPF and DKIM records for the server you use — your email host’s help pages show what to add.</>],
				]}
			/>
			<List
				items={[
					'Changing the server, port, SSL, username or password marks it as not tested — send a test again.',
					'Removing the server stops your emails at once; the log stays.',
				]}
			/>
		</Section>
	</UserGuide>
);

export default Email;
