export const fields = [
	'icon',
	'name',
	'priority',
	'status',
	'shortDescription',
	'description',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Feature Details',
		fields: ['icon', 'name', ['priority', 'status'], 'shortDescription'],
	},
	{
		sectionTitle: 'Description',
		fields: ['description'],
	},
];

export const tableFields = ['name', 'priority', 'status', 'shortDescription'];
