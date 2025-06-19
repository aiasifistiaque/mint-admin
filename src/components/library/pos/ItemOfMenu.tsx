import { FC, ReactNode } from 'react';

import { MenuItemProps, useColorModeValue } from '@chakra-ui/react';
import { useAppSelector, MenuItem } from '../';

const WIDTH = '300px';
const MAX_H = '300px';

type ItemOfMenuProps = MenuItemProps & {
	children: ReactNode;
	id: string;
	filter: string;
};

const ItemOfMenu: FC<ItemOfMenuProps> = ({ children, filter, id, ...props }) => {
	const { filters } = useAppSelector((state: any) => state.table);
	const hoverBg = useColorModeValue('hover.light', 'hover.dark');
	const itemBg = useColorModeValue('brand.500', 'brand.200');
	const itemColor = useColorModeValue('white', '#4a4a4a');

	const isActive = (id: string): boolean => {
		return filters[filter] === id;
	};

	const hoverStyle = (id: string): any => {
		if (isActive(id)) return {};
		return {
			bg: hoverBg,
		};
	};
	return (
		<MenuItem
			w={WIDTH}
			_hover={hoverStyle(id)}
			bg={isActive(id) ? itemBg : 'transparent'}
			color={isActive(id) ? itemColor : 'inherit'}
			_dark={{
				bg: isActive(id) ? itemBg : 'transparent',
				color: isActive(id ? itemColor : 'inherit'),
				_hover: hoverStyle(id),
			}}
			{...props}>
			{children}
		</MenuItem>
	);
};

export default ItemOfMenu;
