export const fields = [
	'image',
	'name',
	'category',
	'status',
	'liveUrl',
	'priority',
	'isFeatured',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Project Details',
		fields: ['image', 'name', ['category', 'status'], 'liveUrl', 'priority', 'isFeatured'],
	},
];

export const tableFields = ['name', 'category', 'liveUrl', 'status', 'priority', 'isFeatured'];
