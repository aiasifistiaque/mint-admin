'use client';

import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';

const fields = [
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

const tableFields = [
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

const formFields = [
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
		fields: ['acountLogin', 'privacy', 'access'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Subscriptions',
	path: 'billsubscriptions',
	export: false,
	button: {
		title: 'New Subscription',
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
