'use client';

export { default as inputDataOptions } from './types/data-types/inputDataOptions';

//fundtions and hooks

export * from './hooks';
export * from './functions';

export * from './config';
export * as theme from './config';

export type ThemeProps = {
	TABLE: any;
	SIDEBAR: any;
};

//components
export * from './containers';

export * from './icon';

export * from './wrappers';

export * from './cms';

export * from './menu';
export * from './components';

export * from './nav';
export * from './utils/inputs';
export * from './utils/texts';

export * from './stat';

export * from './detail';
export { default as HeadingMenu } from './settings/heading-menu/HeadingMenu';

export { default as PageTable } from './pages/page-tables/PageTable';

export type * from './types';
export * from './utils/functions/handlers';

export * from './view';

export * from './components/table';

export * from './dynamic-filters/filters';

export { default as DynamicFilters } from './dynamic-filters/DynamicFilters';

export * from './create-page';
export * from './components/buttons';
export * from './modals';
export { Label, HelperText } from './form';
//export { OrderModal } from './pos';

export * from './store';
export * from './model';

export * from './model/types';
export * from './content';
export * from './components/skeleton';
export * from './page';
export * from './pos';
export * from './settings';

export * from './builder';

export * from './data';

export const alignmentOptions = [
	{
		label: 'Left',
		value: 'left',
	},
	{
		label: 'Center',
		value: 'center',
	},
	{
		label: 'Right',
		value: 'right',
	},
];

export const linkOptions = [
	{
		label: 'Page',
		value: 'page',
	},
	{
		label: 'Product',
		value: 'product',
	},
	{
		label: 'Category',
		value: 'category',
	},
	{
		label: 'Collection',
		value: 'collection',
	},
	{
		label: 'External Link',
		value: 'external',
	},
];

const BASE_LIMIT = 16;
export const SHOW_PER_PAGE_OPTIONS = [
	{ value: BASE_LIMIT, label: BASE_LIMIT },
	{ value: BASE_LIMIT * 2, label: BASE_LIMIT * 2 },
	{ value: 50, label: 50 },
	{ value: 100, label: 100 },
	{ value: 250, label: 250 },
	{ value: 999, label: 999 },
];

export type HomeContentProps = {
	content: any;
	dataModel: any;
	path: any;
	data?: any;
};

type LinkRenderType = {
	key: string;
	pages: { label: string; value: string }[];
	index?: number;
};

const getNestedValue = (obj: any, path: string) => {
	// Handle array notation by parsing the path properly
	const parts = path.match(/[^\[\].]+/g) || [];
	return parts.reduce((acc, part) => {
		return acc ? acc[part] : undefined;
	}, obj);
};

const createRenderCondition = (key: string, expectedType: string) => {
	return (data: any) => {
		// Handle both direct key and nested path scenarios
		const isNestedPath = key.includes('.');

		if (isNestedPath) {
			// For nested paths like 'discover.items[0]'
			const typeValue = getNestedValue(data, `${key}.type`);
			console.log('Path:', `${key}.type`, 'Type value:', typeValue, 'Data:', data);
			return typeValue === expectedType;
		} else {
			// For simple keys
			return data?.[key]?.type === expectedType;
		}
	};
};

export const linkRenderOptions = ({ key, pages, index }: LinkRenderType) => {
	return [
		{
			name: `${key}.type`,
			label: 'Link Type',
			type: 'nested-select',
			isRequired: true,
			options: linkOptions,
		},
		{
			name: `${key}.href`,
			label: 'Select Page',
			type: 'nested-select',
			options: pages,

			isRequired: true,
			renderCondition: createRenderCondition(key, 'page'),
			// renderCondition: (data: any) => {
			// 	return data[key]?.type === 'page';
			// },
		},
		{
			name: `${key}.href`,
			label: 'Select Product',
			type: 'nested-data-menu',
			model: 'products',
			isRequired: true,
			renderCondition: createRenderCondition(key, 'product'),
		},
		{
			name: `${key}.href`,
			label: 'Enter External Link [eg. https://google.com]',
			type: 'nested-string',
			isRequired: true,
			renderCondition: createRenderCondition(key, 'external'),
		},
		{
			name: `${key}.href`,
			label: 'Select Collection',
			type: 'nested-data-menu',
			model: 'collections',
			isRequired: true,

			renderCondition: createRenderCondition(key, 'collection'),
		},
		{
			name: `${key}.href`,
			label: 'Select Cateogry',
			type: 'nested-data-menu',
			model: 'categories',
			isRequired: true,
			renderCondition: createRenderCondition(key, 'category'),
		},
	];
};
