import { Column, sizes, THEME } from '../../../';
import { Stack, StackProps } from '@chakra-ui/react';
import React from 'react';

type SidebarContainerProps = StackProps & {
	children: React.ReactNode;
};

const SidebarContent: React.FC<SidebarContainerProps> = ({ children, ...props }) => {
	return (
		<Column
			flex={1}
			bg='sidebar.light'
			_dark={{ bg: 'sidebar.dark' }}
			borderTopRadius={{ base: '0', md: THEME == 'basic' ? 0 : 'xl' }}
			w='full'
			pl={sizes.SIDEBAR_PX}
			pt={1}
			mx={THEME == 'basic' ? 0 : '16px'}
			zIndex='9999'
			{...props}>
			{children}
		</Column>
	);
};

export default SidebarContent;
