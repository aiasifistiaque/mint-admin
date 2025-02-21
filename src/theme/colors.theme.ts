// import { THEME } from '../components/library';

const THEME: 'basic' | 'fancy' = 'basic';

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
		500: '#171717',
		// 600: 'darkslateblue',
		600: '#333',
	},

	red: {
		// 500: '#A5292f',
		// 100: 'green',
		// 200: 'blue',
		// 300: 'teal',
		// 400: 'slateblue',
		500: '#EA001C',
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
		blurLight: 'rgba(250, 250, 250, .4)',
		// light: THEME == 'basic' ? '#fafafa' : '#f1f1f1',
		// //dark: BLACK,
		// dark: THEME == 'basic' ? BLACK : '#121212',

		light: '#fafafa',
		//dark: BLACK,
		dark: BLACK,
	},
	text: {
		light: '#111',
		dark: '#fafafa',
		shade: '#666',
		200: '#fff',
		400: '#4a4a4a',
		500: '#171717',
		selected: '#4a4a4a',
		selectedDark: SAGE,
	},
	stroke: {
		light: 'transparent',
		//light: '#fff',
		dark: 'transparent',
		deepL: '#e7e7e7',
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
		dark: DARK,
		darker: '#121212',
		hoverLight: '#ECECEC',
		hoverDark: '#141414',
	},
	menu: {
		light: '#fff',
		dark: DARK,
		blurLight: 'rgba(255, 255, 255, 0.5)',
		blurDark: 'rgba(14,14,14,.8)',
	},
	navbar: {
		400: BLACK,
		light: THEME == 'basic' ? '#fff' : BLACK,
		blurLight: 'rgba(255, 255, 255, 0.4)',
		dark: BLACK,
		800: BLACK,
		borderBottomLight: '#ECECEc',
		borderBottomDark: 'transparent',
	},
	border: {
		//light: '#F3F3EF',
		light: '#ececec',
		dark: '#2D2D2D',
	},
	container: {
		light: '#fff',
		dark: BLACK,
		newLight: '#fff',
		newDark: BLACK,
		borderLight: '#e7e7e7',
		borderDark: 'transparent',
		borderDarker: '#111',
	},
	green: {
		500: '#000',
		600: '#000',
	},
	//black: { 500: BLACK, 600: BLACK, 700: BLACK, 800: BLACK, 900: BLACK, 200: BLACK },
	gray: {
		// 50: 'purple',
		// 100: 'teal',
		//200: 'red',
		// 300: 'green',
		// 400: 'blue',
		// 500: '#000',
		// 600: '#000',
		// 700: 'tomato',
		800: BLACK, //initial bg color of the load of colormode
		// 900: 'green',
	},

	table: {
		light: THEME == 'basic' ? 'transparent' : '#fff',
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
