import React, { ReactNode } from 'react';
import { Text } from '@chakra-ui/react';

const FoodMenuDiscountText = ({
	children,
	show,
}: {
	children: ReactNode;
	show: boolean | undefined;
}) => {
	if (!show) return null;
	return (
		<Text
			lineHeight={1.2}
			fontFamily='Bebas neue'
			textDecorationLine='line-through'>
			BDT. {children}
		</Text>
	);
};

export default FoodMenuDiscountText;
