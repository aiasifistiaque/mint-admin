import type { SbNode } from '@/components/library/store/services/siteBuilderApi';

/**
 * Page trees in the editor. `applyOps` is the backend's
 * library/siteBuilder/ops.ts, op for op — the editor's changes are the same
 * operations the AI and the MCP send, so a draft can always be replayed and
 * validated the same way. Keep the two in step.
 */

export type Op =
	| { op: 'insert'; parentId: string | null; slot?: string; index?: number; node: SbNode }
	| { op: 'update'; id: string; props?: Record<string, any>; style?: any; hidden?: any; bind?: Record<string, any>; name?: string | null; action?: any; locked?: boolean }
	| { op: 'move'; id: string; parentId: string | null; slot?: string; index?: number }
	| { op: 'remove'; id: string }
	| { op: 'wrap'; ids: string[]; node: SbNode };

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

export const newId = () => {
	const bytes = crypto.getRandomValues(new Uint8Array(8));
	return Array.from(bytes, b => ALPHABET[b & 63]).join('');
};

const childLists = (n: SbNode): SbNode[][] => {
	const out: SbNode[][] = [];
	if (Array.isArray(n?.children)) out.push(n.children);
	if (n?.slots) for (const v of Object.values(n.slots)) if (Array.isArray(v)) out.push(v);
	return out;
};

type Found = { node: SbNode; list: SbNode[]; index: number; parent: SbNode | null };

const find = (nodes: SbNode[], id: string, parent: SbNode | null = null): Found | null => {
	for (let i = 0; i < nodes.length; i++) {
		const n = nodes[i];
		if (n?.id === id) return { node: n, list: nodes, index: i, parent };
		for (const l of childLists(n)) {
			const hit = find(l, id, n);
			if (hit) return hit;
		}
	}
	return null;
};

/** A node with its parent, the list it's in and its index there. */
export const locate = (nodes: SbNode[], id: string) => find(nodes, id);

export const findNode = (nodes: SbNode[] | undefined, id: string | null): SbNode | null => (id && nodes ? find(nodes, id)?.node || null : null);

/** The node's ancestors, outermost first, then the node — for the breadcrumb. */
export const pathTo = (nodes: SbNode[], id: string): SbNode[] => {
	for (const n of nodes) {
		if (n.id === id) return [n];
		for (const l of childLists(n)) {
			const sub = pathTo(l, id);
			if (sub.length) return [n, ...sub];
		}
	}
	return [];
};

export const allIds = (nodes: SbNode[], out = new Set<string>()) => {
	for (const n of nodes || []) {
		if (typeof n?.id === 'string') out.add(n.id);
		childLists(n).forEach(l => allIds(l, out));
	}
	return out;
};

export const countNodes = (nodes: SbNode[]): number => (nodes || []).reduce((sum, n) => sum + 1 + childLists(n).reduce((s, l) => s + countNodes(l), 0), 0);

const contains = (node: SbNode, id: string): boolean => childLists(node).some(l => l.some(c => c?.id === id || contains(c, id)));

export class OpsError extends Error {}

const slotList = (tree: SbNode[], parentId: string | null | undefined, slot: string | undefined): SbNode[] => {
	if (parentId === null || parentId === undefined) return tree;
	const hit = find(tree, parentId);
	if (!hit) throw new OpsError(`there is no block “${parentId}”`);
	const p = hit.node;
	const name = slot || 'children';
	if (name === 'children') return (p.children = Array.isArray(p.children) ? p.children : []);
	p.slots = p.slots || {};
	return (p.slots[name] = Array.isArray(p.slots[name]) ? p.slots[name] : []);
};

const at = (list: SbNode[], index: number | undefined) =>
	index === undefined || index === null || !Number.isInteger(index) || index > list.length ? list.length : Math.max(0, index);

const merge = (into: any, patch: any) => {
	const out = { ...(into || {}) };
	for (const [k, v] of Object.entries<any>(patch || {})) {
		if (v === null) delete out[k];
		else out[k] = v;
	}
	return out;
};

/** `tree` with `ops` applied, as a new tree (the input is never changed). */
export const applyOps = (tree: SbNode[], ops: Op[]): SbNode[] => {
	const out: SbNode[] = structuredClone(tree || []);
	for (const o of ops) {
		switch (o.op) {
			case 'insert': {
				const ids = allIds(out);
				for (const id of allIds([o.node])) if (ids.has(id)) throw new OpsError(`a block with id “${id}” is already on the page`);
				const list = slotList(out, o.parentId, o.slot);
				list.splice(at(list, o.index), 0, structuredClone(o.node));
				break;
			}
			case 'update': {
				const hit = find(out, o.id);
				if (!hit) throw new OpsError(`there is no block “${o.id}”`);
				const n: any = hit.node;
				if (o.props !== undefined) n.props = merge(n.props, o.props);
				if (o.bind !== undefined) {
					n.bind = merge(n.bind, o.bind);
					if (!Object.keys(n.bind).length) delete n.bind;
				}
				for (const k of ['style', 'hidden', 'action'] as const)
					if (o[k] !== undefined) {
						if (o[k] === null) delete n[k];
						else n[k] = o[k];
					}
				if (o.name !== undefined) {
					if (o.name === null || o.name === '') delete n.name;
					else n.name = o.name;
				}
				if (o.locked !== undefined) n.locked = !!o.locked;
				break;
			}
			case 'move': {
				const hit = find(out, o.id);
				if (!hit) throw new OpsError(`there is no block “${o.id}”`);
				if (hit.node.locked) throw new OpsError(`“${hit.node.name || hit.node.id}” is locked`);
				if (o.parentId === o.id || (o.parentId && contains(hit.node, o.parentId))) throw new OpsError('a block can’t go inside itself');
				hit.list.splice(hit.index, 1);
				const list = slotList(out, o.parentId, o.slot);
				const index = list === hit.list && Number.isInteger(o.index) && o.index! > hit.index ? o.index! - 1 : o.index;
				list.splice(at(list, index), 0, hit.node);
				break;
			}
			case 'remove': {
				const hit = find(out, o.id);
				if (!hit) throw new OpsError(`there is no block “${o.id}”`);
				if (hit.node.locked) throw new OpsError(`“${hit.node.name || hit.node.id}” is locked`);
				hit.list.splice(hit.index, 1);
				break;
			}
			case 'wrap': {
				const hits = o.ids.map(id => find(out, id));
				if (hits.some(h => !h)) throw new OpsError('one of the blocks to wrap isn’t on the page');
				const list = hits[0]!.list;
				if (hits.some(h => h!.list !== list)) throw new OpsError('only blocks side by side can be wrapped together');
				const indexes = hits.map(h => h!.index).sort((a, b) => a - b);
				const wrapper = { ...structuredClone(o.node), children: indexes.map(x => list[x]) };
				for (const x of [...indexes].reverse()) list.splice(x, 1);
				list.splice(indexes[0], 0, wrapper);
				break;
			}
		}
	}
	return out;
};

/* ------------------------------------------------------------ outline */

export type OutlineRow = {
	id: string;
	type: string;
	name: string;
	depth: number;
	hasChildren: boolean;
	hidden: boolean;
	locked: boolean;
	/** a named slot this row sits in ('media'…), when not the default one */
	slot?: string;
	/** where it sits: its parent (null = the top level) and its index there */
	parentId: string | null;
	index: number;
	/** its top-level ancestor (itself at the top level) */
	root: string;
};

/** The tree as rows for the outline, skipping the children of collapsed nodes. */
export const outlineRows = (
	nodes: SbNode[],
	collapsed: Set<string>,
	label: (n: SbNode) => string,
	depth = 0,
	slot?: string,
	parentId: string | null = null,
	root?: string
): OutlineRow[] => {
	const rows: OutlineRow[] = [];
	(nodes || []).forEach((n, index) => {
		if (!n || typeof n !== 'object') return;
		const lists = childLists(n);
		const top = root || n.id;
		rows.push({
			id: n.id,
			type: n.type,
			name: label(n),
			depth,
			hasChildren: lists.some(l => l.length > 0),
			hidden: !!(n.hidden && Object.values(n.hidden).some(Boolean)),
			locked: !!n.locked,
			...(slot && { slot }),
			parentId,
			index,
			root: top,
		});
		if (collapsed.has(n.id)) return;
		if (n.children) rows.push(...outlineRows(n.children, collapsed, label, depth + 1, undefined, n.id, top));
		for (const [name, list] of Object.entries(n.slots || {})) rows.push(...outlineRows(list, collapsed, label, depth + 1, name, n.id, top));
	});
	return rows;
};
