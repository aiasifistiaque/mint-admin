import { FlexPropsType } from '@/types';
import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import { THEME } from '../';

const CreateBody: FC<FlexPropsType> = ({ children, ...props }) => {
	return (
		<Flex
			flexDir='column'
			w='100%'
			pt={10}
			minH='100vh'
			bg={THEME == 'basic' ? 'background.100' : 'background.light'}
			_dark={{ bg: 'sidebar.dark' }}
			px={6}
			justify='center'
			{...props}>
			{children}
		</Flex>
	);
};

export default CreateBody;
