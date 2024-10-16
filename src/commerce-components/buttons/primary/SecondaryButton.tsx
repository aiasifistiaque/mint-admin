import React, { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { ButtonChild } from '../..';

const SecondaryButton: FC<ButtonChild> = ({ children, ...props }) => {
	return (
		<Button
			borderWidth={0.5}
			bg='white'
			borderColor='eblack.200'
			color='eblack.200'
			_dark={{ color: 'white', bg: 'eblack.200', borderColor: 'white' }}
			_hover={{
				borderColor: 'white',
				bg: 'eblack.200',
				color: 'white',
				_dark: { color: 'eblack.200', bg: 'white', borderColor: 'eblack.200' },
			}}
			{...props}>
			{children}
		</Button>
	);
};

export default SecondaryButton;
