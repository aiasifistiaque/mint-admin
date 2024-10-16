'use client';
import React from 'react';
import { FormControl, Stack, SelectProps } from '@chakra-ui/react';
import { useGetSelectDataQuery } from '../..';

import { Label, SelectContainer, HelperText } from '../..';

type InputContainerProps = SelectProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: any;
	model: string;
	placeholder?: any;
};

const VDataSelect: React.FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	model,
	...props
}) => {
	const { data } = useGetSelectDataQuery(model);
	const selectValue = typeof value === 'object' && value !== null ? value?._id : value;

	return (
		<FormControl
			isRequired={isRequired}
			gap={4}>
			<Stack
				spacing={2}
				w='full'>
				<Label>{label}</Label>
				<Stack
					spacing={1}
					w='full'>
					<SelectContainer
						value={selectValue}
						{...props}>
						{data &&
							data?.doc?.map((item: any, i: number) => (
								<option
									key={i}
									value={item?._id}>
									{item?.name}
								</option>
							))}
					</SelectContainer>
				</Stack>
				{helper && <HelperText>{helper}</HelperText>}
			</Stack>
		</FormControl>
	);
};

export default VDataSelect;
