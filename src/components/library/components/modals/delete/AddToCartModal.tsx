'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	Flex,
	Heading,
	Text,
	useDisclosure,
	Input,
	FormControl,
	Stack,
} from '@chakra-ui/react';
import React, { ReactNode, useState } from 'react';

import {
	AlertDialogHeader,
	AlertDialogContent,
	Column,
	useAppDispatch,
	addToCart,
	Label,
	Price,
	useQtyInCart,
} from '../../../';
import CardContainer from '@/components/library/pos/pos-card/CardContainer';

type DeleteItemModalProps = {
	item: any;
	children: ReactNode;
};

const AddToCartModal: React.FC<DeleteItemModalProps> = ({ children, item }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef<any>(undefined);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const inCart = useQtyInCart(item?._id);

	const [qty, setQty] = useState<number>();

	const dispatch = useAppDispatch();

	const closeItem = () => {
		setQty(undefined);
		onClose();
	};

	const outOfStock = () => {
		if (item?.stock < 1) {
			return true;
		}
		if (item?.stock < inCart + (qty || 1)) {
			return true;
		}
	};

	const handleDelete = (e: any) => {
		e.preventDefault();
		if (outOfStock()) {
			return;
		} else {
			dispatch(addToCart({ item, qty }));
			closeItem();
		}
	};

	const onModalOpen = () => {
		onOpen();
		setTimeout(() => {
			inputRef?.current?.focus();
		}, 100);
	};

	return (
		<>
			<CardContainer onClick={onModalOpen}>{children}</CardContainer>

			<AlertDialog
				closeOnOverlayClick={false}
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeItem}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>Add Item To cart</AlertDialogHeader>
						<form onSubmit={handleDelete}>
							<AlertDialogBody>
								<Column
									pt={4}
									gap={2}>
									<Heading size='md'>{item?.name}</Heading>
									{item?.unitValue && (
										<Text>
											{item?.unitValue} {item?.unit}
										</Text>
									)}
									<Text fontSize='.8rem'>SKU: {item?.sku}</Text>
									<Text fontSize='.8rem'>Barcode: {item?.barcode}</Text>
									<Text fontSize='.8rem'>Stock: {item?.stock}</Text>
									<Text fontSize='.8rem'>In Cart: {inCart}</Text>
									<Heading size='xs'>Qty: {qty}</Heading>
									<Heading size='sm'>
										Unit Price: <Price>{item?.price}</Price>
									</Heading>
									<Flex pt={4}>
										<FormControl gap={4}>
											<Stack
												spacing={2}
												w='full'>
												<Label>Enter Quantity</Label>
												<Stack
													spacing={1}
													w='full'>
													<Input
														value={qty}
														ref={inputRef}
														onChange={(e: any) => setQty(e.target.value)}
														type='number'
													/>
												</Stack>
											</Stack>
										</FormControl>
									</Flex>
								</Column>
							</AlertDialogBody>

							<AlertDialogFooter>
								<Button
									ref={cancelRef}
									onClick={closeItem}
									size='sm'
									colorScheme='gray'>
									Discard
								</Button>

								{outOfStock() ? (
									<Button
										colorScheme='brand'
										isDisabled
										ml={2}
										size='sm'>
										Out Of Stock
									</Button>
								) : (
									<Button
										colorScheme='brand'
										type='submit'
										ml={2}
										size='sm'>
										Add To Cart
									</Button>
								)}
							</AlertDialogFooter>
						</form>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default AddToCartModal;
