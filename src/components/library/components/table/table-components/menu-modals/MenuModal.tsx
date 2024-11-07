import {
	DrawerProps,
	Modal,
	ModalProps,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	ModalOverlay,
	ModalContent,
} from '@chakra-ui/react';
import React, { FC } from 'react';

import { useIsMobile } from '../../../../';

type MenuModalProps = ModalProps &
	DrawerProps & {
		children: React.ReactNode;
	};

const MenuModal: FC<MenuModalProps> = ({ children, ...props }) => {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<Drawer
				isFullHeight={false}
				placement='bottom'
				{...props}>
				<DrawerOverlay />
				<DrawerContent
					bg='menu.light'
					_dark={{
						bg: 'menu.dark',
					}}
					maxH='85vh'
					userSelect='none'
					borderTopRadius='20px'>
					{children}
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Modal {...props}>
			<ModalOverlay />
			<ModalContent
				boxShadow='lg'
				borderRadius='2xl'
				bg='menu.light'
				_dark={{
					bg: 'menu.dark',
				}}>
				{children}
			</ModalContent>
		</Modal>
	);
};

export default MenuModal;
