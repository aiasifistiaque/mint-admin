import React from 'react';
import { Heading } from '@chakra-ui/react';
import { Align, PosInput } from '@/components/library';

const LeftSection = ({ data }: { data: any }) => {
	// const borderColor = useColorModeValue('#bbb', 'stroke.deepD');
	return (
		<>
			<Align
				py={3}
				borderBottom='1px dashed'
				borderTop='1px dashed'
				borderColor={'#bbb'}>
				<Heading size='sm'>Billing Details</Heading>
			</Align>

			<PosInput
				valueType='price'
				value={data?.total}
				label='Total'
				isDisabled
			/>
			<PosInput
				value={data?.paidAmount}
				isDisabled
				label='Paid Amount'
				valueType='price'
			/>
			<PosInput
				value={data?.returnAmount}
				isDisabled
				label='Returned Amount'
				valueType='price'
			/>
			<PosInput
				valueType='price'
				value={data?.dueAmount}
				label='Payable'
				isDisabled
			/>
			<PosInput
				isDisabled
				value={data?.paymentMethod}
				valueType='text'
				label='Payment Method'
			/>
			<PosInput
				valueType='text'
				label='Order Status'
				value={data?.status}
				isDisabled
			/>
		</>
	);
};

export default LeftSection;
