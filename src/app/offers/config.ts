export const fields = [
	'icon',
	'name',
	'priority',
	'category',
	'isFeatured',
	'status',
	'shortDescription',
	'description',
	'featureList',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Offer',
		fields: [
			'icon',
			'name',
			['category', 'isFeatured'],
			['priority', 'status'],
			'shortDescription',
		],
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

export const tableFields = ['name', 'priority', 'isFeatured', 'status', 'shortDescription'];
