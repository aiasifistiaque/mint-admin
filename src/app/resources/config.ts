export const fields = [
	'code',
	'name',
	'icon',
	'description',
	'category',
	'url',
	'type',
	'priority',
	'status',
	'attachment',
	'note',
	'tags',
	'isRecommended',
	'focus',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Resource Overview',
		fields: ['name', ['category', 'type'], 'url', 'description'],
	},
	{
		sectionTitle: 'Focus & Priority',
		fields: [['focus', 'priority'], 'status'],
	},
	{
		sectionTitle: 'Details',
		fields: [['icon', 'isRecommended'], 'attachment', 'note', 'tags'],
	},
];

export const tableFields = [
	'code',
	'name',
	'description',
	'category',
	'url',
	'type',
	'priority',
	'status',
	'isRecommended',
	'focus',
	'createdAt',
];
