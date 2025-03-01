'use client';

import React from 'react';
import { NextPage } from 'next';
import {
	PageTable,
	TableObjectProps,
	convertToViewFields,
	convertToTableFields,
	createFormFields,
} from '@/components/library';
import { documentSchema as schema } from '@/models';

const fields = [
	'name',
	'client',
	'docUrl',
	'fileUrl',
	'direction',
	'category',
	'project',
	'privacy',
	'access',
	'addedBy',
	'createdAt',
];

const tableFields = [
	'name',
	'client',
	'docUrl',
	'fileUrl',
	'direction',
	'category',
	'project',
	'privacy',
	'addedBy',
	'createdAt',
];

const formFields = [
	{
		sectionTitle: 'File Details',
		fields: [['name'], ['client', 'project'], ['direction', 'category']],
	},
	{
		sectionTitle: 'URLs',
		fields: ['fileUrl', 'docUrl'],
	},
	{
		sectionTitle: 'Manage Access',
		description: 'Who can access this document?',
		fields: ['privacy', 'access'],
	},
];

const table: TableObjectProps = {
	title: 'Documents',
	path: 'documents',
	export: false,
	button: {
		title: 'Add Document',
		isModal: true,
		dataModel: createFormFields({ schema, layout: formFields }),
	},
	menu: [
		{
			title: 'View',
			type: 'view-modal',
			dataModel: convertToViewFields({ schema, fields }),
		},
		{
			title: 'Edit',
			type: 'edit-modal',
			dataModel: createFormFields({ schema, layout: formFields }),
		},
		{
			title: 'Delete',
			type: 'delete',
		},
	],
	data: convertToTableFields({ schema, fields: tableFields }),
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
