'use client';

import React from 'react';
import { useAddCategoryMutation } from '@/store/services/categoriesApi';
import fields from './dataModel';
import { useFormData, FormPage } from '@/components/library';

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
