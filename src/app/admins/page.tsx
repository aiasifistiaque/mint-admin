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
import { adminSchema as schema } from '@/models';
import { fields, tableFields, formFields as tableSchema } from './config';

const table: TableObjectProps = {
	title: 'Admin',
	path: 'admins',
	export: true,
	button: {
		title: 'New Admin',
		isModal: true,
		dataModel: createFormFields({ schema, layout: tableSchema }),
	},
	menu: [
		{
			title: 'View',
			type: 'view-modal',
			dataModel: convertToViewFields({ schema, fields }),
		},
	],
	data: convertToTableFields({ schema, fields: tableFields }),
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
