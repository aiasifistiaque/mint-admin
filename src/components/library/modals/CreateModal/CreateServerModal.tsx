'use client';

import React, { FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';

import { useCustomToast, useIsMobile, useFormData } from '../../hooks';

import {
	ModalFormSection,
	usePostMutation,
	FormMain,
	DiscardButton,
	Align,
	DialogCloseButton,
	DialogHeader,
	DialogFooter,
	Dialog,
	DialogBody,
	MenuItem,
	useGetConfigQuery,
} from '../..';

type CreateServerModalProps = {
	trigger?: any;
	path: string;
	title?: string;
	invalidate?: any;
	children?: any;
	doc?: any;
	populate?: any;
	isMenu?: boolean;
	item?: any;
	icon?: string;
	layout?: any;
	prompt?: {
		title?: string;
		body?: string;
		btnText?: string;
		successMsg?: string;
	};
};

const CreateServerModal = (props: CreateServerModalProps) => {
	const {
		trigger,
		path,
		title,

		isMenu,
		invalidate,
		children,
		doc,
		prompt,
		populate,
		layout,
		icon,
	} = props;

	const { isOpen, onOpen, onClose } = useDisclosure();

	const { data, isFetching } = useGetConfigQuery(path);

	const [formData, setFormData] = useFormData<any>(data, populate);
	const isMobile = useIsMobile();

	const [callApi, result] = usePostMutation();

	const [schema, setSchema] = useState<any>([]);

	const onModalOpen = () => {
		onOpen();
		let newFieldData = {};

		data?.form?.map((field: any) => {
			if (field?.getValue) newFieldData = { ...newFieldData, [field.name]: field?.getValue(doc) };
			if (field?.value) newFieldData = { ...newFieldData, [field.name]: field?.value };
		});

		setFormData({ ...formData, ...newFieldData });
	};

	const { isSuccess, isLoading } = result;

	const [changedData, setChangedData] = useState({});

	useEffect(() => {
		if (data) {
			let newFieldData = {};
			const fields = data?.form;
			setSchema(fields);
			fields?.map((field: any) => {
				if (field?.getValue) newFieldData = { ...newFieldData, [field.name]: field?.getValue(doc) };
				if (field?.value) newFieldData = { ...newFieldData, [field.name]: field?.value };
			});

			setFormData({ ...formData, ...newFieldData });
		}
	}, [isFetching]);

	const successText = prompt?.successMsg || 'Item added successfully';

	useCustomToast({
		successText,
		...result,
	});

	const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
		if (e.key === 'Enter') e.preventDefault();
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		let findExcludedFields: any = [];

		const fields: any = data?.form;
		findExcludedFields = fields.filter((field: any) => field?.isExcluded);

		const toPostData = { ...formData };

		// Remove excluded fields from toPostData
		findExcludedFields.forEach((field: any) => {
			if (field.name in toPostData) delete toPostData[field.name];
		});

		callApi({ path, body: toPostData, invalidate });
	};

	const onModalClose = () => {
		setFormData({});
		result.reset();
		onClose();
	};

	useEffect(() => {
		if (isLoading) return;
		if (isSuccess) onModalClose();
	}, [isLoading]);

	useEffect(() => {
		if (populate) return;
	}, [isFetching]);

	const footer = (
		<>
			{!isMobile && (
				<DiscardButton
					isDisabled={isLoading}
					onClick={onModalClose}>
					Discard
				</DiscardButton>
			)}
			<Button
				{...(isMobile && { w: 'full' })}
				type='submit'
				size='sm'>
				{isLoading ? 'Processing...' : prompt?.btnText || 'Confirm'}
			</Button>
		</>
	);

	return (
		<>
			{isMenu ? (
				<MenuItem
					icon={icon}
					onClick={onModalOpen}>
					{children || trigger || title || path}
				</MenuItem>
			) : (
				<Flex onClick={onModalOpen}>{children || trigger || title || path}</Flex>
			)}

			<Dialog
				isOpen={isOpen}
				onClose={onModalClose}>
				<form
					onSubmit={handleSubmit}
					onKeyDown={handleKeyDown}>
					<DialogHeader>{prompt?.title || title || `Create ${path}`}</DialogHeader>
					<DialogCloseButton />

					<DialogBody>
						<ModalFormSection>
							{!isFetching && (
								<FormMain
									fields={data?.form}
									formData={formData}
									setFormData={setFormData}
									setChangedData={setChangedData}
									isModal={true}
								/>
							)}
						</ModalFormSection>
						{isMobile && <Align py={5}>{footer}</Align>}
					</DialogBody>
					{!isMobile && <DialogFooter>{footer}</DialogFooter>}
				</form>
			</Dialog>
		</>
	);
};

export default CreateServerModal;
