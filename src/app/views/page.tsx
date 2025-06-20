'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';
import { formFields, fields, tableFields } from './config';

const table: BackendTableObjectProps = {
	title: 'Page Views',
	subTitle:
		'Track and manage all your website page views in one place. Monitor real-time visitor activity, identify your most popular pages, and gain valuable insights with detailed analytics to optimize performance. Stay in control of your web traffic and make smarter decisions with ease.',
	path: 'views',
	export: true,

	// button: {
	// 	title: 'Add Stack',
	// 	isModal: true,
	// 	layout: formFields,
	// },
	fields: tableFields,

	menu: [
		{ type: 'view-modal', title: 'View', fields },
		{ type: 'view-item', title: 'Go To Post' },
		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
