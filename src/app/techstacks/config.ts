export const fields = [
	'icon',
	'name',
	'shortDescription',
	'description',
	'priority',
	'status',
	'tags',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Tech Stack',
		fields: ['icon', 'name', ['priority', 'status'], 'shortDescription'],
	},
	{
		sectionTitle: 'Description',
		fields: ['description'],
	},
	{
		sectionTitle: 'Tags',
		fields: ['tags'],
	},
];

export const tableFields = ['name', 'priority', 'status', 'shortDescription'];
