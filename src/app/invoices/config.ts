import { FormLayout } from '@/components/library';

export const fields = [
	'code',
	'name',
	'description',
	'items',
	'status',
	'client',
	'clientEmail',
	'clientPhone',
	'clientAddress',
	'project',
	'issueDate',
	'dueDate',
	'subTotal',
	'tax',
	'currency',
	'total',
	'access',
	'note',
	'addedBy',
	'createdAt',
];

export const tableFields = [
	'code',
	'name',
	'status',
	'currency',
	'total',
	'issueDate',
	'dueDate',
	'client',
	'project',
	'addedBy',
];

export const formFields: FormLayout = [
	{
		sectionTitle: 'Invoice Details',
		fields: ['name', 'status', ['issueDate', 'dueDate']],
	},
	{
		sectionTitle: 'Items',
		fields: ['description', 'items'],
	},
	// {
	// 	sectionTitle: 'Invoice Issue & Due',
	// 	description: 'Date of the invoice being issues and when the invpice is due',
	// 	fields: [['issueDate', 'dueDate']],
	// 	collapsible: true,
	// },
	{
		sectionTitle: 'Price & Total',
		fields: [['subTotal', 'tax'], 'currency', 'total'],
	},
	{
		sectionTitle: 'Client/Project',
		fields: [['client', 'project']],
	},
	{
		sectionTitle: 'For Internal Use',
		collapsible: true,
		fields: ['note', 'access'],
	},
];
