import { Button, ButtonProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

type FilterButtonProps = ButtonProps & {
	children: ReactNode;
};

const FilterButton: FC<FilterButtonProps> = ({ children, ...props }) => {
	return (
		<Button
			h='30px'
			borderRadius='4px'
			size='sm'
			{...props}>
			{children}
		</Button>
	);
};

export default FilterButton;
