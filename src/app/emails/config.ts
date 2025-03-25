import { FormLayout } from '@/components/library';

export const fields = [
	'subject',
	'recipients',
	'to',
	'cc',
	'bcc',
	'attachment',

	'createdBy',
	'body',
	'attachment',
	'createdAt',
];

export const tableFields = ['subject', 'recipients', 'group', 'createdAt'];

export const formFields: FormLayout = [
	{
		sectionTitle: 'Draft Email',
		fields: ['title', 'subject', 'to'],
	},
	{
		sectionTitle: 'CC/BCC',
		fields: [['cc', 'bcc']],
	},

	{
		sectionTitle: 'Email Body',
		fields: ['body'],
	},
	{
		sectionTitle: 'Attachment',
		fields: ['attachment'],
	},
];
