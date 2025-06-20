import { FC, ReactNode } from 'react';
import { Select, SelectProps } from '@chakra-ui/react';

import { Icon } from '../../..';

type FilterSelectProps = SelectProps & {
	children: ReactNode;
};

const FilterSelect: FC<FilterSelectProps> = ({ children, ...props }) => {
	return (
		<Select
			icon={<Icon name='select' />}
			size='xs'
			borderRadius='md'
			h={{ base: '42px', md: '28px' }}
			boxShadow='md'
			borderColor='selectBorder.light'
			_dark={{
				borderColor: 'selectBorder.dark',
			}}
			{...props}>
			{children}
		</Select>
	);
};

export default FilterSelect;
