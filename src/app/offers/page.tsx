'use client';
import React from 'react';
import { NextPage } from 'next';
// import { BackendPageTable, BackendTableObjectProps } from '@/components/library';
import { formFields, fields, tableFields } from './config';
import BackendPageTable from '@/components/library/pages/page-tables/BackendPageTable';

const table: any = {
	title: 'Service Offers',
	path: 'offers',
	export: true,

	button: {
		title: 'Add Offer',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,

	select: {
		show: true,
		menu: [{ type: 'export', title: 'Export Selected' }],
	},

	menu: [
		{ type: 'view-modal', title: 'View', fields },
		{ type: 'view-item', title: 'Go To Post' },

		{
			type: 'edit-modal',
			title: 'Edit',
			layout: formFields,
		},

		{
			type: 'update-key',
			title: 'Update Priority',
			keyType: 'number',
			key: 'priority',
			prompt: {
				title: 'Update Priority',
				body: 'Enter the new priority value for this item.',
			},
		},
		{
			type: 'duplicate',
			title: 'Make Copy',
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
