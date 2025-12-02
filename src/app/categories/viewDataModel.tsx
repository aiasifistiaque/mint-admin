import { ViewModalDataModelProps } from '@/components/library';

const data: ViewModalDataModelProps[] = [
	{
		title: 'Name',
		dataKey: 'name',
		type: 'string',
	},
	{
		title: 'Priority',
		dataKey: 'priority',
		type: 'string',
	},
	{
		title: 'Active',
		dataKey: 'isActive',
		type: 'tag',
		colorPalette: (isActive: boolean) => (isActive ? 'green' : 'red'),
	},
	{
		title: 'Created',
		dataKey: 'createdAt',
		type: 'date',
	},
];

export default data;
