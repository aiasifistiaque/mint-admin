'use client';

import React from 'react';
import { NextPage } from 'next';
import {
	PageTable,
	TableObjectProps,
	convertToViewFields,
	convertToTableFields,
} from '@/components/library';
import schema from '@/models/admin/schema';

const fields = ['name', 'email', 'phone', 'role', 'shop'];

const table: TableObjectProps = {
	title: 'Sellers',
	path: 'sellers',
	export: true,

	menu: [
		{
			title: 'View',
			type: 'view-modal',
			dataModel: convertToViewFields({ schema, fields }),
		},
	],
	data: convertToTableFields({ schema, fields }),
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
