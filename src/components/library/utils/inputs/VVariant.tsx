import { FC, useEffect, useState } from 'react';

import { FormControl, Image, Stack, Flex, Heading, Input } from '@chakra-ui/react';
import { HelperText, Label, ImageContainer, Column, radius } from '../../';
import { Table, Tr, Th, Td, TableContainer, Tbody, Thead } from '@chakra-ui/react';

type FormDataType = {
	value: any;
	onChange: any;
	isRequired?: boolean;
	label?: string;
	helper?: string;
	isDisabled?: boolean;
	name: any;
	hasImage?: boolean;
	limit?: number;
	section?: any;
	form?: any;
};

const VVariant: FC<FormDataType> = ({
	value,
	onChange,
	isRequired = false,
	label,
	helper,
	isDisabled = false,
	name,
	limit = 999,
	form,
	section,
	...props
}) => {
	const { colors, sizes } = form || {};
	const [variants, setVariants] = useState(value || []);

	useEffect(() => {
		let variantArr: any = [];
		if (colors?.length === 0 || sizes?.length === 0) {
			value?.forEach((v: any) => variantArr.push(v)); // Keep existing variants
			setVariants(variantArr);
			onChange({
				target: {
					name,
					value: variantArr,
				},
			});
			return;
		}
		if (Array.isArray(colors) && Array.isArray(sizes)) {
			colors.forEach((color: string) => {
				sizes.forEach((size: string) => {
					const variantName = `${size}-${color}`;
					const existingVariant = value.find(
						(v: any) => v.name.toLowerCase() === variantName.toLowerCase()
					);
					if (existingVariant) {
						variantArr.push(existingVariant);
					} else {
						variantArr.push({
							name: variantName,
							price: form?.price,
							cost: form?.cost,
							stock: 0,
							sku: '',
							images: [...(form?.images ? [form?.images] : [])],

							attributes: [
								{ label: 'color', value: color },
								{ label: 'size', value: size },
							],
						});
					}
				});
			});
		}
		setVariants(variantArr);
		onChange({
			target: {
				name,
				value: variantArr,
			},
		});
	}, [form?.colors, form?.sizes]);

	const onVariantValueChange = (index: number, field: string, fieldValue: any) => {
		const updatedVariants = [...value];
		updatedVariants[index] = {
			...updatedVariants[index],
			[field]: fieldValue,
		};
		setVariants(updatedVariants);
		onChange({
			target: {
				name,
				value: updatedVariants,
			},
		});
	};

	return (
		<FormControl isRequired={isRequired}>
			<Stack w='full'>
				<Label fontSize='22px'>{label}</Label>
				<Column
					gap={4}
					my={4}>
					<Flex
						w='full'
						align='center'
						gap={6}>
						<Column
							gap={4}
							w='full'>
							<Heading size='sm'>Manage Product Variations</Heading>
							<Flex gap={1}>
								<TableContainer>
									<Table
										variant='simple'
										borderRadius={radius?.MODAL}
										borderWidth={1}>
										<Thead>
											<Tr>
												<Th>Name</Th>
												<Th isNumeric>Cost Price</Th>
												<Th isNumeric>Sell Price</Th>
												<Th isNumeric>Stock</Th>
											</Tr>
										</Thead>
										<Tbody>
											{value?.map((item: any, i: number) => (
												<Tr key={i}>
													<Td fontWeight='600'>{item?.name}:</Td>
													<Td isNumeric>
														<Input
															size='sm'
															value={item?.cost}
															name='cost'
															onChange={e => onVariantValueChange(i, 'cost', e.target.value)}
														/>
													</Td>
													<Td isNumeric>
														<Input
															size='sm'
															value={item?.price}
															name='price'
															onChange={e => onVariantValueChange(i, 'price', e.target.value)}
														/>
													</Td>
													<Td isNumeric>
														<Input
															size='sm'
															value={item?.stock}
															name='stock'
															onChange={e => onVariantValueChange(i, 'stock', e.target.value)}
														/>
													</Td>
												</Tr>
											))}
										</Tbody>
									</Table>
								</TableContainer>
							</Flex>
						</Column>
					</Flex>
				</Column>

				{helper && <HelperText>{helper}</HelperText>}
			</Stack>
		</FormControl>
	);
};

export default VVariant;
