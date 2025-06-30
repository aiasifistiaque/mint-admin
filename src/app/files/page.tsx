'use client';
import React from 'react';
import { NextPage } from 'next';
import { ServerPageTable, ServerTableObjectProps } from '@/components/library';

const table: ServerTableObjectProps = {
	title: 'File Management',
	path: 'files',

	menu: [
		{ type: 'view-server-modal', title: 'View' },
		{ type: 'view-item', title: 'Go To Post' },
		{
			title: 'Update Information',
			type: 'edit-server-modal',
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <ServerPageTable table={table} />;
};

export default BrandPage;
