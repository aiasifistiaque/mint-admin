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
import schema from '@/models/shop/shop.schema';

const tableFields = convertToTableFields({
	schema,
	fields: [
		'id',
		'name',
		'owner',
		'email',
		'phone',
		'isActive',
		'isExpired',
		'createdAt',
		'package',
		'expire',
	],
});

const viewFields = convertToViewFields({ schema });
const formFields = convertToFormFields({
	schema,
	layout: [
		{
			sectionTitle: 'Shop Information',
			fields: ['shopName', 'email', 'phone', 'package'],
		},
		{
			sectionTitle: 'Shop Owner Information',
			fields: ['name', 'password', 'confirm'],
		},
	],
});

const table: TableObjectProps = {
	title: 'Shops',
	path: 'shops',
	data: tableFields,
	isModal: true,
	createModel: formFields,
	button: {
		title: 'Add Shop',
	},
	menu: [
		{
			type: 'view-modal',
			title: 'View Details',
			dataModel: viewFields,
		},
		{
			type: 'update-api',
			title: 'Renew Package',
			path: 'packages/renew',
			id: (data: any) => data?._id,
			invalidate: ['shops'],
			renderCondition: (data: any) => data?.package,
			prompt: {
				title: 'Renew Package',
				body: 'Are you sure you want to renew this package?',
				btnText: 'Confirm',
				successMsg: 'Package renewed successfully',
			},
		},

		{
			type: 'update-key',
			title: 'Assign Package',
			keyType: 'data-menu',
			path: 'packages/assign-package',
			dataPath: 'packages',
			key: 'subscription',
			invalidate: ['shops'],
			renderCondition: (data: any) => !data?.package,
			prompt: {
				title: 'Assign Package',
				body: 'Select a package to assign to this shop',
				btnText: 'Confirm',
				successMsg: 'Package assigned successfully',
			},
		},
		{
			type: 'update-api',
			title: 'Mark as Inactive',
			path: 'shops',
			id: (data: any) => data?._id,
			body: { isActive: false },
			renderCondition: (data: any) => data?.isActive && new Date(data?.expire) < new Date(),
			prompt: {
				title: 'Mark as Inactive',
				body: 'Are you sure you want to mark this shop as inactive?',
				btnText: 'Confirm',
				successMsg: 'Shop deactivated successfully',
			},
		},
	],
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
