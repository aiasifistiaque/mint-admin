'use client';

import { defineRecipe, defineSlotRecipe } from '@chakra-ui/react';
import {
	comboboxAnatomy,
	dialogAnatomy,
	drawerAnatomy,
	nativeSelectAnatomy,
	selectAnatomy,
	tableAnatomy,
	menuAnatomy,
} from '@chakra-ui/react/anatomy';

/**
 * Recipe overrides are deep-merged into Chakra's defaults, so everything here
 * is a patch: only the properties that carry the look of this admin, applied
 * once at the system level rather than re-declared on every call site.
 */

const EASE = 'cubic-bezier(.4, 0, .2, 1)';
const DURATION = '150ms';

export const buttonRecipe = defineRecipe({
	base: {
		borderRadius: 'l2',
		fontWeight: '600',
		letterSpacing: '-0.005em',
		transitionProperty: 'background-color, border-color, color, box-shadow, transform',
		transitionDuration: DURATION,
		transitionTimingFunction: EASE,
		// A half-pixel dip on press: enough to feel like a button, too small to
		// shift the layout around it.
		_active: { transform: 'translateY(0.5px)' },
		_disabled: {
			opacity: 0.45,
			cursor: 'not-allowed',
			_active: { transform: 'none' },
		},
		// `loading` sets the native `disabled` attribute too (so the button can't
		// be clicked mid-request), which put the whole button through the same
		// 0.45-opacity fade as a truly disabled one — washing the spinner and
		// "Uploading…" text out against the page instead of the button's own
		// background. Loading should read as busy, not as unavailable.
		'&[data-loading=true]': {
			opacity: 1,
			cursor: 'progress',
		},
	},
	variants: {
		variant: {
			solid: {
				boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
				_hover: { bg: 'colorPalette.solid/88' },
				_active: { bg: 'colorPalette.solid/80' },
			},
			outline: {
				bg: 'bg.panel',
				color: 'fg',
				borderColor: 'border',
				_hover: { bg: 'bg.subtle', borderColor: 'border.emphasized' },
				_active: { bg: 'bg.muted' },
			},
			ghost: {
				color: 'fg',
				_hover: { bg: 'bg.muted' },
				_active: { bg: 'bg.emphasized' },
			},
			subtle: {
				_hover: { bg: 'bg.emphasized' },
			},
		},
	},
});

// Every form control's text size. It lives on the base rather than only on the
// `sm` size because Chakra sets `textStyle` on some sizes and not others — the
// combobox input and the native select fell through to the browser's 16px
// default, a full three steps larger than the fields beside them. The `sm`
// size variant repeats it to win over that `textStyle` where it is set.
const FIELD_FONT_SIZE = '13px';

const fieldBase = {
	borderRadius: 'l2',
	fontSize: FIELD_FONT_SIZE,
	transitionProperty: 'border-color, box-shadow, background-color',
	transitionDuration: DURATION,
	transitionTimingFunction: EASE,
	_placeholder: { color: 'field.placeholder' },
	_disabled: { bg: 'bg.subtle', opacity: 0.6, cursor: 'not-allowed' },
};

const fieldOutline = {
	bg: 'field.bg',
	borderColor: 'field.border',
	color: 'fg',
	_hover: { borderColor: 'field.borderHover' },
	focusRingColor: 'field.focusRing',
	focusRingWidth: '1px',
};

/**
 * Form controls are `sm` (36px) by default, not Chakra's `md` (40px).
 *
 * Only some call sites passed `size='sm'`, so a drawer could show a 36px text
 * input directly above a 40px select and read as slightly broken. 36px is also
 * what the toolbar's search field, the filter chips and the drawer's own footer
 * buttons resolve to, so one default lines the whole admin up.
 *
 * The matching `fontSize` override is deliberate: Chakra's `sm` size sets
 * `textStyle: 'sm'` (14px), and a field a step larger than the 13px table cells
 * underneath it is what made an open drawer look like a different app. Setting
 * `fontSize` in the same size variant wins over `textStyle` while keeping its
 * line-height.
 */
const fieldSizes = { sm: { fontSize: FIELD_FONT_SIZE } };
const fieldDefaults = { size: 'sm' } as const;

export const inputRecipe = defineRecipe({
	base: fieldBase,
	variants: { variant: { outline: fieldOutline }, size: fieldSizes },
	defaultVariants: fieldDefaults,
});

export const textareaRecipe = defineRecipe({
	base: { ...fieldBase, lineHeight: '1.6' },
	variants: { variant: { outline: fieldOutline }, size: fieldSizes },
	defaultVariants: fieldDefaults,
});

export const nativeSelectSlotRecipe = defineSlotRecipe({
	slots: nativeSelectAnatomy.keys(),
	base: {
		field: {
			...fieldBase,
			...fieldOutline,
			cursor: 'pointer',
		},
		indicator: { color: 'fg.muted' },
	},
	variants: { size: { sm: { field: { fontSize: FIELD_FONT_SIZE } } } },
	defaultVariants: fieldDefaults,
});

export const selectSlotRecipe = defineSlotRecipe({
	slots: selectAnatomy.keys(),
	base: {
		trigger: {
			...fieldBase,
			...fieldOutline,
			cursor: 'pointer',
			_expanded: { borderColor: 'field.focusRing' },
		},
		indicator: { color: 'fg.muted' },
		clearTrigger: { borderRadius: '0' },
		content: {
			borderRadius: 'l3',
			borderWidth: '1px',
			borderColor: 'border.muted',
			bg: 'bg.panel',
			boxShadow: '0 10px 32px -8px rgba(0, 0, 0, 0.18), 0 2px 6px -2px rgba(0, 0, 0, 0.08)',
			p: '1',
			_dark: {
				borderColor: 'border',
				boxShadow: '0 10px 32px -8px rgba(0, 0, 0, 0.7)',
			},
		},
		item: {
			borderRadius: 'l1',
			transitionProperty: 'background-color, color',
			transitionDuration: '120ms',
			_highlighted: { bg: 'bg.emphasized/60' },
		},
	},
	variants: {
		size: { sm: { trigger: { fontSize: FIELD_FONT_SIZE }, item: { fontSize: FIELD_FONT_SIZE } } },
	},
	defaultVariants: fieldDefaults,
});

export const comboboxSlotRecipe = defineSlotRecipe({
	slots: comboboxAnatomy.keys(),
	base: {
		input: {
			...fieldBase,
			...fieldOutline,
		},
		trigger: { color: 'fg.muted' },
		clearTrigger: { borderRadius: '0' },
		content: {
			borderRadius: 'l3',
			borderWidth: '1px',
			borderColor: 'border.muted',
			bg: 'bg.panel',
			boxShadow: '0 10px 32px -8px rgba(0, 0, 0, 0.18), 0 2px 6px -2px rgba(0, 0, 0, 0.08)',
			p: '1',
			_dark: {
				borderColor: 'border',
				boxShadow: '0 10px 32px -8px rgba(0, 0, 0, 0.7)',
			},
		},
		item: {
			borderRadius: 'l1',
			transitionProperty: 'background-color, color',
			transitionDuration: '120ms',
			_highlighted: { bg: 'bg.emphasized/60' },
		},
	},
	variants: {
		size: { sm: { input: { fontSize: FIELD_FONT_SIZE }, item: { fontSize: FIELD_FONT_SIZE } } },
	},
	defaultVariants: fieldDefaults,
});

export const dialogSlotRecipe = defineSlotRecipe({
	slots: dialogAnatomy.keys(),
	base: {
		backdrop: {
			// A white-on-white overlay barely separated the dialog from the page.
			// Dimming alone does the separating — no backdrop-filter, which is
			// expensive to composite on every frame in some browsers.
			bg: 'rgba(17, 17, 17, 0.44)',
			_dark: { bg: 'rgba(0, 0, 0, 0.7)' },
		},
		content: {
			borderRadius: 'l3',
			borderWidth: '1px',
			borderColor: 'border.muted',
			bg: 'bg.panel',
			boxShadow: '0 16px 48px -12px rgba(0, 0, 0, 0.22), 0 4px 12px -4px rgba(0, 0, 0, 0.1)',
			_dark: {
				borderColor: 'border',
				boxShadow: '0 16px 48px -12px rgba(0, 0, 0, 0.7)',
			},
		},
		title: { fontWeight: '600', letterSpacing: '-0.01em' },
		description: { color: 'fg.muted' },
	},
});

export const drawerSlotRecipe = defineSlotRecipe({
	slots: drawerAnatomy.keys(),
	base: {
		backdrop: {
			bg: 'rgba(17, 17, 17, 0.44)',
			_dark: { bg: 'rgba(0, 0, 0, 0.7)' },
		},
		content: { bg: 'bg.panel' },
		title: { fontWeight: '600', letterSpacing: '-0.01em' },
	},
});

export const menuSlotRecipe = defineSlotRecipe({
	slots: menuAnatomy.keys(),
	base: {
		content: {
			borderRadius: 'l3',
			borderWidth: '1px',
			borderColor: 'border.muted',
			boxShadow: '0 10px 32px -8px rgba(0, 0, 0, 0.18), 0 2px 6px -2px rgba(0, 0, 0, 0.08)',
			_dark: { borderColor: 'border', boxShadow: '0 10px 32px -8px rgba(0, 0, 0, 0.7)' },
			p: '1',
		},
		item: {
			borderRadius: 'l1',
			transitionProperty: 'background-color, color',
			transitionDuration: '120ms',
		},
	},
});

export const tableSlotRecipe = defineSlotRecipe({
	slots: tableAnatomy.keys(),
	base: {
		row: { bg: 'transparent' },
		columnHeader: {
			borderColor: 'border.muted',
			color: 'fg.muted',
		},
		cell: { borderColor: 'border.muted' },
	},
});
