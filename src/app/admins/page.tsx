'use client';

import React from 'react';
import { NextPage } from 'next';
import { PageTable, TableObjectProps, convertToViewFields, convertToTableFields } from '@/components/library';
import { adminSchema as schema } from '@/models';
import { fields, tableFields } from './config';
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
