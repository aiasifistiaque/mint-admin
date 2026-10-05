'use client';

import UserGuide, { API_ORIGIN, PUBLIC_API } from '../_components/UserGuide';
import { A, C, CodeBlock, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * Customers of a tenant project: the sign-in widget (backend
 * routes-public/widget.ts), MintAuth, the auth endpoints, and the Customers
 * table. `customers` and `widget` are GuideLink targets.
 */

const SECTIONS = [
	{ id: 'customers', title: 'Customers' },
	{ id: 'widget', title: 'The sign-in widget' },
	{ id: 'mint-auth', title: 'MintAuth in your code' },
	{ id: 'own-form', title: 'Your own sign-in form' },
	{ id: 'tokens', title: 'Tokens and signing out' },
	{ id: 'manage', title: 'Managing customers' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const WIDGET = `<script src="${API_ORIGIN}/public/widget.js" data-project="<project>" async></script>
<div data-mint-login></div>`;

const Customers = () => (
	<UserGuide
		href='/user-docs/customers'
		sections={SECTIONS}
		open={{ href: '/t/customers', label: 'Open Customers' }}>
		<Section
			id='customers'
			title='Customers'
			lead='The people who use your site or app — not the members of your organization.'>
			<P>
				Customers make their own accounts on your site, with an email and password. They never see the MINT panel; they only
				reach the models you made public for <A href='/user-docs/public-api#who'>signed-in customers</A>. Each project has its
				own customers: the same email in two projects is two separate accounts.
			</P>
		</Section>

		<Section
			id='widget'
			title='The sign-in widget'
			lead='A ready-made sign-in and sign-up card — two lines of HTML.'>
			<CodeBlock
				label='sign-in widget'
				code={WIDGET}
			/>
			<P>
				Replace <C>&lt;project&gt;</C> with your project’s public name — the <A href='/public-api'>Public API</A> page has the
				snippet ready. Every <C>data-mint-login</C> element becomes a card with <em>Sign in</em> and{' '}
				<em>Create an account</em>; once signed in it shows “Signed in as …” with a sign-out link. It follows the visitor’s
				light or dark setting and needs no styles of yours.
			</P>
			<List
				items={[
					<>
						<C>data-mode="signup"</C> on the element opens it on <em>Create your account</em>.
					</>,
					'Put the element on as many pages as you like; they all stay in step.',
					'The signed-in customer is remembered in their browser for 30 days.',
				]}
			/>
			<Note>
				The newer <A href='/user-docs/widgets#login'>Login & account widget</A> does the same with options, your own texts
				and your site’s look, set in the panel under Widgets.
			</Note>
		</Section>

		<Section
			id='mint-auth'
			title='MintAuth in your code'
			lead='The widget gives your page’s scripts window.MintAuth.'>
			<Terms
				head={['Use', 'Does']}
				rows={[
					[<C key='r'>await MintAuth.ready</C>, 'Waits until the stored sign-in has been checked; gives the customer or null.'],
					[<C key='u'>MintAuth.user</C>, <>The signed-in customer — <C>{'{ _id, name, email, phone }'}</C> — or null.</>],
					[
						<C key='f'>MintAuth.fetch(path, init)</C>,
						<>
							Calls your public API as the customer: <C>MintAuth.fetch('orders')</C>. Same options as <C>fetch</C>.
						</>,
					],
					[<C key='i'>MintAuth.signIn(email, password)</C>, 'Signs in from your own form.'],
					[<C key='s'>MintAuth.signUp({'{ name, email, password }'})</C>, 'Creates the account and signs in.'],
					[<C key='o'>MintAuth.signOut()</C>, 'Signs out on this browser.'],
					[<C key='c'>MintAuth.onChange(cb)</C>, 'Calls cb with the customer (or null) on every sign-in and sign-out; returns a function to stop.'],
				]}
			/>
			<CodeBlock
				label='MintAuth example'
				code={`<script>
  MintAuth.ready.then(async () => {
    if (!MintAuth.user) return;
    const res = await MintAuth.fetch('orders?sort=-createdAt');
    const { doc } = await res.json();
    renderOrders(doc);
  });
  MintAuth.onChange(user => document.body.classList.toggle('signed-in', !!user));
</script>`}
			/>
		</Section>

		<Section
			id='own-form'
			title='Your own sign-in form'
			lead='Skip the widget and call the API directly — from a mobile app, say.'>
			<Terms
				head={['Request', 'Body → answer']}
				rows={[
					[<C key='r'>POST /auth/register</C>, <>{'{ name, email, password, phone? }'} → {'{ token, customer }'}. Passwords need 8+ characters.</>],
					[<C key='l'>POST /auth/login</C>, <>{'{ email, password }'} → {'{ token, customer }'}</>],
					[<C key='m'>GET /auth/me</C>, 'The signed-in customer (send the token).'],
					[<C key='u'>PUT /auth/me</C>, <>{'{ name, phone }'} — the customer changes their details.</>],
					[<C key='o'>POST /auth/logout-everywhere</C>, 'Signs the customer out on every device.'],
				]}
			/>
			<CodeBlock
				label='Sign in from an app'
				code={`const res = await fetch('${PUBLIC_API}/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const { token, customer, message } = await res.json();
// then: fetch('${PUBLIC_API}/orders', { headers: { Authorization: 'Bearer ' + token } })`}
			/>
		</Section>

		<Section
			id='tokens'
			title='Tokens and signing out'>
			<List
				items={[
					'A token lasts 30 days, and only works for the project that issued it — never for the MINT panel or another project.',
					<>
						Keep it like a password. The widget stores it in the browser’s localStorage; in an app, use its secure storage.
					</>,
					<>
						<C>MintAuth.signOut()</C> forgets it on this browser; <C>logout-everywhere</C> makes every token the customer has
						stop working.
					</>,
					'Switching a customer off in the panel stops their tokens at once.',
				]}
			/>
		</Section>

		<Section
			id='manage'
			title='Managing customers'
			lead='Audience → Customers lists everyone who signed up.'>
			<P>
				See each customer’s name, email, phone, when they joined and last signed in. Edit their name or phone, switch them off
				(they’re signed out and can’t sign in), or delete them. You never see or set their password, and customers can’t be
				added from the panel — they sign up themselves.
			</P>
			<Note>
				There’s no password reset for customers yet. A customer who forgot theirs can sign up again with another email, or
				you can delete their account so they can sign up afresh with the same one.
			</Note>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['The card doesn’t appear', <>Check the script’s <C>data-project</C> and that the page has a <C>data-mint-login</C> element.</>],
					['“An account with this email exists”', 'They signed up before — sign in instead.'],
					['“This account has been switched off”', 'Switched off under Customers. Switch them on again.'],
					['Signed in, but API calls get 401', <>Use <C>MintAuth.fetch</C> (or send the token) — plain fetch has no token.</>],
					['“Too many attempts”', '40 sign-in attempts per 15 minutes per address. Wait and try again.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Customers;
