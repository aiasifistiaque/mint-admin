import React, { FC } from 'react';
import { useIsMobile, ModalHeader } from '../../../../';
import { DrawerHeader } from '@chakra-ui/react';

type MenuModalBodyProps = {
	children: React.ReactNode;
};

const MenuModalHeader: FC<MenuModalBodyProps> = ({ children }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return <DrawerHeader>{children}</DrawerHeader>;
	}

	return <ModalHeader>{children}</ModalHeader>;
};

export default MenuModalHeader;
