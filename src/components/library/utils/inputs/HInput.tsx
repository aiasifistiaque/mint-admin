import React from 'react';
import { Input } from '@chakra-ui/react';
import { styles, HInputProps } from './util';

import { InputContainer } from '../../';

const HInput: React.FC<HInputProps> = ({ label, isRequired, placeholder, value, ...props }) => {
	return (
		<InputContainer
			label={label}
			isRequired={isRequired}>
			<Input
				sx={styles.input}
				placeholder={placeholder ? placeholder : label}
				value={value}
				{...props}
			/>
		</InputContainer>
	);
};

export default HInput;
