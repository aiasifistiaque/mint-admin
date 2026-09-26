import { system } from './index';
import { Palette, Theme } from './palettes';
import { THEME_CSS_KEY, THEME_STYLE_ID } from './themeBoot';

/**
 * Applies a colour theme by overriding the CSS variables Chakra generates for
 * the admin's colour tokens — no reload, no second Chakra system, and every
 * component that already uses the tokens follows.
 *
 * Two kinds of token are covered:
 *
 * - The paired raw tokens most of the admin's own chrome uses (`sidebar.light`
 *   with `_dark: sidebar.dark`, `table.bg.light`/`.dark`, …). Both halves are
 *   set at once from the theme's light and dark palettes; the component's own
 *   `_dark` picks one, as it always has.
 * - Chakra's mode-aware semantic tokens (`bg`, `fg`, `border`, `gray.solid`,
 *   …) that the built-in components use. These are set once under `html`
 *   (light) and once under `html.dark` — next-themes puts the mode's class on
 *   <html>.
 *
 * The rules are written unlayered, and Chakra emits its tokens inside
 * `@layer tokens`, so these win without any specificity games.
 */

type Role = keyof Palette;
type Value = Role | ((p: Palette) => string);

const mix = (a: string, pct: number, b: string) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;
const alpha = (a: string, pct: number) => mix(a, pct, 'transparent');

/** [light token, dark token, value] — the same value taken from each palette. */
const PAIRS: [string, string, Value][] = [
	['navbar.light', 'navbar.dark', 'page'],
	['navbar.blurLight', 'navbar.blurDark', 'page'],
	['background.light', 'background.dark', 'page'],
	['background.cardLight', 'background.cardDark', 'subtle'],
	['result.bg.light', 'result.bg.dark', 'page'],

	['sidebar.light', 'sidebar.dark', 'sidebar'],
	['sidebar.header.light', 'sidebar.header.dark', 'sidebar'],
	['sidebar.headerBlur.light', 'sidebar.headerBlur.dark', p => alpha(p.sidebar, 55)],
	['sidebar.borderBottom.light', 'sidebar.borderBottom.dark', 'sidebarRail'],
	['sidebar.selectedItemBorder.light', 'sidebar.selectedItemBorder.dark', 'sidebarRail'],
	['sidebar.selectedItemBg.light', 'sidebar.selectedItemBg.dark', 'surface'],
	['sidebar.rail.light', 'sidebar.rail.dark', 'sidebarRail'],
	['sidebar.hoverUnderline.light', 'sidebar.hoverUnderline.dark', p => mix(p.sidebarText, 45, p.sidebar)],
	['sidebar.headerText.light', 'sidebar.headerText.dark', 'sidebarTextActive'],
	['sidebar.bodyText.light', 'sidebar.bodyText.dark', 'sidebarText'],
	['sidebar.bodyText.headingLight', 'sidebar.bodyText.headingDark', 'sidebarHeading'],
	['sidebar.bodyText.selectedLight', 'sidebar.bodyText.selectedDark', 'sidebarTextActive'],
	['sidebar.hoverLight', 'sidebar.hoverDark', p => mix(p.sidebarText, 8, p.sidebar)],

	['navbar.text.light', 'navbar.text.dark', 'text'],
	['navbar.border.light', 'navbar.border.dark', 'border'],
	['navbar.borderBottomLight', 'navbar.borderBottomDark', 'border'],

	['menu.light', 'menu.dark', 'surface'],
	['hover.light', 'hover.dark', 'subtle'],
	['card.light', 'card.dark', 'surface'],
	['header.light', 'header.dark', 'surface'],
	['container.light', 'container.dark', 'surface'],
	['container.newLight', 'container.newDark', 'surface'],
	['container.borderLight', 'container.borderDark', 'border'],
	['border.light', 'border.dark', 'border'],
	['selectBorder.light', 'selectBorder.dark', 'border'],
	['eborder.light', 'eborder.dark', 'borderMuted'],

	['field.bg.light', 'field.bg.dark', 'surface'],
	['field.border.light', 'field.border.dark', 'border'],
	['field.borderHover.light', 'field.borderHover.dark', p => mix(p.border, 80, p.text)],
	['field.placeholder.light', 'field.placeholder.dark', p => mix(p.textMuted, 75, p.surface)],
	['field.focusRing.light', 'field.focusRing.dark', 'accent'],

	['text.light', 'text.dark', 'text'],
	['text.selected', 'text.selectedDark', 'text'],
	['text.secondary.light', 'text.secondary.dark', 'textMuted'],
	['text.heading.light', 'text.heading.dark', 'text'],
	['text.formLabel.light', 'text.formLabel.dark', 'text'],
	['heading.light', 'heading.dark', 'text'],
	['heading.lightMuted', 'heading.darkMuted', 'textMuted'],

	['table.bg.light', 'table.bg.dark', 'surface'],
	['table.bgLight', 'table.bgDark', 'surface'],
	['table.head.bgLight', 'table.head.bgDark', 'surface'],
	['table.head.textLight', 'table.head.textDark', 'textMuted'],
	['table.row.light', 'table.row.dark', 'surface'],
	['table.row.hoverLight', 'table.row.hoverDark', 'subtle'],
	['table.innerBorder.light', 'table.innerBorder.dark', 'borderMuted'],
	['table.outerBorder.light', 'table.outerBorder.dark', 'borderMuted'],
	['table.cardBorder.light', 'table.cardBorder.dark', 'borderMuted'],

	['brand.light', 'brand.dark', 'accent'],

	['stroke.deepL', 'stroke.deepD', 'borderMuted'],
	['pos.light', 'pos.dark', 'muted'],
	['image.50', 'image.900', 'muted'],
	['image.100', 'image.800', p => mix(p.muted, 88, p.text)],
	['sidebar.hover.bgLight', 'sidebar.hover.bgDark', p => mix(p.sidebarText, 6, p.sidebar)],
	['menu.blurLight', 'menu.blurDark', p => alpha(p.surface, 80)],
];

/** Mode-aware semantic tokens, set per mode. */
const SEMANTIC: [string, Value][] = [
	['bg', 'page'],
	['bg.subtle', 'subtle'],
	['bg.muted', 'muted'],
	['bg.emphasized', p => mix(p.muted, 90, p.text)],
	['bg.panel', 'surface'],
	['fg', 'text'],
	['fg.muted', 'textMuted'],
	['fg.subtle', p => mix(p.textMuted, 70, p.page)],
	['border', 'border'],
	['border.muted', 'borderMuted'],
	['border.subtle', 'borderMuted'],
	['border.emphasized', p => mix(p.border, 85, p.text)],
	// Solid buttons and switches default to the gray palette; its solid is the
	// theme's accent.
	['gray.solid', 'accent'],
	['gray.contrast', 'accentFg'],
	['gray.focusRing', 'accent'],
	['brand.solid', 'accent'],
	['brand.contrast', 'accentFg'],
	['brand.focusRing', 'accent'],
	['accent.solid', 'accent'],
	['accent.contrast', 'accentFg'],
	['accent.fg', p => mix(p.accent, 80, p.text)],
	['accent.subtle', p => mix(p.accent, 12, p.surface)],
	['accent.muted', p => mix(p.accent, 30, p.surface)],
	['accent.focusRing', 'accent'],
	// Legacy single-value tokens some older components still name. Set per
	// mode, since they have no dark twin.
	['brand.500', 'accent'],
	['brand.600', 'accent'],
	['brand.200', 'accent'],
	['text.500', 'text'],
	['text.shade', 'textMuted'],
	['header.500', 'text'],
	['header.200', 'text'],
];

/** `sidebar.bodyText.light` → `--chakra-colors-sidebar-body-text-light`, as Chakra names it. */
const cssVar = (token: string) => system.token.var(`colors.${token}`).replace(/^var\(|\)$/g, '');

const valueOf = (v: Value, p: Palette) => (typeof v === 'function' ? v(p) : p[v]);

/** The stylesheet for a theme; empty for the built-in look. */
export const themeCss = (theme: Theme) => {
	if (theme.builtIn) return '';
	const { light, dark } = theme;
	const root = [
		...PAIRS.flatMap(([l, d, v]) => [`${cssVar(l)}:${valueOf(v, light)}`, `${cssVar(d)}:${valueOf(v, dark)}`]),
		...SEMANTIC.map(([t, v]) => `${cssVar(t)}:${valueOf(v, light)}`),
		`color-scheme:light`,
	];
	const darkRules = [...SEMANTIC.map(([t, v]) => `${cssVar(t)}:${valueOf(v, dark)}`), `color-scheme:dark`];
	return `html{${root.join(';')}}html.dark{${darkRules.join(';')}}`;
};

export const applyTheme = (theme: Theme) => {
	if (typeof document === 'undefined') return;
	const css = themeCss(theme);
	let el = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;
	if (!el) {
		el = document.createElement('style');
		el.id = THEME_STYLE_ID;
		document.head.appendChild(el);
	}
	if (el.textContent !== css) el.textContent = css;
	try {
		if (css) localStorage.setItem(THEME_CSS_KEY, css);
		else localStorage.removeItem(THEME_CSS_KEY);
	} catch {
		// Storage is only the pre-paint cache; the theme itself is applied above.
	}
};
