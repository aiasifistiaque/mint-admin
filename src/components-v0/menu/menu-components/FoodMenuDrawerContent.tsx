import React, { ReactNode } from 'react';
import { DrawerContent } from '@chakra-ui/react';

const FoodMenuDrawerContent = ({ children }: { children: ReactNode }) => {
	return (
		<DrawerContent
			maxH='85vh'
			userSelect='none'
			bg='#f8f6f3'
			borderTopRadius='20px'>
			{children}
		</DrawerContent>
	);
};

export default FoodMenuDrawerContent;
