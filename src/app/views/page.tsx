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
import { clientSchema as schema } from '@/models';
import { fields, tableFields, formFields } from './config';

const table: TableObjectProps = {
	title: 'Website Views',
	path: 'views',
	export: true,
	// button: {
	// 	title: 'New Client',
	// 	isModal: true,
	// 	dataModel: createFormFields({ schema, layout: formFields }),
	// },
	menu: [
		{
			title: 'View',
			type: 'view-modal',
			dataModel: convertToViewFields({ schema, fields }),
		},
		// {
		// 	title: 'Edit',
		// 	type: 'edit-modal',
		// 	dataModel: createFormFields({ schema, layout: formFields }),
		// },
		{
			title: 'Delete',
			type: 'delete',
		},
	],
	data: convertToTableFields({ schema, fields: tableFields }),
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
