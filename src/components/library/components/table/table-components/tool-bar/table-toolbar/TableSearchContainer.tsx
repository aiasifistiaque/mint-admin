import { FlexProps, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';

type TableSearchContainerProps = FlexProps & {
	children: React.ReactNode;
};

const TableSearchContainer: FC<TableSearchContainerProps> = ({ children, ...props }) => {
	return (
		<Flex
			w={{ base: '100%', md: 'auto' }}
			align='center'
			gap={1.4}
			{...props}>
			{children}
		</Flex>
	);
};

export default TableSearchContainer;
