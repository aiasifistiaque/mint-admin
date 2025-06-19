'use client';

import { FC } from 'react';
import { InputProps, FormControl, Stack, Text } from '@chakra-ui/react';
import { Label, HelperText } from '../..';
import { Input } from '.';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string | number | undefined;
	placeholder?: any;
};

const VReadOnly: FC<InputContainerProps> = ({
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

				<Stack
					spacing={1}
					w='full'
					px={3}>
					<Text>{value}</Text>

					{helper && <HelperText>{helper}</HelperText>}
				</Stack>
			</Stack>
		</FormControl>
	);
};

export default VReadOnly;
