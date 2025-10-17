import React, { ReactNode } from 'react';
import { Column, DetailItem } from '@/components/library';
import { Grid } from '@chakra-ui/react';

const BasicDetails = ({ data }: { data: any }) => {
	const convertAddress = (address: any) => {
		if (!address) return 'Walk-in Customer';
		const add = address?.address ? `${address?.address}, ` : '';
		const street = address?.street ? `${address?.street}, ` : '';
		const city = address?.city ? `${address?.city}, ` : '';
		const postalCode = address?.postalCode ? `${address?.postalCode}, ` : '';
		const country = address?.country ? `${address?.country}` : '';
		return `${add}${street}${city}${postalCode}${country}`;
	};
	return (
		<Grid
			gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
			gap={2}>
			<Section>
				<Item title='Invoice:'>#{data?.invoice}</Item>
				<Item title='Customer:'>{data?.customer?.name || 'Walk-in Customer'}</Item>
				<Item title='Order Date:'>
					{data?.createdAt ? new Date(data?.createdAt).toLocaleDateString() : ''}
				</Item>
				<Item title='Order Time:'>
					{data?.createdAt ? new Date(data?.createdAt).toLocaleTimeString() : ''}
				</Item>

				<Item title='Address:'>{convertAddress(data?.address)}</Item>
			</Section>
			<Section>
				<Item title='Recipient:'>{data?.address?.name}</Item>
				<Item title='Email:'>{data?.address?.email}</Item>
				<Item title='Phone:'>{data?.address?.phone}</Item>
				<Item title='Payment Status:'>{data?.isPaid ? 'Paid' : 'Due'}</Item>
			</Section>
		</Grid>
	);
};

const Item = ({ children, title }: { children: ReactNode; title: string }) => (
	<DetailItem
		row
		title={title}>
		{children}
	</DetailItem>
);

const Section = ({ children }: { children: ReactNode }) => (
	<Column
		gap={1.5}
		fontSize='.95rem'>
		{children}
	</Column>
);

export default BasicDetails;
