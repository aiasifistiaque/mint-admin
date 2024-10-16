import { Schema } from '@/components/library';

const schema: Schema = {
	id: {
		label: 'Code',
		type: 'string',
		isRequired: true,
		sort: true,
		default: true,
		displayInTable: true,
	},
	name: {
		label: 'Name',
		type: 'string',
		isRequired: true,
		sort: true,
		default: true,
		displayInTable: true,
	},
	owner: {
		tableKey: 'owner.name',
		label: 'Owner',
		type: 'string',
		sort: true,
		default: true,
		displayInTable: true,
	},
	description: {
		label: 'Description',
		type: 'textarea',
	},
	template: {
		label: 'Template',
		type: 'text',
		displayInTable: true,
	},
	logo: {
		type: 'image',
		label: 'logo',
	},
	image: {
		type: 'image',
		label: 'Image',
	},
	coverImage: {
		type: 'image',
		label: 'Cover Image',
	},
	location: {
		type: 'string',
		label: 'Location',
	},
	address: {
		type: 'string',
		label: 'Address',
	},
	email: {
		type: 'string',
		isRequired: true,
		label: 'Email',
		displayInTable: true,
	},
	expire: {
		type: 'date',
		isRequired: true,
		label: 'Expire',
		// displayInTable: true,
	},
	trial: {
		type: 'tag',
		label: 'Trial',
		sort: true,
		isRequired: true,
		colorScheme: (data: any) => (data?.trial ? 'purple' : 'green'),
	},
	phone: {
		type: 'string',
		label: 'Phone',
		displayInTable: true,
	},
	package: {
		type: 'string',
		label: 'Package',
	},
	isDeleted: {
		type: 'tag',
		label: 'Deleted',
		sort: true,
		colorScheme: (data: any) => (data?.isDeleted ? 'red' : 'green'),
	},
	isActive: {
		type: 'tag',
		label: 'Active',
		sort: true,
		isRequired: true,
		displayInTable: true,
		colorScheme: (data: any) => (data?.isActive ? 'green' : 'red'),
	},
	createdAt: {
		type: 'date',
		label: 'Registered',
		sort: true,
		displayInTable: true,
		default: true,
	},
};

export default schema;
