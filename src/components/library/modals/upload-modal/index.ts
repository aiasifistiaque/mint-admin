import { border } from '@chakra-ui/react';

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
		h: 'full',
		py: 0,
		flex: 1,
		px: 0,
	},
	tabsCss: {
		h: '63vh',
		colorScheme: 'brand',
		flex: 1,
	},
	tabPanelCss: {
		py: 4,
		h: 'full',
		overflowY: 'scroll',
		px: { base: 4, md: 6 },
	},
	modalContentCss: {
		borderRadius: '10px',
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

export { default as ImageComponent } from './ImageComponent';
export { default as MyFolders } from './MyFolders';
export { default as MyPhotos } from './MyPhotos';
export { default as UploadImage } from './UploadImage';
export { default as InsertUrl } from './InsertUrl';
export { default as MFooter } from './MFooter';
