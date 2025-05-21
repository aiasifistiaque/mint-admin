export const fields = [
	'icon',
	'name',
	'shortDescription',
	'status',
	'category',
	'toStaticPage',
	'staticPageUrl',
	'priority',
	'isFeatured',
	'coverImage',
	'title',
	'subtitle',
	'description',
	'businessNeedsTitle',
	'businessNeedsDescription',
	'whyDigitalTitle',
	'whyDigitalDescription',
	'offersTitle',
	'offersDescription',
	'offers',
	'featureTitle',
	'featureDescription',
	'features',
	'benifitTitle',
	'benifitDescription',
	'benifits',
	'ctaTitle',
	'ctaDescription',
	'ctaButtonText',
	'ctaButtonLink',
	'metaImage',
	'metaTitle',
	'metaDescription',
	'metaSlug',
];

export const formFields = [
	{
		sectionTitle: 'Card Information',
		fields: [
			'icon',
			'name',
			['priority', 'status'],
			['category', 'isFeatured'],
			'shortDescription',
		],
	},
	{
		sectionTitle: 'Should it lead to a static page?',
		fields: ['toStaticPage', 'staticPageUrl'],
	},
	{
		sectionTitle: 'Hero Section',
		fields: ['coverImage', 'title', 'subtitle', 'description'],
	},
	{
		sectionTitle: 'Business Needs',
		fields: ['businessNeedsTitle', 'businessNeedsDescription'],
	},
	{
		sectionTitle: 'Why Digital?',
		fields: ['whyDigitalTitle', 'whyDigitalDescription'],
	},
	{
		sectionTitle: 'Offers',
		fields: ['offersTitle', 'offersDescription', 'offers'],
	},
	{
		sectionTitle: 'Features',
		fields: ['featureTitle', 'featureDescription', 'features'],
	},
	{
		sectionTitle: 'Benefits',
		fields: ['benifitTitle', 'benifitDescription', 'benifits'],
	},
	{
		sectionTitle: 'Call to Action',
		fields: ['ctaTitle', 'ctaDescription', ['ctaButtonText', 'ctaButtonLink']],
	},
	{
		sectionTitle: 'SEO Information',
		fields: ['metaImage', 'metaTitle', 'metaDescription', 'metaSlug'],
	},
];

export const tableFields = [
	'icon',
	'name',
	'shortDescription',
	'status',
	'isFeatured',
	'toStaticPage',
	'staticPageUrl',
	'priority',
];
