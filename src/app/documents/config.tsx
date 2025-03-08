export const fields = [
	'code',
	'name',
	'client',
	'docUrl',
	'fileUrl',
	'direction',
	'category',
	'project',
	'privacy',
	'access',
	'addedBy',
	'createdAt',
];

export const tableFields = [
	'code',
	'name',
	'client',
	'docUrl',
	'fileUrl',
	'direction',
	'category',
	'project',
	'privacy',
	'addedBy',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'File Details',
		fields: [['name'], ['client', 'project'], ['direction', 'category']],
	},
	{
		sectionTitle: 'URLs',
		fields: ['fileUrl', 'docUrl'],
	},
	{
		sectionTitle: 'Manage Access',
		description: 'Who can access this document?',
		fields: ['privacy', 'access'],
	},
];
