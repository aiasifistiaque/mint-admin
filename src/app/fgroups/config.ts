// @ts-nocheck

import { FormLayout } from '@/components/library';

export const fields = [
	'name',
	'url',
	'description',
	'category',
	'members',
	'priority',
	'createdAt',
];

export const formFields: FormLayout = [
	{
		sectionTitle: 'Group Details',
		fields: ['name', 'url', ['category', 'priority'], 'members', 'description'],
	},
];

export const tableFields = ['name', 'url', 'category', 'members', 'priority', 'createdAt'];
