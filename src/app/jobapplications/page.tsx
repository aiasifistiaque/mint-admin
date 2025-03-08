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
import { jobApplicationSchema as schema } from '@/models';

export const tableFields = [
	'name',
	'jobPost',
	'email',
	'phone',
	'status',
	'scheduledAt',
	'fit',
	'resume',
	'university',
	'passingYear',
	'linkedin',
	'portfolioUrl',
	'city',
	'appliedAt',
	'appliedFrom',
];

export const formFields = [
	{
		sectionTitle: 'Personal Information',
		fields: [
			['name', 'jobPost'],
			['email', 'phone'],
			['city', 'status'],
			['scheduledAt', 'fit'],
		],
	},
	{
		sectionTitle: 'Education',
		fields: [['university', 'passingYear']],
	},
	{
		sectionTitle: 'Links',
		fields: [['linkedin', 'portfolioUrl']],
	},
	{
		sectionTitle: 'Application Details',
		fields: ['appliedAt', 'appliedFrom'],
	},
];

export const fields = [
	'jobPost',
	'name',
	'email',
	'phone',
	'address',
	'city',
	'coverLetter',
	'resume',
	'resumeUrl',
	'status',
	'scheduledAt',
	'educationLevel',
	'school',
	'college',
	'degree',
	'university',
	'passingYear',
	'portfolioUrl',
	'linkedin',
	'github',
	'facebook',
	'website',
	'expectedSalary',
	'appliedAt',
	'appliedFrom',
	'experienceLevel',
	'skills',
	'notes',
	'tags',
];

const page: NextPage = () => {
	const tableLayout = convertToTableFields({
		schema,
		fields: tableFields,
	});

	const viewFields = convertToViewFields({
		schema,
		fields: fields,
	});
	const formLayout = convertToFormFields({
		schema,
		layout: formFields,
	});

	const table: TableObjectProps = {
		title: 'Job Applications',
		path: 'jobapplications',
		data: tableLayout,
		export: true,

		button: {
			title: 'New Job Application',
			isModal: true,
			dataModel: formLayout,
		},
		menu: [
			{
				type: 'view-modal',
				dataModel: viewFields,
				title: 'View',
			},
			{
				type: 'edit-modal',
				title: 'Edit',
				dataModel: formLayout,
			},
			{
				type: 'delete',
				title: 'Delete',
			},
		],
	};

	return <PageTable table={table} />;
};

export default page;
