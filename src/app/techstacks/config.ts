export const fields = [
	'icon',
	'name',
	'shortDescription',
	'description',
	'priority',
	'isFeatured',
	'status',
	'tags',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Tech Stack',
		fields: ['icon', 'name', ['priority', 'status'], 'isFeatured', 'shortDescription'],
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

export const tableFields = ['name', 'priority', 'status', 'isFeatured', 'shortDescription'];
