'use client';
import { FC } from 'react';
import { SelectProps } from '@chakra-ui/react';
import { FormControl, SelectContainer, useGetSelectDataQuery } from '../..';

type InputContainerProps = SelectProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: any;
	model: string;
	placeholder?: any;
	valueKey?: string;
	labelKey?: string;
};

const VDataSelect: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	model,
	valueKey = '_id',
	labelKey = 'name',
	...props
}) => {
	const { data } = useGetSelectDataQuery(model);
	const selectValue = typeof value === 'object' && value !== null ? value?._id : value;

	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}>
			<SelectContainer
				value={selectValue}
				{...props}>
				{data?.doc?.map((item: any, i: number) => (
					<option
						key={i}
						value={item?.[valueKey]}>
						{item?.[labelKey]}
					</option>
				))}
			</SelectContainer>
		</FormControl>
	);
};

export default VDataSelect;
