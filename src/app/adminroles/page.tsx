'use client';
import React from 'react';
import { NextPage } from 'next';
import { ServerPageTable, ServerTableObjectProps } from '@/components/library';

const table: ServerTableObjectProps = {
	title: 'Role Management',
	subTitle: 'Manage roles and permissions for your application.',
	path: 'adminroles',
	button: {
		title: 'New Role',
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

const BrandPage: NextPage = () => {
	return <ServerPageTable table={table} />;
};

export default BrandPage;
