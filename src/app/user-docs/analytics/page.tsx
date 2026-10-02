'use client';

import UserGuide, { API_ORIGIN } from '../_components/UserGuide';
import { A, C, CodeBlock, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * Website analytics: the tracker (backend routes-public/track.ts), what it
 * records, and the Analytics page. `analytics` is a GuideLink target.
 */

const SECTIONS = [
	{ id: 'analytics', title: 'What it is' },
	{ id: 'install', title: 'Adding the tracker' },
	{ id: 'domains', title: 'Your domains' },
	{ id: 'reports', title: 'The Analytics page' },
	{ id: 'numbers', title: 'What the numbers mean' },
	{ id: 'events', title: 'Clicks and events' },
	{ id: 'privacy', title: 'Privacy' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const SNIPPET = `<script src="${API_ORIGIN}/public/track.js" data-project="<project>" defer></script>`;

const Analytics = () => (
	<UserGuide
		href='/user-docs/analytics'
		sections={SECTIONS}
		open={{ href: '/analytics', label: 'Open Analytics' }}>
		<Section
			id='analytics'
			title='What it is'
			lead='Visits to your website, counted without cookies.'>
			<P>
				Page views, visitors and visits, where they came from, what they use, which links they click, and events you send
				yourself — for website projects, in <strong>Audience → Analytics</strong>. One line of HTML on your site starts it.
			</P>
		</Section>

		<Section
			id='install'
			title='Adding the tracker'
			lead='Put this on every page of your site, in the head or before the end of the body.'>
			<CodeBlock
				label='tracker snippet'
				code={SNIPPET}
			/>
			<List
				items={[
					<>
						Replace <C>&lt;project&gt;</C> with your project’s public name — or copy the snippet, filled in, from the{' '}
						<A href='/public-api'>Public API</A> page.
					</>,
					'Single-page sites (React, Next.js, Vue…) are handled: a page view is counted on every route change, not only on load.',
					'Events are sent in small batches in the background, so they don’t slow your pages.',
				]}
			/>
		</Section>

		<Section
			id='domains'
			title='Your domains'>
			<P>
				List your site’s domains on the project (Projects → ⋯ → Edit). Then only visits from them — and their subdomains —
				count, so nobody can fill your reports by copying the snippet elsewhere. <C>example.com</C> covers{' '}
				<C>www.example.com</C> and <C>shop.example.com</C>. With no domains listed, visits from any site count.
			</P>
		</Section>

		<Section
			id='reports'
			title='The Analytics page'
			lead='Choose the last 7, 30 or 90 days, or 12 months.'>
			<List
				items={[
					'Five numbers, each against the same length of time just before: page views, visitors, visits, pages per visit, bounce rate.',
					'Page views per day, as a line.',
					'Top pages, referrers (sites that sent visitors; “Direct / none” for typed or bookmarked visits), devices, countries, clicks and events.',
				]}
			/>
			<P>
				Seeing it needs <em>Records: View</em> in your role (owners and admins always can). It counts only this project’s
				site.
			</P>
		</Section>

		<Section
			id='numbers'
			title='What the numbers mean'>
			<Terms
				head={['Number', 'Is']}
				rows={[
					['Page views', 'Every page shown — a visitor reading three pages is three.'],
					['Visitors', 'Different browsers. One person on a phone and a laptop counts twice.'],
					['Visits', 'Browsing sessions; a visit ends when its tab is closed.'],
					['Pages per visit', 'Page views ÷ visits.'],
					['Bounce rate', 'Visits that saw one page and left.'],
				]}
			/>
		</Section>

		<Section
			id='events'
			title='Clicks and events'>
			<P>Links to other sites are counted as clicks automatically. To count a click on anything else, name it:</P>
			<CodeBlock
				label='tracked button'
				code={`<button data-track="book-now">Book now</button>`}
			/>
			<P>For things that aren’t clicks — a form sent, a video finished — send an event from your code:</P>
			<CodeBlock
				label='custom event'
				code={`MintAnalytics.track('signup', { plan: 'pro', yearly: true });
// a page view by hand, for routers the tracker doesn’t see:
MintAnalytics.pageview();`}
			/>
			<P>
				Event properties are a flat object of up to 20 short text, number or yes/no values. Visits arriving with{' '}
				<C>utm_source</C>, <C>utm_medium</C> and <C>utm_campaign</C> in the address are recorded with them.
			</P>
		</Section>

		<Section
			id='privacy'
			title='Privacy'>
			<List
				items={[
					'No cookies. A random visitor id is kept in the browser’s local storage, and a visit id that ends with the tab.',
					'Nothing personal is collected: no names or emails. The country and city come from the IP address, which isn’t stored.',
					'Visitors with “Do Not Track” on aren’t counted, and search-engine bots are left out.',
					<>
						Add <C>data-no-track</C> to the script tag to switch it off — on a staging site, say.
					</>,
				]}
			/>
			<Note>
				Your site’s privacy policy should still mention that you count visits. Whether you need a consent banner depends on
				where you and your visitors are.
			</Note>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['“No visits recorded yet”', 'Check the snippet is on the pages and its data-project is right.'],
					['My own visits don’t show', 'Your domain isn’t in the project’s list, or your browser sends Do Not Track.'],
					['There’s no Analytics in the sidebar', 'The project is an app (analytics is for websites), or your role can’t read records.'],
					['Testing on localhost doesn’t count', 'localhost isn’t one of your domains. Test on the live site, or clear the domains while you test.'],
					['Numbers differ from another tool', 'Each tool counts its own way (bots, Do Not Track, ad blockers). Compare trends, not totals.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Analytics;
