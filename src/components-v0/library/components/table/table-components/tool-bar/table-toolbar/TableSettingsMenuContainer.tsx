import { Flex } from '@chakra-ui/react';
import { SpaceBetween } from '../../../../..';
import React, { ReactNode } from 'react';

const TableSettingsMenuContainer = ({ children }: { children: ReactNode }) => {
	return (
		<SpaceBetween
			align='flex-start'
			border='1px solid transparent'>
			<Flex
				flexDir={{ base: 'column-reverse', lg: 'row' }}
				align='flex-start'
				gap={{ base: 4, md: 4 }}
				justify='space-between'
				w='100%'>
				{children}
			</Flex>
		</SpaceBetween>
	);
};

export default TableSettingsMenuContainer;
