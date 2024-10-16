'use client';
import React from 'react';
import { FormControl, Stack, Checkbox, CheckboxProps } from '@chakra-ui/react';

import { Label, HelperText } from '../..';

type InputContainerProps = CheckboxProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: boolean | undefined;
	placeholder?: string;
};

const VCheckbox: React.FC<InputContainerProps> = ({
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
			gap={4}>
			<Stack
				spacing={2}
				w='full'>
				<Label>{label}</Label>
				<Checkbox
					isChecked={value}
					colorScheme='brand'
					{...props}>
					{placeholder || label}
				</Checkbox>
				{helper && <HelperText>{helper}</HelperText>}
			</Stack>
		</FormControl>
	);
};

export default VCheckbox;
