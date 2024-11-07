import { Flex, FlexProps } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { sizes, shadow } from '../';

const ShadowContainer = ({ children, ...props }: FlexProps & { children?: ReactNode }) => {
	return (
		<Flex
			flexDir='column'
			boxShadow={shadow.CARD}
			bg='menu.light'
			_dark={{
				bg: 'menu.dark',
			}}
			borderRadius={sizes.RADIUS_MENU}
			gap={4}
			borderWidth={1}
			p={4}
			{...props}>
			{children}
		</Flex>
	);
};

export default ShadowContainer;
