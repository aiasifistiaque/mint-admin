'use client';
import { Button, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';

import {
	Column,
	DeleteImageButton,
	Icon,
	InsertModal,
	InsertModalBody,
	InsertModalCloseButton,
	InsertModalContent,
	InsertModalFooter,
	InsertModalHeader,
	InsertModalOverlay,
	VInput,
	VTextarea,
} from '../../..';

type UploadModalProps = {
	trigger?: React.ReactNode;
	handleDataChange: any;
	type?: 'add' | 'edit' | 'delete';
	multiple?: boolean;
	handleDelete?: any;
	value: { title: string; description: string }[];
	name: string;
	prevVal?: { title: string; description: string };
	index?: number;
};

const AddSectionModal: FC<UploadModalProps> = ({
	multiple,
	trigger,
	handleDataChange,
	handleDelete,
	type = 'add',
	value,
	name,
	prevVal,
	index = 0,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const closeModal = () => {
		setVal({ title: '', description: '' });
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
		onOpen();
	};

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setVal(prevVal => ({ ...prevVal, [name]: value }));
	};

	const handleAddSection = () => {
		if (!val.title || !val.description) return;
		const newArr = [...(Array.isArray(value) ? value : []), val];
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
		onClose();
	};

	const handleEditSection = () => {
		if (!val.title || !val.description) return;

		const newArr = Array.isArray(value) ? [...value] : [];
		if (index >= 0 && index < newArr.length) {
			newArr[index] = val;
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
							<VInput
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
							/>
						</Column>
					</InsertModalBody>

					<InsertModalFooter>
						<Flex
							gap={2}
							flex={1}>
							<Button
								size='sm'
								isDisabled={!val.title || !val.description}
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

export default AddSectionModal;
