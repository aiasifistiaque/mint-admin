'use client';

import React, { FC } from 'react';
import { InputProps } from '@chakra-ui/react';
import { FormControl, Input } from './';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string | number | undefined;
	placeholder?: any;
};

const VInput: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	...props
}) => {
	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}>
			<Input
				size='sm'
				px={3}
				placeholder={placeholder ? placeholder : label}
				value={value}
				{...props}
			/>
		</FormControl>
	);
};

export default VInput;
