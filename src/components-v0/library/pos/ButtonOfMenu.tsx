import React, { FC } from 'react';
import { Button, MenuButton, MenuButtonProps } from '@chakra-ui/react';
import { Icon } from '@/components/library';

type ButtonOfMenuProps = MenuButtonProps & {
	children?: any;
	isActive: boolean;
};

const WIDTH = '300px';

const ButtonOfMenu: FC<ButtonOfMenuProps> = ({ children, isActive, ...props }) => {
	return (
		<MenuButton
			isActive={isActive}
			w={WIDTH}
			textAlign='left'
			as={Button}
			borderRadius='lg'
			colorScheme='gray'
			placeholder={children}
			variant='outline'
			rightIcon={<Icon name='select' />}
			{...props}>
			{children}
		</MenuButton>
	);
};

export default ButtonOfMenu;
