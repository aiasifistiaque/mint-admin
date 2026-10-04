/**
 * A website template's `website` part as the five website tabs edit it —
 * Pages, Content, SEO, Site settings, Starter code — one working copy shared
 * by all of them (backend blueprint.ts `website`). Pages are linked by path:
 * a page's `parent` is its parent's path.
 */

export type Card = { image: string; title: string; subTitle: string; description: string };
export type Block = {
	slug: string;
	name: string;
	section: string;
	category: string;
	content: string;
	subContent: string;
	btnText: string;
	url: string;
	image: string;
	videoUrl: string;
	richContent: string;
	list: string[];
	gallery: string[];
	card: Card[];
};
export type PageSeo = { title: string; description: string; image: string; canonical: string; keywords: string[]; noIndex: boolean };
export type Page = {
	path: string;
	name: string;
	status: string;
	template: string;
	showInMenu: boolean;
	priority: number;
	parent: string;
	seo: PageSeo;
	contents: Block[];
};
export type SiteSettings = {
	identity: Record<string, string>;
	contact: Record<string, string>;
	social: Record<string, string>;
	seo: Record<string, any>;
};
export type Starter = { repoUrl: string; framework: string; deployUrl: string; env: { key: string; value: string }[] };
export type Site = { pages: Page[]; settings: SiteSettings; starter: Starter };

export const PAGE_STATUSES = [
	{ value: 'published', label: 'Published' },
	{ value: 'draft', label: 'Draft — not on the site' },
	{ value: 'archived', label: 'Archived' },
];
export const PAGE_TEMPLATES = [
	{ value: 'default', label: 'Default' },
	{ value: 'home', label: 'Home' },
	{ value: 'landing', label: 'Landing' },
	{ value: 'content', label: 'Content' },
	{ value: 'contact', label: 'Contact' },
];
/** The kit's content-block categories (websiteKit.function.ts WebContent), and what each one shows. */
export const BLOCK_CATEGORIES = [
	{ value: 'content', label: 'Content', hint: 'A heading, a line under it and a button' },
	{ value: 'rich-content', label: 'Rich content', hint: 'Formatted text — HTML' },
	{ value: 'list', label: 'List', hint: 'Short items, one per line' },
	{ value: 'card', label: 'Cards', hint: 'Cards with an image, title, sub title and text' },
	{ value: 'image', label: 'Image', hint: 'One image' },
	{ value: 'gallery', label: 'Gallery', hint: 'Several images' },
	{ value: 'list-of-links', label: 'List of links', hint: 'Links, one per line' },
	{ value: 'video', label: 'Video', hint: 'A video by its URL' },
	{ value: 'section', label: 'Section', hint: 'Groups the blocks under it' },
	{ value: 'other', label: 'Other', hint: 'Anything the site’s code reads by slug' },
];

const str = (v: any) => (typeof v === 'string' ? v : '');
const strs = (v: any) => (Array.isArray(v) ? v.map(String) : []);

export const blankBlock = (slug = ''): Block => ({
	slug,
	name: '',
	section: '',
	category: 'content',
	content: '',
	subContent: '',
	btnText: '',
	url: '',
	image: '',
	videoUrl: '',
	richContent: '',
	list: [],
	gallery: [],
	card: [],
});

export const blankPage = (path: string, parent = ''): Page => ({
	path,
	name: '',
	status: 'published',
	template: 'default',
	showInMenu: true,
	priority: 0,
	parent,
	seo: { title: '', description: '', image: '', canonical: '', keywords: [], noIndex: false },
	contents: [],
});

/** The draft's website part as a complete working copy. */
export const siteFrom = (w: any): Site => ({
	pages: (w?.pages || []).map((p: any) => ({
		...blankPage(str(p.path), str(p.parent)),
		name: str(p.name),
		status: p.status || 'published',
		template: p.template || 'default',
		showInMenu: p.showInMenu !== false,
		priority: Number(p.priority) || 0,
		seo: {
			title: str(p.seo?.title),
			description: str(p.seo?.description),
			image: str(p.seo?.image),
			canonical: str(p.seo?.canonical),
			keywords: strs(p.seo?.keywords),
			noIndex: !!p.seo?.noIndex,
		},
		contents: (p.contents || []).map((b: any) => ({
			...blankBlock(),
			...Object.fromEntries(Object.entries(b || {}).filter(([, v]) => typeof v === 'string')),
			list: strs(b?.list),
			gallery: strs(b?.gallery),
			card: (b?.card || []).map((c: any) => ({ image: str(c?.image), title: str(c?.title), subTitle: str(c?.subTitle), description: str(c?.description) })),
		})),
	})),
	settings: {
		identity: { ...(w?.settings?.identity || {}) },
		contact: { ...(w?.settings?.contact || {}) },
		social: { ...(w?.settings?.social || {}) },
		seo: { ...(w?.settings?.seo || {}), keywords: strs(w?.settings?.seo?.keywords) },
	},
	starter: {
		repoUrl: str(w?.starter?.repoUrl),
		framework: str(w?.starter?.framework),
		deployUrl: str(w?.starter?.deployUrl),
		env: (w?.starter?.env || []).map((e: any) => ({ key: str(e?.key), value: str(e?.value) })),
	},
});

const trimmed = (o: Record<string, any>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]).filter(([, v]) => v !== ''));

/** Back to the blueprint: empty strings and empty lists left out of blocks, so a block keeps only what it uses. */
export const siteTo = (s: Site) => ({
	pages: s.pages.map(p => ({
		...p,
		path: p.path.trim(),
		name: p.name.trim(),
		seo: { ...trimmed(p.seo), keywords: p.seo.keywords.map(k => k.trim()).filter(Boolean), noIndex: p.seo.noIndex },
		contents: p.contents.map(b => {
			const { list, gallery, card, ...text } = b;
			return {
				...trimmed(text),
				...(list.filter(Boolean).length && { list: list.map(x => x.trim()).filter(Boolean) }),
				...(gallery.filter(Boolean).length && { gallery: gallery.map(x => x.trim()).filter(Boolean) }),
				...(card.length && { card: card.map(trimmed) }),
			};
		}),
	})),
	settings: {
		identity: trimmed(s.settings.identity),
		contact: trimmed(s.settings.contact),
		social: trimmed(s.settings.social),
		seo: { ...trimmed({ ...s.settings.seo, keywords: '' }), keywords: (s.settings.seo.keywords || []).map((k: string) => k.trim()).filter(Boolean) },
	},
	starter: { ...trimmed({ ...s.starter, env: '' }), env: s.starter.env.map(e => ({ key: e.key.trim(), value: e.value.trim() })).filter(e => e.key) },
});

/** Pages in tree order — each followed by its children — with their depth. */
export const pageTree = (pages: Page[]): { page: Page; index: number; depth: number }[] => {
	const out: { page: Page; index: number; depth: number }[] = [];
	const paths = new Set(pages.map(p => p.path));
	const byPriority = (a: { p: Page; i: number }, b: { p: Page; i: number }) => a.p.priority - b.p.priority || a.i - b.i;
	const walk = (parent: string, depth: number, seen: Set<string>) => {
		pages
			.map((p, i) => ({ p, i }))
			.filter(({ p }) => (parent ? p.parent === parent : !p.parent || !paths.has(p.parent) || p.parent === p.path))
			.sort(byPriority)
			.forEach(({ p, i }) => {
				if (seen.has(p.path) && parent) return;
				out.push({ page: p, index: i, depth });
				if (p.path && p.parent !== p.path) walk(p.path, depth + 1, new Set([...seen, p.path]));
			});
	};
	walk('', 0, new Set());
	// Anything a cycle hid still shows, at the top level.
	pages.forEach((p, i) => !out.some(o => o.index === i) && out.push({ page: p, index: i, depth: 0 }));
	return out;
};

/** A page's label in pickers. */
export const pageLabel = (p: Page) => `${p.name || 'Untitled'} — ${p.path || '(no path)'}`;
