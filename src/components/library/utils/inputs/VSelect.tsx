'use client';
import { ReactNode, FC } from 'react';
import { SelectProps } from '@chakra-ui/react';
import { FormControl, SelectContainer } from '../..';

type InputContainerProps = SelectProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string | boolean | number;
	children: ReactNode;
	placeholder?: any;
	defaultDisabled?: boolean;
};

const VSelect: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	children,
	defaultDisabled,
	...props
}) => {
	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}>
			<SelectContainer
				value={value}
				{...props}>
				{defaultDisabled && (
					<option
						value=''
						disabled>
						{placeholder || `Select an option`}
					</option>
				)}
				{children}
			</SelectContainer>
		</FormControl>
	);
};

export default VSelect;
