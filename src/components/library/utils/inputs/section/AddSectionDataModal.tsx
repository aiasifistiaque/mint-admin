'use client';
import { Button, Flex, FlexProps, IconButton, useDisclosure } from '@chakra-ui/react';
import { FC, ReactNode, useState } from 'react';

import {
	Column,
	createFormFields,
	DeleteImageButton,
	FormMain,
	Icon,
	InsertModal,
	InsertModalBody,
	InsertModalCloseButton,
	InsertModalContent,
	InsertModalHeader,
	InsertModalOverlay,
} from '../../..';

type UploadModalProps = {
	trigger?: ReactNode;
	handleDataChange: any;
	type?: 'add' | 'edit' | 'delete';
	multiple?: boolean;
	handleDelete?: any;
	value: { image?: string; title: string; description: string }[];
	name: string;
	prevVal?: { image?: string; title: string; description: string };
	index?: number;
	dataModel: any;
	hasImage?: boolean;
	section?: any;
};

const AddSectionDataModal: FC<UploadModalProps> = ({
	trigger,
	handleDataChange,
	handleDelete,
	type = 'add',
	value,
	name,
	prevVal,
	index = 0,
	dataModel,
	section,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [formData, setFormData] = useState<any>({});
	const [changedData, setChangedData] = useState<any>({});

	const closeModal = () => {
		setFormData({});
		setChangedData({});
		onClose();
	};

	const openModal = () => {
		setFormData(prevVal || {});
		onOpen();
	};

	const handleAddSection = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		const newArr = [...(Array.isArray(value) ? value : []), formData];
		if (handleDataChange) {
			const event = {
				target: {
					name: name,
					value: newArr,
				},
			} as any;
			handleDataChange(event);
		}
		setFormData({});

		closeModal();
	};

	const handleEditSection = (e: any) => {
		// if (!val.title || !val.description) return;
		e.preventDefault();
		e.stopPropagation();

		const newArr = Array.isArray(value) ? [...value] : [];
		if (index >= 0 && index < newArr.length) {
			newArr[index] = formData;
		}

		if (handleDataChange) {
			const event = {
				target: {
					name: name,
					value: newArr,
				},
			} as any;
			handleDataChange(event);
		}
		closeModal();
	};

	const handleSubmit = type == 'add' ? handleAddSection : handleEditSection;

	const buttonTypes = {
		add: (
			<Button
				size='sm'
				variant='white'>
				{section?.addBtnText || 'Add Item'}
			</Button>
		),
		edit: (
			<IconButton
				variant='outline'
				aria-label='edit-section'
				size='xs'
				colorScheme='brand'
				icon={<Icon name='edit' />}
			/>
		),
		delete: <DeleteImageButton onClick={handleDelete} />,
	};

	let triggerButton = (buttonTypes[type] as any) || trigger;

	const getDataModel = () => {
		if (!section?.dataModel) return null;
		const model = createFormFields({
			schema: section?.dataModel,
			layout: section?.layout,
		});
		return model;
	};

	return (
		<>
			{type == 'delete' ? (
				<DeleteImageButton onClick={handleDelete} />
			) : (
				<Flex onClick={openModal}>{triggerButton}</Flex>
			)}
			<InsertModal
				size='3xl'
				isOpen={isOpen}
				onClose={closeModal}>
				<InsertModalOverlay />
				<InsertModalContent>
					<InsertModalHeader>
						{section?.title ? section?.title : type == 'edit' ? 'Update Section' : 'Add Section'}
					</InsertModalHeader>
					<InsertModalCloseButton />
					<InsertModalBody flex={1}>
						<Column
							gap={4}
							as='form'
							onSubmit={handleSubmit}>
							<FormMain
								fields={section?.dataModel}
								formData={formData}
								setFormData={setFormData}
								setChangedData={setChangedData}
								isModal={true}
							/>
							<Flex {...footerCss}>
								<Button
									variant='white'
									size='sm'
									onClick={onClose}>
									Discard
								</Button>
								<Button
									size='sm'
									type='submit'>
									{type == 'add' ? 'Add' : 'Update'}
								</Button>
							</Flex>
						</Column>
					</InsertModalBody>
				</InsertModalContent>
			</InsertModal>
		</>
	);
};

const footerCss: FlexProps = {
	justify: 'flex-end',
	pb: 4,
	align: 'center',
	gap: 2,
	flex: 1,
};

export default AddSectionDataModal;
