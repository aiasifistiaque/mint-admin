export const fields = [
	'code',
	'name',
	'plan',
	'description',
	'currency',
	'amount',
	'status',
	'billingCycle',
	'renewDate',
	'autoRenew',
	'lastPaymentDate',
	'accountLogin',
	'privacy',
	'addedBy',
	'access',
	'createdAt',
];

export const tableFields = [
	'code',
	'name',
	'plan',
	'currency',
	'amount',
	'status',
	'billingCycle',
	'renewDate',
	'autoRenew',
	'lastPaymentDate',
	'privacy',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Subscription Overview',
		fields: ['name', ['plan', 'status'], 'description'],
	},
	{
		sectionTitle: 'Amount & Currency',
		fields: [
			['currency', 'amount'],
			['billingCycle', 'autoRenew'],
			['renewDate', 'lastPaymentDate'],
		],
	},
	{
		sectionTitle: 'Manage Access',
		description: 'Who can access this document?',
		fields: ['accountLogin', 'privacy', 'access'],
	},
];
