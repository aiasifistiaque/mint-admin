'use client';

import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';

export const fields = [
	'name',
	'component',
	'description',
	'type',
	'isRequired',
	'default',
	'typeValue',
	'condition',
	'createdAt',
];

export const tableFields = [
	'name',
	'component',
	'description',
	'type',
	'isRequired',
	'default',
	'typeValue',
	'condition',
];

export const formFields = [
	{
		sectionTitle: 'Prop Details',
		fields: ['component', 'name', 'description'],
	},
	{
		sectionTitle: 'Prop Fields',
		fields: ['type', ['isRequired', 'default']],
	},
	{
		sectionTitle: 'Type Value',
		description:
			'Enter the type value in JSON format, if type is object or contains multiple selectable values',
		fields: ['typeValue'],
	},
	{
		sectionTitle: 'Condition',
		description: 'Enter The condition for this prop, if it is required or has a default value',
		fields: ['condition'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Props',
	path: 'props',
	export: false,
	button: {
		title: 'Add Prop',
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
