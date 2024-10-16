import React from 'react';
import { useIsMobile } from '../../../..';
import { DrawerOverlay, ModalOverlay } from '@chakra-ui/react';

const MenuModalOverlay = () => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return <DrawerOverlay />;
	}

	return <ModalOverlay />;
};

export default MenuModalOverlay;
