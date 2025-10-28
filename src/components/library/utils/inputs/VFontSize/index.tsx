'use client';

import { FC, useRef } from 'react';
import {
	NativeSelectRoot,
	NativeSelectField,
	Input,
	InputProps,
	Flex,
	Box,
} from '@chakra-ui/react';
import { FormControl } from '..';
import { Icon } from '../../..';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string | number | undefined;
	placeholder?: any;
	options: number[];
};

const VFontSize: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	options,
	...props
}) => {
	const ref = useRef<HTMLSelectElement>(null);
	const onRefClick = () => {
		ref.current?.click();
	};
	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}>
			<Flex {...inputGroupCss}>
				<Input
					onClick={onRefClick}
					{...inputCss}
					placeholder={placeholder ? placeholder : label}
					value={value}
					{...props}
				/>

				<NativeSelectRoot {...selectCss}>
					<NativeSelectField
						ref={ref}
						value={value}
						onChange={props.onChange as any}
						name={props.name}>
						<option
							value=''
							disabled>
							{value}
						</option>
						{options.map((option: any, i: number) => (
							<option
								key={i}
								value={option}>
								{option}
							</option>
						))}
					</NativeSelectField>
					<Box
						position='absolute'
						right={2}
						pointerEvents='none'>
						<Icon name='select' />
					</Box>
				</NativeSelectRoot>
			</Flex>
		</FormControl>
	);
};

const inputGroupCss: any = {
	borderRadius: 'lg',
	size: 'sm',
	alignItems: 'center',
};

const inputCss: any = {
	px: 3,
	borderLeftRadius: 'lg',
	borderRightWidth: 0,
};

const selectCss: any = {
	w: '40px',
	borderRadius: 'lg',
	borderLeftRadius: 0,
	position: 'relative',
};

//const options = [10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 32, 36, 40, 48, 64, 96, 128];

export default VFontSize;
