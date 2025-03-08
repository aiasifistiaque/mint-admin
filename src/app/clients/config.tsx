export const fields = [
	'name',
	'email',
	'phone',
	'address',
	'city',
	'country',
	'website',
	'industry',
	'contactPerson',
	'notes',
	'status',
	'createdAt',
];

export const tableFields = ['name', 'contactPerson', 'email', 'phone', 'city', 'country', 'status'];

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
