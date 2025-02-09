import React, { FC } from 'react';
import { MenuButton, Button, MenuButtonProps } from '@chakra-ui/react';
import { sizes, shadow, Icon } from '../../..';

type DataMenuButtonProps = MenuButtonProps & {
	value: string;
	isActive: boolean;
	children: any;
	isFont?: boolean;
};

const DataMenuButton: FC<DataMenuButtonProps> = ({
	children,
	value,
	isActive,
	isFont,
	...props
}) => {
	return (
		<MenuButton
			isActive={isActive}
			as={Button}
			variant='outline'
			colorScheme='gray'
			sx={styles.btn}
			color={value ? 'text.500' : 'gray.300'}
			{...(!isFont && { fontWeight: value ? '400' : '500' })}
			rightIcon={<Icon name='select' />}
			{...props}>
			{children}
		</MenuButton>
	);
};

const styles = {
	btn: {
		boxShadow: shadow.DASH,
		borderRadius: sizes.RADIUS_MENU,
		cursor: 'default',
		_active: {},
		_hover: {},
		h: '34px',
		textAlign: 'left',
		size: 'sm',
		fontSize: '.9rem',
		pl: 3.5,
		borderColor: 'selectBorder.light',
		_dark: {
			color: 'gray.300',
			borderColor: 'selectBorder.dark',
		},
	},
};

export default DataMenuButton;
