import React from 'react';
import { MenuList, MenuListProps } from '@chakra-ui/react';
import { useIsMobile } from '..';

type MenuContainerProps = MenuListProps & {
	children: React.ReactNode;
};

const MenuContainer: React.FC<MenuContainerProps> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	return (
		<MenuList
			boxShadow='lg'
			borderRadius='xl'
			bg='menu.light'
			_dark={{
				bg: 'menu.dark',
			}}
			{...props}>
			{children}
		</MenuList>
	);
};

export default MenuContainer;
