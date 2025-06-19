import { FC, ReactNode } from 'react';
import { Checkbox, CheckboxProps } from '@chakra-ui/react';

type FilterCheckboxProps = CheckboxProps & {
	children: ReactNode;
};

const FilterCheckbox: FC<FilterCheckboxProps> = ({ children, ...props }) => {
	return (
		<Checkbox
			borderRadius='md'
			size={{ base: 'lg', md: 'sm' }}
			iconSize={20}
			fontSize={{ base: '16px', md: '10px' }}
			colorScheme='brand'
			{...props}>
			{children}
		</Checkbox>
	);
};

export default FilterCheckbox;
