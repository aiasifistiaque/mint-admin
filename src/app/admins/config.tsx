const fields = ['name', 'email', 'phone', 'role', 'isActive', 'github'];
const tableFields = ['name', 'email', 'phone', 'role', 'isActive', 'github'];

const formFields = [
	{
		sectionTitle: 'Basic Details',
		fields: ['name', ['email', 'phone'], ['password', 'role']],
	},
	{
		sectionTitle: 'Advanced Details',
		fields: ['github'],
	},
];

export { formFields, fields, tableFields };
