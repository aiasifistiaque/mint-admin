import { Flex, Center, Text, Button, Grid } from '@chakra-ui/react';
import React from 'react';
import {
	useGetByIdQuery,
	createFormFields,
	CreateModal,
	Column,
	DetailItem,
	Section,
} from '@/components/library';

import { deliverySchema } from '@/models/delivery/delivery.schema';

const OrderDelivery = ({ id, order }: { id: string; order: string }) => {
	const extendSchema = {
		...deliverySchema,
		order: {
			type: 'read-only',
			title: 'Order',
			required: true,
			value: order,
		},
	};

	const formFields = createFormFields({
		schema: extendSchema,
		layout: [
			{
				sectionTitle: 'Basic Information',
				fields: ['order', 'invoice', 'receiveAmount', 'status'],
			},
			{
				sectionTitle: 'Delivery Information',
				fields: ['deliveryCompany', 'trackingId', 'trackingUrl', 'estimatedDeliveryData'],
			},
			{
				sectionTitle: 'Additional Information',
				fields: ['tags', 'note'],
			},
		],
	});

	const editFields = createFormFields({
		schema: extendSchema,
		layout: [
			{
				sectionTitle: 'Basic Information',
				fields: ['order', 'receiveAmount', 'status'],
			},
			{
				sectionTitle: 'Delivery Information',
				fields: ['deliveryCompany', 'trackingId', 'trackingUrl', 'estimatedDeliveryData'],
			},
			{
				sectionTitle: 'Additional Information',
				fields: ['tags', 'note'],
			},
		],
	});

	const { data, isFetching, isLoading } = useGetByIdQuery(
		{
			path: 'deliveries',
			id,
		},
		{
			skip: !id,
		}
	);

	return (
		<Section
			heading='Delivery Information'
			rightComponent={
				id &&
				data && (
					<CreateModal
						data={editFields}
						title='Update Delivery Info'
						invalidate={['deliveries', 'orders']}
						type='update'
						id={id}
						path='deliveries'>
						<Button size='sm'>Update</Button>
					</CreateModal>
				)
			}>
			<>
				{!id || !data ? (
					<Center
						flexDir='column'
						textAlign='center'
						gap={4}
						minH='64px'>
						<Text>No Delivery Information Found</Text>
						<CreateModal
							data={formFields}
							title='Add Delivery Info'
							invalidate={['deliveries', 'orders']}
							path='deliveries'>
							<Button size='sm'>Add Delivery</Button>
						</CreateModal>
					</Center>
				) : (
					<Grid
						gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
						gap={2}>
						<Sec>
							<Item title='Invoice:'>#{data?.invoice}</Item>
							<Item title='Courier:'>{data?.deliveryCompany}</Item>
							<Item title='Tracking ID:'>{data?.trackingId}</Item>
							<Item title='Tracking URL:'>{data?.trackingUrl}</Item>
							<Item title='Status:'>{data?.status}</Item>
							<Item title='Delivery Message:'>{data?.trackingMessage}</Item>

							{/* <Item title='Address:'>{convertAddress(data?.address)}</Item> */}
						</Sec>
						<Sec>
							<Item title='Receivable:'>{data?.receiveAmount}</Item>
							<Item title='Amount Received:'>{data?.amountReceived}</Item>
							<Item title='Delivery Charge:'>{data?.deliveryCharge}</Item>
							<Item title='Note:'>{data?.note}</Item>
							<Item title='Est. Delivery date:'>
								{data?.estimatedDeliveryDate
									? new Date(data?.estimatedDeliveryDate).toLocaleDateString()
									: ''}
							</Item>
						</Sec>
					</Grid>
				)}
			</>
		</Section>
	);
};

const Item = ({ children, title }: { children: React.ReactNode; title: string }) => (
	<DetailItem
		row
		title={title}>
		{children}
	</DetailItem>
);

const Sec = ({ children }: { children: React.ReactNode }) => (
	<Column
		gap={1.5}
		fontSize='.95rem'>
		{children}
	</Column>
);

export default OrderDelivery;
