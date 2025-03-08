export const fields = [
	'name',
	'component',
	'description',
	'type',
	'isRequired',
	'default',
	'typeValue',
	'condition',
	'createdAt',
];

export const tableFields = [
	'name',
	'component',
	'description',
	'type',
	'isRequired',
	'default',
	'typeValue',
	'condition',
];

export const formFields = [
	{
		sectionTitle: 'Prop Details',
		fields: ['component', 'name', 'description'],
	},
	{
		sectionTitle: 'Prop Fields',
		fields: ['type', ['isRequired', 'default']],
	},
	{
		sectionTitle: 'Type Value',
		description:
			'Enter the type value in JSON format, if type is object or contains multiple selectable values',
		fields: ['typeValue'],
	},
	{
		sectionTitle: 'Condition',
		description: 'Enter The condition for this prop, if it is required or has a default value',
		fields: ['condition'],
	},
];
