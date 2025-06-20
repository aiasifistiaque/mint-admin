import { FlexProps, TextProps } from '@chakra-ui/react';

export const wrapperCss: FlexProps = {
	flexDir: 'column',
	gap: 4,
};

export const containerCss: FlexProps = {
	flexDir: { base: 'row', md: 'row' },
	flexWrap: 'wrap',
	gap: 2,
	justify: 'space-between',
	align: { base: 'flex-start', md: 'center' },
	pt: { base: 3, md: 4 },
};

export const headingCss: TextProps = {
	fontSize: { base: '1.5rem', md: '1.75rem' },
};

export const subHeadingCss: TextProps = {
	_light: {
		color: 'text.secondary.light',
	},
	_dark: {
		color: 'text.secondary.dark',
	},
};

export const buttonGroupCss: FlexProps = {
	gap: 2,
	justify: 'flex-end',
};
