'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

export const viewFields = [
	'code',
	'name',
	'project',
	'client',
	'description',
	'startDate',
	'endDate',
	'status',
	'attachment',
	'priority',
	'privacy',
	'access',
	'addedBy',
	'createdAt',
];

export { viewFields as fields };

const formLayout: FormLayout = [
	{
		sectionTitle: 'Maintenance Details',
		fields: ['name', 'project', ['startDate', 'endDate']],
	},
	{
		sectionTitle: 'Details',
		fields: ['description'],
	},
	{
		sectionTitle: 'Status',
		fields: [['status', 'priority'], 'attachment'],
	},
	{
		sectionTitle: 'Access',
		fields: ['privacy', 'access'],
	},
];

export { formLayout as formFields };

export const tableFields = [
	'code',
	'name',
	'project',
	'client',
	'startDate',
	'endDate',
	'status',
	'priority',
	'privacy',
];

const table: BackendTableObjectProps = {
	title: 'Maintenance Contracts',
	path: 'maintenances',
	export: true,

	button: {
		title: 'New Maintenance',
		isModal: true,
		layout: formLayout,
	},
	fields: tableFields,

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
