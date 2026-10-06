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

export type CanvasDesign = {
	theme: string;
	tokens: Record<string, any>;
	colorScheme: 'light' | 'dark' | 'system';
	/** the draft's saved sections, for section-ref blocks */
	sections?: Record<string, { name: string; tree: SbNode[] }>;
};
export type MenuItem = { label: string; path: string };
/** What blocks show from the site itself: name, logo, contact, the menu, this page's place (SB-08). */
export type CanvasContext = {
	site?: { name: string; tagline?: string; logo?: string; contact?: Record<string, string>; social?: Record<string, string> };
	menu?: MenuItem[];
	path?: string;
	crumbs?: MenuItem[];
};
export type CanvasLayout = { header: SbNode[]; footer: SbNode[] } | null;
export type Rect = { x: number; y: number; w: number; h: number };
/** Where a dragged block would land: inside `parentId` (null = the page itself), in `slot`, at `index`. */
export type DropTarget = { parentId: string | null; slot?: string; index: number };
/** What's being dragged from the Add panel: the types of its top-level blocks (a preset may have several). */
export type DragItem = { types: string[]; label: string };

/** panel → canvas */
export type PanelMessage =
	| {
			mint: 1;
			type: 'init';
			design: CanvasDesign;
			layout: CanvasLayout;
			page: { tree: SbNode[] };
			links?: Record<string, string>;
			theme: 'light' | 'dark';
			/** a role that can't change the site: no dragging or typing on the canvas */
			readOnly?: boolean;
			context?: CanvasContext;
	  }
	| { mint: 1; type: 'context'; context: CanvasContext }
	| { mint: 1; type: 'tree'; tree: SbNode[]; layout?: CanvasLayout }
	| { mint: 1; type: 'design'; design: CanvasDesign }
	| { mint: 1; type: 'theme'; theme: 'light' | 'dark' }
	| { mint: 1; type: 'select'; id: string | null }
	| { mint: 1; type: 'hover'; id: string | null }
	/** show an overlay (pop-up, drawer, popover) on the canvas; null closes it */
	| { mint: 1; type: 'open'; id: string | null }
	/** a drag from the Add panel is over the canvas, at x / y in the canvas's own viewport */
	| { mint: 1; type: 'drag'; x: number; y: number; item: DragItem }
	/** the drag left the canvas or ended: stop drawing the drop line */
	| { mint: 1; type: 'dragend' };

/** canvas → panel */
export type CanvasMessage =
	| { mint: 1; type: 'ready'; manifestVersion: string }
	| { mint: 1; type: 'click'; id: string; shift: boolean }
	| { mint: 1; type: 'hover'; id: string | null }
	| { mint: 1; type: 'rects'; rects: Record<string, Rect> }
	| { mint: 1; type: 'height'; px: number }
	/** answer to 'drag': where it would land, or why it can't (null target) */
	| { mint: 1; type: 'dropTarget'; target: DropTarget | null; reason?: string }
	/** a block dragged by its handle on the canvas was dropped */
	| { mint: 1; type: 'move'; id: string; parentId: string | null; slot?: string; index: number }
	/** text typed straight onto the canvas (double click a heading, text, button or link) */
	| { mint: 1; type: 'text'; id: string; prop: string; value: string }
	/** a shortcut pressed while the canvas has the focus — the panel handles it */
	| { mint: 1; type: 'key'; key: string; meta: boolean; ctrl: boolean; shift: boolean; alt: boolean };

export const isCanvasMessage = (d: unknown): d is CanvasMessage =>
	!!d && typeof d === 'object' && (d as any).mint === 1 && typeof (d as any).type === 'string';
