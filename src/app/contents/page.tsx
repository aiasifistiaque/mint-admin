'use client';
import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';
import { formFields, fields, tableFields } from './config';

// Site content and settings documents, looked up by slug — this is where the
// `billing-profile` document lives, so the company name, address and web
// address printed on invoices are editable here rather than in code.
const table: BackendTableObjectProps = {
	title: 'Content',
	subTitle: 'Site content and settings documents, looked up by slug',
	path: 'contents',
	export: true,

	button: {
		title: 'New Content',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,

	menu: [
		{ type: 'view-modal', title: 'View', fields },
		{
			type: 'edit-modal',
			title: 'Edit',
			layout: formFields,
		},
		{ type: 'delete', title: 'Delete' },
	],
};

const Page: NextPage = () => <BackendPageTable table={table} />;

export default Page;
