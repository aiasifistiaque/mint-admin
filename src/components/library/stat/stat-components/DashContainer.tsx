import { Flex, FlexProps } from '@chakra-ui/react';
import React from 'react';
import { shadow, radius } from '../..';

const DashContainer = ({ children, ...props }: FlexProps & { children: React.ReactNode }) => {
	return (
		<Flex
			gap={2}
			flexDir='column'
			w='full'
			p={6}
			px={0}
			pb={0}
			bg='container.newLight'
			borderWidth={1}
			borderColor='container.borderLight'
			//boxShadow={shadow?.DASH}
			_dark={{
				bg: 'menu.dark',
				borderColor: 'container.borderDark',
			}}
			borderRadius={radius.CONTAINER}
			{...props}>
			{children}
		</Flex>
	);
};

export default DashContainer;
