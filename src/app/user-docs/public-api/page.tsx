'use client';

import UserGuide, { PUBLIC_API } from '../_components/UserGuide';
import { A, C, CodeBlock, H3, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * The public API (backend routes-public/public.router.ts), for tenants and the
 * developers of their sites. `public-api` is a GuideLink target (the Public
 * API page); `who` is linked from the Models guide.
 */

const SECTIONS = [
	{ id: 'public-api', title: 'What it is' },
	{ id: 'turn-on', title: 'Making a model public' },
	{ id: 'who', title: 'Who may call it' },
	{ id: 'address', title: 'The address' },
	{ id: 'requests', title: 'Requests' },
	{ id: 'list', title: 'Listing and filtering' },
	{ id: 'shape', title: 'What comes back' },
	{ id: 'writing', title: 'Creating and updating' },
	{ id: 'signed-in', title: 'Calling as a customer' },
	{ id: 'errors', title: 'Errors and limits' },
	{ id: 'reference', title: 'The API reference' },
	{ id: 'tester', title: 'Trying requests' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const PublicApi = () => (
	<UserGuide
		href='/user-docs/public-api'
		sections={SECTIONS}
		open={{ href: '/public-api', label: 'Open Public API' }}>
		<Section
			id='public-api'
			title='What it is'
			lead='Your own website or app reading and writing your models — with no server of your own.'>
			<P>
				A product catalogue on your shop’s site, a booking form that saves straight into Bookings, an app where customers see
				their own orders. Every model can have a public API; it’s off until you turn it on, and then answers only the actions
				you tick. It needs no key — what’s public is public, and what needs a customer asks for one.
			</P>
		</Section>

		<Section
			id='turn-on'
			title='Making a model public'
			lead='Audience → Public API. Needs the Build permission.'>
			<List
				ordered
				items={[
					<>
						Switch the model to <strong>Public</strong>. It starts with List and Read one.
					</>,
					<>
						Tick the actions it answers: <strong>List</strong>, <strong>Read one</strong>, <strong>Create</strong>,{' '}
						<strong>Update</strong>, <strong>Delete</strong>.
					</>,
					<>Choose who may call it (next section). Changes apply at once.</>,
				]}
			/>
			<P>
				The <A href='/public-api'>Public API</A> page shows each model’s address and ready-to-copy examples for the open
				project. A website project’s Site settings, Pages, SEO and Contents start public, read-only — that’s how your site
				reads them.
			</P>
		</Section>

		<Section
			id='who'
			title='Who may call it'>
			<Terms
				head={['Choice', 'Means']}
				rows={[
					['Anyone', 'No sign-in. Anyone who knows the address can use the ticked actions — a product list, blog posts, opening hours.'],
					[
						'Signed-in customers',
						<>
							Only your <A href='/user-docs/customers'>customers</A>, signed in. Every customer sees every record — a members-only
							price list.
						</>,
					],
					[
						'Customers — own records only',
						'Each customer only lists, reads, updates and deletes the records they created — orders, bookings, support requests. Records added in the panel belong to no customer, so customers don’t see them.',
					],
				]}
			/>
			<Note tone='warn'>
				With <strong>Anyone</strong>, Create, Update and Delete are open to the whole internet. Tick them only when that’s
				what you want — a contact form’s Create, say — and never Update or Delete.
			</Note>
		</Section>

		<Section
			id='address'
			title='The address'>
			<P>
				Every project has its own, made from its public name (see{' '}
				<A href='/user-docs/projects#address'>Projects → Its public address</A>). Below, <C>&lt;project&gt;</C> stands for it
				and <C>&lt;model&gt;</C> for the model’s address:
			</P>
			<CodeBlock
				label='API address'
				code={`${PUBLIC_API}/<model>`}
			/>
			<P>
				<C>GET {PUBLIC_API}/</C> describes the project: its name and kind, and every public model with its actions, who may
				call it, and its fields (key, label, kind, required, allowed values) — handy for checking what’s on.
			</P>
		</Section>

		<Section
			id='requests'
			title='Requests'>
			<Terms
				head={['Action', 'Request']}
				rows={[
					['List', <C key='l'>GET /&lt;model&gt;</C>],
					['Read one', <C key='g'>GET /&lt;model&gt;/&lt;id&gt;</C>],
					['Create', <C key='c'>POST /&lt;model&gt;</C>],
					['Update', <C key='u'>PUT /&lt;model&gt;/&lt;id&gt;</C>],
					['Delete', <C key='d'>DELETE /&lt;model&gt;/&lt;id&gt;</C>],
				]}
			/>
			<P>Bodies are JSON. Calls work from any website (CORS is open) and from servers alike.</P>
			<CodeBlock
				label='List products'
				code={`const res = await fetch('${PUBLIC_API}/products?limit=12&sort=-createdAt');
const { doc, total, totalPages } = await res.json();`}
			/>
		</Section>

		<Section
			id='list'
			title='Listing and filtering'>
			<Terms
				head={['Query', 'Does']}
				rows={[
					[<C key='p'>page</C>, 'Which page, from 1.'],
					[<C key='l'>limit</C>, 'Records per page: 20 unless you ask, at most 100.'],
					[
						<C key='s'>sort</C>,
						<>
							A field, <C>-</C> first for newest/highest first: <C>sort=price</C>, <C>sort=-createdAt</C> (the default).
						</>,
					],
					[
						<C key='f'>&lt;field&gt;=&lt;value&gt;</C>,
						<>
							Only records whose field equals the value: <C>status=published</C>, <C>featured=true</C>, <C>price=10</C>,{' '}
							<C>category=&lt;id&gt;</C> for a linked record. Text, email, link, options, tags, number, yes/no, date and
							linked-record fields can be filtered.
						</>,
					],
				]}
			/>
			<CodeBlock
				label='Filtered list'
				code={`GET ${PUBLIC_API}/products?category=66f0c1d2e3a4b5c6d7e8f901&featured=true&sort=price&page=2`}
			/>
		</Section>

		<Section
			id='shape'
			title='What comes back'>
			<P>
				A list is <C>{'{ doc, total, page, limit, totalPages }'}</C>; one record is the record itself. A record has{' '}
				<C>_id</C>, <C>code</C> (when the model numbers records), <C>createdAt</C>, <C>updatedAt</C> and the model’s own
				fields — nothing else. Linked records come with their name: <C>{'"category": { "_id": "…", "name": "Shoes" }'}</C>.
			</P>
			<CodeBlock
				label='A list response'
				code={`{
  "doc": [
    { "_id": "66f0…", "name": "Trail shoe", "price": 89, "category": { "_id": "66e1…", "name": "Shoes" },
      "createdAt": "2026-09-30T10:12:00.000Z", "updatedAt": "2026-09-30T10:12:00.000Z" }
  ],
  "total": 37, "page": 1, "limit": 12, "totalPages": 4
}`}
			/>
		</Section>

		<Section
			id='writing'
			title='Creating and updating'>
			<List
				items={[
					'Send the model’s fields as JSON. Anything else is ignored; calculated (formula) fields are worked out on the server, whatever you send.',
					'Create answers 201 with the new record. Update changes only the fields you send and answers with the record.',
					'The same checks as the panel apply: required fields, allowed values, min/max, unique fields.',
				]}
			/>
			<CodeBlock
				label='Create a booking'
				code={`await fetch('${PUBLIC_API}/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ guestName: 'Ana Lima', date: '2026-10-14', guests: 2 }),
});`}
			/>
		</Section>

		<Section
			id='signed-in'
			title='Calling as a customer'>
			<P>
				For models that need a signed-in customer, send their token: <C>Authorization: Bearer &lt;token&gt;</C>. With the
				sign-in widget on the page, <C>MintAuth.fetch('orders')</C> does that for you. Records a signed-in customer creates are
				theirs, which is what <em>own records only</em> goes by. See{' '}
				<A href='/user-docs/customers'>Customers & sign-in</A>.
			</P>
			<CodeBlock
				label='As a customer'
				code={`const res = await fetch('${PUBLIC_API}/orders', {
  headers: { Authorization: 'Bearer ' + token },
});`}
			/>
		</Section>

		<Section
			id='errors'
			title='Errors and limits'>
			<Terms
				head={['Status', 'Means']}
				rows={[
					['400', <>Something isn’t valid; <C>message</C> says what (“Quantity is required”).</>],
					[
						'401',
						<>
							Sign in first (<C>code: "customer_required"</C>) — the model needs a signed-in customer and the token is missing,
							expired or for another project.
						</>,
					],
					[
						'404',
						'The model isn’t public, the action isn’t ticked, the record doesn’t exist (or isn’t this customer’s), or the project is archived.',
					],
					[
						'429',
						<>
							Too many requests (<C>code: "rate_limited"</C>). <C>Retry-After</C> says how many seconds to wait.
						</>,
					],
				]}
			/>
			<H3>Limits</H3>
			<P>
				300 requests a minute per visitor’s IP address, and 40 sign-in or sign-up attempts per 15 minutes. If your own server
				calls the API for every page view (server-side rendering), all those calls come from one address — cache the answers,
				or call from the browser.
			</P>
		</Section>

		<Section
			id='reference'
			title='The API reference'
			lead='On the Public API page, below the models: every endpoint your site or app can call.'>
			<P>
				It’s made from what the live API says it offers, so it always matches the switches above it — turn a model or an
				action on and its endpoint appears. Click an endpoint for its query parameters (paging, sorting and a filter for each
				field), the body fields it takes, and an example response. Endpoints marked <strong>Customer</strong> need a signed-in
				customer’s token. The customer sign-in endpoints are listed too, and for a website, the site and page endpoints.
			</P>
		</Section>

		<Section
			id='tester'
			title='Trying requests'
			lead='“Try it” sends a request to your live API from your browser and shows the answer.'>
			<List
				ordered
				items={[
					<>
						Press <strong>Try</strong> on an endpoint in the reference — or pick a method and type a path, like{' '}
						<C>/products?limit=5</C>.
					</>,
					<>
						For a create or update, edit the example body. It starts with the model’s fields filled in by example.
					</>,
					<>
						Press <strong>Send</strong>. You see the status, how long it took and the JSON that came back.{' '}
						<strong>Copy as fetch</strong> gives you the same call for your code.
					</>,
				]}
			/>
			<P>
				To try a customer-only endpoint, send <C>POST /auth/register</C> or <C>/auth/login</C> first: the tester keeps the token
				and sends it with the next requests. After a list or a create, the record’s <C>_id</C> fills in the next <C>:id</C>.
			</P>
			<Note tone='warn'>Requests are real — a create, update or delete changes your project’s records.</Note>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['404 for everything', 'Check the project’s public name in the address, and that the project isn’t archived.'],
					['404 for one model', 'It isn’t Public, or the action you’re calling isn’t ticked.'],
					['401', 'The model is for signed-in customers — sign in with the widget, or send the customer’s token.'],
					['A field is missing from the answer', 'Only the model’s own fields come out; check the field’s key in Models.'],
					['A customer can’t see an order made in the panel', 'Own-records-only models show customers only what they created.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default PublicApi;
