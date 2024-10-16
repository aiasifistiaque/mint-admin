import React from 'react';
import {
	Menu,
	MenuButton,
	MenuGroup,
	IconButton,
	Tooltip,
	useColorModeValue,
} from '@chakra-ui/react';
import CustomMenuItem from './CustomMenuItem';
import MenuContainer from './MenuContainer';

import { Icon } from '..';

const CreateMenu = () => {
	const color = useColorModeValue('white', '#111');
	return (
		<Menu>
			<Tooltip
				placement='bottom'
				label='Create'
				borderRadius='md'>
				<MenuButton
					as={IconButton}
					size='xs'
					borderRadius='full'
					icon={
						<Icon
							name='add'
							size={20}
							color={color}
						/>
					}
				/>
			</Tooltip>

			<MenuContainer>
				<MenuGroup title='Create'>
					<CustomMenuItem href='/products/create'>Create Product</CustomMenuItem>
				</MenuGroup>
			</MenuContainer>
		</Menu>
	);
};

export default CreateMenu;
