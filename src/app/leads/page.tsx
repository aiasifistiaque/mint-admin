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
import { fields, formFields as formLayout, tableFields as tFields } from './config';

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
