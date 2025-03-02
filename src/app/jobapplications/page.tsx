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

const page: NextPage = () => {
	const tableFields = convertToTableFields({
		schema,
		fields: [
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
		],
	});

	const viewFields = convertToViewFields({
		schema,
		fields: [
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
		],
	});
	const formFields = convertToFormFields({
		schema,
		layout: [
			{
				sectionTitle: 'Basic Information',
				fields: ['jobPost', ['name', 'status'], ['email', 'phone'], ['city', 'fit'], 'address'],
			},
			{
				sectionTitle: 'Application Details',
				fields: [['appliedAt', 'appliedFrom'], 'coverLetter', ['resume', 'resumeUrl']],
			},
			{
				sectionTitle: 'Schedule Interview',
				fields: ['scheduledAt'],
			},
			{
				sectionTitle: 'Personal Details',
				fields: [
					['educationLevel', 'degree'],
					['school', 'college'],
					['university', 'passingYear'],
					['portfolioUrl', 'linkedin'],
					['github', 'facebook'],
					['website', 'expectedSalary'],
					'skills',
				],
			},

			{
				sectionTitle: 'For Official Use',
				fields: ['notes', 'tags'],
			},
		],
	});

	const table: TableObjectProps = {
		title: 'Job Applications',
		path: 'jobapplications',
		data: tableFields,
		export: true,

		button: {
			title: 'New Job Application',
			isModal: true,
			dataModel: formFields,
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
				dataModel: formFields,
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
