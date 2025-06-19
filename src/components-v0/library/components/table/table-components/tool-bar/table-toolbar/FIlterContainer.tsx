import React, { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';

const FIlterContainer = ({ children }: { children: ReactNode }) => {
	return (
		<Flex
			gap={2}
			align='center'>
			{children}
		</Flex>
	);
};

export default FIlterContainer;
