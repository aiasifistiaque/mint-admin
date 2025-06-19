'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { schema } from '../../../../models';
import { Column, Layout, ViewById, TableObjectProps } from '../../../../components-v0/library';
import { Heading } from '@chakra-ui/react';

import TableCustom from '../../../../components-v0/library/sections/table/TableCustom';
import ledgerSchema from '@/models/ledger/ledger.schema';
import { convertToTableFields, convertToViewFields } from '@/components/library';

const viewDataFields = convertToViewFields({ schema: ledgerSchema });

const ledgerViewFields = convertToTableFields({
	schema: ledgerSchema,
	fields: ['amount', 'amountReceived', 'amountSent', 'account', 'date', 'note'],
});

const viewLedger = (id: string): TableObjectProps => {
	return {
		title: 'Supplier Ledger',
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
			supplier: id,
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

const CustomerLedgers = ({ id }: { id: string }) => {
	return <TableCustom table={viewLedger(id)} />;
};

const ViewPage = () => {
	const { id }: { id: string } = useParams();

	return (
		<Layout
			title='Supplier'
			path='suppliers'>
			<Column gap={6}>
				<Heading size='md'>Basic Info</Heading>
				<ViewById
					schema={schema['suppliers']}
					path='suppliers'
					id={id}
				/>
			</Column>

			<Column
				gap={2}
				pb={2}>
				<Heading size='md'>Supplier Ledger</Heading>
				{id && <CustomerLedgers id={id} />}
			</Column>
		</Layout>
	);
};

export default ViewPage;
