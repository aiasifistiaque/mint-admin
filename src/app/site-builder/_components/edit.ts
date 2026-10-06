import type { SbBlockDef, SbManifest, SbNode } from '@/components/library/store/services/siteBuilderApi';
import { locate, newId, type Op } from './tree';

/**
 * Adding, copying and moving blocks (docs/site-builder SB-06): new blocks from
 * the manifest, presets and pasted blocks with fresh ids, where a click-insert
 * or a paste lands, and the placing rules the canvas also uses (mint-sites
 * src/edit/drop.ts `placeProblem` — keep the two in step).
 */

export type Blocks = Map<string, SbBlockDef>;

export const isOverlay = (blocks: Blocks, type: string) => blocks.get(type)?.category === 'overlay';

const label = (blocks: Blocks, type: string | null) => (type ? blocks.get(type)?.label || type : 'the page');

/** null when a block of `type` may go in `slot` of a `parentType` block (null = the page itself), else why not. */
export function placeProblem(blocks: Blocks, parentType: string | null, type: string, slot = 'children'): string | null {
	const def = blocks.get(type);
	if (!def) return 'That block isn’t available here.';
	if (def.category === 'overlay') return parentType === null ? null : `A ${def.label.toLowerCase()} goes at the top level of the page.`;
	if (parentType === null)
		return def.canBeChildOf?.length ? `${def.label} can only go inside ${def.canBeChildOf.map(t => label(blocks, t)).join(' or ')}.` : null;
	const parent = blocks.get(parentType);
	const s = parent?.slots?.[slot];
	if (!parent || !s) return `${label(blocks, parentType)} can’t hold other blocks.`;
	if (s.allow?.length && !s.allow.includes(type)) return `${def.label} can’t go in ${parent.label}.`;
	if (def.canBeChildOf?.length && !def.canBeChildOf.includes(parentType))
		return `${def.label} can only go inside ${def.canBeChildOf.map(t => label(blocks, t)).join(' or ')}.`;
	return null;
}

export const problemFor = (blocks: Blocks, parentType: string | null, types: string[]) => {
	for (const t of types) {
		const p = placeProblem(blocks, parentType, t);
		if (p) return p;
	}
	return null;
};

/** A copy of `nodes` with fresh ids everywhere; actions pointing inside the copy point at the copies. */
export function rekey(nodes: SbNode[]): SbNode[] {
	const ids = new Map<string, string>();
	const collect = (list: SbNode[] = []) =>
		list.forEach(n => {
			ids.set(n.id, newId());
			collect(n.children);
			Object.values(n.slots || {}).forEach(collect);
		});
	collect(nodes);
	const copy = (n: SbNode): SbNode => {
		const c: SbNode = { ...structuredClone(n), id: ids.get(n.id)! };
		if (n.children) c.children = n.children.map(copy);
		if (n.slots) c.slots = Object.fromEntries(Object.entries(n.slots).map(([k, v]) => [k, v.map(copy)]));
		const a: any = c.action;
		if (a && typeof a.target === 'string' && ids.has(a.target)) c.action = { ...a, target: ids.get(a.target) };
		if (a?.type === 'link' && typeof a.href === 'string' && a.href.startsWith('#node:') && ids.has(a.href.slice(6)))
			c.action = { ...a, href: `#node:${ids.get(a.href.slice(6))}` };
		return c;
	};
	return nodes.map(copy);
}

/** A new block of this type, with the manifest's defaults (and default children). */
export function nodeFromBlock(def: SbBlockDef): SbNode {
	const d = def.defaults || { props: {} };
	const node: SbNode = { id: newId(), type: def.type, props: structuredClone(d.props || {}) };
	if (d.style) node.style = structuredClone(d.style);
	if (def.slots?.children) node.children = d.children?.length ? rekey(d.children) : [];
	return node;
}

export type AddItem =
	| { kind: 'block'; key: string; label: string; types: string[] }
	| { kind: 'preset'; key: string; label: string; types: string[] }
	/** a saved section (SB-07): a section-ref block pointing at it */
	| { kind: 'saved'; key: string; label: string; types: string[] };

/** The blocks an Add-panel item inserts, with fresh ids. */
export function nodesFor(item: AddItem, manifest: SbManifest, blocks: Blocks): SbNode[] {
	if (item.kind === 'block') {
		const def = blocks.get(item.key);
		return def ? [nodeFromBlock(def)] : [];
	}
	if (item.kind === 'saved') return [{ id: newId(), type: 'section-ref', name: item.label.slice(0, 80), props: { section: item.key } }];
	const preset = manifest.presets.find(p => p.key === item.key);
	return preset ? rekey(preset.tree) : [];
}

export type Place = { parentId: string | null; index: number };

/**
 * Where blocks of `types` go when added by a click or pasted: into the
 * selection when it holds blocks, else just after it — climbing out until
 * they're allowed. Sections, headers and overlays go at the top level.
 */
export function placeFor(tree: SbNode[], selectedId: string | null, types: string[], blocks: Blocks): Place | { problem: string } {
	if (types.some(t => isOverlay(blocks, t))) return { parentId: null, index: tree.length };
	let loc = selectedId ? locate(tree, selectedId) : null;
	if (!loc) {
		const why = problemFor(blocks, null, types);
		return why ? { problem: why } : { parentId: null, index: tree.length };
	}
	// Whole sections (and headers) sit side by side on the page, not inside one another.
	if (types.every(t => t === 'section' || t === 'header')) {
		while (loc.parent) loc = locate(tree, loc.parent.id)!;
		return { parentId: null, index: loc.index + 1 };
	}
	const sel = loc.node;
	if (blocks.get(sel.type)?.slots?.children && !problemFor(blocks, sel.type, types)) return { parentId: sel.id, index: (sel.children || []).length };
	let first: string | null = null;
	for (let cur: typeof loc | null = loc; cur; cur = cur.parent ? locate(tree, cur.parent.id) : null) {
		const why = problemFor(blocks, cur.parent?.type ?? null, types);
		if (!why) return { parentId: cur.parent?.id ?? null, index: cur.index + 1 };
		first ??= why;
	}
	return { problem: first || 'It can’t go there.' };
}

/** Insert ops for `nodes` at `place`, in order. */
export const insertOps = (nodes: SbNode[], place: Place): Op[] =>
	nodes.map((node, i) => ({ op: 'insert', parentId: place.parentId, index: place.index + i, node }));

/* ------------------------------------------------------------- clipboard */

const CLIPBOARD = 'mint-site-builder-clipboard';

/** Copied blocks live in this browser (any page, any tab of the panel), not on the system clipboard. */
export const clipboard = {
	write(nodes: SbNode[]) {
		try {
			localStorage.setItem(CLIPBOARD, JSON.stringify({ nodes, at: Date.now() }));
		} catch {}
	},
	read(): SbNode[] | null {
		try {
			const v = JSON.parse(localStorage.getItem(CLIPBOARD) || 'null');
			return Array.isArray(v?.nodes) && v.nodes.length ? v.nodes : null;
		} catch {
			return null;
		}
	},
};

/** Every node in page order (depth first) — ↑ / ↓ walk this. */
export const flatIds = (nodes: SbNode[], out: string[] = []) => {
	for (const n of nodes || []) {
		out.push(n.id);
		flatIds(n.children || [], out);
		Object.values(n.slots || {}).forEach(l => flatIds(l, out));
	}
	return out;
};
