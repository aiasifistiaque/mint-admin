'use client';
import React from 'react';
import { FormControl, Stack, useColorModeValue, Textarea, TextareaProps } from '@chakra-ui/react';

import { Label, HelperText } from '../..';

type InputContainerProps = TextareaProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	placeholder?: any;
};

const VTextarea: React.FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	...props
}) => {
	const borderColor = useColorModeValue('brand.500', 'brand.200');
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
					<Textarea
						minH='200px'
						size='sm'
						px={3}
						borderRadius='lg'
						focusBorderColor={borderColor}
						color='text.500'
						_dark={{
							color: 'gray.300',
						}}
						placeholder={placeholder ? placeholder : label}
						_placeholder={{ fontSize: 14, fontWeight: '500' }}
						value={value}
						{...props}
					/>

					{helper && <HelperText>{helper}</HelperText>}
				</Stack>
			</Stack>
		</FormControl>
	);
};

export default VTextarea;
