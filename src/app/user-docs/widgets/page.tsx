'use client';

import UserGuide, { API_ORIGIN } from '../_components/UserGuide';
import { A, C, CodeBlock, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * Site widgets (backend docs/widgets): the mint.js script, the shared look,
 * the login widget, window.Mint and what's coming. The panel's Widgets page
 * (src/app/widgets) links each panel here — the section ids are GuideLink
 * targets (GuideLink.tsx GUIDE_OF).
 */

const SECTIONS = [
	{ id: 'add-mint', title: 'Add MINT to your site' },
	{ id: 'look', title: 'The look' },
	{ id: 'login', title: 'Login & account' },
	{ id: 'mint-js', title: 'Mint in your own code' },
	{ id: 'coming-next', title: 'Coming next' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const SCRIPT = `<script src="${API_ORIGIN}/public/mint.js" data-project="<project>" async></script>`;

const Widgets = () => (
	<UserGuide
		href='/user-docs/widgets'
		sections={SECTIONS}
		open={{ href: '/widgets', label: 'Open Widgets' }}>
		<Section
			id='add-mint'
			title='Add MINT to your site'
			lead='One script tag per page, then put each widget where it should appear.'>
			<P>
				Widgets are ready-made pieces for a website or app you host yourself: sign-in today, with cart, checkout, forms and
				more on the way. They talk to your project’s <A href='/user-docs/public-api'>public API</A>, so any project with
				one can use them, websites and APIs alike. Find them in the panel under <em>Site → Widgets</em> (websites) or next to
				the Public API (other projects).
			</P>
			<CodeBlock
				label='add once per page'
				code={SCRIPT}
			/>
			<P>
				The Widgets page has this tag ready with your project filled in. Put it in <C>&lt;head&gt;</C> or just before{' '}
				<C>&lt;/body&gt;</C>. Then place a widget with its snippet, such as <C>&lt;div data-mint="login"&gt;&lt;/div&gt;</C>,
				or as a tag: <C>&lt;mint-login&gt;&lt;/mint-login&gt;</C>.
			</P>
			<List
				items={[
					'A widget shows only once you switch it on and save. Switch it off and it disappears from your site within a minute.',
					'Each widget’s code loads only on pages that use it.',
					'Widgets draw in their own sealed area: your CSS can’t break them and theirs can’t touch your page.',
					'Widgets added to the page later (single-page apps, pop-ups) are picked up too.',
				]}
			/>
		</Section>

		<Section
			id='look'
			title='The look'
			lead='Colour, font, corners and light or dark, shared by every widget.'>
			<Terms
				head={['Setting', 'What it does']}
				rows={[
					['Colour', 'Buttons and links. Leave it empty on a website to use the colour from Site setup.'],
					['Font', 'A font your site already loads, e.g. Inter. Empty: whatever the page around the widget uses.'],
					['Corners', 'How round cards, buttons and fields are, 0–24 pixels.'],
					['Light or dark', <>
						<em>Match the page</em> looks at the background behind each widget: light on light pages, dark on dark ones.
						Or pick <em>Always light</em> / <em>Always dark</em>.
					</>],
				]}
			/>
			<P>
				Each widget has a live preview beside its settings, on a light or dark page. It shows your unsaved changes; nothing
				goes live until you press <em>Save</em>.
			</P>
		</Section>

		<Section
			id='login'
			title='Login & account'
			lead='Sign in and sign up for your project’s customers; once signed in, their name and a sign-out link.'>
			<P>
				It uses the same customer accounts as the public API’s signed-in endpoints. See{' '}
				<A href='/user-docs/customers'>Customers</A> for how those accounts work.
			</P>
			<Terms
				head={['Option', 'Choices']}
				rows={[
					['Layout', 'A card on the page (suits an account page), or a button that opens the card (suits a header).'],
					['Opens on', 'Sign in or Create an account: which form shows first.'],
					['Let visitors create accounts', 'Off: only people who already have an account can sign in.'],
				]}
			/>
			<P>
				Under <em>Texts</em> you can reword every title, button and link, for example into your own language. In the
				signed-in text, <C>{'{name}'}</C> becomes the customer’s name.
			</P>
			<P>To change an option on one page only, add it to the element as a <C>data-</C> attribute:</P>
			<CodeBlock
				label='one page, different options'
				code={`<div data-mint="login" data-layout="button"></div>
<mint-login data-start-with="signup"></mint-login>`}
			/>
			<Note>
				Pages written for the older widget (<C>widget.js</C> with <C>data-mint-login</C>) keep working. Switching to{' '}
				<C>mint.js</C> gets you the panel’s options, texts and look.
			</Note>
		</Section>

		<Section
			id='mint-js'
			title='Mint in your own code'
			lead='mint.js gives your page’s scripts window.Mint.'>
			<Terms
				head={['Use', 'Does']}
				rows={[
					[<C key='r'>await Mint.auth.ready</C>, 'Waits until the stored sign-in has been checked; gives the customer or null.'],
					[<C key='u'>Mint.auth.user</C>, 'The signed-in customer, or null.'],
					[<C key='i'>Mint.auth.signIn(email, password)</C>, 'Signs in from your own form.'],
					[<C key='s'>Mint.auth.signUp({'{ name, email, password }'})</C>, 'Creates the account and signs in.'],
					[<C key='o'>Mint.auth.signOut()</C>, 'Signs out on this browser.'],
					[<C key='c'>Mint.auth.onChange(cb)</C>, 'Calls cb with the customer (or null) on every sign-in and sign-out.'],
					[<C key='a'>Mint.api(path, init)</C>, <>Calls your public API, as the customer when one is signed in. Gives a <C>fetch</C> Response.</>],
					[<C key='e'>Mint.on(event, cb)</C>, <>Listens for widget events, e.g. <C>auth</C>. They also fire on <C>document</C> as <C>mint:auth</C>.</>],
				]}
			/>
			<CodeBlock
				label='Mint example'
				code={`<script>
  document.addEventListener('mint:auth', e => {
    document.body.classList.toggle('signed-in', !!e.detail);
  });
  async function myOrders() {
    await Mint.auth.ready;
    if (!Mint.auth.user) return [];
    const res = await Mint.api('orders?sort=-createdAt');
    return (await res.json()).doc;
  }
</script>`}
			/>
			<P>
				<C>window.MintAuth</C> still works and is the same object as <C>Mint.auth</C>.
			</P>
		</Section>

		<Section
			id='coming-next'
			title='Coming next'
			lead='Being built now, roughly in this order.'>
			<List
				items={[
					<>
						<strong>Cart</strong>: add-to-cart buttons on any product, and a cart that follows the customer between devices.
					</>,
					<>
						<strong>Checkout & payments</strong>: address, delivery and payment, with prices worked out on the server. Payments go
						to your own merchant account. Which providers you can use depends on your organization’s country: Stripe everywhere,
						plus SSLCommerz and bKash in Bangladesh. Your country is set in{' '}
						<A href='/user-docs/organization'>organization settings</A>.
					</>,
					<>
						<strong>My orders</strong>: order history and tracking in the account widget.
					</>,
					<>
						<strong>Forms</strong>: contact and newsletter forms built from your models, with spam protection.
					</>,
					<>
						<strong>Booking</strong>: free slots worked out on the server, so there are no double bookings.
					</>,
					<>
						<strong>WhatsApp button, cookie consent and search</strong>.
					</>,
				]}
			/>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['Nothing shows', <>Is the widget switched on and saved? Is the script’s <C>data-project</C> right? The browser console says which.</>],
					['A change doesn’t show', 'Sites pick up saved changes within a minute. Reload the page.'],
					['The colours clash with my page', <>Set <em>Light or dark</em> to Always light or Always dark, or pick a colour under <em>Look</em>.</>],
					['Signed in, but my API calls get 401', <>Use <C>Mint.api</C>: plain <C>fetch</C> doesn’t send the customer’s token.</>],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Widgets;
