'use client';

import React, { FC, useEffect, useRef } from 'react';
import {
	InputProps,
	Flex,
	InputGroup,
	Input,
	InputRightElement,
	InputLeftElement,
} from '@chakra-ui/react';
import { FormControl } from '.';
import { Icon } from '../../icon';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string | undefined;
	placeholder?: any;
};

const VColor: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	...props
}) => {
	const [prevValue, setPrevValue] = React.useState(value);
	const onEyeClick = () => {
		if (value == 'transparent') {
			let changedValue;
			if (prevValue == 'transparent') {
				changedValue = '#000000';
			} else {
				changedValue = prevValue;
			}
			if (props.onChange) {
				const event = {
					target: {
						name: props.name,
						value: changedValue,
					},
				} as any;
				props.onChange(event);
			}
		} else {
			setPrevValue(value);
			if (props.onChange) {
				const event = {
					target: {
						name: props.name,
						value: 'transparent',
					},
				} as any;
				props.onChange(event);
			}
		}
	};

	useEffect(() => {
		if (value != 'transparent') {
			setPrevValue(value);
		}
	}, [value]);

	const ref = useRef<any>(null);

	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}>
			<InputGroup
				gap={2}
				{...inputGroupCss}>
				<InputLeftElement
					onClick={onEyeClick}
					cursor='pointer'>
					<Flex cursor='pointer'>
						<Icon
							name={value == 'transparent' ? 'eye-off' : 'eye'}
							size={20}
						/>
					</Flex>
				</InputLeftElement>
				<Input
					{...inputCss}
					placeholder={placeholder ? placeholder : label}
					value={value}
					{...props}
					type='text'
				/>
				<InputRightElement onClick={() => ref.current?.click()}>
					<Flex
						borderWidth={1}
						borderColor='container.borderLight'
						w='24px'
						h='24px'
						bgColor={value || 'transparent'}
						borderRadius='full'
					/>
				</InputRightElement>
			</InputGroup>
			<Flex
				w='95%'
				borderBottomRadius='lg'
				bg={'transparent'}
				mx='auto'
				justify='flex-end'>
				<Input
					borderColor='transparent'
					ref={ref}
					w='0px'
					h='0px'
					type='color'
					placeholder={placeholder ? placeholder : label}
					value={value}
					{...props}
				/>
			</Flex>
		</FormControl>
	);
};

const inputGroupCss: any = {
	borderRadius: 'lg',
	size: 'sm',
	borderColor: 'container.borderLight',
	borderWidth: 1,
	focusBorderColor: 'brand.500',
	_dark: {
		borderColor: 'brand.200',
	},
};

const inputCss: InputProps = {
	h: '32px',
	px: 3,
	borderLeftRadius: 'lg',
	borderColor: 'transparent',
};

export default VColor;
