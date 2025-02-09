import React, { FC, ReactNode } from 'react';
import { MenuItem, MenuItemProps } from '@chakra-ui/react';
import Link from 'next/link';

type CustomMenuItemProps = MenuItemProps & {
	children: ReactNode;
	href?: string;
};

const CustomMenuItem: FC<CustomMenuItemProps> = ({ children, href, ...props }) => {
	return (
		<MenuItem
			{...(href && { as: Link })}
			{...(href && { href })}
			borderBottomColor='border.light'
			borderBottomWidth={1}
			fontSize='sm'
			px={4}
			bg='inherit'
			color='text.selected'
			fontWeight='600'
			_hover={{
				bg: 'hover.light',
			}}
			_dark={{
				color: 'text.selectedDark',
				borderBottomColor: 'border.dark',
				bg: 'inherit',
				_hover: {
					bg: 'hover.dark',
				},
			}}
			_last={{
				borderBottomWidth: 0,
				borderBottomColor: 'transparent',
			}}
			{...props}>
			{children}
		</MenuItem>
	);
};

export default CustomMenuItem;
