'use client';

import React from 'react';
import { EditItemPage } from '@/components/library';

import { table } from '../../create/dataModel';

const inputFields: any = [
	{
		sectionTitle: 'Product Image',
		name: 'image',
		label: 'Image',
		isRequired: false,
		type: 'image',
		endOfSection: true,
	},
	{
		name: 'name',
		label: 'Name',
		isRequired: true,
		type: 'text',
	},
	{
		label: 'Item Price',
		name: 'price',
		isRequired: true,
		type: 'number',
	},
	{
		name: 'time',
		label: 'Cooking Time',
		isRequired: false,
		type: 'number',
	},
	{
		name: 'description',
		label: 'Short Description',
		isRequired: false,
		type: 'textarea',
	},
	{
		name: 'longDescription',
		label: 'Long Description',
		isRequired: false,
		type: 'textarea',
	},
	{
		name: 'category',
		label: 'Item Category',
		isRequired: true,
		type: 'data-select',
		model: 'categories',
	},

	{
		sectionTitle: 'Product Collections',
		name: 'collection',
		label: 'Add to collections',
		isRequired: false,
		type: 'data-tag',
		model: 'collections',
	},
	{
		name: 'tags',
		label: 'Add Tags',
		isRequired: false,
		type: 'tag',
	},
];

const UpdateItemPage = () => {
	return (
		<>
			<EditItemPage data={table} />
		</>
	);
};

export default UpdateItemPage;
