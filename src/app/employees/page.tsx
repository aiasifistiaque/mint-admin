'use client';
import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';
import { fields, formFields, tableFields } from './config';

const table: BackendTableObjectProps = {
	title: 'Employees',
	path: 'employees',
	button: {
		title: 'Add Employee',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,

	menu: [
		{
			title: 'Quick View',
			type: 'view-modal',
			fields: fields,
		},
		{ type: 'view-item', title: 'View Details' },

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
