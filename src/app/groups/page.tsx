'use client';

import React from 'react';
import { NextPage } from 'next';
import {
	convertToFormFields,
	convertToTableFields,
	PageTable,
	TableObjectProps,
} from '@/components/library';
import schema from '@/models/group/group.schema';

const tableFields = convertToTableFields({ schema, fields: ['name'] });
const formFields = convertToFormFields({
	schema,
	layout: [
		{
			sectionTitle: 'Group Info',
			fields: ['name', 'description'],
		},
	],
});

const table: TableObjectProps = {
	title: 'Groups',
	path: 'groups',
	filters: false,
	data: tableFields,
	isModal: true,
	button: {
		title: 'Add Group',
	},
	createModel: formFields,
	preferences: ['name'],
	hidePreferences: true,
	menu: [
		{
			type: 'edit-modal',
			title: 'Edit',
			dataModel: formFields,
		},
	],
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
