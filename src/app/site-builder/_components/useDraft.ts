'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { SbNode, SbPage, SbPageInput, SbProblem } from '@/components/library/store/services/siteBuilderApi';
import { useSiteBuilderSavePageMutation } from '@/components/library/store/services/siteBuilderApi';
import { applyOps, OpsError, type Op } from './tree';

/**
 * The open page's draft (docs/site-builder SB-05): the tree, changed with ops
 * (tree.ts), 100 steps of undo/redo, and an autosave 1.5 s after the last
 * change with the page's `rev`. A save answered 409 (someone else saved the
 * page) stops autosaving until the editor chooses whose version to keep.
 * Typing into one field is one undo step, not one per key.
 */

const HISTORY = 100;
const AUTOSAVE_MS = 1500;
const COALESCE_MS = 1000;

type State = {
	pageId: string | null;
	tree: SbNode[];
	rev: number;
	past: SbNode[][];
	future: SbNode[][];
	/** bumps on every change; `saved` is the change count the server has */
	changes: number;
	saved: number;
	lastKey: string | null;
	lastAt: number;
};

type Action =
	| { type: 'load'; pageId: string; tree: SbNode[]; rev: number }
	| { type: 'apply'; tree: SbNode[]; key?: string }
	| { type: 'undo' }
	| { type: 'redo' }
	| { type: 'saved'; rev: number; changes: number };

const EMPTY: State = { pageId: null, tree: [], rev: 0, past: [], future: [], changes: 0, saved: 0, lastKey: null, lastAt: 0 };

const reducer = (s: State, a: Action): State => {
	switch (a.type) {
		case 'load':
			return { ...EMPTY, pageId: a.pageId, tree: a.tree, rev: a.rev };
		case 'apply': {
			const now = Date.now();
			const merge = !!a.key && a.key === s.lastKey && now - s.lastAt < COALESCE_MS;
			return {
				...s,
				tree: a.tree,
				past: merge ? s.past : [...s.past, s.tree].slice(-HISTORY),
				future: [],
				changes: s.changes + 1,
				lastKey: a.key || null,
				lastAt: now,
			};
		}
		case 'undo':
			if (!s.past.length) return s;
			return { ...s, tree: s.past[s.past.length - 1], past: s.past.slice(0, -1), future: [s.tree, ...s.future].slice(0, HISTORY), changes: s.changes + 1, lastKey: null };
		case 'redo':
			if (!s.future.length) return s;
			return { ...s, tree: s.future[0], future: s.future.slice(1), past: [...s.past, s.tree].slice(-HISTORY), changes: s.changes + 1, lastKey: null };
		case 'saved':
			return { ...s, rev: a.rev, saved: Math.max(s.saved, a.changes) };
	}
};

export type SaveStatus = 'saved' | 'unsaved' | 'saving' | 'error' | 'conflict';

export type Conflict = { page: SbPage; rev: number };

export function useDraft({ readOnly }: { readOnly: boolean }) {
	const [state, dispatch] = useReducer(reducer, EMPTY);
	const [savePage] = useSiteBuilderSavePageMutation();
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<{ message: string; problems: SbProblem[] } | null>(null);
	const [conflict, setConflict] = useState<Conflict | null>(null);
	// The page as the server last answered it (name, address, SEO…), for its settings.
	const [page, setPage] = useState<SbPage | null>(null);
	const ref = useRef(state);
	ref.current = state;
	// One save at a time; anything asked meanwhile waits for it.
	const queue = useRef<Promise<unknown>>(Promise.resolve());

	const load = useCallback((p: SbPage) => {
		setError(null);
		setConflict(null);
		setPage(p);
		dispatch({ type: 'load', pageId: p.id, tree: p.draft.tree, rev: p.draft.rev });
	}, []);

	/** Applies ops to the draft. Returns the error message if they can't apply. */
	const apply = useCallback(
		(ops: Op[], key?: string): string | null => {
			if (readOnly) return 'Your role can’t change the site.';
			try {
				dispatch({ type: 'apply', tree: applyOps(ref.current.tree, ops), key });
				return null;
			} catch (e) {
				return e instanceof OpsError ? e.message : 'That change couldn’t be made.';
			}
		},
		[readOnly]
	);

	/** Sends the draft (and any page fields) with the current rev. */
	const send = useCallback(
		(fields: SbPageInput & { status?: 'draft' } = {}, opts: { force?: boolean } = {}) => {
			const run = async () => {
				const s = ref.current;
				if (!s.pageId || readOnly) return null;
				const withTree = s.changes !== s.saved;
				if (!withTree && !Object.keys(fields).length && !opts.force) return null;
				setSaving(true);
				try {
					const out = await savePage({ id: s.pageId, rev: s.rev, ...(withTree && { tree: s.tree }), ...fields }).unwrap();
					// Only if the page is still the one open.
					if (ref.current.pageId === out.id) {
						dispatch({ type: 'saved', rev: out.draft.rev, changes: s.changes });
						setPage(out);
					}
					setError(null);
					return out;
				} catch (e: any) {
					if (e?.status === 409 && e?.data?.page) setConflict({ page: e.data.page, rev: e.data.rev });
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
		[readOnly, savePage]
	);

	// Autosave: 1.5 s after the last change; never over a conflict.
	useEffect(() => {
		if (readOnly || conflict || state.changes === state.saved || !state.pageId) return;
		const t = setTimeout(() => send().catch(() => undefined), AUTOSAVE_MS);
		return () => clearTimeout(t);
	}, [state.changes, state.saved, state.pageId, conflict, readOnly, send]);

	// Leaving with unsaved changes warns.
	useEffect(() => {
		const dirty = state.changes !== state.saved;
		if (!dirty) return;
		const warn = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = '';
		};
		window.addEventListener('beforeunload', warn);
		return () => window.removeEventListener('beforeunload', warn);
	}, [state.changes, state.saved]);

	/** Saves now, if anything is waiting (before switching pages, publishing, page settings). */
	const flush = useCallback(async () => {
		if (conflict) throw new Error('Choose whose version to keep first.');
		await send();
	}, [conflict, send]);

	/** 409: take the other person's version, or keep yours (saved over theirs). */
	const resolve = useCallback(
		async (keep: 'theirs' | 'mine') => {
			const c = conflict;
			if (!c) return;
			setConflict(null);
			if (keep === 'theirs') return load(c.page);
			dispatch({ type: 'saved', rev: c.rev, changes: ref.current.saved });
			await send({}, { force: true }).catch(() => undefined);
		},
		[conflict, load, send]
	);

	const status: SaveStatus = conflict ? 'conflict' : saving ? 'saving' : error ? 'error' : state.changes !== state.saved ? 'unsaved' : 'saved';

	return {
		pageId: state.pageId,
		page,
		tree: state.tree,
		rev: state.rev,
		canUndo: state.past.length > 0,
		canRedo: state.future.length > 0,
		status,
		error,
		conflict,
		load,
		apply,
		undo: useCallback(() => !readOnly && dispatch({ type: 'undo' }), [readOnly]),
		redo: useCallback(() => !readOnly && dispatch({ type: 'redo' }), [readOnly]),
		send,
		flush,
		resolve,
	};
}

export type Draft = ReturnType<typeof useDraft>;
