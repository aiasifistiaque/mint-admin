'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = [
	'code',
	'name',
	'description',
	'items',
	'status',
	'client',
	'clientEmail',
	'clientPhone',
	'clientAddress',
	'project',
	'issueDate',
	'dueDate',
	'subTotal',
	'tax',
	'currency',
	'total',
	'access',
	'note',
	'addedBy',
	'createdAt',
];

const formLayout: FormLayout = [
	{
		sectionTitle: 'Invoice Details',
		fields: ['name', 'status', ['issueDate', 'dueDate']],
	},
	{
		sectionTitle: 'Items',
		fields: ['description', 'items'],
	},
	{
		sectionTitle: 'Invoice Issue & Due',
		description: 'Date of the invoice being issues and when the invpice is due',
		fields: [['issueDate', 'dueDate']],
		collapsible: true,
	},
	{
		sectionTitle: 'Price & Total',
		fields: [['subTotal', 'tax'], 'currency', 'total'],
	},
	{
		sectionTitle: 'Client/Project',
		fields: [['client', 'project']],
	},
	{
		sectionTitle: 'For Internal Use',
		collapsible: true,
		fields: ['note', 'access'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Invoice',
	path: 'invoices',
	export: true,

	button: {
		title: 'New Invoice',
		isModal: true,
		layout: formLayout,
	},
	fields: [
		'code',
		'name',
		'status',
		'currency',
		'total',
		'issueDate',
		'dueDate',
		'client',
		'project',
		'addedBy',
	],

	menu: [
		{ type: 'view-modal', title: 'View', fields: viewFields },
		{ type: 'view-item', title: 'Go To Post' },

		{
			type: 'edit-modal',
			title: 'Edit',
			layout: formLayout,
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
