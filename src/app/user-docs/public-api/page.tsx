'use client';

import UserGuide, { PUBLIC_API } from '../_components/UserGuide';
import { A, C, CodeBlock, H3, List, Note, P, Section, Terms } from '../../docs/_components/prose';
import { PAYLOAD_EXAMPLE, VERIFY_NODE } from '../../webhooks/_components/verify';

/**
 * The public API (backend routes-public/public.router.ts), for tenants and the
 * developers of their sites. `public-api` is a GuideLink target (the Public
 * API page); `who` is linked from the Models guide.
 */

const SECTIONS = [
	{ id: 'public-api', title: 'What it is' },
	{ id: 'turn-on', title: 'Making a model public' },
	{ id: 'who', title: 'Who may call it' },
	{ id: 'read-only', title: 'Read-only fields' },
	{ id: 'address', title: 'The address' },
	{ id: 'requests', title: 'Requests' },
	{ id: 'list', title: 'Listing and paging' },
	{ id: 'sorting', title: 'Sorting' },
	{ id: 'filters', title: 'Filters' },
	{ id: 'filter-kinds', title: 'Filters by kind of field' },
	{ id: 'dates', title: 'Filtering by date' },
	{ id: 'search', title: 'Search' },
	{ id: 'fields', title: 'Choosing fields' },
	{ id: 'recipes', title: 'Recipes' },
	{ id: 'shape', title: 'What comes back' },
	{ id: 'writing', title: 'Creating and updating' },
	{ id: 'signed-in', title: 'Calling as a customer' },
	{ id: 'errors', title: 'Errors and limits' },
	{ id: 'reference', title: 'The API reference' },
	{ id: 'examples', title: 'Example requests' },
	{ id: 'tester', title: 'Trying requests' },
	{ id: 'webhooks', title: 'Webhooks' },
	{ id: 'verify-signatures', title: 'Checking a webhook is real' },
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
			lead='Audience → Public API (in an API project: API → Public API). Needs the Build permission.'>
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
					<>
						With Create or Update ticked, tick the <A href='#read-only'>read-only fields</A> — what only your team sets, like an
						order’s status.
					</>,
				]}
			/>
			<P>
				The <A href='/public-api'>Public API</A> page shows each model’s address and ready-to-copy examples for the open
				project. A website project’s Pages, SEO and Contents start public, read-only — that’s how your site
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
			id='read-only'
			title='Read-only fields'
			lead='What only your team sets — never a request. Public API → the model → Read-only fields (shown when Create or Update is ticked).'>
			<P>
				A customer who can create an order shouldn’t be able to send <C>{'"status": "paid"'}</C> with it. Tick the fields your
				business controls — an order’s status, payment reference, tracking link; a booking’s confirmation — and the API never
				writes them:
			</P>
			<Terms
				head={['Request', 'What happens to a read-only field']}
				rows={[
					['Create (POST)', 'Whatever is sent for it is ignored; the new record gets the field’s default (or stays empty).'],
					['Update (PUT)', 'Whatever is sent for it is ignored; it keeps the value it has. The other fields are still saved.'],
					['List, Read one', 'It comes back as usual — your site can show the status, it just can’t change it.'],
				]}
			/>
			<P>
				Requests aren’t refused for sending one, so a site can send back a record it read. Your team still changes these fields
				in the panel as usual — a webhook on the model tells your server when a new order comes in. <C>GET {PUBLIC_API}/</C> and the{' '}
				<A href='#reference'>API reference</A> mark them <C>readOnly</C>; calculated (formula) fields are always read-only.
			</P>
			<Note tone='warn'>
				A required field with no default can’t be read-only while Create is on — every new record would be missing it. Give the
				field a default in Models (an order’s status: <C>pending</C>), or let the API write it.
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
				call it, and its fields (key, label, kind, required, allowed values, and <C>readOnly</C> on those a request can’t write)
				— handy for checking what’s on.
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
			title='Listing and paging'
			lead='GET /<model> answers one page of records at a time, with the numbers you need to page through the rest.'>
			<Terms
				head={['Query', 'Does']}
				rows={[
					[<C key='p'>page</C>, 'Which page, from 1. 1 unless you ask. Past the last page you get an empty list and the same total.'],
					[<C key='l'>limit</C>, 'Records per page: 20 unless you ask, 1 to 100. More than 100 counts as 100.'],
				]}
			/>
			<P>
				Every list answers <C>{'{ doc, total, page, limit, totalPages }'}</C>: <C>doc</C> is this page’s records,{' '}
				<C>total</C> how many records match your filters across every page, and <C>totalPages</C> how many pages that makes
				at this <C>limit</C>. There’s another page while <C>page &lt; totalPages</C>.
			</P>
			<CodeBlock
				label='Page 2, 12 to a page'
				code={`GET ${PUBLIC_API}/products?page=2&limit=12

{ "doc": [ …12 records… ], "total": 37, "page": 2, "limit": 12, "totalPages": 4 }`}
			/>
			<P>
				Pages are stable: records that sort the same are always put in the same order, so paging never shows a record twice
				or skips one — unless records are added or removed while you page.
			</P>
			<CodeBlock
				label='Every record, page by page'
				code={`async function all(model, query = {}) {
  const records = [];
  for (let page = 1; ; page++) {
    const params = new URLSearchParams({ ...query, page, limit: 100 });
    const res = await fetch(\`${PUBLIC_API}/\${model}?\${params}\`);
    if (!res.ok) throw new Error((await res.json()).message);
    const { doc, totalPages } = await res.json();
    records.push(...doc);
    if (page >= totalPages) return records;
  }
}`}
			/>
			<Note>
				Fetching everything costs one request per 100 records and counts toward the rate limit (see{' '}
				<A href='#errors'>Errors and limits</A>). For a page your visitors see, ask for just the page they’re on.
			</Note>
		</Section>

		<Section
			id='sorting'
			title='Sorting'
			lead='sort names a field; a minus in front reverses it.'>
			<Terms
				head={['Query', 'Order']}
				rows={[
					[<C key='1'>sort=-createdAt</C>, 'Newest first — the default when you don’t say.'],
					[<C key='2'>sort=price</C>, 'Lowest price first (A→Z for text, oldest first for dates, false before true).'],
					[<C key='3'>sort=-price</C>, 'Highest price first.'],
					[<C key='4'>sort=-featured,price</C>, 'Featured first, then by price within each — up to three fields, comma-separated.'],
				]}
			/>
			<P>
				You can sort by any of the model’s own fields and by <C>createdAt</C>, <C>updatedAt</C>, <C>code</C> and{' '}
				<C>_id</C>. A field the list can’t sort by is skipped; if none is left, the default applies. The reference on the{' '}
				<A href='/public-api'>Public API</A> page lists each model’s sortable fields.
			</P>
		</Section>

		<Section
			id='filters'
			title='Filters'
			lead='Add a field’s key to the address to get only the records that match — the same way the panel’s own lists filter.'>
			<P>
				<C>&lt;field&gt;=&lt;value&gt;</C> keeps the records whose field equals the value. For anything else, add an operator to
				the field’s key with an underscore: <C>&lt;field&gt;_&lt;operator&gt;=&lt;value&gt;</C>.
			</P>
			<CodeBlock
				label='Live products from 10 to 50, cheapest first'
				code={`GET ${PUBLIC_API}/products?status=live&price_gte=10&price_lte=50&sort=price`}
			/>
			<Terms
				head={['Operator', 'Keeps records where the field…']}
				rows={[
					[<C key='eq'>status=live</C>, 'equals the value. On a list field (tags, options you can pick several of, several links): has it. On a date: falls on that day.'],
					[<C key='ne'>status_ne=draft</C>, 'doesn’t equal it (a list field: doesn’t have it).'],
					[<C key='in'>status_in=live,sold</C>, 'is any of these, comma-separated. Repeating the name does the same: status=live&status=sold.'],
					[<C key='nin'>status_nin=draft,sold</C>, 'is none of these.'],
					[<C key='gt'>price_gt=10 · price_gte=10</C>, 'is greater than · greater than or equal to the value (numbers and dates).'],
					[<C key='lt'>price_lt=50 · price_lte=50</C>, 'is less than · less than or equal to the value (numbers and dates).'],
					[<C key='bt'>price_btwn=10_50</C>, 'is between the two, both included: from_to. Leave one end out for open-ended — price_btwn=100_ is 100 and up.'],
					[<C key='co'>name_contains=shoe</C>, 'contains the text, any case — “Trail Shoe”, “SHOES”. The value is plain text, not a pattern.'],
					[<C key='al'>tags_all=run,trail</C>, 'has all of these (tags, options you can pick several of, several links).'],
				]}
			/>
			<H3>How filters combine</H3>
			<List
				items={[
					<>Every filter must match: <C>status=live&amp;featured=true</C> is live <em>and</em> featured.</>,
					<>
						Two operators on one field make a range: <C>price_gte=10&amp;price_lt=20</C>.
					</>,
					<>
						For “this or that” on one field use <C>_in</C>. Filters on different fields can’t be OR-ed — make two requests, or
						use <A href='#search'>search</A>.
					</>,
					<>
						Filters, <C>search</C>, <C>sort</C>, <C>page</C>, <C>limit</C> and <C>fields</C> all work together, in any order.
						<C>total</C> and <C>totalPages</C> count what matches.
					</>,
				]}
			/>
			<H3>What the API does with a name it doesn’t know</H3>
			<P>
				It ignores it, so cache busters like <C>?v=2</C> are harmless — but so is a typo: <C>?staus=live</C> filters nothing.
				If a filter seems to be ignored, check the key in Models (it’s the key, not the label, and it’s case-sensitive). A
				value the API can’t read is an error instead, with the reason: <C>price=cheap</C> answers 400 “price must be a
				number”, and so does an operator the field doesn’t take, like <C>status_gte</C>.
			</P>
			<Note>
				Use underscores, not brackets: <C>price_gte=10</C>, never <C>price[gte]=10</C> (that answers 400). Keys with an
				underscore of their own work as they are: <C>contact_email=…</C>, <C>contact_email_contains=…</C>.
			</Note>
			<H3>Writing the address</H3>
			<P>
				Values with spaces, <C>&amp;</C>, <C>+</C>, <C>#</C> or accents must be encoded. Let the browser do it:
			</P>
			<CodeBlock
				label='Build the query with URLSearchParams'
				code={`const params = new URLSearchParams({
  status: 'live',
  price_btwn: '10_50',
  name_contains: 'trail & road',   // encoded for you
  sort: '-createdAt',
  page: '1',
  limit: '12',
});
const res = await fetch(\`${PUBLIC_API}/products?\${params}\`);`}
			/>
		</Section>

		<Section
			id='filter-kinds'
			title='Filters by kind of field'
			lead='What each kind of field takes. Fields not listed here (images, files, rich text, colours, sections, passwords) can’t be filtered.'>
			<Terms
				head={['Field kind', 'Value and operators']}
				rows={[
					[
						'Text, email, link, long text',
						<>
							Exact text (equals is exact and case-sensitive; emails ignore case). <C>_ne</C>, <C>_in</C>, <C>_nin</C>,{' '}
							<C>_contains</C> (any case).
						</>,
					],
					[
						'Options (pick one)',
						<>
							One of the field’s values — the value, not the label. <C>_ne</C>, <C>_in</C>, <C>_nin</C>.
						</>,
					],
					[
						'Number, calculated (formula)',
						<>
							A number: <C>10</C>, <C>12.5</C>, <C>-3</C>. <C>_ne</C>, <C>_in</C>, <C>_nin</C>, <C>_gt</C>, <C>_gte</C>,{' '}
							<C>_lt</C>, <C>_lte</C>, <C>_btwn</C>.
						</>,
					],
					[
						'Yes / no',
						<>
							<C>true</C> or <C>false</C> (<C>1</C> and <C>0</C> work too). <C>_ne</C>. A record saved without the box
							ticked counts as <C>false</C>.
						</>,
					],
					[
						'Date',
						<>
							See <A href='#dates'>Filtering by date</A>. <C>_ne</C>, <C>_gt</C>, <C>_gte</C>, <C>_lt</C>, <C>_lte</C>,{' '}
							<C>_btwn</C>.
						</>,
					],
					[
						'Link to one record',
						<>
							The linked record’s <C>_id</C>: <C>category=66f0c1d2e3a4b5c6d7e8f901</C>. <C>_ne</C>, <C>_in</C>, <C>_nin</C>.
						</>,
					],
					[
						'Tags, options (pick several), links to several records',
						<>
							Equals means “has it”: <C>tags=sale</C>. <C>_ne</C> (doesn’t have it), <C>_in</C> (has any), <C>_nin</C> (has
							none), <C>_all</C> (has every one).
						</>,
					],
					[
						<C key='c'>createdAt, updatedAt</C>,
						'Every model has these two dates, and filters by them like any date — handy for “new this week” and for syncing what changed.',
					],
				]}
			/>
			<P>
				<C>GET {PUBLIC_API}/</C> lists, for each model with List on, its <C>filters</C> (each field’s key, kind and
				operators), the fields <C>search</C> looks through, and the fields it can <C>sort</C> by.
			</P>
		</Section>

		<Section
			id='dates'
			title='Filtering by date'
			lead='Dates take a day, a moment, or a shortcut.'>
			<Terms
				head={['Value', 'Means']}
				rows={[
					[<C key='d'>2026-10-04</C>, 'That whole day (UTC). releasedOn=2026-10-04 is anything on the 4th.'],
					[<C key='t'>2026-10-04T09:30:00Z</C>, 'That exact moment. Add a zone (Z, +06:00) — without one the server’s time zone (UTC) is used.'],
					[<C key='today'>today</C>, 'Today (UTC).'],
					[<C key='w'>week · month · year</C>, 'The last 7 days · month · year, up to the end of today.'],
					[<C key='n'>days_30 · months_3</C>, 'The last 30 days · 3 months, up to the end of today.'],
				]}
			/>
			<P>With a plain day, the operators work in whole days, the way people say it:</P>
			<Terms
				head={['Query', 'Keeps']}
				rows={[
					[<C key='1'>date_gte=2026-10-01</C>, 'From the 1st on, the 1st included.'],
					[<C key='2'>date_lte=2026-10-31</C>, 'Up to the end of the 31st, the 31st included.'],
					[<C key='3'>date_gt=2026-10-01</C>, 'From the 2nd on.'],
					[<C key='4'>date_lt=2026-10-31</C>, 'Up to the end of the 30th.'],
					[<C key='5'>date_btwn=2026-10-01_2026-10-31</C>, 'All of October, both ends included.'],
					[<C key='6'>createdAt=week</C>, 'Added in the last 7 days.'],
					[<C key='7'>updatedAt_gte=2026-10-04T09:30:00Z</C>, 'Changed since that moment — for keeping a copy in sync.'],
				]}
			/>
		</Section>

		<Section
			id='search'
			title='Search'
			lead='search=<words> keeps records where any text field contains the words, ignoring case.'>
			<P>
				It looks through the model’s text, email, long text, options and tags fields, and matches the words as one piece of
				text: <C>search=trail shoe</C> finds “Trail Shoe 2”, not “shoe for the trail”. It works alongside filters and sorting,
				and isn’t a ranked search — sort the results as you like. At most 100 characters are used.
			</P>
			<CodeBlock
				label='A search box'
				code={`const params = new URLSearchParams({ search: input.value, status: 'live', limit: '10' });
const { doc } = await fetch(\`${PUBLIC_API}/products?\${params}\`).then(r => r.json());`}
			/>
			<Note>
				While someone types, wait about 300 ms after the last key before you send (debounce) — a request per key press soon
				reaches the rate limit.
			</Note>
		</Section>

		<Section
			id='fields'
			title='Choosing fields'
			lead='fields=<keys> answers with just those fields of each record — smaller and faster, for menus, cards and dropdowns.'>
			<CodeBlock
				label='Only names and prices'
				code={`GET ${PUBLIC_API}/products?fields=name,price&limit=100

{ "doc": [ { "_id": "66f0…", "name": "Trail shoe", "price": 89 }, … ], "total": 37, … }`}
			/>
			<P>
				<C>_id</C> always comes back. Keys the model doesn’t have are skipped; if none of them is known, every field comes
				back. Linked records named in <C>fields</C> still come with their name. <C>fields</C> only changes what comes back —
				you can filter and sort by fields you didn’t ask for.
			</P>
		</Section>

		<Section
			id='recipes'
			title='Recipes'>
			<Terms
				head={['You want', 'Request']}
				rows={[
					['A shop page: one category, a price range, cheapest first, 24 to a page', <C key='1'>GET /products?category=&lt;id&gt;&amp;price_btwn=20_100&amp;sort=price&amp;limit=24&amp;page=1</C>],
					['The newest three posts for a home page', <C key='2'>GET /posts?status=published&amp;sort=-createdAt&amp;limit=3</C>],
					['Featured items only', <C key='3'>GET /products?featured=true</C>],
					['Anything tagged sale or new', <C key='4'>GET /products?tags_in=sale,new</C>],
					['Upcoming events, soonest first', <C key='5'>GET /events?startsOn_gte=today&amp;sort=startsOn</C>],
					['Bookings for one day', <C key='6'>GET /bookings?date=2026-10-14</C>],
					['What changed since your last sync', <C key='7'>GET /products?updatedAt_gt=2026-10-04T09:30:00Z&amp;sort=updatedAt&amp;limit=100</C>],
					['A dropdown of names', <C key='8'>GET /categories?fields=name&amp;sort=name&amp;limit=100</C>],
					['How many records match, without the records', <C key='9'>GET /orders?status=open&amp;fields=_id&amp;limit=1</C>],
				]}
			/>
			<P>
				The last one reads <C>total</C> from the answer. Every list endpoint on the <A href='/public-api'>Public API</A> page
				comes with examples made from that model’s own fields — press <strong>Try</strong> on one to send it.
			</P>
			<CodeBlock
				label='“Load more” (infinite scroll)'
				code={`let page = 0, totalPages = 1;
async function loadMore() {
  if (page >= totalPages) return;            // nothing left
  page += 1;
  const res = await fetch(\`${PUBLIC_API}/products?status=live&sort=-createdAt&limit=12&page=\${page}\`);
  const data = await res.json();
  totalPages = data.totalPages;
  render(data.doc);                          // append to what's shown
}`}
			/>
		</Section>

		<Section
			id='shape'
			title='What comes back'>
			<P>
				A list is <C>{'{ doc, total, page, limit, totalPages }'}</C>; one record is the record itself. A record has{' '}
				<C>_id</C>, <C>code</C> (when the model numbers records), <C>createdAt</C>, <C>updatedAt</C> and the model’s own
				fields — nothing else. Linked records come with their name: <C>{'"category": { "_id": "…", "name": "Shoes" }'}</C>.
				Records you archive in the panel never come out — not in lists, and not by their <C>_id</C>.
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
					<>
						Send the model’s fields as JSON. Anything else is ignored; calculated (formula) fields are worked out on the server,
						and <A href='#read-only'>read-only fields</A> are left to your team, whatever you send.
					</>,
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
					[
						'400',
						<>
							Something isn’t valid; <C>message</C> says what — a body (“Quantity is required”) or a list’s query (“price
							must be a number”, “status can’t use _gte — it takes status_ne, status_in, status_nin”).
						</>,
					],
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
				action on and its endpoint appears. Above the models, <strong>Lists: paging, sorting and filters</strong> sums up the
				query parameters and operators every list takes. Click an endpoint for the rest: a list shows its sortable and
				searchable fields, every filter its fields take (with their operators and allowed values) and example requests made
				from its own fields, each with <strong>Try</strong>; a create or update shows the body fields; every endpoint shows an
				example response. Endpoints marked <strong>Customer</strong> need a signed-in customer’s token. The customer sign-in
				endpoints are listed too, and for a website, the site and page endpoints.
			</P>
		</Section>

		<Section
			id='examples'
			title='Example requests'
			lead='Every endpoint in the reference comes as a request you can paste: curl or fetch.'>
			<P>
				Open an endpoint and its <strong>Example request</strong> is at the top — switch between <strong>curl</strong> for a
				terminal and <strong>fetch</strong> for your site or app, and copy it. The address is your project’s, the body has the
				model’s fields filled in by example, and an endpoint for signed-in customers carries the{' '}
				<C>Authorization: Bearer &lt;customer token&gt;</C> header to fill in. For instance, creating a booking:
			</P>
			<CodeBlock
				label='curl'
				code={`curl -X POST 'https://…/public/api/your-project/bookings' \\
  -H 'Content-Type: application/json' \\
  -d '{"guest":"Ada Lovelace","nights":2}'`}
			/>
			<CodeBlock
				label='fetch'
				code={`const res = await fetch('https://…/public/api/your-project/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ guest: 'Ada Lovelace', nights: 2 }),
});
const data = await res.json();
if (!res.ok) throw new Error(data.message);`}
			/>
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
			id='webhooks'
			title='Webhooks'
			lead='Your project telling your own server when records change. Webhooks page; needs the Build permission.'>
			<P>
				Where the public API lets your site ask for records, a webhook sends them as they change: a new booking to your front-desk
				system, a paid order to the warehouse, anything to Zapier. Whether the change was made in the panel, through the public
				API or by an AI assistant, the project <C>POST</C>s the record to an address of yours.
			</P>
			<List
				ordered
				items={[
					<>
						On <A href='/webhooks'>Webhooks</A>, press <strong>Add a webhook</strong>.
					</>,
					<>Pick the model and when it’s sent: a record created, changed, deleted — any of them.</>,
					<>
						Give the address your server listens on, starting with <C>https://</C>, and a note on what it does with it. Without an
						address the webhook stays off.
					</>,
					<>
						Copy the <strong>secret</strong> that’s shown — it isn’t shown again. Your server uses it to check each request
						(next section). Lost it? The key button makes a new one; the old one stops matching at once.
					</>,
					<>
						Press <strong>Send test</strong>. Your server gets an <C>event: "test"</C> request with the model’s newest record
						(or an example), and the answer shows straight away.
					</>,
				]}
			/>
			<P>Each request has a JSON body like this:</P>
			<CodeBlock
				label='body'
				code={PAYLOAD_EXAMPLE}
			/>
			<Terms
				head={['', 'How it works']}
				rows={[
					['Success', <>Any 2xx answer. Answer quickly — after 10 seconds it counts as no answer.</>],
					[
						'Retries',
						<>
							Anything else is tried 3 more times, waiting longer each time (about 15 seconds, 1 minute, 4 minutes). The{' '}
							<C>delivery</C> id stays the same, so skip one you’ve already handled.
						</>,
					],
					['The log', <>Deliveries on each webhook: the last 50, with what was sent, what came back and how many tries.</>],
					['Fields', <>The record’s own fields, as the public API gives them — never password fields.</>],
					[
						'Addresses',
						<>Servers on the internet only: addresses inside a private network, or the server’s own, are turned away.</>,
					],
				]}
			/>
			<Note>
				An API template can make webhooks for you, asking for the address when the project is made. Off ones are waiting for an
				address — add it and switch them on.
			</Note>
		</Section>

		<Section
			id='verify-signatures'
			title='Checking a webhook is real'
			lead='Anyone can send your server a request; only your project can sign one with the secret.'>
			<P>
				Every request carries <C>x-mint-event</C>, <C>x-mint-delivery</C>, <C>x-mint-timestamp</C> (seconds) and{' '}
				<C>x-mint-signature</C>. The signature is <C>sha256=</C> followed by the HMAC-SHA256, in hex, of the timestamp, a dot and
				the body exactly as it arrived — keyed with the webhook’s secret. Work it out yourself and compare; turn away a request
				that doesn’t match or whose timestamp is more than a few minutes old. In Node:
			</P>
			<CodeBlock
				label='Node'
				code={VERIFY_NODE}
			/>
			<Note tone='warn'>
				Use the raw body. Parsing the JSON and turning it back into text can change spacing or order, and the signature no longer
				matches.
			</Note>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['404 for everything', 'Check the project’s public name in the address, and that the project isn’t archived.'],
					[
						'A webhook says “Couldn’t reach it” or “No answer in 10 seconds”',
						'Your server is down, the address is wrong, or it answers too slowly — answer first, then do the work. Send test shows the answer straight away.',
					],
					['The signature never matches', 'Use the body exactly as it arrived (not re-serialised JSON), and the secret shown last — making a new one retires the old.'],
					['404 for one model', 'It isn’t Public, or the action you’re calling isn’t ticked.'],
					['401', 'The model is for signed-in customers — sign in with the widget, or send the customer’s token.'],
					['A field is missing from the answer', 'Only the model’s own fields come out; check the field’s key in Models — and that fields= doesn’t leave it out.'],
					[
						'A filter changes nothing',
						'The name isn’t one of the model’s filterable keys, so it’s ignored — check the spelling and case of the key (not the label) in Models. Images, files, rich text and sections can’t be filtered.',
					],
					['A text filter finds nothing', <>Equals is exact and case-sensitive. Use <C key='c'>_contains</C> or <C key='s'>search</C> for “contains, any case”.</>],
					['A date filter is a day off', 'Plain days are UTC. For your own time zone, send moments with the zone: date_gte=2026-10-04T00:00:00+06:00.'],
					['A record is in the panel but not in the API', 'It’s archived, it’s kept private to some of the team, or the model is own-records-only.'],
					['A customer can’t see an order made in the panel', 'Own-records-only models show customers only what they created.'],
					[
						'A field I send doesn’t change',
						<>
							It’s <A href='#read-only'>read-only</A> on the Public API page (only your team sets it), or it’s calculated. GET{' '}
							<C key='g'>/</C> marks both <C key='r'>readOnly</C>.
						</>,
					],
					[
						'Can’t make a field read-only: “required and has no default”',
						'With Create on, every new record needs it. Give the field a default in Models, then tick it.',
					],
				]}
			/>
		</Section>
	</UserGuide>
);

export default PublicApi;
