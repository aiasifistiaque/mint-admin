import { THEME } from '../components/library';

type ColorMode = {
	light?: string;
	dark?: string;
	50?: string;
	100?: string;
	200?: string;
	300?: string;
	400?: string;
	500?: string;
	600?: string;
	700?: string;
	800?: string;
	900?: string;
	selected?: string;
	selectedDark?: string;
	darker?: string;
};

type Colors = {
	background: ColorMode;
	text: ColorMode & {
		500: string;
	};
	stroke: ColorMode & { deepL: string; deepD: string };
	header: ColorMode;
	sidebar: ColorMode;
	border: ColorMode;
	container: ColorMode;
	table: ColorMode;
	navbar: ColorMode;
	brand: ColorMode;
	black?: ColorMode;
	white?: ColorMode;
	blackAlpha?: ColorMode;
	menu: ColorMode;
	hover: ColorMode;
	selectBorder: ColorMode;
	gray?: ColorMode;
	card: ColorMode;
	pos: ColorMode;
};

const RICH_BLACK = '#0E131F';
const DARK = '#0E0E0E';

// const SAGE = '#B5BD89';
const SAGE = 'whitesmoke';
const THIRSTLE = '#D0C4DF';

//const BLACK = '#1f1f1f';
const BLACK = '#171717';

const test = {
	100: 'red',
	200: 'blue',
	300: 'teal',
	400: 'slateblue',
	500: 'darkslateblue',
	600: 'green',
	700: 'yellow',
	800: 'orange',
	900: 'tomato',
};

export const colors: any = {
	brand: {
		// 100: 'red',
		light: '#635BFF',
		dark: SAGE,
		200: SAGE,
		// 300: 'blue',
		// 400: 'teal',
		//500: '#635BFF',
		500: '#4a4a4a',
		// 600: 'darkslateblue',
		600: '#111',
	},

	red: {
		// 500: '#A5292f',
		// 100: 'green',
		// 200: 'blue',
		// 300: 'teal',
		// 400: 'slateblue',
		600: '#EA001C',
		// 700: 'yellow',
		// 800: 'orange',
		// 900: 'tomato',
		//#EA001C
	},
	// black: test,
	// white: test,
	// blackAlpha: test,
	hover: {
		light: 'whitesmoke',
		dark: BLACK,
	},
	background: {
		100: '#f1f1f1',
		400: '#f8f6f3',
		500: '#fff',
		200: BLACK,
		light: THEME == 'basic' ? '#fafafa' : '#f1f1f1',
		//dark: BLACK,
		dark: THEME == 'basic' ? BLACK : '#121212',
	},
	text: {
		light: '#30313D',
		dark: '#f1f1f1',
		200: '#fff',
		400: '#4a4a4a',
		500: '#30313D',
		selected: '#4a4a4a',
		selectedDark: SAGE,
	},
	stroke: {
		light: 'transparent',
		//light: '#fff',
		dark: 'transparent',
		deepL: '#ECECE8',
		deepD: '#2D2D2D',
	},
	pos: {
		light: '#ebebeb',
		dark: DARK,
	},

	card: {
		light: 'white',
		dark: BLACK,
	},

	header: {
		light: '#fff',
		dark: BLACK,
		200: 'whitesmoke',
		500: '#414552',
	},
	sidebar: {
		//light: '#F3F3EF',
		light: '#fafafa',
		selected: '#4a4a4a',
		dark: DARK,
		darker: '#121212',
	},
	menu: {
		light: '#fff',
		dark: DARK,
	},
	navbar: {
		400: BLACK,
		light: THEME == 'basic' ? '#fafafa' : BLACK,
		dark: BLACK,
		800: BLACK,
	},
	border: {
		//light: '#F3F3EF',
		light: '#e3e3e3',
		dark: '#2D2D2D',
	},
	container: {
		light: '#fff',
		dark: BLACK,
	},
	//black: { 500: BLACK, 600: BLACK, 700: BLACK, 800: BLACK, 900: BLACK, 200: BLACK },
	gray: {
		// 50: 'purple',
		// 100: 'teal',
		//200: 'red',
		// 300: 'green',
		// 400: 'blue',
		// 500: 'yellow',
		// 600: 'orange',
		// 700: 'tomato',
		800: BLACK, //initial bg color of the load of colormode
		// 900: 'green',
	},

	table: {
		light: THEME == 'basic' ? '#fff' : '#fff',
		dark: THEME == 'basic' ? 'transparent' : DARK,
	},
	selectBorder: {
		light: '#d1d3d3',
		dark: 'whitesmoke',
	},
	//ecom-commers
	white: {
		200: '#f5f5f5',
		600: '#202020',
	},
	eblack: {
		200: '#202020',
	},
	etext: {
		400: '#676767',
		600: '#202020',
	},
	eborder: {
		300: '#fafafa',
		600: '#e3e3e3',
	},
};

//ecom-colors

export default colors;
