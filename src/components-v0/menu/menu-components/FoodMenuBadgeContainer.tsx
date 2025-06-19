import React, { ReactNode } from 'react';
import { Wrap } from '@chakra-ui/react';

const FoodMenuBadgeContainer = ({ children }: { children: ReactNode }) => {
	return (
		<Wrap
			gap={2}
			py={2}>
			{children}
		</Wrap>
	);
};

export default FoodMenuBadgeContainer;
