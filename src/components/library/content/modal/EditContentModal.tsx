import { FormEvent, useEffect, useState, ReactNode, MouseEvent } from 'react';
import {
	Flex,
	FlexProps,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalOverlay,
	useDisclosure,
} from '@chakra-ui/react';

import {
	ModalFormSection,
	useCustomToast,
	ModalContainer,
	useFormData,
	InputData,
	ModalHeader,
	ModalFooter,
	FormMain,
	DiscardButton,
	ModalSubmitButton,
} from '../..';
import { useUpdateContentMutation } from '../../store/services/contentApi';

type CreateModalProps = FlexProps & {
	dataModel: InputData<any>[];
	children?: ReactNode;
	path?: string;
	title?: string;
	data: any;
	contentType?: 'basic' | 'content';
	setIsOpen?: any;
	setHover?: any;
};

const EditContentModal = ({
	data,
	dataModel,
	children,
	path = 'nexa',
	title,
	contentType = 'content',
	setIsOpen,
	setHover,
	...props
}: CreateModalProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [formData, setFormData] = useFormData<any>(dataModel, data);
	const [trigger, result] = useUpdateContentMutation();

	const onModalOpen = () => {
		setFormData(data);
		onOpen();
		setIsOpen && setIsOpen(true);
	};

	const { isSuccess, isLoading, isError, error } = result;

	const [changedData, setChangedData] = useState({});

	useCustomToast({
		successText: 'Content Updated',
		isSuccess,
		isError,
		isLoading,
		error,
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		trigger({
			body: formData,
			path,
			type: contentType,
		});
	};

	const onModalClose = () => {
		setFormData({});
		setHover && setHover(false);
		setIsOpen && setIsOpen(false);
		result.reset();
		onClose();
	};

	useEffect(() => {
		if (isSuccess && !isLoading) {
			onModalClose();
		}
	}, [isLoading]);

	return (
		<>
			<Flex
				onClick={onModalOpen}
				{...props}>
				{children || title || path}
			</Flex>

			<Modal
				size='2xl'
				isOpen={isOpen}
				onClose={onModalClose}
				closeOnOverlayClick={false}>
				<ModalOverlay />
				<ModalContainer onClick={(e: MouseEvent) => e.stopPropagation()}>
					<ModalHeader>{`Update Content`}</ModalHeader>
					<ModalCloseButton />
					<form onSubmit={handleSubmit}>
						<ModalBody px={6}>
							<ModalFormSection>
								<FormMain
									fields={dataModel}
									formData={formData}
									setFormData={setFormData}
									setChangedData={setChangedData}
									isModal={true}
								/>
							</ModalFormSection>
						</ModalBody>
						<ModalFooter>
							<DiscardButton
								mr={2}
								onClick={onModalClose}>
								Discard
							</DiscardButton>
							<ModalSubmitButton isLoading={isLoading}>Confirm</ModalSubmitButton>
						</ModalFooter>
					</form>
				</ModalContainer>
			</Modal>
		</>
	);
};

export default EditContentModal;
