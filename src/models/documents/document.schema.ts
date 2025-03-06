import { SchemaType, SchemaProps } from '@/components/library';

type DocumentBaseType = {
	createdAt?: Date;
	updatedAt?: Date;
};

type Type = DocumentBaseType & {
	name: string;
	client: string;
	docUrl: string;
	fileUrl: string;
	category: string;
	direction: 'inbound' | 'outbound' | 'internal' | 'other';
	tags?: string[];
	project: string;
	addedBy: string;
	access: any;
	privacy: 'public' | 'private' | 'only-me';
};

const documentSchema: SchemaType<Type> = {
	name: {
		label: 'Name',
		type: 'string',
		isRequired: true,
		default: true,
		displayInTable: true,
		sort: true,
	},
	client: {
		label: 'Client',
		type: 'data-menu',
		default: true,
		displayInTable: true,
		tableType: 'text',
		tableKey: 'client.name',
		sort: true,
		model: 'clients',
	},
	docUrl: {
		label: 'Document URL',
		type: 'string',
		default: true,
		displayInTable: true,
		viewType: 'external-link',
		tableType: 'external-link',
	},
	fileUrl: {
		label: 'File',
		type: 'file',
		default: true,
		displayInTable: true,
	},
	category: {
		label: 'Category',
		type: 'string',
		isRequired: true,
		displayInTable: true,
		sort: true,
		default: true,
	},
	direction: {
		label: 'Type',
		type: 'select',
		displayInTable: true,
		sort: true,
		options: [
			{ label: 'Inbound', value: 'inbound' },
			{ label: 'Outbound', value: 'outbound' },
			{ label: 'Internal', value: 'internal' },
			{ label: 'Other', value: 'other' },
		],
		helperText: 'Select the type of the document',
	},
	project: {
		label: 'Project',
		type: 'data-menu',
		default: true,
		displayInTable: true,
		tableType: 'text',
		tableKey: 'project.name',
		sort: true,
		model: 'projects',
		tooltip: 'The project this document is related to',
	},
	access: {
		label: 'Access',
		type: 'data-tag',
		viewType: 'data-tag-array',
		model: 'admins',
		modelAddOn: 'email',
		// menuKey: 'email',
		// menuAddOnKey: 'name',
		tooltip: 'Users who can access this document',
	},
	privacy: {
		label: 'Privacy',
		type: 'select',
		displayInTable: true,
		default: true,
		isRequired: true,
		sort: true,
		options: [
			{
				label: 'Public',
				value: 'public',
			},
			{
				label: 'Private',
				value: 'private',
			},
			{
				label: 'Only Me',
				value: 'only-me',
			},
		],
	},
	addedBy: {
		label: 'Added By',
		type: 'string',
		displayInTable: true,
		tableKey: 'addedBy.name',
		sort: true,
	},
	createdAt: { label: 'Created At', type: 'date', displayInTable: true, sort: true },
};

export default documentSchema;
