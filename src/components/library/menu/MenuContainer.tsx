import { FC, ReactNode } from 'react';
import { MenuList, MenuListProps } from '@chakra-ui/react';
import { radius } from '../config';

type MenuContainerProps = MenuListProps & {
	children: ReactNode;
};

const MenuContainer: FC<MenuContainerProps> = ({ children, ...props }) => {
	return (
		<MenuList
			boxShadow='xl'
			borderRadius={radius?.MENU}
			bg='menu.light'
			borderColor='container.borderLight'
			_dark={{
				bg: 'menu.dark',
				borderColor: 'container.borderDark',
			}}
			{...props}>
			{children}
		</MenuList>
	);
};

export default MenuContainer;
