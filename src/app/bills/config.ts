export const tableFields = [
	'code',
	'name',
	'currency',
	'amount',
	'status',
	'dueDate',
	'dueIn',
	'overDuration',
	'refNo',
	'billDate',
	'paidAt',
	'category',
	'createdAt',
	'privacy',
];

export const fields = [
	'code',
	'name',
	'currency',
	'amount',
	'status',
	'details',
	'refNo',
	'dueDate',
	'billDate',
	'paidAt',
	'category',
	'receipt',
	'tags',
	'note',
	'createdAt',
	'privacy',
	'addedBy',
	'access',
];

export const formFields = [
	{
		sectionTitle: 'Bill Overview',
		fields: ['name', ['currency', 'amount'], ['dueDate', 'status'], 'details'],
	},
	{
		sectionTitle: 'Bill Details',
		fields: [['refNo', 'billDate'], 'receipt', 'paidAt'],
	},
	{
		sectionTitle: 'For Official Use',
		fields: ['category', 'tags', 'note'],
	},
	{
		sectionTitle: 'Manage Access',
		description: 'Who can access this document?',
		fields: ['privacy', 'access'],
	},
];
