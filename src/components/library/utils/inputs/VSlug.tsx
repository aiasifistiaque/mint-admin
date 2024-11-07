'use client';

import React, { FC } from 'react';
import { InputProps } from '@chakra-ui/react';
import { FormControl } from '../../';
import { Input } from './';

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
			label={label}
			helper={helper}>
			<Input
				placeholder={placeholder ? placeholder : label}
				value={value}
				onChange={handleChange}
				{...props}
			/>
		</FormControl>
	);
};

export default VSlug;
