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
import schema from '@/models/subscription/subscription.schema';

const tableFields = convertToTableFields({
	schema,
	fields: ['name', 'amount', 'duration', 'isDiscounted', 'isActive', 'createdAt'],
});

const viewFields = convertToViewFields({ schema });
const formFields = convertToFormFields({
	schema,
	layout: [
		{
			sectionTitle: 'Basic Information',
			fields: ['name', 'amount', 'duration', 'billingCycle'],
		},
		{
			sectionTitle: 'Discount Information',
			fields: ['isDiscounted', 'discountedPrice'],
		},
	],
});

const table: TableObjectProps = {
	title: 'Packages',
	path: 'packages',
	data: tableFields,
	isModal: true,
	createModel: formFields,
	button: {
		title: 'Add Package',
	},
	menu: [
		{
			type: 'view-modal',
			title: 'View Details',
			dataModel: viewFields,
		},
	],
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
