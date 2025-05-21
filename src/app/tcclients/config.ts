export const fields = ['icon', 'name', 'url', 'description', 'priority', 'isActive', 'createdAt'];

export const formFields = [
	{
		sectionTitle: 'Client Details',
		fields: ['icon', 'name', ['priority', 'isActive'], 'url', 'description'],
	},
];

export const tableFields = ['name', 'priority', 'url', 'isActive', 'createdAt'];
