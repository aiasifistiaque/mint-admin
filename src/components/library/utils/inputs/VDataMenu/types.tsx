import { InputProps } from '@chakra-ui/react';

export type VDataMenuProps = InputProps & {
	label: string;
	isRequired?: boolean;
	placeholder?: string;
	value: any;
	helper?: string;
	model: string;
	dataModel?: any;
	hideNew?: boolean;
	field?: string;
	type?: 'object' | 'value' | string;
	dataKey?: 'string';
	unselect?: boolean;
};
