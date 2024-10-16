import { TextChild } from '../..';
import React, { FC } from 'react';
import { Text } from '@chakra-ui/react';

const SubHeading: FC<TextChild> = ({ children, ...props }) => {
	return (
		<Text
			color='etext.400'
			fontSize={{ base: '1.4rem', md: '1.4rem' }}
			{...props}>
			{children}
		</Text>
	);
};

export default SubHeading;
