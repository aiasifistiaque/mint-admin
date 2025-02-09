'use client';
import { Button, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';

import {
	Column,
	createFormFields,
	DeleteImageButton,
	Icon,
	InsertModal,
	InsertModalBody,
	InsertModalCloseButton,
	InsertModalContent,
	InsertModalFooter,
	InsertModalHeader,
	InsertModalOverlay,
	VImage,
	VInput,
	VTextarea,
} from '../../..';

type UploadModalProps = {
	trigger?: React.ReactNode;
	handleDataChange: any;
	type?: 'add' | 'edit' | 'delete';
	multiple?: boolean;
	handleDelete?: any;
	value: { image?: string; title: string; description: string }[];
	name: string;
	prevVal?: { image?: string; title: string; description: string };
	index?: number;
	dataModel?: any;
	hasImage?: boolean;
	section?: any;
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
	dataModel,
	hasImage,
	section,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [val, setVal] = useState<{
		image?: string;
		title: string;
		description: string;
	}>(
		prevVal || {
			image: '',
			title: '',
			description: '',
		}
	);

	const closeModal = () => {
		hasImage
			? setVal({
					image: '',
					title: '',
					description: '',
			  })
			: setVal({
					title: '',
					description: '',
			  });

		onClose();
	};

	const openModal = () => {
		if (hasImage) setVal(prevVal || { image: '', title: '', description: '' });
		else setVal(prevVal || { title: '', description: '' });
		onOpen();
	};

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setVal(prevVal => ({ ...prevVal, [name]: value }));
	};

	const handleImage = (e: any) => {
		setVal(prevVal => ({ ...prevVal, image: e }));
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
				isOpen={isOpen}
				onClose={closeModal}>
				<InsertModalOverlay />
				<InsertModalContent>
					<InsertModalHeader>
						{section?.title ? section?.title : type == 'edit' ? 'Update Section' : 'Add Section'}
					</InsertModalHeader>
					<InsertModalCloseButton />
					<InsertModalBody flex={1}>
						<Column gap={4}>
							{/* <Text>{JSON.stringify(section)}</Text> */}
							{section?.dataModel && <></>}
							{hasImage && (
								<VImage
									name='image'
									label='Image'
									value={val?.image}
									onChange={handleImage}
								/>
							)}
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
								minH='300px'
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
								{type == 'add' ? 'Add' : 'Update'}
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
