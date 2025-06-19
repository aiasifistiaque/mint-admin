import React from 'react';
import { MenuList, MenuListProps } from '@chakra-ui/react';

type MenuContainerProps = MenuListProps & {
	children: React.ReactNode;
};

const MenuContainer: React.FC<MenuContainerProps> = ({ children, ...props }) => {
	return (
		<MenuList
			boxShadow='lg'
			borderRadius='xl'
			bg='menu.light'
			// backdropFilter='blur(5px)'
			_dark={{
				bg: 'menu.dark',
			}}
			{...props}>
			{children}
		</MenuList>
	);
};

export default MenuContainer;
