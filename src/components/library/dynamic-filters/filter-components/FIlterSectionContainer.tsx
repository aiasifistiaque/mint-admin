import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';

const FilterSectionContainer = ({ children }: { children: ReactNode }) => {
	return (
		<Flex
			gap={2}
			flexWrap='wrap'>
			{children}
		</Flex>
	);
};

export default FilterSectionContainer;
