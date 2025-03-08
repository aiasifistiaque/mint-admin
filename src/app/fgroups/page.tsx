'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

export const fields = [
	'name',
	'url',
	'description',
	'category',
	'members',
	'priority',
	'createdAt',
];

export const formFields: FormLayout = [
	{
		sectionTitle: 'Group Details',
		fields: ['name', 'url', ['category', 'priority'], 'members', 'description'],
	},
];

export const tableFields = ['name', 'url', 'category', 'members', 'priority', 'createdAt'];

export const table: BackendTableObjectProps = {
	title: 'FB Groups',
	path: 'fgroups',
	export: true,

	button: {
		title: 'Add Group',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,

	menu: [
		{ type: 'view-modal', title: 'View', fields: fields },
		{ type: 'view-item', title: 'Go To Post' },

		{
			type: 'edit-modal',
			title: 'Edit',
			layout: formFields,
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
