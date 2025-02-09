import React from 'react';
import { Select } from '@chakra-ui/react';
import { SelectChild } from '../../../types';

const SelectInput = ({ children, ...props }: SelectChild) => (
	<Select
		cursor='pointer'
		size='sm'
		_light={{
			bg: 'container.newLight',
		}}
		fontWeight='600'
		fontSize={12}
		borderRadius={4}
		{...props}>
		{children}
	</Select>
);

export default SelectInput;
