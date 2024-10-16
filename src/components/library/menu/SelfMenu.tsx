'use client';
import React from 'react';
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

import { useGetSelfQuery } from '@/store/services/authApi';

import { Icon, useAppDispatch, MenuContainer, THEME, logout } from '..';

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
				variant='ghost'
				size='md'
				borderRadius='full'
				icon={
					<Icon
						color={THEME == 'basic' ? 'inherit' : 'white'}
						name='settings'
						size={24}
					/>
				}
			/>

			<MenuContainer>
				<MenuGroup>
					<MenuItem
						alignItems='flex-start'
						flexDir='column'
						_hover={{ bg: 'transparent' }}
						bg='transparent'>
						<Heading
							size='sm'
							mb={2}>
							{data?.name}
						</Heading>
						<Tag>{data?.role?.name}</Tag>
					</MenuItem>
				</MenuGroup>
				<MenuDivider />
				<MenuGroup>
					<CustomMenuItem onClick={handleLogout}>Logout</CustomMenuItem>
				</MenuGroup>
			</MenuContainer>
		</Menu>
	);
};

export default SelfMenu;
