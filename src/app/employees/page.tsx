'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = [
	'code',
	'photo',

	'name',
	'email',

	'phone',
	'gender',

	'dob',
	'maritalStatus',

	'bloodGroup',
	'nationality',

	'employeeType',
	'reportingTo',

	//Address
	'presentAddress',
	'permanentAddress',

	//Education
	'university',
	'degree',
	'passingYear',
	'education',

	'whatsApp',
	'github',
	'discord',
	'nid',

	'status',
	'jobTitle',
	'department',
	'joiningDate',

	//Salary
	'salary',
	'bKash',
	'salaryDisburstmentPreference',
	'bankAccountName',
	'bankAccount',
	'bankName',
	'branchName',
	'bankRoutingNumber',

	//Experience
	'linkedIn',
	'experience',

	//Emergency Contact
	'adminId',
	'emergencyContactName',
	'emergencyContactRelationship',
	'emergencyContactNumber',

	//Contact
	'contractEndDate',
	'contractDoc',

	//Skills
	'skills',
	'foodSubsidy',

	//attachments
	'nidAttachment',
	'cvAttachment',

	//pricvacy
	'createdAt',
	'addedBy',
	'privacy',
	'access',
];

const formLayout: FormLayout = [
	{
		sectionTitle: 'Employee Details',
		fields: [
			'photo',
			['name', 'status'],
			['phone', 'email'],
			['gender', 'dob'],
			['employeeType', 'reportingTo'],
			['adminId', 'foodSubsidy'],
		],
	},
	{
		sectionTitle: 'Job Details',
		fields: [['jobTitle', 'department'], ['joiningDate', 'contractEndDate'], 'contractDoc'],
	},
	{
		sectionTitle: 'Personal Details',
		fields: [['maritalStatus', 'bloodGroup'], ['nid', 'nationality'], 'nidAttachment'],
	},
	{
		sectionTitle: 'Employee Address',
		fields: ['presentAddress', 'permanentAddress'],
	},
	{
		sectionTitle: 'Socials & Contact Details',
		fields: [
			['whatsApp', 'discord'],
			['github', 'linkedin'],
		],
	},
	{
		sectionTitle: 'Salary & Bank Details',
		fields: [
			['salary', 'salaryDisburstmentPreference'],
			['bkash', 'bankAccountName'],
			['bankAccount', 'bankName'],
			['branchName', 'bankRoutingNumber'],
		],
	},
	{
		sectionTitle: 'Emergency Contact',
		fields: ['emergencyContactName', ['emergencyContactRelationship', 'emergencyContactNumber']],
	},
	{
		sectionTitle: 'Education & Experience',
		fields: [['university', 'degree'], ['passingYear', 'skills'], 'education', 'experience'],
	},
	{
		sectionTitle: 'Access & Privacy',
		fields: ['privacy', 'access'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Employees',
	path: 'employees',
	button: {
		title: 'Add Employee',
		isModal: true,
		layout: formLayout,
	},
	fields: [
		'code',

		'name',
		'email',

		'phone',
		'gender',

		'employeeType',
		'reportingTo',

		'whatsApp',
		'github',
		'discord',

		'jobTitle',

		'joiningDate',

		'contractEndDate',

		'foodSubsidy',
	],

	menu: [
		{ type: 'view-modal', title: 'View', fields: viewFields },
		{ type: 'view-item', title: 'Go To Post' },

		{
			type: 'edit-modal',
			title: 'Edit',
			layout: formLayout,
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
