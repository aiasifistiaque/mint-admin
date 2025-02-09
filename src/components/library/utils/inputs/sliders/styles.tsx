import { InputProps } from '@chakra-ui/react';

export const toolTipStyle: any = {
	borderRadius: '12px',
	mt: '-12',
	ml: '0',
	px: 2,
	py: 1,
	fontSize: '12px',
	fontWeight: '600',
	textAlign: 'center',
	bg: 'brand.500',
	color: 'white',
	_dark: {
		bg: 'whitesmoke',
		color: 'brand.500',
	},
};

export const labelStyle: any = {
	mt: '2',
	ml: '0',
	fontSize: '12px',
	fontWeight: '500',
};

export const variables = {
	height: '72px',
	track: '#888',
	filledTrack: 'brand.500',
	boxSize: 6,
};

export type SliderProps = InputProps &
	any & {
		label: string;
		value: any;
		isRequired?: boolean;
		placeholder?: string;
		helper?: string;
		hideNew?: boolean;
		unselect?: boolean;
	};
