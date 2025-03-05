'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = [
	'code',
	'name',
	'description',
	'status',
	'images',
	'attachment',
	'priority',
	'type',
	'project',
	'assignedTo',
	'addedBy',
	'note',
	'dueDate',
	'isActive',
	'createdAt',
];

const formLayout: FormLayout = [
	{
		sectionTitle: 'Issue Details',
		fields: ['name', 'description', ['status', 'type'], ['project', 'priority']],
	},
	{
		sectionTitle: 'More Details',
		fields: ['assignedTo', 'dueDate', 'note', 'isActive'],
	},
	{
		sectionTitle: 'Add Issue Images & files',
		fields: ['images', 'attachment'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Issues',
	path: 'issues',
	export: true,

	button: {
		title: 'New Issue',
		isModal: true,
		layout: formLayout,
	},
	fields: [
		'code',
		'name',
		'status',
		'priority',
		'type',
		'project',
		'assignedTo',
		'addedBy',
		'note',
		'dueDate',
		'isActive',
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
