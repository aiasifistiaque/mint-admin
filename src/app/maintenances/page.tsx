'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';
import { fields, formFields, tableFields } from './config';

const table: BackendTableObjectProps = {
	title: 'Maintenance Contracts',
	path: 'maintenances',
	export: true,

	button: {
		title: 'New Maintenance',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,

	menu: [
		{ type: 'view-modal', title: 'View', fields: fields },
		{ type: 'view-item', title: 'Go To Post' },

		{
			type: 'edit-modal',
			title: 'Edit',
			layout: formFields,
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
