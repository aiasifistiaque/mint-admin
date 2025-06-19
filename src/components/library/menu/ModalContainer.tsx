'use client';
import { FC, ReactNode } from 'react';
import {
	DrawerContent,
	DrawerContentProps,
	MenuListProps,
	ModalContent,
	ModalContentProps,
} from '@chakra-ui/react';
import { radius } from '../config';

type MenuContainerProps = ModalContentProps &
	DrawerContentProps &
	MenuListProps & {
		children: ReactNode;
		isSmallScreen?: boolean;
	};

const ModalContainer: FC<MenuContainerProps> = ({ children, isSmallScreen, ...props }) => {
	if (isSmallScreen)
		return (
			<DrawerContent
				borderTopRadius='2xl'
				h='85vh'
				bg='menu.light'
				_dark={{
					bg: 'menu.dark',
				}}
				{...props}>
				{children}
			</DrawerContent>
		);
	else
		return (
			<ModalContent
				boxShadow='lg'
				borderRadius={radius.MODAL}
				bg='background.light'
				_dark={{
					bg: 'menu.dark',
				}}
				{...props}>
				{children}
			</ModalContent>
		);
};

export default ModalContainer;
