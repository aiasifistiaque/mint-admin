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
import { themeSchema as schema } from '@/models';

const tableFields = convertToTableFields({
	schema,
	fields: [
		'name',
		'slug',
		'gitRepo',
		'price',
		'isDiscounted',
		'discountedPrice',
		'developer',
		'views',
		'likes',
		'downloads',
	],
});

const viewFields = convertToViewFields({ schema });
const formFields = convertToFormFields({
	schema,
	layout: [
		{
			sectionTitle: 'Basic Information',
			fields: [
				'image',
				'name',
				['slug', 'gitRepo'],
				['developer', 'framework'],
				['useCase', 'css'],
			],
		},
		{
			sectionTitle: 'Description',
			fields: ['title', 'shortDescription', 'description', 'images'],
		},
		{
			sectionTitle: 'Pricing',
			fields: ['price', ['isDiscounted', 'discountedPrice']],
		},
		{
			sectionTitle: 'Demo',
			fields: ['demoUrl'],
		},
	],
});

const table: TableObjectProps = {
	title: 'Themes',
	path: 'themes',
	data: tableFields,
	// isModal: true,
	// createModel: formFields,
	button: {
		title: 'Add Theme',
		isModal: true,
		dataModel: formFields,
	},
	menu: [
		{
			type: 'edit-modal',
			title: 'Edit',
			dataModel: formFields,
		},
		{
			type: 'delete',
			title: 'Delete',
		},
	],
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
