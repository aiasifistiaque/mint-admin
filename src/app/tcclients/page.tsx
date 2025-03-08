'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = ['icon', 'name', 'description', 'priority', 'isActive', 'createdAt'];

const formLayout: FormLayout = [
	{
		sectionTitle: 'Client Details',
		fields: ['icon', 'name', ['priority', 'isActive'], 'description'],
	},
];

export { viewFields as fields };
export const tableFields = ['name', 'priority', 'isActive', 'createdAt'];
export { formLayout as formFields };

const table: BackendTableObjectProps = {
	title: 'Clients',
	path: 'tcclients',
	export: true,

	button: {
		title: 'Add Client',
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
