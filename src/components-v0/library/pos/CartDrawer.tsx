'use client';
import React, { ReactNode } from 'react';
import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	useDisclosure,
} from '@chakra-ui/react';
import { IconButton } from '..';

const CartDrawer = ({ footer, cart }: { footer: ReactNode; cart: ReactNode }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<IconButton
				w='44px'
				h='44px'
				aria-label='Open Cart'
				iconName='cart'
				onClick={onOpen}>
				Open
			</IconButton>
			<Drawer
				isOpen={isOpen}
				placement='right'
				onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent
					bg='sidebar.light'
					_dark={{ bg: 'sidebar.dark' }}>
					<DrawerCloseButton />
					<DrawerHeader h='52px'>Cart</DrawerHeader>
					<DrawerBody p={0}>{cart}</DrawerBody>

					<DrawerFooter
						h='52px'
						p={0}>
						{footer}
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default CartDrawer;
