'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = [
	'code',
	'name',
	'icon',
	'description',
	'category',
	'url',
	'type',
	'priority',
	'status',
	'attachment',
	'note',
	'tags',
	'isRecommended',
	'focus',
	'createdAt',
];

const formLayout: FormLayout = [
	{
		sectionTitle: 'Resource Overview',
		fields: ['name', ['category', 'type'], 'url', 'description'],
	},
	{
		sectionTitle: 'Focus & Priority',
		fields: [['focus', 'priority'], 'status'],
	},
	{
		sectionTitle: 'Details',
		fields: [['icon', 'isRecommended'], 'attachment', 'note', 'tags'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Developer Resources',
	path: 'resources',
	export: true,

	button: {
		title: 'Add resource',
		isModal: true,
		layout: formLayout,
	},
	fields: [
		'code',
		'name',
		'description',
		'category',
		'url',
		'type',
		'priority',
		'status',
		'isRecommended',
		'focus',
		'createdAt',
	],

	menu: [
		{ type: 'view-modal', title: 'View', fields: viewFields },
		{ type: 'view-item', title: 'Go To Post' },

		{
			type: 'edit-modal',
			title: 'Edit',
			layout: formLayout,
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
