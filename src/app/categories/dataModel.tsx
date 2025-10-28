import { TableObjectProps } from '@/components/library';
import viewDataModel from './viewDataModel';
// import editModel from './create/dataModel';

const editModel: any = [
	{
		sectionTitle: 'Details',
		name: 'name',
		label: 'Category Name',
		isRequired: true,
		type: 'text',
	},
	{
		name: 'description',
		label: 'Description',
		isRequired: false,
		type: 'textarea',
	},
	{
		name: 'priority',
		label: 'Priority',
		isRequired: false,
		type: 'number',
	},
	{
		name: 'isActive',
		label: 'Is Active',
		isRequired: false,
		type: 'checkbox',
		endOfSection: true,
	},
];

const data: TableObjectProps = {
	title: 'Categories',
	path: 'categories',
	isModal: true,
	createModel: editModel,
	export: true,

	select: {
		show: true,
		menu: [
			{
				title: 'Mark as featured',
				type: 'edit',
				key: 'isFeatured',
				value: true,
				prompt: {
					title: 'Mark as featured',
					body: 'Are you sure you want to mark these items as featured?',
				},
			},
			{
				title: 'Un-feature selected',
				type: 'edit',
				key: 'isFeatured',
				value: false,
				prompt: {
					title: 'Un-feature selected',
					body: 'Are you sure you want to un-feature these items?',
				},
			},
		],
	},

	button: {
		title: 'Add Category',
		path: '/categories/create',
	},
	menu: [
		{
			title: 'Edit',
			type: 'edit-modal',
			dataModel: editModel,
		},
		{
			title: 'View',
			type: 'view-modal',
			dataModel: viewDataModel,
		},
	],

	data: [
		{
			title: 'Name',
			dataKey: 'name',
			sort: 'name',
			default: true,
		},
		{ title: 'Priority', dataKey: 'priority', sort: 'priority', default: true, editable: true },

		{
			title: 'isActive',
			dataKey: 'isActive',
			type: 'tag',
			sort: 'isActive',
			default: true,
			colorPalette: (data: boolean) => (data ? 'green' : 'red'),
		},
		{
			title: 'Featured',
			dataKey: 'isFeatured',
			type: 'tag',
			sort: 'isFeatured',
			default: true,
			colorPalette: (data: boolean) => (data ? 'green' : 'red'),
		},
		{ title: 'Created', dataKey: 'createdAt', type: 'date', sort: 'createdAt' },
		{ title: '...', type: 'menu' },
	],
};

export default data;
