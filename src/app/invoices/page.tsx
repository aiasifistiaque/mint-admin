'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';
import { fields, formFields, tableFields } from './config';

const table: BackendTableObjectProps = {
	title: 'Invoice',
	path: 'invoices',
	export: true,

	button: {
		title: 'New Invoice',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,
	select: {
		show: true,
		menu: [
			{
				type: 'calculate',
				title: 'Calculate Values',
			},
		],
	},

	menu: [
		{ type: 'view-modal', title: 'View', fields },
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
