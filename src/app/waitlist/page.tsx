'use client';
import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable } from '@/components/library';
import { fields, formFields, tableFields } from './config';

/**
 * Early-access sign-ups from the marketing website (mint-webpage →
 * POST /public/waitlist). Approving one — from the row menu, the bulk menu or
 * by editing its status — emails them a link to create their account
 * (backend models/waitlist/waitlist.mail.ts). Signing up marks them Joined.
 */
const table: any = {
	title: 'Waitlist',
	path: 'waitlist',
	export: true,
	fields: tableFields,

	select: {
		show: true,
		menu: [
			{
				type: 'edit',
				title: 'Approve selected',
				key: 'status',
				value: 'approved',
				prompt: {
					title: 'Approve the selected people?',
					body: 'Each one not approved yet gets an email with a link to create their MINT account.',
					successMsg: 'Approved — the sign-up links are on their way',
				},
			},
			{
				type: 'edit',
				title: 'Decline selected',
				key: 'status',
				value: 'declined',
				prompt: { title: 'Decline the selected people?', body: 'No email is sent.', successMsg: 'Declined' },
			},
			{ type: 'export', title: 'Export selected' },
		],
	},

	menu: [
		{ type: 'view-modal', title: 'View', fields },
		{
			type: 'set-field',
			title: 'Approve',
			key: 'status',
			value: 'approved',
			fieldLabel: 'Status',
			valueLabel: 'Approved',
			prompt: {
				title: 'Approve this person?',
				body: 'They’ll get an email with a link to create their MINT account.',
				btnText: 'Approve and send link',
				successMsg: 'Approved — the sign-up link is on its way',
			},
		},
		{
			type: 'update-api',
			title: 'Resend signup link',
			path: 'waitlist/send-link',
			body: {},
			renderCondition: (doc: any) => doc?.status === 'approved',
			prompt: {
				title: 'Resend the sign-up link?',
				body: 'They’ll get the “Your spot is ready” email again.',
				btnText: 'Resend',
				successMsg: 'Sign-up link sent',
			},
		},
		{ type: 'edit-modal', title: 'Edit', layout: formFields },
		{ type: 'delete', title: 'Delete' },
	],
};

const WaitlistPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default WaitlistPage;
