import React, { FormEvent, useEffect, useState } from 'react';
import {
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalOverlay,
	useDisclosure,
	Drawer,
	DrawerOverlay,
	DrawerCloseButton,
	DrawerBody,
	DrawerFooter,
	useColorModeValue,
} from '@chakra-ui/react';

import {
	DrawerHeader,
	ModalFormSection,
	useCustomToast,
	useFormData,
	InputData,
	ModalHeader,
	ModalFooter,
	usePostMutation,
	useUpdateByIdMutation,
	FormMain,
	useLazyGetByIdToEditQuery,
	DiscardButton,
	ModalSubmitButton,
	useIsMobile,
	ModalContent,
	DrawerContentContainer,
	Align,
} from '../';

type CreateModalProps = {
	data: InputData<any>[];
	trigger?: any;
	path: string;
	type?: 'post' | 'update';
	id?: string;
	title?: string;
	invalidate?: any;
	children?: any;
};

const CreateModal = ({
	data,
	trigger,
	path,
	title,
	type,
	id,
	invalidate,
	children,
}: CreateModalProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [fetch, { data: prevData, isFetching, isUninitialized }] = useLazyGetByIdToEditQuery();
	const [formData, setFormData] = useFormData<any>(data, prevData);
	const isMobile = useIsMobile();

	const borderColor = useColorModeValue('border.light', 'border.dark');

	const Container = isMobile ? Drawer : Modal;
	const Overlay = isMobile ? DrawerOverlay : ModalOverlay;
	const Content = isMobile ? DrawerContentContainer : ModalContent;
	const Header = isMobile ? DrawerHeader : ModalHeader;
	const CloseButton = isMobile ? DrawerCloseButton : ModalCloseButton;
	const Body = isMobile ? DrawerBody : ModalBody;
	const Footer = isMobile ? DrawerFooter : ModalFooter;

	const [callApi, result] = usePostMutation();
	const [updateApi, updateResult] = useUpdateByIdMutation();

	const onModalOpen = () => {
		onOpen();
		let newFieldData = {};
		data?.map(field => {
			if (field?.value) newFieldData = { ...newFieldData, [field.name]: field.value };
		});
		setFormData({ ...formData, ...newFieldData });
		if (type == 'update') {
			fetch({ path, id });
		}
	};

	const { isSuccess, isLoading, isError, error } = type === 'update' ? updateResult : result;

	const [changedData, setChangedData] = useState({});

	const successText =
		type == 'update' ? 'Information Updated Successfully' : 'Item added successfully';

	useCustomToast({
		successText,
		isSuccess,
		isError,
		isLoading,
		error,
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const findExcludedFields = data.filter((field: any) => field?.isExcluded);
		const toPostData = { ...formData };

		// Remove excluded fields from toPostData
		findExcludedFields.forEach((field: any) => {
			if (field.name in toPostData) {
				delete toPostData[field.name];
			}
		});

		if (type === 'update') {
			updateApi({ path, id: id || 'id', body: changedData, invalidate });
		} else {
			callApi({ path, body: toPostData, invalidate: invalidate && invalidate });
		}
	};

	const onModalClose = () => {
		setFormData({});
		result.reset();
		onClose();
	};

	useEffect(() => {
		if (isSuccess && !isLoading) {
			onModalClose();
		}
	}, [isLoading]);

	useEffect(() => {
		if (prevData) {
			setFormData(prevData);
		}
	}, [prevData, isFetching]);

	const footer = (
		<>
			{!isMobile && (
				<DiscardButton
					mr={2}
					onClick={onModalClose}>
					Discard
				</DiscardButton>
			)}
			<ModalSubmitButton
				borderRadius={{ base: 'md', md: 'md' }}
				size={{ base: 'md', md: 'xs' }}
				{...(isMobile && { w: '100%' })}
				isLoading={isLoading}>
				Confirm
			</ModalSubmitButton>
		</>
	);

	return (
		<>
			<Flex onClick={onModalOpen}>{children || trigger || title || path}</Flex>

			<Container
				isCentered
				{...(isMobile && { placement: 'bottom' })}
				{...(isMobile && { isFullHeight: false })}
				isOpen={isOpen}
				size='xl'
				onClose={onModalClose}
				closeOnOverlayClick={false}>
				<Overlay />
				<form onSubmit={handleSubmit}>
					<Content
						// overflowY='scroll'
						onClick={(e: React.MouseEvent) => e.stopPropagation()}>
						<Header>{title || `${type === 'update' ? 'Update' : 'Create'} ${path}`}</Header>
						<CloseButton />

						<Body
							px={{ base: 4, md: 6 }}
							{...(isMobile && { overflowY: 'scroll' })}>
							<ModalFormSection>
								<FormMain
									fields={data}
									formData={formData}
									setFormData={setFormData}
									setChangedData={setChangedData}
									isModal={true}
								/>
							</ModalFormSection>
							{isMobile && <Align py={5}>{footer}</Align>}
						</Body>
						{!isMobile && (
							<Footer
								borderTopWidth={1}
								borderColor={borderColor}>
								{footer}
							</Footer>
						)}
					</Content>
				</form>
			</Container>
		</>
	);
};

export default CreateModal;
