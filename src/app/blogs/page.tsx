'use client';
import React from 'react';
import { NextPage } from 'next';
import { ServerPageTable, ServerTableObjectProps } from '@/components/library';

const table: ServerTableObjectProps = {
	title: 'Blog Management',
	path: 'blogs',
	button: {
		title: 'New Blog',
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
			title: 'Open Editor',
			type: 'custom-redirect',
			href: data => '/blogs/edit-content/' + data?._id,
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <ServerPageTable table={table} />;
};

export default BrandPage;
