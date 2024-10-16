import { FlexChild, Title } from '../../..';
import React, { FC } from 'react';
import { Center } from '@chakra-ui/react';

const Logo: FC<FlexChild> = ({ children, ...props }) => {
	return (
		<Center {...props}>
			<Title
				fontSize='2rem'
				letterSpacing={-0.75}>
				{children}
			</Title>
		</Center>
	);
};

export default Logo;
