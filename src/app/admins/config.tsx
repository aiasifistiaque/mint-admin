const fields = ['name', 'email', 'phone', 'role', 'isActive', 'invitationStatus', 'github'];
const tableFields = ['name', 'email', 'phone', 'role', 'invitationStatus', 'isActive', 'github'];

const formFields = [
	{
		sectionTitle: 'Admin Access',
		fields: ['role', 'isActive'],
	},
];

export { formFields, fields, tableFields };
