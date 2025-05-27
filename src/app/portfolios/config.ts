export const fields = [
	'image',
	'name',
	'category',
	'status',
	'liveUrl',
	'isVideoEnabled',
	'videoURL',
	'priority',
	'isFeatured',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Project Details',
		fields: [
			'image',

			'name',
			['category', 'status'],
			'priority',

			['liveUrl', 'showLiveUrl'],
			'isFeatured',
		],
	},
	{
		sectionTitle: 'Project Details: Video',
		fields: ['isVideoEnabled', 'videoURL', 'thumbnail'],
	},

	{
		sectionTitle: 'Project Images',
		fields: ['images'],
	},

	{
		sectionTitle: 'Project Card',
		fields: ['client', 'shortDescription', 'tags'],
	},
	{
		sectionTitle: 'Project Card Details',
		fields: ['shortDescription', 'tags'],
	},

	{
		sectionTitle: 'Project Details: SEO',
		fields: ['seoTitle', 'seoDescription', 'seoKeywords'],
	},
	{
		sectionTitle: 'Case Study',
		fields: ['coverImage', 'title', 'showCaseStudy', 'subTitle', 'overview'],
	},
	{
		sectionTitle: 'Case Study: Project Overview',
		fields: ['logo', 'client', ['duration', 'year'], 'productTitle', 'productDescription'],
	},
	{
		sectionTitle: 'Case Study: Project Images',
		fields: ['images'],
	},
	{
		sectionTitle: 'Company Details',
		fields: [
			'companyName',
			['companyCategory', 'companyUrl'],
			'companyTitle',
			'companyDescription',
		],
	},
	{
		sectionTitle: 'The Challenge',
		fields: ['challengeTitle', 'challengeDescription'],
	},
	{
		sectionTitle: 'The Solution',
		fields: ['solutionTitle', 'solutionDescription', 'solutionFeatures'],
	},
	{
		sectionTitle: 'Our Approach',
		fields: ['approachTitle', 'approachDescription'],
	},
	{
		sectionTitle: 'Tech Stack',
		fields: ['techStackTitle', 'techStackDescription', 'techStack'],
	},
	{
		sectionTitle: 'Client Review',
		fields: ['review'],
	},
];

export const tableFields = [
	'name',
	'category',
	'liveUrl',
	'isVideoEnabled',
	'status',
	'priority',
	'isFeatured',
];
