import React, { FC } from 'react';
import { useIsMobile } from '../../../../';
import { DrawerBody, DrawerContentProps, ModalBody, ModalBodyProps } from '@chakra-ui/react';

type MenuModalBodyProps = ModalBodyProps &
	DrawerContentProps & {
		children: React.ReactNode;
	};

const MenuModalBody: FC<MenuModalBodyProps> = ({ children }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return <DrawerBody>{children}</DrawerBody>;
	}

	return <ModalBody>{children}</ModalBody>;
};

export default MenuModalBody;
