'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = ['name', 'url', 'description', 'category', 'members', 'priority', 'createdAt'];

const formLayout: FormLayout = [
	{
		sectionTitle: 'Group Details',
		fields: ['name', 'url', ['category', 'priority'], 'members', 'description'],
	},
];

const table: BackendTableObjectProps = {
	title: 'FB Groups',
	path: 'fgroups',
	export: true,

	button: {
		title: 'Add Group',
		isModal: true,
		layout: formLayout,
	},
	fields: ['name', 'url', 'description', 'category', 'members', 'priority', 'createdAt'],

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
