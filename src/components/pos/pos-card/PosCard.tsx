import React from 'react';
import { Box, Badge, Flex, Image, Text, Heading, Button } from '@chakra-ui/react';

import {
	PLACEHOLDER_IMAGE,
	ImageContainer,
	Column,
	useAppDispatch,
	addToCart,
	currency,
	ViewItemModal,
	AddToCartModal,
} from '@/components/library';

import CardContainer from './CardContainer';

import { viewPreviewFields as viewAllDataFields } from '@/models/products/products.model';

const PosCard = ({ item }: { item: any }) => {
	// const dispatch = useAppDispatch();

	// const handleAddToCart = (item: any) => {
	// 	dispatch(addToCart(item));
	// };

	const title = `${item?.name} ${
		item?.unit !== undefined ? `(${item?.unitValue} ${item?.unit})` : ''
	}`;

	const price = (
		<>
			<Text fontSize='.95rem'>
				{currency.symbol} {item?.price?.toLocaleString()}
			</Text>
			{item?.vat > 0 && <Text fontSize='.8rem'>{item?.vat > 0 ? `+ VAT` : null}</Text>}
		</>
	);

	const quickView = (
		<Flex
			flex={1}
			// justify='flex-end'
			onClick={(e: any) => {
				e.stopPropagation();
			}}>
			<ViewItemModal
				id={item?._id}
				path='/products'
				dataModel={viewAllDataFields}
				trigger={<Button size='xs'>Quick View</Button>}
			/>
		</Flex>
	);

	const sku = item?.sku && (
		<Box>
			<Badge>SKU: {item?.sku}</Badge>
		</Box>
	);

	return (
		<AddToCartModal item={item}>
			{/* <CardContainer> */}
			<ImageContainer size={100}>
				<Image
					src={item?.image || PLACEHOLDER_IMAGE}
					h='100%'
					w='100%'
					objectFit='contain'
				/>
			</ImageContainer>
			<Column
				w='100%'
				flex={1}>
				<Heading size='xs'>{title}</Heading>
				<>{sku}</>
				<Flex
					gap={1}
					align='center'>
					{price}
				</Flex>
				<Flex
					align='flex-end'
					flex={1}>
					{quickView}
				</Flex>
			</Column>
			{/* </CardContainer> */}
		</AddToCartModal>
	);
};

export default PosCard;
