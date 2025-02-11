'use client';
import { defineStyle, defineStyleConfig, extendTheme, ThemeConfig } from '@chakra-ui/react';
import colors from './colors.theme';

// 2. Add color mode config
const config: ThemeConfig = {
	initialColorMode: 'light',
	useSystemColorMode: false,
};

export const headingTheme = defineStyleConfig({
	baseStyle: {
		color: 'text.light',
		_dark: {
			color: 'text.dark',
		},
	},
});

export const textTheme = defineStyleConfig({
	baseStyle: {
		color: '#171717',
		fontSize: '15px',
		_dark: {
			color: 'text.dark',
		},
	},
});

const buttonXs = defineStyle({
	fontS4ize: 'xs',
	h: '26px',
	minW: '26px',
});

export const buttonTheme = defineStyleConfig({
	baseStyle: {
		fontWeight: '500', // change the font weight to normal
		borderRadius: '6px', // <-- border radius is same for all variants and sizes
		fontSize: '14px',
		letterSpacing: '-0.4px',
		px: 4,
	},

	variants: {
		white: {
			h: '36px',
			color: '#171717',
			border: '1px solid',
			borderColor: '#e7e7e7',
			bg: 'white',
			_hover: {
				bg: 'inherit',
			},
			_dark: {
				color: '#fafafa',
				borderColor: '#333',
				bg: '#171717',
				_hover: {
					bg: 'gray.800',
				},
			},
		},
	},
	sizes: {
		xs: buttonXs,
		md: {
			fontSize: '14px',
		},
		sm: {
			h: '34px',
			fontSize: '14px',
			lineHeight: '1.5',
			px: 4,
		},
	},
	defaultProps: {
		colorScheme: 'brand',
	},
});

export const tooltipTheme = defineStyleConfig({
	baseStyle: {
		borderRadius: 'lg',
		bg: 'brand.500',
		_dark: { bg: 'whitesmoke' },
	},
});

const components = {
	Button: buttonTheme,
	Heading: headingTheme,
	Tooltip: tooltipTheme,
	Text: textTheme,
};

const shadows = {};

// 6. Add Breakpoints
export const breakpoints = {
	base: '0px',
	sm: '480px',
	md: '768px',
	lg: '992px',
	xl: '1280px',
};

export const theme = extendTheme({
	config,
	colors,
	components,
	breakpoints,
	shadows,
});
