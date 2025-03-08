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

export const fields = ['name', 'email', 'phone', 'role', 'isActive', 'github'];
export const tableFields = ['name', 'email', 'phone', 'role', 'isActive', 'github'];

const tableSchema = [
	{
		sectionTitle: 'Basic Details',
		fields: ['name', ['email', 'phone'], ['password', 'role']],
	},
	{
		sectionTitle: 'Advanced Details',
		fields: ['github'],
	},
];

export { tableSchema as formFields };

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
	data: convertToTableFields({ schema, fields }),
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
