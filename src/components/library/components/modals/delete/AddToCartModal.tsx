'use client';

import {
	Dialog,
	Button,
	Flex,
	Heading,
	Text,
	useDisclosure,
	Input,
	Field,
	Stack,
} from '@chakra-ui/react';
import { ReactNode, useState, FC, useRef } from 'react';

import { Column, useAppDispatch, addToCart, Label, Price, useQtyInCart } from '../../..';
import CardContainer from '../../../pos/pos-card/CardContainer';

type DeleteItemModalProps = {
	item: any;
	children: ReactNode;
};

const AddToCartModal: FC<DeleteItemModalProps> = ({ children, item }) => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);
	const inputRef = useRef<HTMLInputElement>(null);

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

			<Dialog.Root
				closeOnInteractOutside={false}
				open={isOpen}
				onOpenChange={e => !e.open && closeItem()}
				role='alertdialog'>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Add Item To cart</Dialog.Title>
						</Dialog.Header>
						<form onSubmit={handleDelete}>
							<Dialog.Body>
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
										<Field.Root gap={4}>
											<Stack
												gap={2}
												w='full'>
												<Field.Label>Enter Quantity</Field.Label>
												<Stack
													gap={1}
													w='full'>
													<Input
														value={qty}
														ref={inputRef}
														onChange={(e: any) => setQty(e.target.value)}
														type='number'
													/>
												</Stack>
											</Stack>
										</Field.Root>
									</Flex>
								</Column>
							</Dialog.Body>

							<Dialog.Footer>
								<Dialog.CloseTrigger asChild>
									<Button
										ref={cancelRef}
										size='sm'
										colorPalette='gray'>
										Discard
									</Button>
								</Dialog.CloseTrigger>

								{outOfStock() ? (
									<Button
										colorPalette='brand'
										disabled
										ml={2}
										size='sm'>
										Out Of Stock
									</Button>
								) : (
									<Button
										colorPalette='brand'
										type='submit'
										ml={2}
										size='sm'>
										Add To Cart
									</Button>
								)}
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		</>
	);
};

export default AddToCartModal;
