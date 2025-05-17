export const fields = [
	'icon',
	'name',
	'priority',
	'status',
	'shortDescription',
	'description',
	'featureList',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Offer',
		fields: ['icon', 'name', ['priority', 'status'], 'shortDescription'],
	},
	{
		sectionTitle: 'Description',
		fields: ['description'],
	},
	{
		sectionTitle: 'Features',
		fields: ['featureList'],
	},
];

export const tableFields = ['name', 'priority', 'status', 'shortDescription'];
