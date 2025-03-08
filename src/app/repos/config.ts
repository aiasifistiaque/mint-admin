export const fields = [
	'name',
	'project',
	'category',
	'status',
	'githubUrl',
	'devUrl',
	'liveUrl',
	'testUrl',
	'prodUrl',
	'domain',
];

export const tableFields = [
	'name',
	'project',
	'category',
	'status',
	'githubUrl',
	'devUrl',
	'liveUrl',
	'testUrl',
	'prodUrl',
	'domain',
];

export const formFields = [
	{
		sectionTitle: 'Basic Details',
		fields: [['name', 'project'], ['category', 'status'], ['projectType']],
	},
	{
		sectionTitle: 'Links',
		fields: [
			['githubUrl', 'devUrl'],
			['liveUrl', 'testUrl'],
			['prodUrl', 'domain'],
		],
	},
	{
		sectionTitle: 'Technologies',
		fields: ['libraries', 'frameworks', 'technologies'],
	},
];
