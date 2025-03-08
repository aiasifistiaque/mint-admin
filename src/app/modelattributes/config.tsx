export const fields = [
	'name',
	'model',
	'project',
	'description',
	'type',
	'required',
	'default',
	'ref',
	'enum',
	'trim',
	'lowercase',
	'unique',
	'match',
	'isImmutable',
	'note',
	'createdAt',
];
export const tableFields = [
	'name',
	'model',
	'project',
	'description',
	'type',
	'required',
	'default',
	'ref',
	'enum',
	'trim',
	'lowercase',
	'unique',
	'match',
	'isImmutable',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Field Overview',
		fields: [['project', 'model'], 'name', 'description'],
	},
	{
		sectionTitle: 'Field Attributes',
		fields: [
			['type', 'ref'],
			'enum',
			['required', 'default'],
			['trim', 'lowercase'],
			['unique', 'isImmutable'],
			'match',
		],
	},
	{
		sectionTitle: 'Note',
		fields: ['note'],
	},
];
