'use client';

import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';

export const fields = [
	'name',
	'model',
	'project',
	'description',
	'type',
	'required',
	'default',
	'ref',
	'enum',
	'trim',
	'lowercase',
	'unique',
	'match',
	'isImmutable',
	'note',
	'createdAt',
];
export const tableFields = [
	'name',
	'model',
	'project',
	'description',
	'type',
	'required',
	'default',
	'ref',
	'enum',
	'trim',
	'lowercase',
	'unique',
	'match',
	'isImmutable',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Field Overview',
		fields: [['project', 'model'], 'name', 'description'],
	},
	{
		sectionTitle: 'Field Attributes',
		fields: [
			['type', 'ref'],
			'enum',
			['required', 'default'],
			['trim', 'lowercase'],
			['unique', 'isImmutable'],
			'match',
		],
	},
	{
		sectionTitle: 'Note',
		fields: ['note'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Plan Schema',
	path: 'modelattributes',
	export: false,
	button: {
		title: 'New Attribute',
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
