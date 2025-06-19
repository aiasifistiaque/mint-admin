import React from 'react';
import { Badge } from '@chakra-ui/react';

const FoodMenuBadge = ({ children }: { children: any }) => {
	return (
		<Badge
			size='md'
			bg='white'
			variant='subtle'>
			{children}
		</Badge>
	);
};

export default FoodMenuBadge;
