'use client';
import React from 'react';
import { NextPage } from 'next';
import {
	convertToTableFields,
	convertToViewFields,
	PageTable,
	TableObjectProps,
} from '@/components/library';
import schema from '@/models/shop/shop.schema';

const tableFields = convertToTableFields({
	schema,
	fields: ['id', 'name', 'owner', 'email', 'phone', 'isActive', 'createdAt'],
});

const viewFields = convertToViewFields({ schema });

const table: TableObjectProps = {
	title: 'Shops',
	path: 'shops',
	data: tableFields,
	menu: [
		{
			type: 'view-modal',
			title: 'View Details',
			dataModel: viewFields,
		},
	],
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
