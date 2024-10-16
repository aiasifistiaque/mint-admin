'use client';

import React, { FC } from 'react';
import { InputProps, FormControl, Stack } from '@chakra-ui/react';
import { Label, HelperText } from '../..';
import { Input } from '.';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string;
	placeholder?: any;
	onChange: any;
};

const VSlug: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	onChange,
	...props
}) => {
	const handleChange = (e: any) => {
		const lowerCaseValue = e.target.value.toLowerCase().replace(/\s/g, '-');
		onChange({
			target: {
				name: props.name,
				value: lowerCaseValue,
			},
		});
	};
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
					<Input
						placeholder={placeholder ? placeholder : label}
						value={value}
						onChange={handleChange}
						{...props}
					/>

					{helper && <HelperText>{helper}</HelperText>}
				</Stack>
			</Stack>
		</FormControl>
	);
};

export default VSlug;
