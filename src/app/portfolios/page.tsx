'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';
import { fields, formFields, tableFields } from './config';

const table: BackendTableObjectProps = {
	title: 'Featured Projects',
	path: 'portfolios',
	export: true,

	button: {
		title: 'Add Project',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,

	select: {
		show: true,
		menu: [
			{
				title: 'Change Project Status',
				type: 'edit-select',
				key: 'status',
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
				key: 'isFeatured',
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
		{ type: 'view-modal', title: 'View', fields },
		{ type: 'view-item', title: 'Go To Post' },

		{
			type: 'edit-modal',
			title: 'Edit',
			layout: formFields,
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
			renderCondition: doc => doc.isFeatured,
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
