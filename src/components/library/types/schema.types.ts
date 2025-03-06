import { InputDataType, TableDataFieldType } from './data-types';

type CommonProps = {
	label: string;
	type: InputDataType;
	inputLabel?: string;
	isRequired?: boolean;
	sort?: boolean;
	tableType?: TableDataFieldType;
	imageKey?: string;
	default?: boolean;
	menuKey?: string;
	menuAddOnKey?: string;
	displayInTable?: boolean; // Display in table
	model?: string;
	dataModel?: any;
	viewType?: string;
	objectKey?: string;
	options?: { label: string; value: string }[];
	placeholder?: string;
	colorScheme?: any;
	renderCondition?: any; // Condition to render the field
	tableKey?: string; // Key for table if different from model key specially for nested objects
	viewKey?: string; // Key for view if different from model key specially for nested objects
	menuField?: string;
	limit?: number; // Limit for number of items in array
	copy?: boolean;
	helperText?: string; // Helper text for the input
	tooltip?: string; // Tooltip for the table
	modelAddOn?: string;

	section?: {
		title?: string;
		addBtnText?: string;
		btnText?: string;
		dataModel?: any;
		display?: {
			image?: string;
			title: string;
			description?: string;
		};
	};
	value?: any;
	getValue?: (doc: any) => any;
	fetch?: (data: any) => {
		path: string;
		fields: { key: string; as: string }[];
		id: any;
	};
	isExcluded?: boolean;
};

type Schema = {
	[key: string]: CommonProps;
};

export type SchemaType<T> = {
	[K in keyof T]: CommonProps;
};

export default Schema;
