'use client';

import React from 'react';
import { NextPage } from 'next';
import {
	PageTable,
	TableObjectProps,
	convertToViewFields,
	convertToTableFields,
	createFormFields,
} from '@/components/library';
import { projectSchema as schema } from '@/models';
import { formFields, fields, tableFields } from './config';

const table: TableObjectProps = {
	title: 'Repo',
	path: 'repos',
	export: true,
	button: {
		title: 'New Repo',
		isModal: true,
		dataModel: createFormFields({ schema, layout: formFields }),
	},
	menu: [
		{
			title: 'View',
			type: 'view-modal',
			dataModel: convertToViewFields({ schema }),
		},
		{
			title: 'Edit',
			type: 'edit-modal',
			dataModel: createFormFields({ schema, layout: formFields }),
		},
		{
			title: 'Delete',
			type: 'delete',
		},
	],
	data: convertToTableFields({ schema, fields }),
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
