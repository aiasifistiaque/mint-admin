import React from 'react';
import { SelectProps } from '@chakra-ui/react';
import { FormControl, SelectContainer } from '../../';

type Option = {
	label: string;
	value: string;
};

type InputContainerProps = SelectProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string;
	options: Option[];
};

const ItemSelect: React.FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	options,
	...props
}) => {
	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}>
			<SelectContainer
				value={value}
				{...props}>
				{options?.map((item: Option, i: number) => (
					<option
						key={i}
						value={item?.value}>
						{item?.label}
					</option>
				))}
			</SelectContainer>
		</FormControl>
	);
};

export default ItemSelect;
