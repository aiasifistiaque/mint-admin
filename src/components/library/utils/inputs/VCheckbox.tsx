'use client';
import { FC } from 'react';
import { FormControl, Stack, Checkbox, CheckboxProps } from '@chakra-ui/react';

import { Label, HelperText } from '../..';

type InputContainerProps = CheckboxProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value?: boolean | undefined;
	placeholder?: string;
};

const VCheckbox: FC<InputContainerProps> = ({
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
					size='lg'
					fontSize='18px'
					textTransform='capitalize'
					fontWeight='600'
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
