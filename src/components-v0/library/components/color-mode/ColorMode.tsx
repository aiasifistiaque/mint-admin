'use client';

import { Center, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';

const ColorMode = ({ position, size }: { position?: 'navbar' | 'absolute'; size?: string }) => {
	const { colorMode, toggleColorMode } = useColorMode();

	const SIZE = size || '24px';

	const icon =
		colorMode === 'light' ? <IoMoonOutline size={SIZE} /> : <IoSunnyOutline size={SIZE} />;

	const style = position === 'navbar' ? styles.nav : styles.container;

	if (!position) return null;

	return (
		<Center
			sx={style}
			onClick={toggleColorMode}>
			{icon}
		</Center>
	);
};

const styles = {
	container: {
		zIndex: 999,
		h: '44px',
		w: '44px',
		bg: 'container.light',
		_dark: { bg: 'sidebar.dark' },
		position: 'fixed',
		cursor: 'pointer',
		borderLeftRadius: 2,
		right: 0,
		bottom: 14,
		boxShadow: 'lg',
	},
	nav: {
		h: '32px',
		w: '32px',
		cursor: 'pointer',
	},
};

export default ColorMode;
