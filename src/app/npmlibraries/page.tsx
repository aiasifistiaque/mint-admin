'use client';

import React from 'react';
import { NextPage } from 'next';
import {
	convertToViewFields,
	BackendTableObjectProps,
	BackendPageTable,
} from '@/components/library';
import { clientSchema as schema } from '@/models';
import { fields, tableFields, formFields } from './config';

const table: BackendTableObjectProps = {
	title: 'Npm Packages',
	path: 'npmlibraries',
	button: {
		title: 'Add Package',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,
	menu: [
		{
			title: 'View',
			type: 'view-modal',
			fields,
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
