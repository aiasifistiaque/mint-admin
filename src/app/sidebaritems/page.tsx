'use client';
import React from 'react';
import { NextPage } from 'next';
import { ServerPageTable, ServerTableObjectProps } from '@/components/library';

const table: ServerTableObjectProps = {
	title: 'Sidebar Item',
	path: 'sidebaritems',
	button: {
		title: 'Add Item',
		isModal: true,
	},

	menu: [
		{ type: 'view-server-modal', title: 'View' },
		{ type: 'view-item', title: 'Go To Post' },
		{
			title: 'Edit Details',
			type: 'edit-server-modal',
		},
		{
			type: 'update-key',
			title: 'Update Priority',
			keyType: 'number',
			key: 'priority',
			prompt: {
				title: 'Update Priority',
				body: 'Enter the new priority value for this item.',
			},
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <ServerPageTable table={table} />;
};

export default BrandPage;
