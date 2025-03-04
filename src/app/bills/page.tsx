'use client';

import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';

const tableFields = [
	'code',
	'name',
	'currency',
	'amount',
	'status',
	'dueDate',
	'dueIn',
	'overDuration',
	'refNo',
	'billDate',
	'paidAt',
	'category',
	'createdAt',
	'privacy',
];

const fields = [
	'code',
	'name',
	'currency',
	'amount',
	'status',
	'details',
	'refNo',
	'dueDate',
	'billDate',
	'paidAt',
	'category',
	'receipt',
	'tags',
	'note',
	'createdAt',
	'privacy',
	'addedBy',
	'access',
];

const formFields = [
	{
		sectionTitle: 'Bill Overview',
		fields: ['name', ['currency', 'amount'], ['dueDate', 'status'], 'details'],
	},
	{
		sectionTitle: 'Bill Details',
		fields: [['refNo', 'billDate'], 'receipt', 'paidAt'],
	},
	{
		sectionTitle: 'For Official Use',
		fields: ['category', 'tags', 'note'],
	},
	{
		sectionTitle: 'Manage Access',
		description: 'Who can access this document?',
		fields: ['privacy', 'access'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Bills',
	path: 'bills',
	export: false,
	button: {
		title: 'New Bill',
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
