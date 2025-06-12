'use client';
import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';
import { formFields, fields, tableFields } from './config';

const table: BackendTableObjectProps = {
	title: 'Blog Management',
	path: 'blogs',

	button: {
		title: 'Write Blog',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,

	menu: [
		{ type: 'view-modal', title: 'View', fields },
		{ type: 'view-item', title: 'Go To Post' },
		{
			title: 'Edit Details',
			type: 'edit-modal',
			layout: formFields,
		},
		{
			title: 'Open Editor',
			type: 'custom-redirect',
			href: data => '/blogs/edit-content/' + data?._id,
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
