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

	select: {
		show: true,
		menu: [
			{
				type: 'update-api',
				title: 'Turn On Permission for Selected',

				key: 'permissionProtected',
				value: true,
				prompt: {
					title: 'Turn On Permission',
					body: 'This will turn on the permission protection for this item. Are you sure you want to proceed?',
					successMsg: 'Permission protection turned on successfully',
				},
			},
			{
				type: 'update-api',
				title: 'Turn Off Permission for Selected',
				key: 'permissionProtected',
				value: false,

				prompt: {
					title: 'Turn Off Permission',
					body: 'This will turn off the permission protection for this item. Are you sure you want to proceed?',
					successMsg: 'Permission protection turned off successfully',
				},
			},
		],
	},

	menu: [
		{ type: 'view-server-modal', title: 'View' },
		{ type: 'view-item', title: 'Go To Post' },
		{
			title: 'Edit Details',
			type: 'edit-server-modal',
		},
		{
			type: 'update-api',
			title: 'Turn On Permission',
			path: 'sidebaritems',
			id: (data: any) => data?._id,
			body: { permissionProtected: true },
			renderCondition: (data: any) => !data?.permissionProtected,
			prompt: {
				title: 'Turn On Permission',
				body: 'This will turn on the permission protection for this item. Are you sure you want to proceed?',
				btnText: 'Confirm',
				successMsg: 'Permission protection turned on successfully',
			},
		},
		{
			type: 'update-api',
			title: 'Turn Off Permission',
			path: 'sidebaritems',
			id: (data: any) => data?._id,
			body: { permissionProtected: false },
			renderCondition: (data: any) => data?.permissionProtected,
			prompt: {
				title: 'Turn Off Permission',
				body: 'This will turn off the permission protection for this item. Are you sure you want to proceed?',
				btnText: 'Confirm',
				successMsg: 'Permission protection turned off successfully',
			},
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
