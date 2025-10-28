'use client';

import { FC, ReactNode } from 'react';
import { useIsMobile, radius } from '../../../..';
import { Dialog, DrawerContent, DrawerContentProps } from '@chakra-ui/react';

type Props = any &
	DrawerContentProps & {
		children: ReactNode;
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
		<Dialog.Positioner>
			<Dialog.Content
				boxShadow='lg'
				borderRadius={radius.MODAL}
				bg='background.light'
				_dark={{
					bg: 'menu.dark',
				}}
				{...props}>
				{children}
			</Dialog.Content>
		</Dialog.Positioner>
	);
};

export default DialogContent;
