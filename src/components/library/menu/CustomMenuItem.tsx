import { FC, ReactNode } from 'react';
import { MenuDivider, MenuItem, MenuItemProps, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { Icon, radius } from '..';

type CustomMenuItemProps = any & {
	children: ReactNode;
	href?: string;
	color?: string;
	icon?: string;
};

const CustomMenuItem: FC<CustomMenuItemProps> = ({ children, icon, href, ...props }) => {
	return (
		<>
			<MenuItem
				{...(href && { as: Link })}
				{...(href && { href })}
				borderBottomColor='border.light'
				// borderBottomWidth={1}
				borderRadius={radius?.MENU_INNER}
				fontSize='14px'
				px={2}
				bg='inherit'
				color='text.selected'
				fontWeight='500'
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
					borderBottomRadius: radius?.MENU,
				}}
				_hover={{
					bg: 'hover.light',
				}}
				{...props}>
				<Flex
					w='full'
					// justify='space-between'
					gap={2}
					align='center'>
					{icon && (
						<Icon
							name={icon}
							size={17}
							color={props.color || 'text.selected'}
						/>
					)}
					{children}
				</Flex>
			</MenuItem>
			<MenuDivider
				_last={{ display: 'none' }}
				m={1}
			/>
		</>
	);
};

export default CustomMenuItem;
