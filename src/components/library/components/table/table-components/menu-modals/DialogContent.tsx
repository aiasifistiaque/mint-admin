'use client';

import React, { FC } from 'react';
import { useIsMobile, radius } from '../../../..';
import {
	DrawerContent,
	DrawerContentProps,
	ModalContent,
	ModalContentProps,
} from '@chakra-ui/react';

type Props = ModalContentProps &
	DrawerContentProps & {
		children: React.ReactNode;
	};

const DialogContent: FC<Props> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return (
			<DrawerContent
				bg='menu.light'
				_dark={{
					bg: 'menu.dark',
				}}
				w='100%'
				maxH='85vh'
				minH='20vh'
				userSelect='none'
				borderTopRadius='20px'
				{...props}>
				{children}
			</DrawerContent>
		);
	}

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

export default DialogContent;
