'use client';
import React from 'react';
import { NextPage } from 'next';
import {
	convertToFormFields,
	convertToTableFields,
	convertToViewFields,
	PageTable,
	TableObjectProps,
} from '@/components/library';
import { leadSchema as schema } from '@/models';

const tFields = [
	'name',
	'email',
	'businessName',
	'phone',
	'status',
	'source',
	'category',
	'leadType',
	'facebook',
	'instagram',
	'websiteUrl',
	'priority',
	'city',
	'createdAt',
];

export { tFields as tableFields };

export const fields = [
	'name',
	'email',
	'phone',
	'status',
	'source',
	'requirements',
	'leadType',
	'priority',
	'category',
	'interestedIn',
	'estimatedBudget',
	'businessName',
	'businessAddress',
	'facebook',
	'instagram',
	'hasWebsite',
	'websiteUrl',
	'city',
	'createdAt',
];

const formLayout = [
	{
		sectionTitle: 'Basic Information',
		fields: [
			['name', 'email', 'phone'],
			['businessName', 'businessAddress'],
			['city', 'status'],
			['source', 'leadType'],
			['category', 'priority'],
		],
	},
	{
		sectionTitle: 'Requirements',
		fields: ['requirements', 'interestedIn', 'estimatedBudget'],
	},
	{
		sectionTitle: 'Social Media',
		fields: ['facebook', 'instagram'],
	},
	{
		sectionTitle: 'Website',
		fields: ['hasWebsite', 'websiteUrl'],
	},
];

export { formLayout as formFields };

const page: NextPage = () => {
	const tableFields = convertToTableFields({
		schema,
		fields: tFields,
	});

	const viewFields = convertToViewFields({
		schema,
		fields: fields,
	});
	const formFields = convertToFormFields({
		schema,
		layout: formLayout,
	});

	const table: TableObjectProps = {
		title: 'Leads',
		path: 'leads',
		data: tableFields,

		button: {
			title: 'New Lead',
			isModal: true,
			dataModel: formFields,
		},
		menu: [
			{
				type: 'view-modal',
				dataModel: viewFields,
				title: 'View',
			},
			{
				type: 'edit-modal',
				title: 'Edit',
				dataModel: formFields,
			},
			{
				type: 'delete',
				title: 'Delete',
			},
		],
	};

	return <PageTable table={table} />;
};

export default page;
