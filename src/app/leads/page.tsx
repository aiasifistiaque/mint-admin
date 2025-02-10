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

const page: NextPage = () => {
	const tableFields = convertToTableFields({
		schema,
		fields: [
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
		],
	});

	const viewFields = convertToViewFields({
		schema,
		fields: [
			'name',
			'email',
			'phone',
			'status',
			'source',
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
		],
	});
	const formFields = convertToFormFields({
		schema,
		layout: [
			{
				sectionTitle: 'Basic Information',
				fields: [
					'name',
					['email', 'phone'],
					['businessName', 'position'],
					['category', 'city'],
					'businessAddress',
				],
			},
			{
				sectionTitle: 'Status Description',
				fields: [
					['status', 'leadType'],
					['priority', 'group'],
					['source', 'hasWebsite'],
				],
			},
			{
				sectionTitle: 'Socials',
				fields: [['facebook', 'instagram'], 'websiteUrl'],
			},
			{
				sectionTitle: 'More Detai;s',
				fields: ['estimatedBudget', 'interestedIn', 'tags'],
			},
		],
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
