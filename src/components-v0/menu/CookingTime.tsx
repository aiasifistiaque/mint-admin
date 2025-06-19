import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { Icon } from '@/components/library';
const CookingTime = ({ children }: { children: number }) => {
	if (!children || children === 0) return null;
	return (
		<Flex
			mt={-1}
			gap={1}
			align='center'>
			<Icon
				size={12}
				name='clock-outline'
				color='#888'
			/>
			<Text
				color='#888'
				fontSize='12px'>
				<i>{children} mins</i>
			</Text>
		</Flex>
	);
};

export default CookingTime;
