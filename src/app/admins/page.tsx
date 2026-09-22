'use client';

import React from 'react';
import { NextPage } from 'next';
import {
	PageTable,
	TableObjectProps,
	convertToViewFields,
	convertToTableFields,
	createFormFields,
} from '@/components/library';
import { adminSchema as schema } from '@/models';
import { fields, tableFields, formFields } from './config';
import InviteAdminModal from './InviteAdminModal';

const table: TableObjectProps = {
	title: 'Admin',
	path: 'admins',
	export: true,
	customButton: <InviteAdminModal />,
	menu: [
		{
			title: 'View',
			type: 'view-modal',
			dataModel: convertToViewFields({ schema, fields }),
		},
		{
			title: 'Edit',
			type: 'edit-modal',
			dataModel: createFormFields({ schema, layout: formFields }),
			renderCondition: (data: any) => data?.invitationStatus !== 'pending',
		},
		{
			type: 'update-api',
			title: 'Disable',
			body: { isActive: false },
			invalidate: ['admins'],
			renderCondition: (data: any) => data?.invitationStatus !== 'pending' && data?.isActive,
			prompt: {
				title: 'Disable Admin',
				body: 'Are you sure you want to disable this admin? They will no longer be able to sign in.',
				btnText: 'Disable',
				successMsg: 'Admin disabled',
			},
		},
		{
			type: 'update-api',
			title: 'Enable',
			body: { isActive: true },
			invalidate: ['admins'],
			renderCondition: (data: any) => data?.invitationStatus !== 'pending' && !data?.isActive,
			prompt: {
				title: 'Enable Admin',
				body: 'Are you sure you want to re-enable this admin?',
				btnText: 'Enable',
				successMsg: 'Admin enabled',
			},
		},
		{
			title: 'Delete',
			type: 'delete',
			renderCondition: (data: any) => data?.invitationStatus !== 'pending',
			prompt: {
				title: 'Delete Admin',
				body: 'This will permanently remove this admin account. This action cannot be undone.',
				successMsg: 'Admin deleted',
			},
		},
		{
			type: 'update-api',
			title: 'Resend Invitation',
			path: 'admin-invitations',
			id: (data: any) => `${data?._id}/resend`,
			invalidate: ['admins'],
			renderCondition: (data: any) => data?.invitationStatus === 'pending',
			prompt: {
				title: 'Resend Invitation',
				body: 'Send a new invitation link to this email? The previous link will stop working.',
				btnText: 'Resend',
				successMsg: 'Invitation resent',
			},
		},
		{
			type: 'delete',
			title: 'Cancel Invitation',
			path: 'admin-invitations',
			id: (data: any) => `${data?._id}/cancel`,
			invalidate: ['admins'],
			renderCondition: (data: any) => data?.invitationStatus === 'pending',
			prompt: {
				title: 'Cancel Invitation',
				body: 'This invitation link will stop working. You can invite this email again later.',
				successMsg: 'Invitation cancelled',
			},
		},
	],
	data: convertToTableFields({ schema, fields: tableFields }),
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
