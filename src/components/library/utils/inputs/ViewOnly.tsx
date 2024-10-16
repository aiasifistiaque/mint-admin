'use client';
import React from 'react';
import { InputProps, FormControl, Stack, useColorModeValue, Text } from '@chakra-ui/react';

import { Label, HelperText } from '../..';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string;
	placeholder?: any;
};

const ViewOnly: React.FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	...props
}) => {
	const borderColor = useColorModeValue('brand.500', 'brand.200');

	return (
		<FormControl gap={4}>
			<Stack
				spacing={2}
				w='full'>
				<Label>{label}</Label>
				<Stack
					spacing={1}
					w='full'>
					<Text>{value || '...'}</Text>
					{helper && <HelperText>{helper}</HelperText>}
				</Stack>
			</Stack>
		</FormControl>
	);
};

export default ViewOnly;
