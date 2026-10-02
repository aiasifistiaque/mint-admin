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
	{ id: 'kit', title: 'The website kit' },
	{ id: 'settings', title: 'Site settings' },
	{ id: 'build-a-page', title: 'Building a page' },
	{ id: 'contents', title: 'Content blocks' },
	{ id: 'seo', title: 'SEO' },
	{ id: 'menu', title: 'The menu' },
	{ id: 'site-api', title: 'The site API' },
	{ id: 'render', title: 'Rendering your site' },
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
			lead='Four ordinary models, in a “Website” sidebar section. Change them like any model.'>
			<Terms
				head={['Model (address)', 'Holds']}
				rows={[
					[<>Site settings (<C>site-settings</C>)</>, 'One record: name, logo, favicon, colours, font, contact details, social links, default SEO.'],
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
		</Section>

		<Section
			id='settings'
			title='Site settings'>
			<P>
				Add one record under <strong>Site settings</strong>: site name, logo and favicon, footer text, primary and secondary
				colour and font, email, phone, address and map link, Facebook, X, Instagram, YouTube and LinkedIn, and the default
				meta title, description and share image used when a page has no SEO of its own. Only the first record is used.
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
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['“No published page at that path”', <>The page is still a draft, or its path differs — <C>/about</C>, not <C>about</C>.</>],
					['A block doesn’t show', 'It’s on another page, Draft, or Is visible is off.'],
					['/site returns 404', 'The project is an app — the site API is for website projects.'],
					[<>/site gives <C key='n'>settings: null</C></>, 'No Site settings record yet — or that model was renamed or made private.'],
					['The menu is missing a page', 'It isn’t published, or In the menu is off.'],
					['Changes take a minute to appear', 'Your site caches the answers (revalidate: 60 above). That’s on your side.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Websites;
