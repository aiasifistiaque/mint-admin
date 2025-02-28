'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = ['image', 'name', 'category', 'status', 'priority', 'isFeatured', 'createdAt'];

const formLayout: FormLayout = [
	{
		sectionTitle: 'Project Details',
		fields: ['image', 'name', ['category', 'status'], 'priority', 'isFeatured'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Featured Projects',
	path: 'portfolios',
	export: true,

	button: {
		title: 'Add Project',
		isModal: true,
		layout: formLayout,
	},
	fields: ['name', 'category', 'status', 'priority', 'isFeatured'],

	select: {
		show: true,
		menu: [
			{
				title: 'Change Project Status',
				type: 'edit-select',
				options: [
					{
						label: 'Draft',
						value: 'draft',
					},
					{
						label: 'Published',
						value: 'published',
					},
					{
						label: 'Archived',
						value: 'archived',
					},
				],
				prompt: {
					title: 'Change Status',
					body: 'Please select status of the projects, this will update the status of the selected items?',
				},
			},
			{
				title: 'Change Featured Status',
				type: 'edit-select',
				options: [
					{
						label: 'Yes',
						value: true,
					},
					{
						label: 'No',
						value: false,
					},
				],
				prompt: {
					title: 'Mark as Featured',
					body: 'Are you sure you want to mark selected projects as featured?',
				},
			},
		],
	},

	menu: [
		{ type: 'view-modal', title: 'View', fields: viewFields },
		{ type: 'view-item', title: 'Go To Post' },

		{
			type: 'edit-modal',
			title: 'Edit',
			layout: formLayout,
		},
		{
			type: 'update-api',
			title: 'Mark as Featured',
			body: {
				isFeatured: true,
			},
			prompt: {
				title: 'Mark as Featured',
				body: 'Are you sure you want to mark this project as featured?',
			},
			renderCondition: doc => !doc.isFeatured,
		},
		{
			type: 'update-api',
			title: 'Unfeature Item',
			body: {
				isFeatured: false,
			},
			prompt: {
				title: 'Unfeature Item',
				body: 'Are you sure you want to hide this project from home?',
			},
			renderCondition: doc => !doc.isFeatured,
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
