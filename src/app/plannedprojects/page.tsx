'use client';

import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';

const fields = ['name', 'description', 'status', 'stack', 'createdAt'];
const tableFields = ['name', 'status', 'stack', 'createdAt'];

const formFields = [
	{
		sectionTitle: 'Project Plan',
		fields: ['name', ['platform', 'status', 'stack']],
	},
];

const table: BackendTableObjectProps = {
	title: 'Plan Project',
	path: 'plannedprojects',
	export: false,
	button: {
		title: 'New Project',
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
