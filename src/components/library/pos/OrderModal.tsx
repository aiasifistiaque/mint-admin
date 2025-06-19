'use client';
import { useEffect, useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	Grid,
	Flex,
	Heading,
	Drawer,
	DrawerOverlay,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	useColorModeValue,
} from '@chakra-ui/react';

import PosInput from './PosInput';
import OrderPriceDetails from './pos-card/OrderPriceDetails/OrderPriceDetails';
import { useAddOrderMutation, useGetCartTotalMutation } from '../';

import {
	resetCart,
	useCustomToast,
	ModalContainer,
	Column,
	currency,
	VTextarea,
	useAppDispatch,
	useAppSelector,
	useIsMobile,
	SpaceBetween,
	VCheckbox,
} from '../';
import {
	OrderAddress,
	OrderButton,
	OrderItemHeading,
	OrderItemsContainer,
	OrderItemText,
	OrderRightSectionContainer,
	OrderCustomer,
} from './pos-card/odder';
import { useRouter } from 'next/navigation';

const OrderModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { cartItems, total, user, subTotal, discount, vat, shipping, address, isAddressSet } =
		useAppSelector(state => state.cart);
	const dispatch = useAppDispatch();
	const router = useRouter();

	const [trigger, result] = useGetCartTotalMutation();

	const [paidAmount, setPaidAmount] = useState<any>();
	const [paymentMethod, setPaymentMethod] = useState('cash');
	const [note, setNote] = useState('');
	const [status, setStatus] = useState('confirmed');
	const [emailReceipt, setEmailReceipt] = useState(false);
	const [trnxRef, setTrnxRef] = useState<any>();

	const [createOrder, createOrderResult] = useAddOrderMutation();
	const { isSuccess, isError, isLoading, error, data } = createOrderResult;

	useEffect(() => {
		trigger({ items: cartItems, discount, shipping });
	}, [cartItems, discount, shipping, trigger]);

	const onModalOpen = () => {
		onOpen();
		trigger({ items: cartItems, discount, shipping });
	};

	const handlePaid = () => {
		setPaidAmount(total);
	};

	const onModalClose = () => {
		onClose();
		setPaidAmount(undefined);
		setPaymentMethod('cash');
		setNote('');
	};

	useCustomToast({
		successText: 'Order Placed Successfully',
		...createOrderResult,
	});

	const handleCreateOrder = () => {
		createOrder({
			cart: result?.data,
			paymentMethod,
			paymentAmount: paidAmount,
			paidAmount,
			note,
			status,
			address,
			customer: user,
			emailReceipt,
			trnxRef,
		});
	};

	useEffect(() => {
		if (!isLoading && isSuccess) {
			dispatch(resetCart());
			onModalClose();
			router.push(`/orders/${data?._id}`);
		}
	}, [isLoading]);

	const borderColor = useColorModeValue('#bbb', 'stroke.deepD');

	const renderLeftSection = (
		<>
			<OrderRightSectionContainer>
				<OrderItemHeading>Description</OrderItemHeading>
				<OrderItemHeading textAlign='center'>Price</OrderItemHeading>
				<OrderItemHeading textAlign='center'>Qty</OrderItemHeading>
				<OrderItemHeading textAlign='right'>Amount</OrderItemHeading>
			</OrderRightSectionContainer>
			<OrderItemsContainer>
				{result?.data?.items?.map((item: any, i: number) => (
					<Grid
						gridTemplateColumns='2fr 1fr 1fr 1fr'
						key={i}>
						<OrderItemText fontWeight='600'>
							{i + 1}. {item?.name}
						</OrderItemText>
						<OrderItemText textAlign='center'>
							{item?.unitPrice?.toFixed(2)?.toLocaleString()}
						</OrderItemText>
						<OrderItemText textAlign='center'>{item?.qty}</OrderItemText>
						<OrderItemText textAlign='right'>
							{currency.symbol}
							{item?.totalPrice?.toFixed(2)?.toLocaleString()}
						</OrderItemText>
					</Grid>
				))}
			</OrderItemsContainer>
			<Flex
				flex={1}
				align='flex-end'
				w='full'>
				<OrderPriceDetails
					total={result?.data?.total}
					subTotal={result?.data?.subTotal}
					discount={result?.data?.discount}
					shipping={result?.data?.shipping}
					vat={result?.data?.vat}
				/>
			</Flex>
		</>
	);

	const renderRightSection = (
		<>
			<SpaceBetween
				py={3}
				borderBottom='1px dashed'
				borderTop='1px dashed'
				borderColor={borderColor}>
				<Heading size='sm'>Billing Details</Heading>
				<Button
					size='xs'
					onClick={handlePaid}>
					Paid
				</Button>
			</SpaceBetween>

			<PosInput
				valueType='text'
				value={total?.toLocaleString()}
				label='Total Due'
			/>
			<PosInput
				value={paidAmount}
				type='number'
				onChange={(e: any) => setPaidAmount(e.target.value)}
				label='Paid Amount'
			/>
			<PosInput
				value={paymentMethod}
				valueType='select'
				onChange={(e: any) => setPaymentMethod(e?.target?.value)}
				label='Payment Method'
				options={['cash', 'card', 'bkash', 'nagad', 'other']}
			/>
			<PosInput
				value={trnxRef}
				type='text'
				onChange={(e: any) => setTrnxRef(e?.target?.value)}
				label='TRNX REF.'
			/>
			<PosInput
				value={status}
				onChange={(e: any) => setStatus(e.target.value)}
				valueType='select'
				label='Order Status'
				options={[
					'pending',
					'order-placed',
					'confirmed',
					'out-for-delivery',
					'delivered',
					'completed',
					'cancelled',
				]}
			/>
			<VCheckbox
				isChecked={emailReceipt}
				onChange={(e: any) => setEmailReceipt(e.target.checked)}
				label='Email Receipt'
			/>
			<VTextarea
				value={note}
				onChange={(e: any) => setNote(e.target.value)}
				label='Note'
			/>
		</>
	);

	const isSmallScreen = useIsMobile();

	const Container = isSmallScreen ? Drawer : Modal;
	const Overlay = isSmallScreen ? DrawerOverlay : ModalOverlay;
	const CloseButton = isSmallScreen ? DrawerCloseButton : ModalCloseButton;
	const Header = isSmallScreen ? DrawerHeader : ModalHeader;
	const Body = isSmallScreen ? DrawerBody : ModalBody;

	return (
		<>
			<Button
				w='156px'
				h='100%'
				borderRadius={0}
				onClick={onModalOpen}>
				Confirm Order
			</Button>

			<Container
				{...(!isSmallScreen && { isCentered: true })}
				{...(isSmallScreen && { placement: 'bottom' })}
				closeOnOverlayClick={false}
				size='5xl'
				isOpen={isOpen}
				onClose={onModalClose}>
				<Overlay />
				<ModalContainer isSmallScreen={isSmallScreen}>
					<Header>
						Order Details
						{isAddressSet && (
							<OrderCustomer
								data={{ name: address?.name, email: address?.email, phone: address?.phone }}
							/>
						)}
						{isAddressSet && <OrderAddress address={{ ...address }} />}
					</Header>
					<CloseButton />
					<Body>
						<Grid
							display={{ base: 'flex', md: 'grid' }}
							flexDir={{ base: 'column', md: 'row' }}
							gridTemplateColumns={{ base: '1fr', md: '3fr 2fr' }}
							gap={10}>
							<Flex flexDirection='column'>{renderLeftSection}</Flex>
							<Column
								flex={1}
								gap={4}>
								<Column
									flex={1}
									gap={1}>
									{renderRightSection}
								</Column>

								<OrderButton
									onClick={handleCreateOrder}
									isLoading={createOrderResult?.isLoading}>
									Confirm & Pay
								</OrderButton>
							</Column>
						</Grid>
					</Body>
				</ModalContainer>
			</Container>
		</>
	);
};

export default OrderModal;
