export const fields = [
	'profilePicture',
	'name',
	'position',
	'email',
	'priority',
	'phone',
	'status',
	'bio',
	'skills',
	'experienceInYears',
	'isActive',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Member Details',
		fields: ['profilePicture', ['name', 'position'], ['priority', 'status']],
	},
	{
		sectionTitle: 'More Details',
		fields: [['phone', 'email'], 'bio', ['isActive', 'experienceInYears'], 'skills'],
	},
];

export const tableFields = [
	'name',
	'position',
	'email',
	'phone',
	'priority',
	'status',
	'isActive',
	'createdAt',
];
