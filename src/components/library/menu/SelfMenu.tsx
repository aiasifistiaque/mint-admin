'use client';
import {
	Menu,
	MenuButton,
	MenuGroup,
	Heading,
	Tag,
	MenuItem,
	MenuDivider,
	Center,
	useColorModeValue,
} from '@chakra-ui/react';
import CustomMenuItem from './CustomMenuItem';
import { MenuIconContainer } from '.';

import { Icon, useAppDispatch, MenuContainer, THEME, logout, useGetSelfQuery } from '..';

const SelfMenu = ({ iconSize }: { iconSize?: number }) => {
	const { data, isFetching, isError, error, isSuccess } = useGetSelfQuery({});
	const dispatch = useAppDispatch();
	const handleLogout = () => {
		dispatch(logout());
	};
	const red = useColorModeValue('red.500', 'red.300');
	return (
		<Menu>
			{/* <MenuButton as={MenuIconContainer}> */}
			<MenuIconContainer as={MenuButton}>
				<Center>
					<Icon
						color='inherit'
						name='user-outline'
						size={iconSize || 16}
					/>
				</Center>
			</MenuIconContainer>
			{/* </MenuButton> */}

			<MenuContainer>
				<MenuGroup>
					<MenuItem {...menuItemCss}>
						<Heading
							size='sm'
							mb={2}>
							{data?.name}
						</Heading>
						<Tag>{data?.role?.name}</Tag>
					</MenuItem>
				</MenuGroup>
				<MenuDivider />
				<CustomMenuItem
					icon='config'
					href='/settings'>
					Settings
				</CustomMenuItem>
				{/* <MenuDivider /> */}
				{/* <MenuGroup> */}
				<CustomMenuItem
					color={red}
					_dark={{ color: 'red.300' }}
					icon='logout'
					onClick={handleLogout}>
					Logout
				</CustomMenuItem>
				{/* </MenuGroup> */}
			</MenuContainer>
		</Menu>
	);
};

const menuBtnCss: any = {
	variant: 'ghost',
	size: 'md',
	borderRadius: 'full',
	color: 'navbar.text.light',
	_dark: {
		color: 'navbar.text.dark',
	},
};

const menuItemCss: any = {
	alignItems: 'flex-start',
	flexDir: 'column',
	_hover: { bg: 'transparent' },
	bg: 'transparent',
};

export default SelfMenu;
