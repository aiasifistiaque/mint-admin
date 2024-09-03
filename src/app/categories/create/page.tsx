'use client';

import React from 'react';
import { useAddCategoryMutation } from '@/store/services/categoriesApi';

import { useFormData, FormPage } from '@/components/library';

const fields: any = [
	{
		sectionTitle: 'Details',
		name: 'name',
		label: 'Category Name',
		isRequired: true,
		type: 'text',
	},
	{
		name: 'description',
		label: 'Description',
		isRequired: false,
		type: 'textarea',
	},
	{
		name: 'priority',
		label: 'Priority',
		isRequired: false,
		type: 'number',
	},
	{
		name: 'isActive',
		label: 'Is Active',
		isRequired: false,
		type: 'checkbox',
		endOfSection: true,
	},
];

const CreateCategoryPage = () => {
	const [trigger, result] = useAddCategoryMutation();
	const [formData, setFormData] = useFormData(fields);

	return (
		<FormPage
			data={fields}
			formData={formData}
			setFormData={setFormData}
			trigger={trigger}
			result={result}
			path='categories'
			title='Create Category'
		/>
	);
};

export default CreateCategoryPage;
