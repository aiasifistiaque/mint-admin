import React, { ReactNode } from 'react';
import { Column } from '@/components/library';
import { useColorModeValue } from '@chakra-ui/react';

const CartPriceContainer = ({ children }: { children: ReactNode }) => {
	const borderColor = useColorModeValue('stroke.deepL', 'stroke.deepD');
	return (
		<Column
			p={2}
			m={2}
			mt={0}
			border='1px dashed'
			borderRadius={8}
			bg='#f7f7f7'
			_dark={{
				bg: 'sidebar.dark',
			}}
			borderColor={borderColor}>
			{children}
		</Column>
	);
};

export default CartPriceContainer;
