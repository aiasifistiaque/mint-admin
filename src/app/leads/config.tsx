export const tableFields = [
	'name',
	'email',
	'businessName',
	'phone',
	'status',
	'source',
	'category',
	'leadType',
	'facebook',
	'instagram',
	'websiteUrl',
	'priority',
	'city',
	'createdAt',
];

export const fields = [
	'name',
	'email',
	'phone',
	'status',
	'source',
	'requirements',
	'leadType',
	'priority',
	'category',
	'interestedIn',
	'estimatedBudget',
	'businessName',
	'businessAddress',
	'facebook',
	'instagram',
	'hasWebsite',
	'websiteUrl',
	'city',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Basic Information',
		fields: [
			['name', 'email', 'phone'],
			['businessName', 'businessAddress'],
			['city', 'status'],
			['source', 'leadType'],
			['category', 'priority'],
		],
	},
	{
		sectionTitle: 'Requirements',
		fields: ['requirements', 'interestedIn', 'estimatedBudget'],
	},
	{
		sectionTitle: 'Social Media',
		fields: ['facebook', 'instagram'],
	},
	{
		sectionTitle: 'Website',
		fields: ['hasWebsite', 'websiteUrl'],
	},
];
