import React, { FC, useEffect } from 'react';
import { useState } from 'react';

import { CustomTd as Td, RowContainerBase, Icon, useGetByIdQuery } from '../..';
import { Box, Tr, Td as TD, Select, useColorModeValue } from '@chakra-ui/react';
import InputElement from '../../utils/inputs/input-components/InputElement';

type PurchaseProductProps = {
	item: any;
	i: number;
	setItem: any;
	deleteItem: any;
	viewOnly?: boolean;
	isMobile?: boolean;
};

const PurchaseVariantProduct: FC<PurchaseProductProps> = ({
	item,
	i,
	setItem,
	isMobile,
	deleteItem,
}) => {
	const { data } = useGetByIdQuery({ path: 'products', id: item?._id }, { skip: !item?._id });
	const [qty, setQty] = useState(1);
	const [price, setPrice] = useState(0);
	const [variantId, setVariantId] = useState('');
	const [variantName, setVariantName] = useState('');

	useEffect(() => {
		setQty(item?.qty);
		setPrice(item?.price);
		if (item?.variantId) {
			setVariantId(item?.variantId);
		}
		if (item?.variantName) {
			setVariantName(item?.variantName);
		}
	}, []);

	const handlePrice = (e: any) => {
		setPrice(e.target.value);
		setItem({ price: e.target.value, item, qty, variantId, variantName });
	};

	const handleVariant = (e: any) => {
		// Find the variant object from the variations array using the selected value
		const selectedVariant = item?.variations?.find(
			(variant: any) => variant._id === e.target.value
		);

		if (selectedVariant) {
			setVariantId(selectedVariant._id);
			setVariantName(selectedVariant.name);
			setPrice(selectedVariant.price); // Update price to match variant price
			setItem({
				variantId: selectedVariant._id,
				item,
				qty,
				price: selectedVariant.price,
				variantName: selectedVariant.name,
			});
		}
	};

	const handleReturnQty = (e: any) => {
		if (e.target.value < 0) {
			return;
		}
		setQty(e.target.value);
		setItem({ price, item, qty: e.target.value, variantId, variantName });
	};

	const borderColor = useColorModeValue('brand.500', 'brand.200');

	if (isMobile)
		return (
			<RowContainerBase>
				<Td heading='#'>{i + 1}</Td>
				<Td heading='Product Name'>{item?.name}</Td>

				<Td heading='Qty'>
					<InputElement
						size='xs'
						type='number'
						value={qty}
						onChange={handleReturnQty}
						w='100px'
					/>
				</Td>

				<Td heading='Variant'>
					<Select
						value={variantId}
						onChange={handleVariant}
						placeholder='Select variant'
						size='xs'
						px={3}
						borderRadius='lg'
						focusBorderColor={borderColor}
						color='text.500'
						_dark={{
							color: 'gray.300',
						}}
						_placeholder={{ fontSize: 14, fontWeight: '500' }}>
						{item?.variations?.map((variant: any) => (
							<option
								key={variant._id}
								value={variant?._id}>
								{variant?.name}
							</option>
						))}
					</Select>
				</Td>

				<Td heading='Unit Price'>
					<InputElement
						size='xs'
						type='number'
						value={price}
						onChange={handlePrice}
						w='100px'
					/>
				</Td>
				<Td
					isNumeric
					heading='SubTotal'>
					{item?.subTotal}
				</Td>

				<Td>
					<Box
						cursor='pointer'
						onClick={() => deleteItem(item?._id)}>
						<Icon name='delete' />
					</Box>
				</Td>
			</RowContainerBase>
		);
	return (
		<Tr h='2.5rem'>
			<TD>{i + 1}</TD>
			<TD>{item?.name}</TD>

			<TD>
				<InputElement
					size='xs'
					type='number'
					value={qty}
					onChange={handleReturnQty}
					w='100px'
				/>
			</TD>

			<TD>
				<Select
					value={variantId}
					onChange={handleVariant}
					placeholder='Select variant'
					size='xs'
					px={3}
					borderRadius='lg'
					focusBorderColor={borderColor}
					color='text.500'
					_dark={{
						color: 'gray.300',
					}}
					_placeholder={{ fontSize: 14, fontWeight: '500' }}>
					{data?.variations?.map((variant: any) => (
						<option
							key={variant?._id}
							value={variant?._id}>
							{variant?.name}
						</option>
					))}
				</Select>
			</TD>

			<TD>
				<InputElement
					size='xs'
					type='number'
					value={price}
					onChange={handlePrice}
					w='100px'
				/>
			</TD>
			<TD isNumeric>{item?.subTotal}</TD>

			<TD>
				<Box
					cursor='pointer'
					onClick={() => deleteItem(item?._id)}>
					<Icon name='delete' />
				</Box>
			</TD>
		</Tr>
	);
};

export default PurchaseVariantProduct;
