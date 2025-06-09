export const fields = [
	'pageSlug',
	'pageTitle',
	'visitDate',

	'locationCity',
	'locationCountry',

	'customRef',

	'deviceType',
	'deviceBrowser',
	'deviceOs',
	'deviceBrand',
	'deviceModel',

	'isBot',
	'botName',

	'locationIsp',

	'isUniqueVisitor',
	'isReturnVisitor',
	'visitCount',

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

	// 'createdAt',
	'visitDate',

	'customRef',

	'locationCity',
	'locationCountry',
	'deviceType',

	'deviceBrowser',

	'isUniqueVisitor',
	'isReturnVisitor',
	// 'visitCount',

	'ipAddress',

	'isBot',
	'botName',

	'pageUrl',

	'locationRegion',
	'locationRegionCode',
	'locationIsp',

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
