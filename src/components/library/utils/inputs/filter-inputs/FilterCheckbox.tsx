import { FC, ReactNode } from 'react';
import { Checkbox } from '@chakra-ui/react';

type FilterCheckboxProps = {
	children: ReactNode;
	value?: string;
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	onChange?: (e: any) => void;
	[key: string]: any;
};

const FilterCheckbox: FC<FilterCheckboxProps> = ({ children, checked, ...props }) => {
	return (
		<Checkbox.Root
			colorPalette='gray'
			borderRadius='md'
			size={{ base: 'lg', md: 'sm' }}
			checked={checked}
			{...props}>
			<Checkbox.HiddenInput />
			<Checkbox.Control />
			<Checkbox.Label
				fontSize={{ base: '16px', md: '14px' }}
				textTransform='capitalize'>
				{children}
			</Checkbox.Label>
		</Checkbox.Root>
	);
};

export default FilterCheckbox;
