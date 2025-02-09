import {
	DrawerProps,
	Modal,
	ModalProps,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	ModalOverlay,
	ModalContent,
	DrawerContentProps,
} from '@chakra-ui/react';
import React, { FC } from 'react';

import { radius, shadow, styles, useIsMobile } from '../../../..';

type MenuModalProps = ModalProps &
	DrawerProps & {
		children: React.ReactNode;
	};

const MenuModal: FC<MenuModalProps> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	const drawerStyleProps: any = styles.DRAWER;

	if (isMobile) {
		return (
			<Drawer
				isFullHeight={false}
				placement='bottom'
				{...props}>
				<DrawerOverlay />
				<DrawerContent {...drawerStyleProps}>{children}</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Modal
			isCentered
			{...props}>
			<ModalOverlay _light={{ bg: styles?.color?.MODAL_OVERLAY?.LIGHT }} />
			<ModalContent {...styles?.MODAL}>{children}</ModalContent>
		</Modal>
	);
};

export default MenuModal;
