import React from 'react';
import { MenuItem } from '../../..';
import { MenuItemProps, useColorModeValue } from '@chakra-ui/react';

/**
 *
 * This is the item of data Menu
 */

type ItemOfMenuProps = MenuItemProps & {
	children: React.ReactNode;
	id: string;
	filter?: string;
};

const WIDTH = { base: '300px', md: '360px' };
const MAX_H = '200px';

const ItemOfMenu: React.FC<ItemOfMenuProps> = ({ children, filter, id, ...props }) => {
	const hoverBg = useColorModeValue('hover.light', 'hover.dark');
	const itemBg = useColorModeValue('brand.500', 'brand.200');
	const itemColor = useColorModeValue('white', '#4a4a4a');

	const isActive = (id: string): boolean => {
		//return filters[filter] === id;
		return false;
	};

	return (
		<MenuItem
			py={{ base: 3, md: 2 }}
			w={WIDTH}
			_hover={{ bg: hoverBg }}
			bg={isActive(id) ? itemBg : 'transparent'}
			color={isActive(id) ? itemColor : 'inherit'}
			_dark={{
				bg: isActive(id) ? itemBg : 'transparent',
				color: isActive(id ? itemColor : 'inherit'),
				_hover: { bg: hoverBg },
			}}
			{...props}>
			{children}
		</MenuItem>
	);
};

export default ItemOfMenu;
