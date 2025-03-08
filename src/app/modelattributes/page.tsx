'use client';

import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';
import { fields, formFields, tableFields } from './config';

const table: BackendTableObjectProps = {
	title: 'Plan Schema',
	path: 'modelattributes',
	export: false,
	button: {
		title: 'New Attribute',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,
	menu: [
		{
			title: 'View',
			type: 'view-modal',
			fields: fields,
		},
		{
			title: 'Edit',
			type: 'edit-modal',
			layout: formFields,
		},
		{
			title: 'Duplicate',
			type: 'duplicate',
		},
		{
			title: 'Delete',
			type: 'delete',
		},
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
