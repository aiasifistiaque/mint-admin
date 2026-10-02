'use client';
import React from 'react';
import { NextPage } from 'next';
import { BackendPageTable, BackendTableObjectProps } from '@/components/library';
import { fields, formFields, tableFields } from './config';

/**
 * The support team's queue. Tickets are opened from the Support page (/support)
 * by any admin; "Open thread" answers one there.
 */
const table: BackendTableObjectProps = {
	title: 'Support Tickets',
	path: 'support-tickets',
	export: true,
	fields: tableFields,

	menu: [
		{ type: 'link', title: 'Open thread', href: '/support' },
		{ type: 'view-modal', title: 'View', fields },
		{ type: 'edit-modal', title: 'Edit', layout: formFields },
		{ type: 'delete', title: 'Delete' },
	],
};

const SupportTicketsPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default SupportTicketsPage;
