'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { schema } from '../../../../models';
import { Heading } from '@chakra-ui/react';

import { viewAllDataFields } from '../../../../models/order';
import TableCustom from '../../../../components/library/sections/table/TableCustom';
import ledgerSchema from '@/models/ledger/ledger.schema';
import {
	convertToTableFields,
	convertToViewFields,
	Column,
	Layout,
	ViewById,
	TableObjectProps,
} from '@/components/library';

const viewDataFields = convertToViewFields({ schema: ledgerSchema });

const ledgerViewFields = convertToTableFields({
	schema: ledgerSchema,
	fields: ['amount', 'amountReceived', 'amountSent', 'account', 'date', 'note'],
});

const viewLedger = (id: string): TableObjectProps => {
	return {
		title: 'Customer Ledger',
		path: 'ledgers',
		export: false,
		search: false,
		hidePreferences: true,
		filters: false,
		limit: 5,
		pagination: false,
		topPagination: true,
		preferences: ['amount', 'amountReceived', 'amountSent', 'account', 'date'],
		preFilters: {
			customer: id,
		},
		menu: [
			{
				type: 'view-modal',
				title: 'View',
				dataModel: viewDataFields,
			},
		],

		data: ledgerViewFields,
	};
};

const viewAll = (id: string): TableObjectProps => {
	return {
		title: 'Customer Orders',
		path: 'orders',
		export: false,
		search: false,
		clickable: true,
		toPath: '/orders',
		hidePreferences: true,
		filters: false,
		limit: 5,
		pagination: false,
		topPagination: true,
		preferences: ['customer.name', 'totalItems', 'status', 'total', 'dueAmount', 'createdAt'],
		preFilters: {
			customer: id,
		},

		data: viewAllDataFields,
		showMenu: false,
	};
};

const OrderTable = ({ id }: { id: string }) => {
	return <TableCustom table={viewAll(id)} />;
};

const CustomerLedgers = ({ id }: { id: string }) => {
	return <TableCustom table={viewLedger(id)} />;
};

const ViewPage = () => {
	const { id }: { id: string } = useParams();

	return (
		<Layout
			title='Customer'
			path='customers'>
			<Column gap={6}>
				<Heading size='md'>Basic Info</Heading>
				<ViewById
					schema={schema['customers']}
					path='customers'
					id={id}
				/>
			</Column>
			<Column
				gap={2}
				py={6}
				pb={2}>
				<Heading size='md'>Customer Orders</Heading>
				{id && <OrderTable id={id} />}
			</Column>
			<Column
				gap={2}
				pb={2}>
				<Heading size='md'>Customer Ledger</Heading>
				{id && <CustomerLedgers id={id} />}
			</Column>
		</Layout>
	);
};

export default ViewPage;
