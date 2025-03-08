export const fields = ['name', 'description', 'priority', 'isActive', 'createdAt'];

export const tableFields = ['name', 'description', 'priority', 'isActive', 'createdAt'];

export const formFields = [
	{
		sectionTitle: 'Service Details',
		fields: ['name', 'description', ['priority', 'isActive']],
	},
];
