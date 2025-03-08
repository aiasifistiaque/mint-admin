export const fields = [
	'code',
	'name',
	'amount',
	'date',
	'category',
	'project',
	'details',
	'tags',
	'receipt',
	'note',
	'privacy',
	'addedBy',
	'access',
	'createdAt',
];

export const tableFields = [
	'code',
	'name',
	'amount',
	'date',
	'project',
	'category',
	'privacy',
	'addedBy',
];

export const formFields = [
	{
		sectionTitle: 'Expense Details',
		fields: ['name', ['amount', 'date'], 'category'],
	},
	{
		sectionTitle: 'Detailed Info',
		fields: ['project', 'receipt', 'details', 'tags'],
	},
	{
		sectionTitle: 'Manage Access',
		description: 'Who can access this document?',
		fields: ['privacy', 'access'],
	},
];
