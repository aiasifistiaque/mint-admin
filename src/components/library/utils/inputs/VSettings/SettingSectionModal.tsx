'use client';
import { Button, Flex, FlexProps, IconButton, useDisclosure } from '@chakra-ui/react';
import { FC, ReactNode, useEffect, useState } from 'react';

import {
	Column,
	DeleteImageButton,
	Icon,
	InsertModal,
	InsertModalBody,
	InsertModalCloseButton,
	InsertModalContent,
	InsertModalHeader,
	InsertModalOverlay,
} from '../../..';
import FormFields from './SettingFields';

type UploadModalProps = {
	trigger?: ReactNode;
	handleDataChange: any;
	type?: 'add' | 'edit' | 'delete';
	multiple?: boolean;
	handleDelete?: any;
	value: any[];
	name: string;
	prevVal?: { image?: string; title: string; description: string };
	index?: number;
	hasImage?: boolean;
	section?: any;
	sectionKey: string;
};

const SettingSectionModal: FC<UploadModalProps> = ({
	trigger,
	handleDataChange,
	handleDelete,
	type = 'add',
	value,
	name,
	prevVal,
	index = 0,
	section,
	sectionKey,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [formData, setFormData] = useState<any>({
		title: '',
		type: 'string',
		required: false,
		sort: false,
		unique: false,
		search: false,
		edit: false,
		trim: false,
		min: 0,
		max: 99999999,
	});
	const [changedData, setChangedData] = useState<any>({});

	const onChange = (e: any) => {
		const { name, value, type, checked } = e.target;
		const val = type === 'checkbox' ? checked : value;

		setFormData((prev: any) => ({
			...prev,
			[name]: val,
		}));
	};

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
		const newObj = { ...value, [sectionKey]: formData };
		if (handleDataChange) {
			const event = {
				target: {
					name: name,
					value: newObj,
				},
			} as any;
			handleDataChange(event);
		}
		setFormData({
			title: '',
			type: 'string',
			required: false,
			sort: false,
			unique: false,
			search: false,
			edit: false,
			trim: false,
			min: 0,
			max: 99999999,
		});
		closeModal();
	};

	const handleEditSection = (e: any) => {
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
		setFormData({});
		closeModal();
	};

	const handleSubmit = type == 'add' ? handleAddSection : handleEditSection;

	const buttonTypes = {
		add: (
			<Button
				w='full'
				size='sm'
				variant='white'>
				{section?.addBtnText || 'Add Setting'}
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
				size='3xl'
				isOpen={isOpen}
				onClose={closeModal}>
				<InsertModalOverlay />
				<InsertModalContent>
					<InsertModalHeader>{`Enter Values for field ${sectionKey}`}</InsertModalHeader>
					<InsertModalCloseButton />
					<InsertModalBody flex={1}>
						<Column
							gap={4}
							as='form'
							onSubmit={handleSubmit}>
							<FormFields
								formData={formData}
								onChange={onChange}
							/>
							<Flex {...footerCss}>
								<Button
									variant='white'
									size='sm'
									onClick={closeModal}>
									Discard
								</Button>
								<Button
									size='sm'
									type='submit'>
									{type == 'add' ? 'Insert' : 'Update'}
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

export default SettingSectionModal;
