// import { THEME } from '../components/library';

const THEME: 'basic' | 'fancy' = 'basic';

const RICH_BLACK = '#0E131F';
const DARK = '#0E0E0E';

const PRIMARY = 'black';

const BORDER_LIGHT = '#e4e4e4';
const BORDER_DARK = '#222';

// const SAGE = '#B5BD89';
const SAGE = 'whitesmoke';
const THIRSTLE = '#D0C4DF';

//const BLACK = '#1f1f1f';
const BLACK = '#171717';

export const colors: any = {
	brand: {
		// 100: 'red',
		// light: '#635BFF',
		light: '#40234A',
		dark: SAGE,
		200: SAGE,
		// 300: 'blue',
		// 400: 'teal',
		//500: '#635BFF',
		// 500: '#171717',
		500: PRIMARY,
		// 600: 'darkslateblue',
		600: '#34163F',
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
		//dark: BLACK,
		dark: 'black',
	},

	stroke: {
		light: 'transparent',
		//light: '#fff',
		dark: 'transparent',
		deepL: '#ebebeb',
		deepD: 'transparent',
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
		//dark: BLACK,
		dark: 'black',
		200: 'whitesmoke',
		500: '#414552',
	},
	button: {
		primary: {
			textLight: '#fff',
			textDark: '#fff',
			bgLight: '#fafafa',
			bgDark: PRIMARY,
			hoverLight: '#583D60',
			hoverDark: '#583D60',
		},

		secondary: {
			borderLight: BORDER_LIGHT,
			borderDark: BORDER_DARK,
			textLight: PRIMARY,
			textDark: '#fafafa',
			bgLight: '#fff',
			bgDark: '#0A0A0A',
			hoverLight: '#583D60',
			hoverDark: '#222',
		},
	},
	text: {
		// light: '#40234A',
		formLabel: {
			light: PRIMARY,
			dark: '#fafafa',
		},

		heading: {
			light: PRIMARY,
			dark: '#fafafa',
		},
		secondary: {
			light: '#666',
			dark: '#a1a1a1',
		},
		light: '#222',
		dark: '#ededed',
		shade: '#666',
		200: '#fff',
		300: '#fff',
		// 400: '#4a4a4a',
		400: 'blue',
		// 500: '#171717',
		// 500: 'blue',
		500: PRIMARY,
		selected: '#4a4a4a',
		selectedDark: SAGE,
	},
	sidebar: {
		//light: '#F3F3EF',
		light: '#fafafa',
		dark: '#000',
		header: {
			light: '#fff',
			dark: '#0a0a0a',
		},
		borderBottom: {
			light: '#ebebeb',
			dark: BORDER_DARK,
		},
		selectedItemBorder: {
			light: '#ebebeb',
			dark: '#222',
		},
		selectedItemBg: {
			light: '#fff',
			dark: '#0a0a0a',
		},
		hover: {
			bgLight: '#fff',
			bgDark: 'transparent',
		},

		headerText: {
			// light: '#111',na
			// dark: '#fafafa',
			light: '#222',
			dark: '#fafafa',
		},
		bodyText: {
			// light: '#111',
			// dark: '#fafafa',
			light: '#4a4a4a',
			dark: '#a1a1a1',
			headingLight: '#222',
			headingDark: '#a1a1a1',
			selectedLight: '#222',
			selectedDark: '#fafafa',
		},

		//dark: DARK,

		darker: '#121212',
		hoverLight: '#ebebeb',
		hoverDark: '#141414',
		headingBorderDark: BORDER_DARK,
	},

	sidebarItem: {
		light: 'transparent',
		dark: 'transparent',
		lightSelect: 'transparent',
		darkSelect: '#0A0A0A',
		lightHover: 'transparent',
		darkhover: 'transparent',
		textLight: 'transparent',
		textDark: '#ededed',
	},

	menu: {
		light: '#fff',
		dark: '#0A0A0A',
		blurLight: 'rgba(255, 255, 255, 0.4)',
		blurDark: 'rgba(0, 0, 0, .8)',
		overlayDark: 'rgba(10, 10, 10, .9)',
	},
	navbar: {
		400: BLACK,
		text: {
			light: '#222',
			dark: '#ebebeb',
		},
		light: 'rgba(255, 255, 255, 0.4)',
		blurLight: 'rgba(255, 255, 255, 0.4)',
		blurDark: 'rgba(0, 0, 0, 1)',
		dark: '#0A0A0A',
		800: BLACK,
		borderBottomLight: '#ebebeb',
		borderBottomDark: BORDER_DARK,
		border: {
			light: '#ebebeb',
			dark: '#222',
		},
	},
	border: {
		//light: '#F3F3EF',
		light: BORDER_LIGHT,
		secondary_light: '#aeaeae',
		dark: '#222',
		secondary_dark: '#5a5a5a',
	},
	container: {
		light: '#fff',
		dark: '#0A0A0A',
		newLight: '#fff',
		newDark: DARK,
		borderLight: BORDER_LIGHT,
		borderDark: BORDER_DARK,
		borderDarker: '#111',
	},
	green: {
		500: '#000',
		600: '#000',
	},
	//black: { 500: BLACK, 600: BLACK, 700: BLACK, 800: BLACK, 900: BLACK, 200: BLACK },
	gray: {
		50: 'white',
		100: BORDER_LIGHT,
		200: BORDER_LIGHT, //input borders
		300: PRIMARY,
		400: PRIMARY,
		500: '#E0DCE5',
		600: PRIMARY,
		700: PRIMARY,
		800: 'black', //initial bg color of the load of colormode
		900: 'green',
	},

	result: {
		bg: {
			light: '#fafafa',
			dark: 'black',
		},
		border: {
			light: 'transparent',
			dark: 'transparent',
		},
	},

	table: {
		light: THEME == 'basic' ? 'transparent' : '#fff',
		dark: THEME == 'basic' ? 'transparent' : DARK,
		bgLight: '#fff',
		bgDark: '#0A0A0A',

		bg: {
			light: '#fff',
			dark: '#0A0A0A',
		},
		cardBorder: {
			light: '#ebebeb',
			dark: BORDER_DARK,
		},
		innerBorder: {
			light: '#ebebeb',
			dark: BORDER_DARK,
		},
		outerBorder: {
			light: '#ebebeb',
			dark: BORDER_DARK,
		},
		head: {
			bgLight: '#fafafa',
			bgDark: '#0A0A0A',
		},
		row: {
			light: 'white',
			dark: '#0A0A0A',
		},
	},
	selectBorder: {
		light: '#ebebeb',
		dark: BORDER_DARK,
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
		light: '#ebebeb',
		dark: BORDER_DARK,
	},
};

//ecom-colors

export default colors;
