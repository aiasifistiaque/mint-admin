'use client';

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import colors from './colors.theme';
import {
	buttonRecipe,
	comboboxSlotRecipe,
	dialogSlotRecipe,
	drawerSlotRecipe,
	inputRecipe,
	menuSlotRecipe,
	nativeSelectSlotRecipe,
	selectSlotRecipe,
	tableSlotRecipe,
	textareaRecipe,
} from './recipes';

export const system = createSystem(defaultConfig, {
	theme: {
		tokens: {
			colors: colors,
			fonts: {
				body: { value: 'system-ui, sans-serif' },
				heading: { value: 'system-ui, sans-serif' },
			},
		},
		semanticTokens: {
			colors: {
				brand: {
					solid: { value: '{colors.blue.500}' },
					contrast: { value: 'white' },
					fg: { value: '{colors.blue.700}' },
					muted: { value: '{colors.blue.100}' },
					subtle: { value: '{colors.blue.50}' },
					emphasized: { value: '{colors.blue.600}' },
					focusRing: { value: '{colors.blue.500}' },
				},

				// Chakra derives bg/fg/border from the `gray` scale, and this theme
				// collapses that scale onto a few brand values — which left muted
				// text and every default border black-on-black in dark mode. These
				// point at the `neutral` ramp instead so the built-in components
				// resolve to something visible.
				bg: {
					DEFAULT: { value: { _light: '#ffffff', _dark: '#000000' } },
					subtle: { value: { _light: '{colors.neutral.50}', _dark: '#0a0a0a' } },
					muted: { value: { _light: '{colors.neutral.100}', _dark: '#151515' } },
					emphasized: { value: { _light: '{colors.neutral.200}', _dark: '#1f1f1f' } },
					panel: { value: { _light: '#ffffff', _dark: '#0a0a0a' } },
					inverted: { value: { _light: '#171717', _dark: '#fafafa' } },
				},
				fg: {
					DEFAULT: { value: { _light: '#171717', _dark: '{colors.text.dark}' } },
					muted: { value: { _light: '{colors.neutral.500}', _dark: '#8f8f8f' } },
					subtle: { value: { _light: '{colors.neutral.400}', _dark: '#6b6b6b' } },
					inverted: { value: { _light: '#fafafa', _dark: '#0a0a0a' } },
				},
				border: {
					DEFAULT: { value: { _light: '{colors.border.light}', _dark: '{colors.border.dark}' } },
					muted: { value: { _light: '#ebebeb', _dark: '#1c1c1c' } },
					subtle: { value: { _light: '{colors.neutral.100}', _dark: '#161616' } },
					emphasized: { value: { _light: '{colors.neutral.300}', _dark: '#333333' } },
				},
				gray: {
					contrast: { value: { _light: '#ffffff', _dark: '#0a0a0a' } },
					fg: { value: { _light: '{colors.neutral.700}', _dark: '{colors.neutral.300}' } },
					subtle: { value: { _light: '{colors.neutral.100}', _dark: '#171717' } },
					muted: { value: { _light: '{colors.neutral.200}', _dark: '#222222' } },
					emphasized: { value: { _light: '{colors.neutral.300}', _dark: '#2e2e2e' } },
					solid: { value: { _light: '#171717', _dark: '#fafafa' } },
					focusRing: { value: { _light: '#171717', _dark: '#d4d4d4' } },
				},

				// Form-control surface, shared by input / textarea / select.
				field: {
					bg: { value: { _light: '{colors.field.bg.light}', _dark: '{colors.field.bg.dark}' } },
					border: {
						value: { _light: '{colors.field.border.light}', _dark: '{colors.field.border.dark}' },
					},
					borderHover: {
						value: {
							_light: '{colors.field.borderHover.light}',
							_dark: '{colors.field.borderHover.dark}',
						},
					},
					placeholder: {
						value: {
							_light: '{colors.field.placeholder.light}',
							_dark: '{colors.field.placeholder.dark}',
						},
					},
					focusRing: {
						value: {
							_light: '{colors.field.focusRing.light}',
							_dark: '{colors.field.focusRing.dark}',
						},
					},
				},
			},

			// Chakra's `l1/l2/l3` layer radii drive the corner of every built-in
			// component. The defaults (2 / 4 / 6px) read as a much older UI than
			// the rest of this admin.
			radii: {
				l1: { value: '{radii.md}' },
				l2: { value: '{radii.lg}' },
				l3: { value: '{radii.xl}' },
			},
		},
		recipes: {
			button: buttonRecipe,
			input: inputRecipe,
			textarea: textareaRecipe,
		},
		slotRecipes: {
			combobox: comboboxSlotRecipe,
			dialog: dialogSlotRecipe,
			drawer: drawerSlotRecipe,
			menu: menuSlotRecipe,
			nativeSelect: nativeSelectSlotRecipe,
			select: selectSlotRecipe,
			table: tableSlotRecipe,
		},
		breakpoints: {
			sm: '480px',
			md: '768px',
			lg: '992px',
			xl: '1280px',
			'2xl': '1536px',
		},
	},
	globalCss: {
		'body, p, span': {
			color: '#171717',
			fontSize: '15px',
			_dark: {
				color: '{colors.text.dark}',
			},
		},
		'h1, h2, h3, h4, h5, h6': {
			color: '{colors.text.light}',
			_dark: {
				color: '{colors.text.dark}',
			},
		},
		// Scrollbars inside panels, tables and modals; the platform default is a
		// heavy grey bar that fights the rest of the chrome.
		'*::-webkit-scrollbar': { width: '10px', height: '10px' },
		'*::-webkit-scrollbar-track': { bg: 'transparent' },
		'*::-webkit-scrollbar-thumb': {
			bg: 'transparent',
			borderRadius: 'full',
			border: '3px solid transparent',
			backgroundClip: 'content-box',
		},
		'*:hover::-webkit-scrollbar-thumb': {
			bg: '{colors.neutral.300}',
			backgroundClip: 'content-box',
			_dark: { bg: '#2e2e2e' },
		},
	},
});

export const config = {
	initialColorMode: 'light' as const,
	useSystemColorMode: false,
};

export { colors };
