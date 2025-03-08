'use client';

import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';

export const fields = [
	'code',
	'name',
	'amount',
	'date',
	'category',
	'project',
	'details',
	'tags',
	'receipt',
	'note',
	'privacy',
	'addedBy',
	'access',
	'createdAt',
];

export const tableFields = [
	'code',
	'name',
	'amount',
	'date',
	'project',
	'category',
	'privacy',
	'addedBy',
];

export const formFields = [
	{
		sectionTitle: 'Expense Details',
		fields: ['name', ['amount', 'date'], 'category'],
	},
	{
		sectionTitle: 'Detailed Info',
		fields: ['project', 'receipt', 'details', 'tags'],
	},
	{
		sectionTitle: 'Manage Access',
		description: 'Who can access this document?',
		fields: ['privacy', 'access'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Expenses',
	path: 'expenses',
	export: false,
	button: {
		title: 'New Expense',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,
	menu: [
		{
			title: 'View',
			type: 'view-modal',
			fields: fields,
		},
		{
			title: 'Edit',
			type: 'edit-modal',
			layout: formFields,
		},
		{
			title: 'Delete',
			type: 'delete',
		},
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
