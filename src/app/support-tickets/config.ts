import { FormLayout } from '@/components/library';

export const fields = [
	'code',
	'name',
	'description',
	'status',
	'category',
	'priority',
	'images',
	'addedBy',
	'assignedTo',
	'replyCount',
	'lastReplyAt',
	'lastReplyBy',
	'note',
	'createdAt',
];

// Staff edit the ticket's handling, not what the requester wrote — replies
// happen in the thread (/support/<id>).
export const formFields: FormLayout = [
	{
		sectionTitle: 'Handling',
		fields: [['status', 'priority'], ['category', 'assignedTo']],
	},
	{
		sectionTitle: 'Internal',
		fields: ['note'],
	},
];

export const tableFields = [
	'code',
	'name',
	'status',
	'priority',
	'category',
	'addedBy',
	'assignedTo',
	'replyCount',
	'lastReplyAt',
	'createdAt',
];
