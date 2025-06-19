import { GridItem, GridItemProps } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

const ItemText = ({ children, ...props }: GridItemProps & { children: ReactNode }) => {
	return (
		<GridItem
			fontSize='.9rem'
			{...props}>
			{children}
		</GridItem>
	);
};

export default ItemText;
