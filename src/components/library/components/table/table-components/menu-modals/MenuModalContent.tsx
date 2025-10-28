import { FC, ReactNode } from 'react';
import { useIsMobile } from '../../../..';
import { DrawerContent, DrawerContentProps, Dialog } from '@chakra-ui/react';

type Props = any &
	DrawerContentProps & {
		children: ReactNode;
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
		<Dialog.Content
			boxShadow='lg'
			borderRadius='2xl'
			bg='menu.light'
			_dark={{
				bg: 'menu.dark',
			}}
			{...props}>
			{children}
		</Dialog.Content>
	);
};

export default MenuModalContent;
