import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';

const FilterSectionContainer = ({ children }: { children: ReactNode }) => {
	return (
		<Flex
			pb={2}
			gap={1}
			flexWrap='wrap'>
			{children}
		</Flex>
	);
};

export default FilterSectionContainer;
