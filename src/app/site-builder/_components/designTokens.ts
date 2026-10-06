import type { SbFont, SbManifest, SbTheme } from '@/components/library/store/services/siteBuilderApi';
import type { DesignData } from './useDesign';

/**
 * The theme's tokens with the design's changes, as the editor needs them
 * (docs/site-builder SB-07): colours for swatches, the space scale for labels,
 * font weights a family really has. The renderer's src/render/tokens.ts and
 * src/themes/fonts.ts do the same for the page — keep them in step.
 */

export const themeOf = (m: SbManifest | undefined, key: string | undefined): SbTheme | null =>
	m?.themes.find(t => t.key === key) || m?.themes.find(t => t.key === 'studio') || m?.themes[0] || null;

/** Colour token → the colour it is now, in light or dark. */
export const resolvedColors = (m: SbManifest | undefined, d: DesignData | null, mode: 'light' | 'dark' = 'light'): Record<string, string> => {
	const t = themeOf(m, d?.theme);
	if (!t) return {};
	const over = d?.tokens?.colors || {};
	return Object.fromEntries(Object.entries(t.tokens.colors).map(([k, pair]) => [k, over[k]?.[mode] || pair[mode]]));
};

/** Space step → its length ("4" → "1rem"). */
export const resolvedSpace = (m: SbManifest | undefined, d: DesignData | null): Record<string, string> => {
	const t = themeOf(m, d?.theme);
	return { ...(t?.tokens.space || {}), ...(d?.tokens?.space || {}) };
};

/** What each font role asks for when a family is picked (then clamped to what it has). */
export const ROLE_WEIGHTS: Record<'heading' | 'body' | 'mono', number[]> = { heading: [500, 600, 700], body: [400, 500, 700], mono: [400] };

export const weightsFor = (font: SbFont | undefined, wanted: number[]) => {
	if (!font) return wanted;
	const out = new Set<number>();
	for (const w of wanted) out.add(font.weights.includes(w) ? w : font.weights.reduce((b, x) => (Math.abs(x - w) < Math.abs(b - w) ? x : b), font.weights[0]));
	return [...out].sort((a, b) => a - b);
};

/** One stylesheet with every listed family, only the letters of its name (+ "Aa") — the picker shows each in its own face. */
export const fontPreviewHref = (fonts: SbFont[]) => {
	const letters = [...new Set(`Aa${fonts.map(f => f.family).join('')}`.replace(/\s/g, ''))].join('');
	const families = fonts.map(f => `family=${f.family.replace(/ /g, '+')}`).join('&');
	return `https://fonts.googleapis.com/css2?${families}&text=${encodeURIComponent(letters)}&display=swap`;
};

/** Ready-made corner sets (the radius tokens). */
export const CORNERS: { key: string; label: string; radius: Record<string, string> }[] = [
	{ key: 'sharp', label: 'Sharp', radius: { none: '0px', sm: '0px', md: '0px', lg: '0px', xl: '0px', full: '9999px' } },
	{ key: 'subtle', label: 'Subtle', radius: { none: '0px', sm: '0.125rem', md: '0.25rem', lg: '0.375rem', xl: '0.75rem', full: '9999px' } },
	{ key: 'soft', label: 'Soft', radius: { none: '0px', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1.25rem', full: '9999px' } },
	{ key: 'round', label: 'Round', radius: { none: '0px', sm: '0.5rem', md: '0.875rem', lg: '1.25rem', xl: '2rem', full: '9999px' } },
];

/** Ready-made shadow sets (sm / md / lg). */
export const SHADOWS: { key: string; label: string; shadow: Record<string, string> | null }[] = [
	{ key: 'flat', label: 'Flat', shadow: { none: 'none', sm: 'none', md: 'none', lg: 'none' } },
	{ key: 'theme', label: 'Theme’s', shadow: null },
	{
		key: 'deep',
		label: 'Deep',
		shadow: { none: 'none', sm: '0 2px 6px rgb(0 0 0 / 0.12)', md: '0 10px 28px rgb(0 0 0 / 0.16)', lg: '0 28px 64px rgb(0 0 0 / 0.24)' },
	},
];

export const COLOR_GROUPS: { label: string; keys: string[] }[] = [
	{ label: 'Page', keys: ['background', 'foreground'] },
	{ label: 'Brand', keys: ['primary', 'primary-foreground', 'accent', 'accent-foreground', 'secondary', 'secondary-foreground'] },
	{ label: 'Surfaces', keys: ['muted', 'muted-foreground', 'card', 'card-foreground'] },
	{ label: 'Lines', keys: ['border', 'ring'] },
	{ label: 'Status', keys: ['success', 'warning', 'danger'] },
];

export const COLOR_LABEL: Record<string, string> = {
	background: 'Background',
	foreground: 'Text',
	primary: 'Primary',
	'primary-foreground': 'Text on primary',
	accent: 'Accent',
	'accent-foreground': 'Text on accent',
	secondary: 'Secondary',
	'secondary-foreground': 'Text on secondary',
	muted: 'Muted',
	'muted-foreground': 'Quiet text',
	card: 'Card',
	'card-foreground': 'Text on cards',
	border: 'Lines',
	ring: 'Focus ring',
	success: 'Success',
	warning: 'Warning',
	danger: 'Danger',
};
