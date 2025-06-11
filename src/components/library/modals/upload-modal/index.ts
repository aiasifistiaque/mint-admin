export const styles: any = {
	container: {
		border: '1px solid red',
		h: '80vh',
		w: '1200px',
		position: 'fixed',
		left: '20',
		top: '20',
		bg: 'background.light',
		_dark: {
			bg: 'background.dark',
		},
		zIndex: '999',
	},
	panel: {
		flex: 1,
		h: 'full',
		px: 0,
	},
	tabsCss: {
		h: '60vh',
		colorScheme: 'brand',
		flex: 1,
	},
	tabPanelCss: {
		px: 0,
		h: 'full',
		overflowY: 'scroll',
	},
	modalContentCss: {
		bg: 'menu.light',
		_dark: {
			bg: 'menu.dark',
		},
	},
	cancelBtnCss: {
		colorScheme: 'gray',
		size: 'sm',
	},
};
