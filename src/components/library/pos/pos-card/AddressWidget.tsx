import {
	Modal,
	ModalOverlay,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	Flex,
	ModalFooter,
	Text,
} from '@chakra-ui/react';

import {
	IconButton,
	useFormData,
	FormContent,
	ModalContainer,
	Column,
	InputData,
	useAppDispatch,
	useAppSelector,
	useGetByIdQuery,
	DiscardButton,
	Address,
	removeAddress,
	setAddress,
} from '../..';

const inputFields: InputData<Address>[] = [
	{
		name: 'name',
		label: 'Recipient Name',
		isRequired: true,
		type: 'text',
	},
	{
		name: 'email',
		label: 'Recipient Email',
		isRequired: true,
		type: 'text',
		span: 1,
	},
	{
		name: 'phone',
		label: 'Recipient Phone',
		isRequired: true,
		type: 'text',
		span: 1,
	},
	{
		name: 'street',
		label: 'Street Address',
		isRequired: true,
		type: 'textarea',
	},
	{
		name: 'city',
		label: 'City',
		isRequired: true,
		type: 'text',
		span: 1,
	},
	{
		name: 'state',
		label: 'State',
		isRequired: false,
		type: 'text',
		span: 1,
	},
	{
		name: 'country',
		label: 'Country',
		isRequired: false,
		type: 'text',
		span: 1,
	},
	{
		name: 'postalCode',
		label: 'Post Code',
		isRequired: true,
		type: 'text',
		span: 1,
	},
];

const AddressWidget = ({ id }: { id?: string }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const dispatch = useAppDispatch();
	const { isAddressSet, address, user }: any = useAppSelector(state => state.cart);

	const { data, isFetching } = useGetByIdQuery(
		{
			path: 'customers',
			id: user,
		},
		{
			skip: !user,
		}
	);

	const [formData, setFormData] = useFormData<any>(inputFields);

	const onModalOpen = () => {
		setFormData({
			name: data?.name,
			email: data?.email,
			phone: data?.phone,
		});
		onOpen();
	};

	const onModalClose = () => {
		setFormData({});
		onClose();
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		dispatch(setAddress(formData));
		onModalClose();
	};

	const deleteAddress = (e: any) => {
		dispatch(removeAddress());
	};

	const addressIsSet = (
		<Flex
			justify='space-between'
			flex={1}>
			<Column gap={0}>
				<Text
					fontSize='.8rem'
					fontWeight='600'>
					{`${address?.street}, ${address?.city},`} {`${address?.postalCode}, ${address?.country}`}
				</Text>
			</Column>

			<IconButton
				tooltip='Delete Address'
				aria-label='Delete Address'
				colorScheme='red'
				variant='outline'
				iconName='delete'
				size='xs'
				onClick={deleteAddress}
			/>
		</Flex>
	);

	const addressNotSet = (
		<Button
			size='sm'
			fontWeight='700'
			variant='link'
			onClick={onModalOpen}>
			Add Delivery Address
		</Button>
	);

	return (
		<>
			<Flex
				py={1}
				pl={3}>
				{isAddressSet ? addressIsSet : addressNotSet}
			</Flex>

			<Modal
				size='4xl'
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />

				<ModalContainer>
					<ModalCloseButton />
					<ModalHeader>Delivery Address</ModalHeader>
					<form onSubmit={handleSubmit}>
						<ModalBody>
							<FormContent
								formData={formData}
								setFormData={setFormData}
								data={inputFields}
							/>
						</ModalBody>
						<ModalFooter>
							<DiscardButton
								size='sm'
								_light={{
									borderWidth: 1,
									borderColor: 'container.borderLight',
									bg: 'container.newLight',
								}}
								mr={2}
								onClick={onModalClose}>
								Discard
							</DiscardButton>
							<Button
								size='sm'
								type='submit'>
								Submit
							</Button>
						</ModalFooter>
					</form>
				</ModalContainer>
			</Modal>
		</>
	);
};

export default AddressWidget;
