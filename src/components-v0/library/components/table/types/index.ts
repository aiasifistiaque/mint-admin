import { TableCellProps } from '@chakra-ui/react';
import React from 'react';

export type TableItemProps = {
	title: string;
	sort?: string;
	dataKey?: any;
};

export type TableDataProps = TableCellProps & {
	children?: any;
	date?: boolean;
	price?: boolean;
	src?: string;
	type?: string;
};
