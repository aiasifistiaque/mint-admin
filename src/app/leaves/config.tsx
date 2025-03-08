export const fields = [
	'code',
	'employee',
	'leaveType',
	'numberOfDays',
	'status',
	'startDate',
	'endDate',
	'reason',
	'addedBy',
	'access',
	'attachment',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Leave Details',
		fields: ['employee', ['leaveType', 'status']],
	},
	{
		sectionTitle: 'Date & time',
		fields: [['startDate', 'endDate'], 'numberOfDays'],
	},
	{
		sectionTitle: 'Reason',
		description: 'Reason for the leave',
		fields: ['reason'],
	},
	{
		sectionTitle: 'Attachment',
		fields: ['attachment'],
	},

	{
		sectionTitle: 'For Internal Use',
		collapsible: true,
		fields: ['note', 'access'],
	},
];

export const tableFields = ['code', 'employee', 'leaveType', 'startDate', 'numberOfDays', 'status'];
