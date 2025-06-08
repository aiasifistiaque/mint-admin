export const fields = [
	'pageSlug',
	'pageName',
	'createdAt',

	'locationCity',
	'locationCountry',
	'deviceType',
	'deviceBrowser',

	'visitDate',

	'isUniqueVisitor',
	'isReturnVisitor',
	'visitCount',

	'pageTitle',
	'pageUrl',

	'ipAddress',
	'locationRegion',
	'locationRegionCode',

	'userAgent',
	'locationTimezone',
	'locationLatitude',
	'locationLongitude',
];

export const tableFields = [
	'pageTitle',
	'pageSlug',
	'pageName',
	'createdAt',
	'visitDate',

	'locationCity',
	'locationCountry',
	'deviceType',

	'deviceBrowser',

	'isUniqueVisitor',
	'isReturnVisitor',
	// 'visitCount',

	'pageUrl',

	'ipAddress',
	'locationRegion',
	'locationRegionCode',

	'userAgent',
	'locationTimezone',
	'locationLatitude',
	'locationLongitude',
];

export const formFields = [
	{
		sectionTitle: 'Basic Details',
		fields: [
			['name', 'contactPerson'],
			['email', 'phone'],
			['industry', 'status'],
		],
	},
	{
		sectionTitle: 'Description',
		fields: ['description'],
	},
	{
		sectionTitle: 'Address',
		fields: ['address', ['city', 'country'], 'website'],
	},
];
