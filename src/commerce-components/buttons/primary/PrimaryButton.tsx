import React, { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { ButtonChild } from '../..';

const PrimaryButton: FC<ButtonChild> = ({ children, ...props }) => {
	return (
		<Button
			bg='eblack.200'
			borderColor='eblack.200'
			borderWidth={1}
			_dark={{ color: 'eblack.200', bg: 'white' }}
			_hover={{
				bg: 'white',
				color: 'eblack.200',
				_dark: { color: 'eblack.200' },
			}}
			{...props}>
			{children}
		</Button>
	);
};

export default PrimaryButton;
