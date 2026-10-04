'use client';

import UserGuide, { PUBLIC_API } from '../_components/UserGuide';
import { A, C, CodeBlock, H3, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * Website projects: the website kit (backend library/functions/websiteKit),
 * building pages, and the site API (/site, /pages/by-path). `websites` is a
 * GuideLink target.
 */

const SECTIONS = [
	{ id: 'websites', title: 'What you get' },
	{ id: 'site-overview', title: 'The website’s home' },
	{ id: 'site-setup', title: 'Site setup' },
	{ id: 'site-general', title: 'Name, logo and favicon' },
	{ id: 'site-contact', title: 'Contact and social links' },
	{ id: 'site-seo', title: 'Default SEO' },
	{ id: 'tracking', title: 'Tracking tags and pixels' },
	{ id: 'server-side', title: 'Server-side tracking' },
	{ id: 'site-code', title: 'Code on every page' },
	{ id: 'indexing', title: 'Indexing, robots.txt and sitemap' },
	{ id: 'redirects', title: 'Redirects and headers' },
	{ id: 'site-domains', title: 'Domains' },
	{ id: 'site-check', title: 'Check the site' },
	{ id: 'ai-site', title: 'Build your site with AI' },
	{ id: 'kit', title: 'The website kit' },
	{ id: 'build-a-page', title: 'Building a page' },
	{ id: 'contents', title: 'Content blocks' },
	{ id: 'seo', title: 'SEO' },
	{ id: 'menu', title: 'The menu' },
	{ id: 'site-api', title: 'The site API' },
	{ id: 'render', title: 'Rendering your site' },
	{ id: 'starter-code', title: 'Starter code from a template' },
	{ id: 'more', title: 'Blogs, products and more' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const NEXT_EXAMPLE = `// app/[[...slug]]/page.tsx — Next.js, one route for every page
const API = '${PUBLIC_API}';

const load = async (slug: string[] = []) => {
  const path = '/' + slug.join('/');
  const res = await fetch(\`\${API}/pages/by-path?path=\${encodeURIComponent(path)}\`, { next: { revalidate: 60 } });
  return res.ok ? res.json() : null;
};

export async function generateMetadata({ params }) {
  const data = await load((await params).slug);
  return data?.seo
    ? { title: data.seo.title, description: data.seo.description,
        openGraph: { images: data.seo.image ? [data.seo.image] : [] },
        robots: data.seo.noIndex ? { index: false } : undefined }
    : {};
}

export default async function Page({ params }) {
  const data = await load((await params).slug);
  if (!data) return notFound();
  return (
    <main>
      <h1>{data.page.name}</h1>
      {data.contents.map(block => <Block key={block._id} block={block} />)}
    </main>
  );
}`;

const BLOCK_EXAMPLE = `function Block({ block }) {
  switch (block.category) {
    case 'rich-content': return <section dangerouslySetInnerHTML={{ __html: block.richContent }} />;
    case 'image':        return <img src={block.image} alt={block.name} />;
    case 'gallery':      return <div className="gallery">{block.gallery.map(src => <img key={src} src={src} alt="" />)}</div>;
    case 'list':         return <ul>{block.list.map(item => <li key={item}>{item}</li>)}</ul>;
    case 'card':         return <div className="cards">{block.card.map((c, i) => <article key={i}><h3>{c.title}</h3><p>{c.description}</p></article>)}</div>;
    case 'video':        return <video src={block.videoUrl} controls />;
    default:             return <section><h2>{block.content}</h2><p>{block.subContent}</p>
                           {block.btnText && <a href={block.url}>{block.btnText}</a>}</section>;
  }
}`;

const Websites = () => (
	<UserGuide
		href='/user-docs/websites'
		sections={SECTIONS}
		open={{ href: '/projects', label: 'Open Projects' }}>
		<Section
			id='websites'
			title='What you get'
			lead='A website project runs your site’s content; your site shows it.'>
			<P>
				MINT is where your team edits the website — its pages, their text and images, their SEO. Your site (Next.js, Astro, a
				static site, anything that can call an API) reads it with two calls. Make one by choosing <strong>Website</strong> when
				creating a project; list the site’s domains on the project for <A href='/user-docs/analytics'>analytics</A>.
			</P>
		</Section>

		<Section
			id='kit'
			title='The website kit'
			lead='Three ordinary models, in a “Website” sidebar section. Change them like any model.'>
			<Terms
				head={['Model (address)', 'Holds']}
				rows={[
					[<>Pages (<C>pages</C>)</>, 'Every page: its name, path, status, template, parent and place in the menu.'],
					[<>SEO (<C>seo</C>)</>, 'Per page: title, description, share image, keywords, canonical URL, hide from search engines.'],
					[<>Contents (<C>web-contents</C>)</>, 'The content blocks on each page: text, lists, cards, rich text, images, galleries, video.'],
				]}
			/>
			<P>
				They start with a read-only <A href='/user-docs/public-api'>public API</A> (List and Read one, open to anyone), which
				is what the site API uses. Add fields freely; keep the models’ addresses and that public API, or the site API can’t
				find them.
			</P>
			<P>
				The site’s own settings — name, logo, favicon, contact details, default SEO, tags — aren’t a model: they’re on{' '}
				<A href='#site-setup'>Site setup</A>, one set per website. (Websites made before this had a <em>Site settings</em>{' '}
				table; its record was copied to Site setup, and the table can be deleted in the model builder.)
			</P>
		</Section>

		<Section
			id='build-a-page'
			title='Building a page'
			lead='A page, its SEO and its content blocks.'>
			<List
				ordered
				items={[
					<>
						Under <strong>Pages</strong>, add a page: name “About”, path <C>/about</C> (the home page is <C>/</C>), template,
						and status <strong>Draft</strong> while you work.
					</>,
					<>
						Open it. Its <strong>Contents</strong> tab lists its blocks — <strong>Add</strong> there creates one already
						linked to the page. Add a heading block, a rich-text block, a gallery…
					</>,
					<>
						Its <strong>SEO</strong> tab: add the title and description search engines and link previews show.
					</>,
					<>
						Set the page to <strong>Published</strong>. Your site shows it from then on.
					</>,
				]}
			/>
			<Note>Only published pages are served. Set a page back to Draft or Archived to take it down without deleting it.</Note>
		</Section>

		<Section
			id='contents'
			title='Content blocks'
			lead='Each block is one piece of a page. Category says what kind.'>
			<Terms
				head={['Category', 'Uses the fields']}
				rows={[
					['Content', 'Content (heading or main text), Sub content, Button text and Url'],
					['Rich content', 'Rich content — formatted text with headings, lists, links and images'],
					['List / List of links', 'List — one entry per item'],
					['Card', 'Cards — rows of image, title, subtitle and description'],
					['Image / Gallery', 'Image / Gallery'],
					['Video', 'Video URL'],
					['Section / Other', 'Whatever your site’s design needs'],
				]}
			/>
			<List
				items={[
					<>
						<strong>Priority</strong> orders blocks on the page — higher first. <strong>Section</strong> and{' '}
						<strong>Slug</strong> let your site group or find a particular block (“hero”, “faq”).
					</>,
					<>
						<strong>Is visible</strong> off, or status Draft, hides a block without deleting it.
					</>,
					<>
						Background colour, font colour and font sizes are there for blocks that need their own style; <em>Note</em> and{' '}
						<em>Ref image</em> are for your team only.
					</>,
				]}
			/>
		</Section>

		<Section
			id='seo'
			title='SEO'>
			<P>
				One SEO record per page: <strong>Title</strong> (up to 120 characters) and <strong>Description</strong> (up to 320) for
				search results, a <strong>Share image</strong> for link previews, keywords and tags, a <strong>Canonical URL</strong>{' '}
				if the page lives at another address too, and <strong>Hide from search engines</strong>. Your site puts them in the
				page’s head (see the example below); pages without one fall back to the site settings’ defaults.
			</P>
		</Section>

		<Section
			id='menu'
			title='The menu'>
			<P>
				Published pages with <strong>In the menu</strong> on make up the site’s menu, highest <strong>Priority</strong> first.
				Give a page a <strong>Parent page</strong> to put it under another — your site builds the dropdowns from that.
			</P>
		</Section>

		<Section
			id='site-api'
			title='The site API'
			lead='Two read-only calls, no key.'>
			<Terms
				head={['Call', 'Answers']}
				rows={[
					[
						<C key='s'>GET /site</C>,
						<>
							<C>{'{ settings, menu }'}</C> — the site settings, and the menu: <C>{'[{ _id, name, path, parent }]'}</C>.
						</>,
					],
					[
						<C key='p'>GET /pages/by-path?path=/about</C>,
						<>
							<C>{'{ page, seo, contents }'}</C> — the published page at that path, its SEO (or null), and its visible,
							published blocks in order. 404 if there’s no published page there.
						</>,
					],
				]}
			/>
			<CodeBlock
				label='Site API'
				code={`const site = await fetch('${PUBLIC_API}/site').then(r => r.json());
const about = await fetch('${PUBLIC_API}/pages/by-path?path=/about').then(r => r.json());`}
			/>
			<P>
				Need something else — every block with section “faq”, say? The models’ own public API is there too:{' '}
				<C>GET /web-contents?section=faq</C>.
			</P>
		</Section>

		<Section
			id='render'
			title='Rendering your site'
			lead='One route that renders whatever path is asked for.'>
			<P>
				An example with Next.js — fetch the page by its path, put its SEO in the head, and draw each block by its category.
				Any framework works the same way.
			</P>
			<CodeBlock
				label='Next.js page'
				code={NEXT_EXAMPLE}
			/>
			<CodeBlock
				label='Drawing a block'
				code={BLOCK_EXAMPLE}
			/>
			<H3>Images</H3>
			<P>
				Image fields hold the file’s public address from your project’s <A href='/user-docs/media'>Media</A>, ready for an{' '}
				<C>img</C> tag.
			</P>
			<Note tone='warn'>
				Rich content is HTML written by your team. Render it only from your own project, as here — never pass HTML from
				visitors through the same path.
			</Note>
		</Section>

		<Section
			id='site-overview'
			title='The website’s home'
			lead='Open a website project and its dashboard is about the site.'>
			<List
				items={[
					<>
						<strong>Traffic</strong> — page views, visitors, visits and bounce rate for the last 30 days, against the 30 before,
						and views per day. The full reports are on <A href='/user-docs/analytics'>Analytics</A>.
					</>,
					<>
						<strong>Set up</strong> — what’s still missing: name, logo, favicon, default SEO, a published page, SEO on every
						page, a domain, tracking. Each has a link to where it’s set; the list goes once everything is done.
					</>,
					<>
						<strong>Pages</strong> — each page’s path, status, whether it has SEO, and how many content blocks it has.
					</>,
				]}
			/>
			<P>
				Numbers, charts and lists you add in the <A href='/user-docs/dashboard'>dashboard builder</A> show below.
			</P>
		</Section>

		<Section
			id='site-setup'
			title='Site setup'
			lead='Site → Site setup: everything a website needs besides its pages, on one page — not a table.'>
			<P>
				Its tabs are <strong>General</strong>, <strong>Contact & social</strong>, <strong>SEO</strong>,{' '}
				<strong>Tracking</strong>, <strong>Server-side</strong>, <strong>Code</strong>, <strong>Redirects & headers</strong>,{' '}
				<strong>Domains</strong> and <strong>Check the site</strong>. Each setting is a card with its own Save, enabled once
				you change something. Your site reads it all from the <A href='#site-api'>site API</A>, so a change is live within a
				minute with no code change. Changing it needs the Build permission; domains need Manage projects.
			</P>
		</Section>

		<Section
			id='site-general'
			title='Name, logo and favicon'>
			<P>
				<strong>General</strong> has the site’s name, tagline, logo, favicon and footer text, and its theme: primary and
				secondary colour and font. Images come from your <A href='/user-docs/media'>Media library</A>. The analytics script
				adds the favicon to pages that don’t have one.
			</P>
		</Section>

		<Section
			id='site-contact'
			title='Contact and social links'>
			<P>
				<strong>Contact & social</strong>: email, phone, WhatsApp, opening hours, address and a map embed, and the full
				addresses of your Facebook, Instagram, X, LinkedIn, YouTube, TikTok and Pinterest pages. Your site shows the ones you
				fill in.
			</P>
		</Section>

		<Section
			id='site-seo'
			title='Default SEO'>
			<P>
				On the <strong>SEO</strong> tab: the default title, description, share image and keywords, used by any page without
				its own SEO, and a <strong>title template</strong> — <C>%s · Acme</C> makes a page called “About us” show as “About
				us · Acme”.
			</P>
		</Section>

		<Section
			id='tracking'
			title='Tracking tags and pixels'
			lead='Paste an ID, save its card, and the tag is on every page — the analytics script adds it.'>
			<Terms
				head={['Tag', 'The ID looks like']}
				rows={[
					['Google Analytics 4', <C key='a'>G-XXXXXXXXXX</C>],
					['Google Tag Manager', <C key='b'>GTM-XXXXXXX</C>],
					['Google Ads', <C key='c'>AW-123456789</C>],
					['Meta Pixel', 'A long number'],
					['TikTok Pixel', 'Capital letters and digits'],
					['LinkedIn Insight', 'The partner ID, a number'],
					['Pinterest Tag', 'A long number'],
					['X (Twitter) Pixel', <C key='x'>o1a2b</C>],
					['Snap Pixel', 'A 36-character ID with dashes'],
					['Microsoft Clarity', 'The project ID'],
					['Hotjar', 'The site ID, a number'],
				]}
			/>
			<P>
				This works on any site with the <A href='/user-docs/analytics'>analytics script</A> on its pages. Page views on sites
				that change pages without reloading are counted by the pixels too. <strong>MINT analytics</strong> turns the
				panel’s own visit counting on or off. A site that renders its tags itself adds <C>data-no-tags</C> to the script.
			</P>
		</Section>

		<Section
			id='server-side'
			title='Server-side tracking'
			lead='Browsers block a good share of tracking; this server can send the events too.'>
			<Terms
				head={['Provider', 'What the server sends — and what it needs']}
				rows={[
					[
						'Meta Conversions API',
						<>
							Page views, Lead (a record your site sends in, e.g. a contact form) and CompleteRegistration (a customer signs up).
							Needs the Meta Pixel ID and an access token from the pixel’s Conversions API settings.
						</>,
					],
					[
						'Google Analytics (Measurement Protocol)',
						<>generate_lead and sign_up. Needs the Google Analytics ID and an API secret from your web data stream.</>,
					],
				]}
			/>
			<P>
				Turn each on in <strong>Site setup → Server-side</strong>. Keys are kept on the server: once saved, the panel only
				shows that one is set, with Replace and Remove. Meta gets each page view from the pixel and the server with the same
				event id, so it counts it once; Google can’t do that, so page views go to Google from the browser only. Visitors are
				matched by IP address, browser and the platform’s cookie; an email or phone in a form is hashed before it’s sent.
			</P>
			<P>
				So a lead is matched to the visitor who sent it, the site adds <C>window.MintAnalytics?.headers()</C> to the headers
				of its own calls to the site API. Use Meta’s <strong>test event code</strong> while you check it in Events Manager →
				Test events, then clear it.
			</P>
		</Section>

		<Section
			id='site-code'
			title='Code on every page'>
			<P>
				Named pieces of HTML — a chat widget, another provider’s tag, a verification snippet — each placed in the{' '}
				<C>&lt;head&gt;</C>, at the start of <C>&lt;body&gt;</C> or at its end. Add, edit, switch off or remove each one;
				it’s saved straight away. Scripts in it run. Only add code you trust: it can do anything on your site.
			</P>
		</Section>

		<Section
			id='indexing'
			title='Indexing, robots.txt and sitemap'>
			<List
				items={[
					<>
						<strong>Let search engines index the site</strong> — off while you build; robots.txt then asks them all to stay
						away.
					</>,
					<>
						<strong>Sitemap</strong> — a sitemap.xml of your published pages, without those marked <em>Hide from search
						engines</em>, named in robots.txt.
					</>,
					<>
						<strong>Main domain</strong> — the address used in the sitemap and robots.txt.
					</>,
					<>
						<strong>Google Search Console</strong> and <strong>Bing</strong> — the verification codes, added as meta tags.
					</>,
				]}
			/>
			<P>
				Your site serves them from the site API: <C>/site/robots.txt</C> and <C>/site/sitemap.xml</C> — the tab shows the
				full addresses. A site built with <A href='#ai-site'>AI</A> wires them up for you.
			</P>
		</Section>

		<Section
			id='redirects'
			title='Redirects and headers'>
			<P>
				<strong>Redirects</strong> send an old address to a new page or another site — <em>301 permanent</em> when a page
				moved for good, <em>302 temporary</em> otherwise. <strong>Response headers</strong> are sent with your pages, for
				security (<C>X-Frame-Options</C>, <C>Content-Security-Policy</C>) or caching. Both come to your site in{' '}
				<C>GET /site</C> under <C>config</C>; its code applies them (a site built with AI does).
			</P>
		</Section>

		<Section
			id='site-domains'
			title='Domains'>
			<P>
				Where your site is live, e.g. <C>example.com</C> and <C>www.example.com</C>. Analytics only counts visits from these
				(and from localhost while you build), so others can’t send visits in your name. With none, visits from anywhere
				count.
			</P>
		</Section>

		<Section
			id='site-check'
			title='Check the site'
			lead='Is every tag really on the live site?'>
			<P>
				<strong>Check the site</strong> opens your live home page (the main domain, or the first domain) and shows each tag
				set here as <em>On the site</em>, <em>Check this</em> or <em>Not on the site</em>. It also finds tags the page adds
				by itself: the same ID twice means every visit is counted twice; another ID means the page has its own. Google Tag
				Manager confirms your container exists, and Meta confirms the Conversions API token is valid and made for your
				pixel. Each Tracking card shows its result from the last check.
			</P>
		</Section>

		<Section
			id='ai-site'
			title='Build your site with AI'
			lead='Build the site with Claude Code (or any AI editor) and it’s managed from here the moment it’s deployed.'>
			<P>
				<A href='/user-docs/connect-ai'>Connect your AI</A> to this website project, then ask it to build your site — “a
				two-page site for my bakery: a home page and an about page, and a menu of our products”. While it writes the code, it
				puts everything the site shows into this project instead of into the code:
			</P>
			<List
				items={[
					<>
						<strong>Site setup</strong> — name, logo, favicon, colours, font, contact details, social links, default SEO, tags, and
						the domains it’s deployed on.
					</>,
					<>
						<strong>Pages</strong> — each with its SEO and its <strong>content blocks</strong> in order: headings, text,
						buttons, lists, cards, images.
					</>,
					<>
						<strong>Images</strong> — uploaded to your <A href='/user-docs/media'>Media library</A>.
					</>,
					<>
						<strong>Lists</strong> — products, services, team, testimonials — become models of their own, linked where they
						belong, with their <A href='/user-docs/public-api'>public API</A> on.
					</>,
					<>
						<strong>Analytics</strong> — the <A href='/user-docs/analytics'>tracker</A> on every page.
					</>,
				]}
			/>
			<P>
				The site’s code reads all of it from the <A href='#site-api'>site API</A>. Once deployed, change a heading in{' '}
				<strong>Contents</strong>, a price in <strong>Products</strong> or the favicon in <strong>Site setup</strong>, and
				the live site shows it within a minute — no code change, no redeploy.
			</P>
			<H3>Building again</H3>
			<P>
				Asking the AI to rebuild or change the site updates the same pages, blocks and records rather than adding copies:
				pages are matched by path, blocks by their slug on the page, list records by a field such as their slug. A block the
				AI drops is archived — hidden from the site, still in the panel. Note that a rebuild writes the AI’s text over edits
				you made in the panel to the same blocks.
			</P>
			<Note>
				The AI shows you the pages and lists it plans before writing them, and nothing is saved if any part is invalid. Its
				key needs <em>Can build</em>, and your role needs Build and Records: Add and Edit.
			</Note>
		</Section>

		<Section
			id='more'
			title='Blogs, products and more'>
			<P>
				A website project is a full project: build a <em>Posts</em> or <em>Products</em> model, make it public (List and Read
				one, open to anyone), and your site lists them through the <A href='/user-docs/public-api'>public API</A>. Add the{' '}
				<A href='/user-docs/customers'>sign-in widget</A> for members’ areas, and the{' '}
				<A href='/user-docs/analytics'>tracker</A> to count visits.
			</P>
		</Section>

		<Section
			id='starter-code'
			title='Starter code from a template'
			lead='A website made from a template can come with the code its site starts from.'>
			<P>
				When the template has starter code, the website’s home shows a <strong>Starter code</strong> card: a link to the
				repository, a <strong>Deploy it</strong> button for its host, and the settings (environment variables) the code needs —
				your project’s API address and public name already filled in. Copy the repository (or press Deploy it), paste the settings
				where the host asks for them, and the site shows your pages and content straight away. Change the code as you like; it
				reads everything through the <A href='#site-api'>site API</A>.
			</P>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['“No published page at that path”', <>The page is still a draft, or its path differs — <C>/about</C>, not <C>about</C>.</>],
					['A block doesn’t show', 'It’s on another page, Draft, or Is visible is off.'],
					['/site returns 404', 'The project is an app — the site API is for website projects.'],
					['A tag isn’t on the site', 'Run Site setup → Check the site: it says whether the analytics script is on the page and which tags it found.'],
					['The menu is missing a page', 'It isn’t published, or In the menu is off.'],
					['Changes take a minute to appear', 'Your site caches the answers (revalidate: 60 above). That’s on your side.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Websites;
