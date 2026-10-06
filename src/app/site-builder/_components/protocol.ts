import type { SbNode } from '@/components/library/store/services/siteBuilderApi';

/**
 * The editor ↔ canvas protocol (backend docs/site-builder "Editor ↔ canvas
 * protocol", D9) — a copy of mint-sites src/edit/protocol.ts; change both
 * together. Every message is { mint: 1, type, …payload }; messages from any
 * origin but the renderer's are ignored.
 */

export const SITES_URL = (process.env.NEXT_PUBLIC_SITES_URL || 'http://localhost:3300').replace(/\/+$/, '');
export const SITES_ORIGIN = (() => {
	try {
		return new URL(SITES_URL).origin;
	} catch {
		return SITES_URL;
	}
})();

export type CanvasDesign = { theme: string; tokens: Record<string, any>; colorScheme: 'light' | 'dark' | 'system' };
export type CanvasLayout = { header: SbNode[]; footer: SbNode[] } | null;
export type Rect = { x: number; y: number; w: number; h: number };

/** panel → canvas */
export type PanelMessage =
	| { mint: 1; type: 'init'; design: CanvasDesign; layout: CanvasLayout; page: { tree: SbNode[] }; links?: Record<string, string>; theme: 'light' | 'dark' }
	| { mint: 1; type: 'tree'; tree: SbNode[]; layout?: CanvasLayout }
	| { mint: 1; type: 'design'; design: CanvasDesign }
	| { mint: 1; type: 'theme'; theme: 'light' | 'dark' }
	| { mint: 1; type: 'select'; id: string | null }
	| { mint: 1; type: 'hover'; id: string | null }
	| { mint: 1; type: 'open'; id: string | null };

/** canvas → panel */
export type CanvasMessage =
	| { mint: 1; type: 'ready'; manifestVersion: string }
	| { mint: 1; type: 'click'; id: string; shift: boolean }
	| { mint: 1; type: 'hover'; id: string | null }
	| { mint: 1; type: 'rects'; rects: Record<string, Rect> }
	| { mint: 1; type: 'height'; px: number };

export const isCanvasMessage = (d: unknown): d is CanvasMessage =>
	!!d && typeof d === 'object' && (d as any).mint === 1 && typeof (d as any).type === 'string';
