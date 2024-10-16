'use client';
import React from 'react';
import { FormControl, Stack, SelectProps } from '@chakra-ui/react';

import { Label, HelperText, SelectContainer } from '../..';

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
			gap={4}>
			<Stack
				spacing={2}
				w='full'>
				<Label>{label}</Label>
				<Stack
					spacing={1}
					w='full'>
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
				</Stack>
				{helper && <HelperText>{helper}</HelperText>}
			</Stack>
		</FormControl>
	);
};

export default ItemSelect;
