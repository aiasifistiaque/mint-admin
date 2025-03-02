'use client';

import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';

const fields = ['name', 'description', 'project', 'createdAt'];
const tableFields = ['name', 'description', 'project', 'createdAt'];

const formFields = [
	{
		sectionTitle: 'Model Overview',
		fields: ['name', 'project', 'description'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Plan Model',
	path: 'plannedmodels',
	export: false,
	button: {
		title: 'New model',
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
			title: 'Duplicate',
			type: 'duplicate',
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
