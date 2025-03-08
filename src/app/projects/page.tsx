'use client';

import React from 'react';
import { NextPage } from 'next';
import {
	convertToViewFields,
	createFormFields,
	BackendTableObjectProps,
	BackendPageTable,
} from '@/components/library';
import { projectSchema as schema } from '@/models';

export const fields = [
	'name',
	'category',
	'status',
	'description',
	'client',
	'startDate',
	'endDate',
	'deadline',
	'requirements',
	'file',
	'fileUrl',
	'tags',
	'addedBy',
	'privacy',
	'access',
	'createdAt',
];

const tableSchema = [
	{
		sectionTitle: 'Basic Details',
		fields: [['name', 'client'], ['category', 'status'], 'tags'],
	},
	{
		sectionTitle: 'Description',
		fields: ['description'],
	},
	{
		sectionTitle: 'Timeline',
		fields: [['startDate', 'endDate'], 'deadline'],
	},
	{
		sectionTitle: 'Requirements & Details',
		fields: ['requirements', 'file', 'fileUrl'],
	},
	{
		sectionTitle: 'Access Control',
		fields: ['privacy', 'access'],
	},
	{
		sectionTitle: 'Note & Tags',
		fields: ['note'],
	},
];

export const tableFields = [
	'name',
	'category',
	'status',
	'client',
	'startDate',
	'endDate',
	'deadline',
	'file',
	'filerl',
	'privacy',
	'addedBy',
];

export { tableSchema as formFields };

const table: BackendTableObjectProps = {
	title: 'Projects',
	path: 'projects',

	fields: tableFields,
	button: {
		title: 'New Project',
		isModal: true,
		layout: tableSchema,
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
			layout: tableSchema,
		},
		{
			title: 'Delete',
			type: 'delete',
		},
	],
};

const page: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default page;
