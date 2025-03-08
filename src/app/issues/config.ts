import { FormLayout } from '@/components/library';

export const fields = [
	'code',
	'name',
	'description',
	'status',
	'images',
	'attachment',
	'priority',
	'type',
	'project',
	'assignedTo',
	'assignees',
	'addedBy',
	'note',
	'dueDate',
	'isActive',
	'createdAt',
];

export const formFields: FormLayout = [
	{
		sectionTitle: 'Issue Details',
		fields: ['name', 'description', ['status', 'type'], ['project', 'priority']],
	},
	{
		sectionTitle: 'More Details',
		fields: ['assignedTo', 'assignees', 'dueDate', 'note', 'isActive'],
	},
	{
		sectionTitle: 'Add Issue Images & files',
		fields: ['images', 'attachment'],
	},
];

export const tableFields = [
	'code',
	'name',
	'status',
	'priority',
	'type',
	'project',
	'assignedTo',
	'addedBy',
	'note',
	'dueDate',
	'isActive',
	'createdAt',
];
