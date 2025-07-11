'use client';
import {
	Drawer,
	DrawerContent,
	DrawerContentProps,
	DrawerOverlay,
	DrawerProps,
	Modal,
	ModalContent,
	ModalContentProps,
	ModalOverlay,
	ModalProps,
} from '@chakra-ui/react';
import { radius, styles, useIsMobile } from '../../../..';
import { FC, ReactNode } from 'react';

const Dialog: FC<ModalProps & DrawerProps & { children: ReactNode }> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return (
			<Drawer
				placement='bottom'
				isFullHeight={false}
				closeOnOverlayClick={false}
				{...props}>
				<DrawerOverlay />

				<DrawerContent
					onClick={(e: any) => e.stopPropagation()}
					{...drawerContentCss}>
					{children}
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Modal
			isCentered
			closeOnOverlayClick={false}
			size='3xl'
			{...props}>
			<ModalOverlay
				_light={{
					bg: styles.color.MODAL_OVERLAY.LIGHT,
				}}
				_dark={{
					bg: styles.color.MODAL_OVERLAY.DARK,
				}}
			/>
			<ModalContent
				onClick={(e: any) => e.stopPropagation()}
				{...styles.MODAL}>
				{children}
			</ModalContent>
		</Modal>
	);
};

const drawerContentCss: DrawerContentProps = {
	overflowY: 'scroll',
	bg: 'container.newLight',
	_dark: {
		bg: 'menu.dark',
	},
	shadow: '2xl',
	w: '100%',
	maxH: '85vh',
	minH: '20vh',
	userSelect: 'none',
	borderTopRadius: '20px',
};

export default Dialog;
