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
import { jobPostSchema as schema } from '@/models';

const page: NextPage = () => {
	const tableFields = convertToTableFields({
		schema,
		fields: [
			'name',
			'company',
			'category',
			'postingDate',
			'status',
			'postingMedia',
			'employmentType',
			'noOfOpenings',
			'minSalary',
			'jobLocationType',
			'jobLocation',
			'shift',
			'isActive',
			'applicationUrl',
		],
	});

	const viewFields = convertToViewFields({
		schema,
		fields: [
			'name',
			'company',
			'status',
			'noOfOpenings',
			'email',
			'category',
			'postingDate',
			'postingMedia',
			'experienceLevel',
			'educationLevel',
			'applicationProcess',
			'shift',
			'phone',
			'website',
			'address',
			'city',
			'country',
			'industry',
			'companyDescription',
			'employmentType',
			'jobLocationType',
			'jobLocation',
			'minSalary',
			'maxSalary',
			'salaryType',
			'salaryCurrency',
			'jobDescription',
			'requirements',
			'qualifications',
			'responsibilities',
			'tags',
			'applicationUrl',
			'companyLogo',
			'skills',
			'benefits',
			'addedBy',
			'isActive',
			'deadline',
			'file',
			'fileUrl',
		],
	});
	const formFields = convertToFormFields({
		schema,
		layout: [
			{
				sectionTitle: 'Basic Information',
				fields: [
					'name',
					['company', 'category'],
					['website', 'status'],
					['postingDate', 'deadline'],
					['postingMedia', 'applicationUrl'],
					'tags',
				],
			},
			{
				sectionTitle: 'Job Details',
				fields: [
					['employmentType', 'noOfOpenings'],
					['minSalary', 'maxSalary'],
					['salaryType', 'shift'],
					['jobLocationType', 'jobLocation'],
				],
			},
			{
				sectionTitle: 'Contact & Location',
				fields: [['phone', 'email'], ['city', 'country'], 'address'],
			},
			{
				sectionTitle: 'Company Descroption',
				fields: ['companyDescription'],
			},
			{
				sectionTitle: 'Job Description',
				fields: [
					'jobDescription',
					'responsibilities',
					'requirements',
					'qualifications',
					'benifits',
					'skills',
					'experienceLevel',
					'educationLevel',
				],
			},
			{
				sectionTitle: 'Relevant Files & Documents',
				description: 'Upload Relevant Documents and files for this job post',
				fields: ['file', 'fileUrl'],
			},
		],
	});

	const table: TableObjectProps = {
		title: 'Job Posts',
		path: 'jobposts',
		data: tableFields,

		button: {
			title: 'New Job Post',
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
