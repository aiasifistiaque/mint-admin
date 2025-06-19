'use client';
import React from 'react';
import {
	Input,
	InputProps,
	FormControl,
	Stack,
	useColorModeValue,
	Text,
	FormLabel,
	Flex,
	Textarea,
	TextareaProps,
	TextProps,
	SelectProps,
	Select,
	Grid,
} from '@chakra-ui/react';
import { Price } from '..';

type InputContainerProps = InputProps &
	TextareaProps &
	TextProps &
	SelectProps & {
		label: string;
		isRequired?: boolean;
		helper?: string;
		value: any;
		valueType?: 'input' | 'textarea' | 'select' | 'text' | 'price';
		options?: any;
	};

const FONT_SIZE = '1rem';
const FONT_WEIGHT = '600';
const M = 0;

const PosInput: React.FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	valueType = 'input',
	options,
	...props
}) => {
	const borderColor = useColorModeValue('brand.500', 'brand.200');

	return (
		<FormControl
			isRequired={isRequired}
			gap={4}>
			<Grid
				gridTemplateColumns='1fr 1fr'
				gap={2}
				w='full'>
				<Flex align='center'>
					<FormLabel
						m='0'
						fontSize={FONT_SIZE}
						fontWeight={FONT_WEIGHT}>
						{label}
					</FormLabel>
				</Flex>

				<Stack
					spacing={1}
					w='full'>
					{valueType == 'text' ? (
						<Flex
							justify='space-between'
							w='full'
							align='center'
							justifyContent='flex-end'>
							<Text fontWeight='600'>{value}</Text>
						</Flex>
					) : valueType == 'price' ? (
						<Flex
							justify='space-between'
							w='full'
							align='center'
							justifyContent='flex-end'>
							<Text fontWeight='600'>
								<Price>{value}</Price>
							</Text>
						</Flex>
					) : valueType == 'textarea' ? (
						<Textarea
							height='200px'
							sx={styles.input}
							focusBorderColor={borderColor}
							placeholder={placeholder ? placeholder : label}
							value={value}
							{...props}
						/>
					) : valueType == 'select' ? (
						<Select
							sx={styles.input}
							focusBorderColor={borderColor}
							value={value}
							{...props}>
							{options.map((option: any) => (
								<option
									key={option}
									value={option}>
									{option}
								</option>
							))}
						</Select>
					) : (
						<Input
							sx={styles.input}
							focusBorderColor={borderColor}
							placeholder={placeholder ? placeholder : label}
							value={value}
							type='number'
							{...props}
						/>
					)}
				</Stack>
			</Grid>
		</FormControl>
	);
};

const styles = {
	input: {
		size: 'md',
		px: 3,
		borderRadius: 'sm',
		color: 'text.500',
		_dark: {
			color: 'gray.300',
		},
		_placeholder: { fontSize: 14, fontWeight: '500' },
	},
};

export default PosInput;
