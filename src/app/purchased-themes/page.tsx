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
import { purchasedThemeSchema as schema } from '@/models';

const fields = [
	'theme',
	'name',
	'shop',
	'price',
	'isActivated',
	'activatedAt',
	'isDeployed',
	'deployment',
];

const tableFields = convertToTableFields({
	schema,
	fields,
});

const viewFields = convertToViewFields({
	schema,
	fields,
});
const formFields = convertToFormFields({
	schema,
	layout: [
		{
			sectionTitle: 'Purchase Information',
			fields: ['shop', 'theme', ['name', 'price']],
		},
		{
			sectionTitle: 'Additional Information',
			fields: ['isActivated', 'activatedAt'],
		},
	],
});

const table: TableObjectProps = {
	title: 'Purchased Themes',
	path: 'purchasedthemes',
	data: tableFields,
	button: {
		title: 'New Purchase',
		isModal: true,
		dataModel: formFields,
	},
	menu: [
		{
			type: 'view-modal',
			title: 'View Details',
			dataModel: viewFields,
		},
		{
			type: 'update-api',
			title: 'Make Default',
			path: 'purchasedthemes/make/default',
			invalidate: ['purchasedthemes'],
			renderCondition: (data: any) => !data?.isActivated,
			id: (data: any) => data?._id,
			bodyFn: (data: any) => ({ shop: data.shop?._id }),
			prompt: {
				title: 'Make this theme as default?',
				body: 'Are you sure you want to make this theme as default?',
				btnText: 'Proceed',
				successMsg: 'Theme set as default',
			},
		},
	],
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
