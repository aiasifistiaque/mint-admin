export const TOKEN_NAME: string = process.env.NEXT_PUBLIC_TOKEN_NAME || 'MINT_CAFE_TOKEN_TWO';

export const REFRESH_TOKEN: string =
	process.env.REFRESH_TOKEN || 'THINKCRYPT_ERP_REFRESH_TOKEN_TEST_ONE';

export const STORE: string = process.env.NEXT_PUBLIC_STORE || '6587157f9b62eb0e74c9f2ef';

export const CART_NAME: string =
	process.env.NEXT_PUBLIC_CART_NAME || 'THINKCRYPT_ERP_CART_TEST_ONE';

export const PLACEHOLDER_IMAGE =
	process.env.PLACEHOLDER_IMAGE ||
	'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704931200&semt=ais';

export const URL = {
	backend: process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000',
	api: process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000',
};

export const currency = {
	code: 'BDT',
	symbol: '৳',
};

const BASE_SIDEBAR_WIDTH = '240px';
const BASE_SIDEBAR_WIDTH_SMALL = '20PX';

export const BODY_PT = '72px';

export const sizes = {
	SIDEBAR_WIDTH: BASE_SIDEBAR_WIDTH,
	HOME_NAV_MAX_WIDTH: `calc(100vw - ${BASE_SIDEBAR_WIDTH})`,
	HOME_NAV_SMALL_SCREEN_WIDTH: `calc(100vw - ${'20px + 32px'})`,
	HOME_NAV_LEFT: BASE_SIDEBAR_WIDTH,
	PADDING_X_BASE: 4,
	PADDING_X_MD: 6,
	PADDING_X_LG: 6,
	POPOVER_WIDTH: '260px',
	RADIUS_MENU: 'lg',
	POS_MAX_HEIGHT: '75vh',
	POS_RATIO: '8fr 2fr',
	POS_RATIO_BASE: '6fr 1fr',
	NAV_HEIGHT: 14,
	CARD_RADIUS: '8px',
	SIDEBAR_PX: 3,
	SEARCH_BAR_HEIGHT: '38px',
};

export const shadow = {
	MENU: 'lg',
	CARD: '2px 2px 10px rgba(0,0,0,.1)',
	DASH: '0px 0px 1px rgba(0,0,0,.08), 0px 2px 2px 0px rgba(0, 0, 0, 0.04)',
	MODAL: '2xl',
};

export const padding = {
	BASE: sizes.PADDING_X_BASE,
	MD: sizes.PADDING_X_MD,
	LG: sizes.PADDING_X_LG,
	BODY_TOP: '72px',
	CONTAINER: {
		BASE: 4,
		MD: 8,
		LG: 8,
	},
};

export const zIndex = {
	NAV: 999,
	SIDEBAR: 998,
};

export const radius = {
	CONTAINER: '4px',
	MODAL: '8px',
	MENU: '6px',
	BUTTON: '4px',
	INPUT: '4px',
	SELECT_CONTAINER: '6px',
	FILTER: '4px',
};

export const styles = {
	backdropFilter: 'blur(5px)',
	BACKDROP_FILTER: 'blur(5px)',
	BLUR_CONTAINER: {
		backdropFilter: 'blur(10px)',
		bg: 'navbar.blurLight',
	},
	MODAL_BLUR: {
		bg: 'rgba(255, 255, 255, .6)',
		backdropFilter: 'blur(10px)',
	},
	NAVBAR: {
		h: sizes.NAV_HEIGHT || 12,
		alignItems: 'center',
		bg: 'navbar.light',
		backdropFilter: 'blur(5px)',
		borderBottomWidth: 1,
		zIndex: zIndex.NAV || 999,
		borderBottomColor: 'navbar.border.light',
		color: 'navbar.text.light',
		_dark: {
			color: 'navbar.text.dark',
			bg: 'navbar.dark',
			borderBottomColor: 'navbar.border.dark',
		},
	},
	SIDEBAR_NAV: {
		h: sizes.NAV_HEIGHT || 12,
		alignItems: 'center',
		bg: 'sidebar.header.light',
		backdropFilter: 'blur(5px)',

		borderBottomWidth: 1,
		zIndex: zIndex.NAV || 999,
		borderColor: 'sidebar.borderBottom.light',
		_dark: {
			bg: 'sidebar.header.dark',
			borderColor: 'sidebar.borderBottom.dark',
		},
	},
	bigInput: {
		borderRadius: '6px',
		_light: {
			borderColor: 'container.borderLight',
		},
	},
	color: {
		MODAL_OVERLAY: {
			LIGHT: 'rgba(250, 250, 250, .8)',
			DARK: 'menu.overlayDark',
		},
	},
	BORDER: {
		_light: {
			borderColor: 'container.borderLight',
			borderWidth: 1,
		},
		borderRadius: '6px',
	},
	MODAL: {
		bg: 'menu.light',
		borderWidth: 1,
		borderColor: 'container.borderLight',
		_dark: {
			bg: 'menu.dark',
			borderColor: 'container.borderDark',
		},
		borderRadius: '8px',
		shadow: '2xl',
	},
	DRAWER: {
		bg: 'menu.light',
		_dark: {
			bg: 'menu.dark',
		},
		maxH: '85vh',
		userSelect: 'none',
		borderTopRadius: '20px',
	},
	CONTAINER: {
		RADIUS: {
			borderRadius: '8px',
		},
		SHADOW: {
			boxShadow: shadow.DASH,
		},
		BG: {
			bg: 'container.newLight',
			_dark: {
				bg: 'menu.dark',
			},
		},
		BORDER: {
			borderWidth: 1,
			borderColor: 'container.borderLight',
			_dark: {
				borderColor: '#eee',
			},
		},
	},
	STAT_CONTAINER: {
		borderRadius: radius.CONTAINER,
		alignItems: 'center',
		w: 'full',
		p: 4,
		bg: 'container.newLight',
		borderColor: 'container.borderLight',
		borderWidth: 1,
		boxShadow: shadow.DASH,
		_dark: {
			bg: 'menu.dark',
			borderColor: 'container.borderDark',
		} as any,
	},
};

// export const color = {
// 	MODDAL_OVERLAY: {
// 		LIGHT: 'rgba(250, 250, 250, .8)',
// 	},
// };

export const BASE_LIMIT = 16;

export const THEME: 'basic' | 'fancy' = 'basic';
