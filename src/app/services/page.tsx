'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = ['name', 'description', 'priority', 'isActive', 'createdAt'];

const formLayout: FormLayout = [
	{
		sectionTitle: 'Service Details',
		fields: ['name', 'description', ['priority', 'isActive']],
	},
];

const table: BackendTableObjectProps = {
	title: 'Services',
	path: 'services',
	export: true,

	button: {
		title: 'Add Service',
		isModal: true,
		layout: formLayout,
	},
	fields: ['name', 'priority', 'isActive', 'createdAt'],

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
