import React, { FC } from 'react';
import { useIsMobile } from '../../../..';
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

const MenuModalContent: FC<Props> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return (
			<DrawerContent
				bg='menu.light'
				_dark={{
					bg: 'menu.dark',
				}}
				maxH='85vh'
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
			borderRadius='2xl'
			bg='menu.light'
			_dark={{
				bg: 'menu.dark',
			}}
			{...props}>
			{children}
		</ModalContent>
	);
};

export default MenuModalContent;
