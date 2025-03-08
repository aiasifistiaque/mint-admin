'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = [
	'profilePicture',
	'name',
	'position',
	'email',
	'priority',
	'phone',
	'status',
	'bio',
	'skills',
	'experienceInYears',
	'isActive',
	'createdAt',
];

export { viewFields as fields };

const formLayout: FormLayout = [
	{
		sectionTitle: 'Member Details',
		fields: ['profilePicture', ['name', 'position'], ['priority', 'status']],
	},
	{
		sectionTitle: 'More Details',
		fields: [['phone', 'email'], 'bio', ['isActive', 'experienceInYears'], 'skills'],
	},
];

export { formLayout as formFields };
export const tableFields = [
	'name',
	'position',
	'email',
	'phone',
	'priority',
	'status',
	'isActive',
	'createdAt',
];

const table: BackendTableObjectProps = {
	title: 'Team Members',
	path: 'teams',
	export: true,

	button: {
		title: 'Add Member',
		isModal: true,
		layout: formLayout,
	},
	fields: tableFields,

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
