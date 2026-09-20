const fields = ['name', 'email', 'phone', 'role', 'isActive', 'invitationStatus', 'github'];
const tableFields = ['name', 'email', 'phone', 'role', 'invitationStatus', 'isActive', 'github'];

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
