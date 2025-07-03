'use client';
import React from 'react';
import { NextPage } from 'next';
import { ServerPageTable, ServerTableObjectProps } from '@/components/library';

const table: ServerTableObjectProps = {
	title: 'Permission Management',
	subTitle:
		'Manage permissions for your application, including creating, editing, and deleting permissions.',
	path: 'permissions',
	button: {
		title: 'Add Permission',
		isModal: true,
	},

	menu: [
		{ type: 'view-server-modal', title: 'View' },
		{ type: 'view-item', title: 'Go To Post' },
		{
			title: 'Edit Details',
			type: 'edit-server-modal',
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const ServerPage: NextPage = () => {
	return <ServerPageTable table={table} />;
};

export default ServerPage;
