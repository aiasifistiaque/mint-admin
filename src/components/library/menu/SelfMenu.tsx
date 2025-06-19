'use client';
import {
	Menu,
	MenuButton,
	IconButton,
	MenuGroup,
	Heading,
	Tag,
	MenuItem,
	MenuDivider,
} from '@chakra-ui/react';
import CustomMenuItem from './CustomMenuItem';

import { Icon, useAppDispatch, MenuContainer, THEME, logout, useGetSelfQuery } from '..';

const SelfMenu = () => {
	const { data, isFetching, isError, error, isSuccess } = useGetSelfQuery({});
	const dispatch = useAppDispatch();
	const handleLogout = () => {
		dispatch(logout());
	};
	return (
		<Menu>
			<MenuButton
				as={IconButton}
				{...menuBtnCss}
				icon={
					<Icon
						color='inherit'
						name='settings'
						size={24}
					/>
				}
			/>

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
				<CustomMenuItem href='/settings'>Settings</CustomMenuItem>
				<MenuDivider />
				<MenuGroup>
					<CustomMenuItem onClick={handleLogout}>Logout</CustomMenuItem>
				</MenuGroup>
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
