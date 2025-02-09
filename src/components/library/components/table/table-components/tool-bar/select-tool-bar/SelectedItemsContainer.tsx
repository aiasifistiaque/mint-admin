import React, { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import { radius, shadow, SpaceBetween } from '../../../../..';

const SelectedItemsContainer = ({ children }: { children: ReactNode }) => {
	return (
		<Flex
			p={2}
			pb={0}
			px={0}
			w='full'
			py={2}>
			<SpaceBetween
				p={2}
				w='full'
				borderRadius={radius?.SELECT_CONTAINER}
				bg='container.newLight'
				border='1px solid'
				borderColor='container.borderLight'
				color='gray.600'
				fontWeight='600'
				boxShadow={shadow.DASH}
				_dark={{
					bg: 'sidebar.dark',
					borderColor: 'container.borderDark',
					color: 'gray.200',
				}}>
				{children}
			</SpaceBetween>
		</Flex>
	);
};

export default SelectedItemsContainer;
