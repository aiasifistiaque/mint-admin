import { FC, ReactNode } from 'react';
import { MenuList, MenuListProps } from '@chakra-ui/react';
import { radius } from '../config';

type MenuContainerProps = MenuListProps & {
	children: ReactNode;
};

const MenuContainer: FC<MenuContainerProps> = ({ children, ...props }) => {
	return (
		<MenuList
			boxShadow='md'
			p={1.5}
			gap={2}
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
