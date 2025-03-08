export const fields = [
	'code',
	'name',
	'project',
	'client',
	'description',
	'startDate',
	'endDate',
	'status',
	'attachment',
	'priority',
	'privacy',
	'access',
	'addedBy',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Maintenance Details',
		fields: ['name', 'project', ['startDate', 'endDate']],
	},
	{
		sectionTitle: 'Details',
		fields: ['description'],
	},
	{
		sectionTitle: 'Status',
		fields: [['status', 'priority'], 'attachment'],
	},
	{
		sectionTitle: 'Access',
		fields: ['privacy', 'access'],
	},
];

export const tableFields = [
	'code',
	'name',
	'project',
	'client',
	'startDate',
	'endDate',
	'status',
	'priority',
	'privacy',
];
