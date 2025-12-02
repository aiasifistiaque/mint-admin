'use client';

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import colors from './colors.theme';

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
			},
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
	},
});

export const config = {
	initialColorMode: 'light' as const,
	useSystemColorMode: false,
};

export { colors };
