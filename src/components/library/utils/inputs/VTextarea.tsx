'use client';
import React from 'react';
import { useColorModeValue, Textarea, TextareaProps } from '@chakra-ui/react';
import { FormControl } from '../..';

type InputContainerProps = TextareaProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	placeholder?: any;
};

const MIN_H = '200px';

const VTextarea: React.FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	...props
}) => {
	const borderColor = useColorModeValue('brand.500', 'brand.200');
	const color = useColorModeValue('text.500', 'gray,300');
	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}>
			<Textarea
				onKeyDown={e => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.stopPropagation();
					}
				}}
				minH={MIN_H}
				size='sm'
				px={3}
				borderRadius='lg'
				focusBorderColor={borderColor}
				color={color}
				placeholder={placeholder ? placeholder : label}
				_placeholder={{ fontSize: 14, fontWeight: '500' }}
				value={value}
				{...props}
			/>
		</FormControl>
	);
};

export default VTextarea;
