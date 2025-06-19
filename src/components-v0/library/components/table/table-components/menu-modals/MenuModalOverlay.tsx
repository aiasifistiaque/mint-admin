import React from 'react';
import { styles, useIsMobile } from '../../../..';
import { DrawerOverlay, ModalOverlay } from '@chakra-ui/react';

const MenuModalOverlay = () => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return <DrawerOverlay />;
	}

	return (
		<ModalOverlay
			_light={{
				bg: styles.color.MODAL_OVERLAY.LIGHT,
			}}
		/>
	);
};

export default MenuModalOverlay;
