'use client';

import React from 'react';
import { NextPage } from 'next';
import {
	convertToViewFields,
	BackendTableObjectProps,
	BackendPageTable,
} from '@/components/library';
import { projectSchema as schema } from '@/models';
import { fields, formFields, tableFields } from './config';

const table: BackendTableObjectProps = {
	title: 'Projects',
	path: 'projects',
	export: true,
	fields: tableFields,
	button: {
		title: 'New Project',
		isModal: true,
		layout: formFields,
	},
	menu: [
		{
			title: 'View',
			type: 'view-modal',
			dataModel: convertToViewFields({ schema, fields }),
		},
		{
			title: 'Edit',
			type: 'edit-modal',
			layout: formFields,
		},
		{
			title: 'Delete',
			type: 'delete',
		},
	],
};

const page: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default page;
