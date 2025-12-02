'use client';
import { Menu, Heading, Tag, Center } from '@chakra-ui/react';

import CustomMenuItem from './CustomMenuItem';
import { MenuIconContainer, MenuContainer } from '.';
import { Icon } from '../icon';
import { useGetSelfQuery, logout } from '../store';
import { useAppDispatch } from '../hooks';
import { useColorMode } from '@/components/ui/color-mode';

const SelfMenu = ({ iconSize }: { iconSize?: number }) => {
	const { data } = useGetSelfQuery({});
	const dispatch = useAppDispatch();
	const { colorMode } = useColorMode();
	const handleLogout = () => {
		dispatch(logout());
	};
	const red = colorMode === 'light' ? 'red.500' : 'red.300';
	return (
		<Menu.Root>
			{/* <MenuButton as={MenuIconContainer}> */}
			<MenuIconContainer asChild>
				<Menu.Trigger>
					<Center>
						<Icon
							color='inherit'
							name='user-outline'
							size={iconSize || 16}
						/>
					</Center>
				</Menu.Trigger>
			</MenuIconContainer>
			{/* </MenuButton> */}

			<MenuContainer>
				<Menu.ItemGroup>
					<Menu.Item {...menuItemCss}>
						<Heading
							size='xs'
							mb={2}>
							{data?.name}
						</Heading>
						<Tag.Root size='sm'>
							<Tag.Label>Role: {data?.role?.name}</Tag.Label>
						</Tag.Root>
					</Menu.Item>
				</Menu.ItemGroup>
				<Menu.Separator />
				<CustomMenuItem
					icon='config'
					href='/settings'>
					Settings
				</CustomMenuItem>
				{/* <MenuDivider /> */}
				{/* <MenuGroup> */}
				<CustomMenuItem
					color={red}
					icon='logout'
					onClick={handleLogout}>
					Logout
				</CustomMenuItem>
				{/* </MenuGroup> */}
			</MenuContainer>
		</Menu.Root>
	);
};

const menuBtnCss: any = {
	variant: 'ghost',
	size: 'md',
	borderRadius: 'full',
	color: { base: 'navbar.text.light', _dark: 'navbar.text.dark' },
};

const menuItemCss: any = {
	px: 2,
	py: 1,
	alignItems: 'flex-start',
	flexDir: 'column',
	_hover: { bg: 'transparent' },
	bg: 'transparent',
};

export default SelfMenu;
