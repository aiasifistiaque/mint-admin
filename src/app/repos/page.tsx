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
import { projectSchema as schema } from '@/models';

export const fields = [
	'name',
	'project',
	'category',
	'status',
	'githubUrl',
	'devUrl',
	'liveUrl',
	'testUrl',
	'prodUrl',
	'domain',
];

export { fields as tableFields };

const tableSchema = [
	{
		sectionTitle: 'Basic Details',
		fields: [['name', 'project'], ['category', 'status'], ['projectType']],
	},
	{
		sectionTitle: 'Links',
		fields: [
			['githubUrl', 'devUrl'],
			['liveUrl', 'testUrl'],
			['prodUrl', 'domain'],
		],
	},
	{
		sectionTitle: 'Technologies',
		fields: ['libraries', 'frameworks', 'technologies'],
	},
];

export { tableSchema as formFields };

const table: TableObjectProps = {
	title: 'Repo',
	path: 'repos',
	export: true,
	button: {
		title: 'New Repo',
		isModal: true,
		dataModel: createFormFields({ schema, layout: tableSchema }),
	},
	menu: [
		{
			title: 'View',
			type: 'view-modal',
			dataModel: convertToViewFields({ schema }),
		},
		{
			title: 'Edit',
			type: 'edit-modal',
			dataModel: createFormFields({ schema, layout: tableSchema }),
		},
		{
			title: 'Delete',
			type: 'delete',
		},
	],
	data: convertToTableFields({ schema, fields }),
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
