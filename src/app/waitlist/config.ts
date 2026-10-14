import { FormLayout } from '@/components/library';

export const fields = [
	'email',
	'name',
	'company',
	'role',
	'teamSize',
	'useCase',
	'status',
	'source',
	'approvedAt',
	'linkSentAt',
	'note',
	'createdAt',
];

export const formFields: FormLayout = [
	{
		sectionTitle: 'Person',
		fields: ['email', ['name', 'company'], ['role', 'teamSize'], 'useCase'],
	},
	{
		sectionTitle: 'Handling',
		description: 'Setting the status to Approved emails them a link to create their account.',
		fields: ['status', 'note'],
	},
];

export const tableFields = ['email', 'name', 'company', 'teamSize', 'status', 'linkSentAt', 'createdAt'];
