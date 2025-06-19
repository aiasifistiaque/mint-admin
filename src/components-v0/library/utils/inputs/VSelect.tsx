'use client';
import React from 'react';
import { SelectProps } from '@chakra-ui/react';
import { FormControl, SelectContainer } from '../..';

type InputContainerProps = SelectProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string | boolean | number;
	children: React.ReactNode;
	placeholder?: any;
};

const VSelect: React.FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	children,
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
				{children}
			</SelectContainer>
		</FormControl>
	);
};

export default VSelect;
