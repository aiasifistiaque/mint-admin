'use client';

import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';

export const fields = ['code', 'name', 'description', 'version', 'platform', 'createdAt'];

export const tableFields = ['code', 'name', 'description', 'version', 'platform'];

export const formFields = [
	{
		sectionTitle: 'Component Details',
		fields: ['name', ['platform', 'version']],
	},
	{
		sectionTitle: 'Description',
		fields: ['description'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Components',
	path: 'components',
	export: false,
	button: {
		title: 'Add Component',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,
	menu: [
		{
			title: 'View',
			type: 'view-modal',
			fields: fields,
		},
		{
			title: 'Edit',
			type: 'edit-modal',
			layout: formFields,
		},
		{
			title: 'Delete',
			type: 'delete',
		},
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
