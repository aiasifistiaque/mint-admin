'use client';
import React from 'react';
import { FormControl, Stack, SelectProps } from '@chakra-ui/react';

import { Label, HelperText, SelectContainer } from '../..';

type InputContainerProps = SelectProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string | boolean;
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
						{children}
					</SelectContainer>
					{helper && <HelperText>{helper}</HelperText>}
				</Stack>
			</Stack>
		</FormControl>
	);
};

export default VSelect;
