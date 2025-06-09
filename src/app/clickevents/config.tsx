export const fields = [
	'elementName',
	'createdAt',
	'elementId',
	'elementSlug',
	'elementType',
	'pageSlug',
	'sessionId',
	'elementText',
	'elementHref',
	'clickType',
	'eventCategory',
	'eventName',

	'pageTitle',
	'ipAddress',
	'userAgent',
	'locationCity',
	'locationCountry',
	'locationRegion',
	'deviceType',
	'deviceBrand',
	'deviceModel',
	'deviceOs',
	'deviceBrowser',
	'locationCountryCode',
	'locationRegionCode',
	'locationTimeZone',
	'elementTag',

	'customref',

	'conversionType',
	'isBot',
	'botName',
	'tags',
];

export const tableFields = [
	'elementName',
	'createdAt',
	'elementId',
	'elementSlug',
	'elementType',
	'pageSlug',
	'sessionId',
	'elementText',
	'elementHref',
	'clickType',
	'eventCategory',
	'eventName',

	'pageTitle',
	'ipAddress',

	'locationCity',
	'locationCountry',
	'locationRegion',
	'deviceType',
	'deviceBrand',
	'deviceModel',

	'elementTag',

	'customref',

	'isBot',
	'botName',
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
