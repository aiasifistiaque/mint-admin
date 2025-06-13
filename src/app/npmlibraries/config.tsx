export const fields = [
	'name',
	'version',
	'type',
	'installCommand',
	'description',
	//
	'npmUrl',
	'githubUrl',
	'website',
	'demoUrl',
	'documentationUrl',
	//
	'weeklyDownloads',
	'packageSize',
	'author',
	'usageFrequency',
	'priorityLevel',
	'isDeprecated',

	'note',

	'expertise',
	'status',
	'alternates',
	'tags',
	'createdAt',
];

export const tableFields = [
	'name',
	'type',
	'installCommand',
	'npmUrl',
	'githubUrl',
	'website',
	'documentationUrl',
	'weeklyDownloads',
	'usageFrequency',
	'priorityLevel',
	'expertise',
	'status',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Package Information',
		fields: ['name', ['version', 'type'], 'installCommand', 'description'],
	},
	{
		sectionTitle: 'Links',
		fields: ['npmUrl', 'githubUrl', 'website', 'demoUrl', 'documentationUrl'],
	},
	{
		sectionTitle: 'Alternate Packages',
		fields: ['alternates'],
	},
	{
		sectionTitle: 'Statistics',
		fields: [
			['weeklyDownloads', 'packageSize'],
			['userFrequency', 'priorityLevel'],
			['expertise', 'status'],
			['isDeprecated', 'author'],
		],
	},
	{
		sectionTitle: 'Additional Information',
		fields: ['note', 'tags'],
	},
];
