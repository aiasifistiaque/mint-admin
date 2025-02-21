'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = [
	'code',
	'employee',
	'leaveType',
	'numberOfDays',
	'status',
	'startDate',
	'endDate',
	'reason',
	'addedBy',
	'access',
	'attachment',
	'createdAt',
];

const formLayout: FormLayout = [
	{
		sectionTitle: 'Leave Details',
		fields: ['employee', ['leaveType', 'status']],
	},
	{
		sectionTitle: 'Date & time',
		fields: [['startDate', 'endDate'], 'numberOfDays'],
	},
	{
		sectionTitle: 'Reason',
		description: 'Reason for the leave',
		fields: ['reason'],
	},
	{
		sectionTitle: 'Attachment',
		fields: ['attachment'],
	},

	{
		sectionTitle: 'For Internal Use',
		collapsible: true,
		fields: ['note', 'access'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Leaves',
	path: 'leaves',
	export: false,

	button: {
		title: 'New Leave',
		isModal: true,
		layout: formLayout,
	},
	fields: ['code', 'employee', 'leaveType', 'startDate', 'numberOfDays', 'status'],

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
