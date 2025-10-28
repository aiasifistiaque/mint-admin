import React from 'react';
import {
	convertToTableFields,
	TableObjectProps,
	Column,
	SpaceBetween,
	FormLayout,
	createFormFields,
	CreateModal,
} from '@/components/library';
import TableCustom from '@/components/library/sections/table/TableCustom';
import { adjustmentSchema } from '@/models/payment/payment.model';
import { Button, Heading } from '@chakra-ui/react';

const fields = ['invoice', 'amount', 'date', 'trnxId', 'reference', 'paymentMethod'];
const viewFileds = convertToTableFields({
	schema: adjustmentSchema,
	fields,
});

const formLayout: FormLayout = [
	{
		sectionTitle: 'Payment details',
		fields: [
			'invoice',
			'due',
			'account',
			['amount', 'paymentMethod'],
			'date',

			['trnxId', 'reference'],
		],
	},

	{
		sectionTitle: 'Additional Information',
		fields: ['tags', 'note', 'attachments'],
	},
];

const OrderPayments = ({ order, invoice }: { order: any; invoice: string }) => {
	const viewAll: TableObjectProps = {
		title: 'Order Payments',
		path: 'payments',
		export: false,
		search: false,
		hidePreferences: true,
		filters: false,
		pagination: false,
		preferences: fields,
		data: viewFileds,
		showMenu: false,
		topPagination: true,
		preFilters: {
			invoice,
		},
	};

	const { invoice: delInvoice, account, ...schema } = adjustmentSchema;

	const extendSchema = {
		invoice: {
			label: 'Order Id',
			type: 'read-only',
			isDisabled: true,
			value: order,
		},
		account: {
			type: 'read-only',
			value: 'credit',
			renderCondition: () => false,
		},
		...schema,
	};

	const formDataModel = createFormFields({ schema: extendSchema, layout: formLayout });

	return (
		<Column gap={2}>
			<SpaceBetween align='center'>
				<Heading size='md'>Payments for Invoice #{invoice}</Heading>
				<CreateModal
					title={`Add Payment for Invoice #${invoice}`}
					path='payments'
					invalidate={['payments', 'orders']}
					data={formDataModel}>
					<Button
						colorPalette='brand'
						size='sm'>
						Add Payment
					</Button>
				</CreateModal>
			</SpaceBetween>
			<TableCustom table={viewAll} />
		</Column>
	);
};

export default OrderPayments;
