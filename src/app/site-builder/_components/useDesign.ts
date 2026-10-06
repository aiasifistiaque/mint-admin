'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { SbDesign, SbDesignDraft, SbNode, SbProblem, SbSectionUsage } from '@/components/library/store/services/siteBuilderApi';
import { useSiteBuilderSaveDesignMutation } from '@/components/library/store/services/siteBuilderApi';
import { applyOps, OpsError, type Op } from './tree';

/**
 * The site's design draft (docs/site-builder SB-07): theme, token overrides,
 * colour scheme, the layouts' headers and footers, and the saved sections —
 * one document with its own `rev`, 100 steps of undo, and an autosave 1.5 s
 * after the last change that sends only the parts that changed. Headers,
 * footers and saved sections are edited on the canvas like pages: as a "part"
 * whose tree lives in here.
 */

const HISTORY = 100;
const AUTOSAVE_MS = 1500;
const COALESCE_MS = 1000;

export type DesignData = Omit<SbDesignDraft, 'rev'>;
export type DesignKey = keyof DesignData;
const KEYS: DesignKey[] = ['theme', 'tokens', 'colorScheme', 'layouts', 'sections'];

/** A tree that belongs to the design: a layout's header or footer, or a saved section. */
export type Part = { kind: 'header' | 'footer'; layout: string } | { kind: 'section'; id: string };

export const partKey = (p: Part) => (p.kind === 'section' ? `section:${p.id}` : `${p.kind}:${p.layout}`);
export const parsePart = (v: string | null): Part | null => {
	const m = v?.match(/^(header|footer|section):([A-Za-z0-9_-]{1,40})$/);
	if (!m) return null;
	return m[1] === 'section' ? { kind: 'section', id: m[2] } : { kind: m[1] as 'header' | 'footer', layout: m[2] };
};

export const partTree = (d: DesignData | null, p: Part): SbNode[] => {
	if (!d) return [];
	if (p.kind === 'section') return d.sections?.[p.id]?.tree || [];
	return d.layouts?.[p.layout]?.[p.kind] || [];
};

/** `d` with the part's tree replaced. */
const withPart = (d: DesignData, p: Part, tree: SbNode[]): DesignData => {
	if (p.kind === 'section') {
		const s = d.sections?.[p.id];
		if (!s) throw new OpsError('That saved section was deleted.');
		return { ...d, sections: { ...d.sections, [p.id]: { ...s, tree } } };
	}
	const l = d.layouts?.[p.layout];
	if (!l) throw new OpsError(`There is no “${p.layout}” layout any more.`);
	return { ...d, layouts: { ...d.layouts, [p.layout]: { ...l, [p.kind]: tree } } };
};

type State = {
	data: DesignData | null;
	rev: number;
	past: DesignData[];
	future: DesignData[];
	changes: number;
	saved: number;
	lastKey: string | null;
	lastAt: number;
};

type Action =
	| { type: 'load'; data: DesignData; rev: number }
	| { type: 'set'; data: DesignData; key?: string }
	| { type: 'undo' }
	| { type: 'redo' }
	| { type: 'saved'; rev: number; changes: number };

const EMPTY: State = { data: null, rev: 0, past: [], future: [], changes: 0, saved: 0, lastKey: null, lastAt: 0 };

const reducer = (s: State, a: Action): State => {
	switch (a.type) {
		case 'load':
			return { ...EMPTY, data: a.data, rev: a.rev };
		case 'set': {
			if (!s.data) return s;
			const now = Date.now();
			const merge = !!a.key && a.key === s.lastKey && now - s.lastAt < COALESCE_MS;
			return {
				...s,
				data: a.data,
				past: merge ? s.past : [...s.past, s.data].slice(-HISTORY),
				future: [],
				changes: s.changes + 1,
				lastKey: a.key || null,
				lastAt: now,
			};
		}
		case 'undo':
			if (!s.past.length || !s.data) return s;
			return { ...s, data: s.past[s.past.length - 1], past: s.past.slice(0, -1), future: [s.data, ...s.future].slice(0, HISTORY), changes: s.changes + 1, lastKey: null };
		case 'redo':
			if (!s.future.length || !s.data) return s;
			return { ...s, data: s.future[0], future: s.future.slice(1), past: [...s.past, s.data].slice(-HISTORY), changes: s.changes + 1, lastKey: null };
		case 'saved':
			return { ...s, rev: a.rev, saved: Math.max(s.saved, a.changes) };
	}
};

const dataOf = (d: SbDesignDraft): DesignData => ({
	theme: d.theme,
	tokens: d.tokens || {},
	colorScheme: d.colorScheme || 'light',
	layouts: d.layouts || {},
	sections: d.sections || {},
});

export function useDesign({ readOnly }: { readOnly: boolean }) {
	const [state, dispatch] = useReducer(reducer, EMPTY);
	const [saveDesign] = useSiteBuilderSaveDesignMutation();
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<{ message: string; problems: SbProblem[] } | null>(null);
	const [conflict, setConflict] = useState<{ design: SbDesign; rev: number } | null>(null);
	const [usage, setUsage] = useState<SbSectionUsage>({});
	const ref = useRef(state);
	ref.current = state;
	// What the server has, per part — a save sends only the parts that differ.
	const server = useRef<Record<DesignKey, string> | null>(null);
	const queue = useRef<Promise<unknown>>(Promise.resolve());

	const load = useCallback((d: SbDesign) => {
		const data = dataOf(d.draft);
		server.current = Object.fromEntries(KEYS.map(k => [k, JSON.stringify(data[k])])) as Record<DesignKey, string>;
		setError(null);
		setConflict(null);
		if (d.usage) setUsage(d.usage);
		dispatch({ type: 'load', data, rev: d.draft.rev });
	}, []);

	/** Changes top-level parts of the design (theme, tokens, …). */
	const set = useCallback(
		(patch: Partial<DesignData>, key?: string): string | null => {
			if (readOnly) return 'Your role can’t change the site.';
			const d = ref.current.data;
			if (!d) return 'The design hasn’t loaded yet.';
			dispatch({ type: 'set', data: { ...d, ...patch }, key });
			return null;
		},
		[readOnly]
	);

	/** Applies ops to a header, footer or saved section. Returns the error message if they can't apply. */
	const applyPart = useCallback(
		(part: Part, ops: Op[], key?: string): string | null => {
			if (readOnly) return 'Your role can’t change the site.';
			const d = ref.current.data;
			if (!d) return 'The design hasn’t loaded yet.';
			try {
				dispatch({ type: 'set', data: withPart(d, part, applyOps(partTree(d, part), ops)), key });
				return null;
			} catch (e) {
				return e instanceof OpsError ? e.message : 'That change couldn’t be made.';
			}
		},
		[readOnly]
	);

	const send = useCallback(
		(opts: { force?: boolean } = {}) => {
			const run = async () => {
				const s = ref.current;
				if (!s.data || readOnly || !server.current) return null;
				const now = Object.fromEntries(KEYS.map(k => [k, JSON.stringify(s.data![k])])) as Record<DesignKey, string>;
				const changed = KEYS.filter(k => now[k] !== server.current![k]);
				if (!changed.length && !opts.force) {
					dispatch({ type: 'saved', rev: s.rev, changes: s.changes });
					return null;
				}
				setSaving(true);
				try {
					const sent = changed.length ? changed : KEYS;
					const body: any = { rev: s.rev };
					for (const k of sent) body[k] = s.data[k];
					const out = await saveDesign(body).unwrap();
					for (const k of sent) server.current![k] = now[k];
					dispatch({ type: 'saved', rev: out.draft.rev, changes: s.changes });
					if (out.usage) setUsage(out.usage);
					setError(null);
					return out;
				} catch (e: any) {
					if (e?.status === 409 && e?.data?.design) setConflict({ design: e.data.design, rev: e.data.rev });
					else setError({ message: e?.data?.message || 'Not saved — check your connection.', problems: e?.data?.problems || [] });
					throw e;
				} finally {
					setSaving(false);
				}
			};
			const next = queue.current.then(run, run);
			queue.current = next.catch(() => undefined);
			return next;
		},
		[readOnly, saveDesign]
	);

	// Autosave: 1.5 s after the last change; never over a conflict.
	useEffect(() => {
		if (readOnly || conflict || state.changes === state.saved || !state.data) return;
		const t = setTimeout(() => send().catch(() => undefined), AUTOSAVE_MS);
		return () => clearTimeout(t);
	}, [state.changes, state.saved, state.data, conflict, readOnly, send]);

	useEffect(() => {
		if (state.changes === state.saved) return;
		const warn = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = '';
		};
		window.addEventListener('beforeunload', warn);
		return () => window.removeEventListener('beforeunload', warn);
	}, [state.changes, state.saved]);

	const flush = useCallback(async () => {
		if (conflict) throw new Error('Choose whose design to keep first.');
		await send();
	}, [conflict, send]);

	const resolve = useCallback(
		async (keep: 'theirs' | 'mine') => {
			const c = conflict;
			if (!c) return;
			setConflict(null);
			if (keep === 'theirs') return load(c.design);
			dispatch({ type: 'saved', rev: c.rev, changes: ref.current.saved });
			await send({ force: true }).catch(() => undefined);
		},
		[conflict, load, send]
	);

	const status = conflict ? 'conflict' : saving ? 'saving' : error ? 'error' : state.changes !== state.saved ? 'unsaved' : 'saved';

	return {
		loaded: !!state.data,
		data: state.data,
		rev: state.rev,
		usage,
		canUndo: state.past.length > 0,
		canRedo: state.future.length > 0,
		status: status as 'saved' | 'unsaved' | 'saving' | 'error' | 'conflict',
		error,
		conflict,
		load,
		set,
		applyPart,
		undo: useCallback(() => !readOnly && dispatch({ type: 'undo' }), [readOnly]),
		redo: useCallback(() => !readOnly && dispatch({ type: 'redo' }), [readOnly]),
		flush,
		resolve,
	};
}

export type DesignDraft = ReturnType<typeof useDesign>;
