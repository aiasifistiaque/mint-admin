'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = [
	'profilePicture',
	'name',
	'position',
	'email',
	'phone',
	'status',
	'bio',
	'skills',
	'experienceInYears',
	'isActive',
	'createdAt',
];

const formLayout: FormLayout = [
	{
		sectionTitle: 'Member Details',
		fields: ['profilePicture', ['name', 'position'], 'status'],
	},
	{
		sectionTitle: 'More Details',
		fields: [['phone', 'email'], 'bio', ['isActive', 'experienceInYears'], 'skills'],
	},
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
	fields: ['name', 'position', 'email', 'phone', 'status', 'isActive', 'createdAt'],

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
