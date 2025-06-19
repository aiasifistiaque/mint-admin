'use client';
import React from 'react';
import { FormControl, Switch, SwitchProps } from '@chakra-ui/react';

import { Label } from '../..';

type InputContainerProps = SwitchProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value?: boolean | undefined;
	placeholder?: any;
};

const VSwitch: React.FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	...props
}) => {
	return (
		<FormControl
			display='flex'
			gap={4}
			alignItems='center'
			isRequired={isRequired}>
			<Label htmlFor='email-alerts'>{label}</Label>
			<Switch
				isChecked={value}
				id='email-alerts'
				colorScheme='brand'
				{...props}
			/>
		</FormControl>
	);
};

export default VSwitch;
