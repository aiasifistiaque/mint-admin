import React, { FC } from 'react';
import { MenuButton, Button, MenuButtonProps, ButtonProps } from '@chakra-ui/react';
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
			{...btnStyle}
			color={value ? 'text.500' : 'gray.300'}
			{...(!isFont && { fontWeight: value ? '400' : '500' })}
			rightIcon={
				<Icon
					name='select'
					size={20}
				/>
			}
			{...props}>
			{children}
		</MenuButton>
	);
};

const btnStyle: ButtonProps = {
	variant: 'outline',
	colorScheme: 'gray',
	boxShadow: 'none',
	borderRadius: sizes.RADIUS_MENU,
	cursor: 'default',
	_active: {},
	_hover: {},
	h: '32px',
	textAlign: 'left',
	size: 'sm',
	fontSize: '.9rem',
	pl: 3,
	pr: 2,
	borderColor: 'selectBorder.light',
	_dark: {
		color: 'gray.300',
		borderColor: 'selectBorder.dark',
	},
};

export default DataMenuButton;
