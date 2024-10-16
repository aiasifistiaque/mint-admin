'use client';
import { Button, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';

import {
	Column,
	DeleteImageButton,
	FormMain,
	Icon,
	InsertModal,
	InsertModalBody,
	InsertModalCloseButton,
	InsertModalContent,
	InsertModalFooter,
	InsertModalHeader,
	InsertModalOverlay,
	useFormData,
	VInput,
	VTextarea,
} from '../../..';

type UploadModalProps = {
	trigger?: React.ReactNode;
	handleDataChange: any;
	dataModel?: any;
	type?: 'add' | 'edit' | 'delete';
	multiple?: boolean;
	handleDelete?: any;
	value: { title: string; description: string }[];
	name: string;
	prevVal?: { title: string; description: string };
	index?: number;
};

const AddCustomSection: FC<UploadModalProps> = ({
	multiple,
	trigger,
	handleDataChange,
	handleDelete,
	type = 'add',
	value,
	name,
	prevVal,
	index = 0,
	dataModel,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [formData, setFormData] = useFormData<any>(dataModel, prevVal);
	const [changedData, setChangedData] = useState({});

	const closeModal = () => {
		setVal({ title: '', description: '' });
		setFormData({});
		onClose();
	};

	const [val, setVal] = useState<{
		title: string;
		description: string;
	}>(
		prevVal || {
			title: '',
			description: '',
		}
	);

	const openModal = () => {
		setVal(prevVal || { title: '', description: '' });
		setFormData(prevVal || {});
		onOpen();
	};

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setVal(prevVal => ({ ...prevVal, [name]: value }));
	};

	const handleAddSection = () => {
		// if (!val.title || !val.description) return;
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

		setVal({ title: '', description: '' });
		closeModal();
	};

	const handleEditSection = () => {
		if (!val.title || !val.description) return;

		const newArr = Array.isArray(value) ? [...value] : [];
		if (index >= 0 && index < newArr.length) {
			newArr[index] = formData as any;
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
				colorScheme='brand'>
				Add Section
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

	return (
		<>
			{type == 'delete' ? (
				<DeleteImageButton onClick={handleDelete} />
			) : (
				<Flex onClick={openModal}>{triggerButton}</Flex>
			)}
			<InsertModal
				isOpen={isOpen}
				onClose={closeModal}>
				<InsertModalOverlay />
				<InsertModalContent>
					<InsertModalHeader>{type == 'edit' ? 'Update' : 'Add'} Section</InsertModalHeader>
					<InsertModalCloseButton />
					<InsertModalBody flex={1}>
						<Column gap={4}>
							<FormMain
								isModal={true}
								fields={dataModel}
								setFormData={setFormData}
								formData={formData}
								setChangedData={setChangedData}
							/>
							{/* <VInput
								name='title'
								label='Title'
								value={val?.title}
								onChange={handleChange}
							/>
							<VTextarea
								name='description'
								label='Description'
								value={val?.description}
								h='full'
								minH='400px'
								onChange={handleChange}
							/> */}
						</Column>
					</InsertModalBody>

					<InsertModalFooter>
						<Flex
							gap={2}
							flex={1}>
							<Button
								size='sm'
								// isDisabled={!val.title || !val.description}
								onClick={handleSubmit}>
								{type == 'add' ? 'Insert' : 'Update'} Section
							</Button>
							<Button
								colorScheme='gray'
								size='sm'
								onClick={onClose}>
								Cancel
							</Button>
						</Flex>
					</InsertModalFooter>
				</InsertModalContent>
			</InsertModal>
		</>
	);
};

export default AddCustomSection;
