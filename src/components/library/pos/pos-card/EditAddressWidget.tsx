import React from 'react';
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
} from '@chakra-ui/react';

import {
	useFormData,
	FormContent,
	ModalContainer,
	InputData,
	DiscardButton,
	Address,
	useLazyGetByIdToEditQuery,
} from '../../';

const inputFields: InputData<Address>[] = [
	{
		name: 'address.name',
		label: 'Recipient Name',
		isRequired: true,
		type: 'text',
	},
	{
		name: 'address.email',
		label: 'Recipient Email',
		isRequired: true,
		type: 'text',
		span: 1,
	},
	{
		name: 'address.phone',
		label: 'Recipient Phone',
		isRequired: true,
		type: 'text',
		span: 1,
	},
	{
		name: 'address.street',
		label: 'Street Address',
		isRequired: true,
		type: 'textarea',
	},
	{
		name: 'address.city',
		label: 'City',
		isRequired: true,
		type: 'text',
		span: 1,
	},
	{
		name: 'address.state',
		label: 'State',
		isRequired: false,
		type: 'text',
		span: 1,
	},
	{
		name: 'address.country',
		label: 'Country',
		isRequired: false,
		type: 'text',
		span: 1,
		value: () => 'Bangladesh',
	},
	{
		name: 'address.postalCode',
		label: 'Post Code',
		isRequired: true,
		type: 'text',
		span: 1,
	},
];

const EditAddressWidget = ({ id }: { id: string }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [fetch, { data: prevData }] = useLazyGetByIdToEditQuery();

	const [formData, setFormData] = useFormData<any>(inputFields, prevData);

	const onModalOpen = () => {
		onOpen();
		let newFieldData = {};
		inputFields?.map((field: any) => {
			if (field?.value) newFieldData = { ...newFieldData, [field.name]: field.value };
		});
		setFormData({ ...formData, ...newFieldData });
		onOpen();
		fetch({ path: 'orders', id });
	};

	const onModalClose = () => {
		setFormData({});
		onClose();
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();

		onModalClose();
	};

	const addressNotSet = (
		<Button
			size='sm'
			colorScheme='brand'
			onClick={onModalOpen}>
			Update
		</Button>
	);

	return (
		<>
			<Flex>{addressNotSet}</Flex>

			<Modal
				size='4xl'
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />

				<ModalContainer>
					<ModalCloseButton />
					<ModalHeader>Edit Customer</ModalHeader>
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

export default EditAddressWidget;
