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
import { jobPostSchema as schema } from '@/models';
import { fields, tableFields, formFields } from './config';

const tFields = convertToTableFields({
	schema,
	fields: tableFields,
});

const viewFields = convertToViewFields({
	schema,
	fields: fields,
});
const fField = convertToFormFields({
	schema,
	layout: formFields,
});

const page: NextPage = () => {
	const table: TableObjectProps = {
		title: 'Job Posts',
		path: 'jobposts',
		data: tFields,

		button: {
			title: 'New Job Post',
			isModal: true,
			dataModel: fField,
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
				dataModel: fField,
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
