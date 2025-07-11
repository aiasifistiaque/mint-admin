import { ReactNode } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { hasActiveFilters, formatFilterKeys } from '../../../../../functions';
import { useAppSelector } from '../../../../../hooks';

const FIlterContainer = ({ children }: { children: ReactNode }) => {
	const { filters } = useAppSelector((state: any) => state.table);

	return (
		<Flex
			flexDir='column'
			gap={2}>
			<Flex
				gap={2}
				align='center'>
				{children}
			</Flex>
			{hasActiveFilters(filters) && (
				<Text
					color='text.secondary.light'
					_dark={{ color: 'text.secondary.dark' }}
					fontSize='12px'
					fontWeight='600'>
					Active Filters: {formatFilterKeys(filters)}
				</Text>
			)}
		</Flex>
	);
};

export default FIlterContainer;
