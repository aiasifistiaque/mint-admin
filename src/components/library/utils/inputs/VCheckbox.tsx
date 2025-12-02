'use client';
import { FC } from 'react';
import { Checkbox, Flex } from '@chakra-ui/react';

import { Label, HelperText, FormControl } from '../..';

type InputContainerProps = {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value?: boolean | undefined;
	placeholder?: string;
	onChange?: any;
	name?: string;
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
			<Flex
				flexDir='column'
				gap={2}
				w='full'>
				<Label>{label}</Label>
				<Checkbox.Root
					size='lg'
					checked={value}
					// colorPalette='brand'
					onCheckedChange={details => {
						if (props.onChange) {
							const event = {
								target: {
									name: props.name,
									checked: details.checked,
								},
							} as any;
							props.onChange(event);
						}
					}}>
					<Checkbox.HiddenInput />
					<Checkbox.Control />
					<Checkbox.Label
						fontSize='18px'
						textTransform='capitalize'
						fontWeight='600'>
						{placeholder || label}
					</Checkbox.Label>
				</Checkbox.Root>
				{helper && <HelperText>{helper}</HelperText>}
			</Flex>
		</FormControl>
	);
};

export default VCheckbox;
