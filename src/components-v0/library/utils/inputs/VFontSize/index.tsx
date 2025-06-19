'use client';

import React, { FC, useRef } from 'react';
import { InputGroup, Input, InputProps, Select, SelectProps } from '@chakra-ui/react';
import { FormControl } from '..';
import { Icon } from '../../..';

type InputContainerProps = InputProps &
	SelectProps & {
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
	const ref = useRef<HTMLInputElement>(null);
	const onRefClick = () => {
		ref.current?.click();
	};
	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}>
			<InputGroup {...inputGroupCss}>
				<Input
					onClick={onRefClick}
					{...inputCss}
					placeholder={placeholder ? placeholder : label}
					value={value}
					{...props}
				/>

				<Select
					icon={<Icon name='select' />}
					{...selectCss}
					ref={ref}
					isRequired={isRequired}
					value={value}
					{...props}>
					<option
						value=''
						disabled
						selected>
						{value}
					</option>
					{options.map((option: any, i: number) => (
						<option
							key={i}
							value={option}>
							{option}
						</option>
					))}
				</Select>
			</InputGroup>
		</FormControl>
	);
};

const inputGroupCss: any = {
	borderRadius: 'lg',
	size: 'sm',
};

const inputCss: InputProps = {
	px: 3,
	borderLeftRadius: 'lg',
	borderRightWidth: 0,
	focusBorderColor: 'container.borderLight',
};

const selectCss: SelectProps = {
	w: '40px',
	borderRadius: 'lg',
	borderLeftRadius: 0,
	focusBorderColor: 'container.borderLight',
};

//const options = [10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 32, 36, 40, 48, 64, 96, 128];

export default VFontSize;
