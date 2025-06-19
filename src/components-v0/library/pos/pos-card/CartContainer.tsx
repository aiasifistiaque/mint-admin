import { FlexProps, useColorModeValue } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { Column } from '@/components/library';

const HEIGHT = 'calc(100vh - 52px)';

const CartContainer = ({ children, ...props }: FlexProps & { children: ReactNode }) => {
	const borderColor = useColorModeValue('stroke.deepL', 'stroke.deepD');
	return (
		<Column
			h={`calc(${HEIGHT} - 160px)`}
			overflowY='scroll'
			borderTopWidth={1}
			borderColor={borderColor}
			{...props}>
			{children}
		</Column>
	);
};

export default CartContainer;
