import { Flex, FlexProps } from '@chakra-ui/react';
import React, { FC } from 'react';

type FoodMenuTriggerProps = FlexProps & {
	children: React.ReactNode;
};

const FoodMenuTrigger: FC<FoodMenuTriggerProps> = ({ children, ...props }) => {
	return (
		<Flex
			flexDir='column'
			borderBottom='2px dotted #333'
			w='full'
			py={2}
			gap={2}
			{...props}>
			{children}
		</Flex>
	);
};

export default FoodMenuTrigger;
