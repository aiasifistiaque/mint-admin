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
import { jobApplicationSchema as schema } from '@/models';
import { fields, formFields, tableFields } from './config';

const page: NextPage = () => {
	const tableLayout = convertToTableFields({
		schema,
		fields: tableFields,
	});

	const viewFields = convertToViewFields({
		schema,
		fields: fields,
	});
	const formLayout = convertToFormFields({
		schema,
		layout: formFields,
	});

	const table: TableObjectProps = {
		title: 'Job Applications',
		path: 'jobapplications',
		data: tableLayout,
		export: true,

		button: {
			title: 'New Job Application',
			isModal: true,
			dataModel: formLayout,
		},
		menu: [
			{
				title: 'Quick View',
				type: 'view-modal',
				fields: fields,
			},
			{ type: 'view-item', title: 'View Details' },
			{
				type: 'edit-modal',
				title: 'Edit',
				dataModel: formLayout,
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
