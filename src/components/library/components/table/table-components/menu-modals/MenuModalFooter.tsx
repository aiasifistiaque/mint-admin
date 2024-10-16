import React, { FC } from 'react';
import { useIsMobile, ModalFooter } from '../../../..';
import { DrawerFooter } from '@chakra-ui/react';

type MenuModalBodyProps = {
	children: React.ReactNode;
};

const MenuModalFooter: FC<MenuModalBodyProps> = ({ children }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return <DrawerFooter>{children}</DrawerFooter>;
	}

	return <ModalFooter>{children}</ModalFooter>;
};

export default MenuModalFooter;
