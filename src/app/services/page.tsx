'use client';
import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';
import { formFields, fields, tableFields } from './config';

const table: BackendTableObjectProps = {
	title: 'Services',
	path: 'services',
	export: true,

	button: {
		title: 'Add Service',
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
