export const fields = ['code', 'name', 'description', 'version', 'platform', 'createdAt'];

export const tableFields = ['code', 'name', 'description', 'version', 'platform'];

export const formFields = [
	{
		sectionTitle: 'Component Details',
		fields: ['name', ['platform', 'version']],
	},
	{
		sectionTitle: 'Description',
		fields: ['description'],
	},
];
