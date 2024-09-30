import { TableProps } from '@chakra-ui/react';

export type CustomTableProps = TableProps & {
	children: React.ReactNode;
	header?: React.ReactNode;
	data: any;
	isLoading: boolean;
	col?: number;
	filters?: string;
	preferences?: any;
	pagination?: boolean;
	path?: any;
	headers?: string[];
	hidePreferences?: boolean;
	selectable?: boolean;
	selectedItems?: any;
	isError?: boolean;
	search?: boolean;
	showFilters?: any;
	error?: any;
	table?: any;
	select?: {
		show: boolean;
		menu: any[];
	};
};
