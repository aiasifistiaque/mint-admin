'use client';

import React, { FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';

import { useCustomToast, useIsMobile, useFormData } from '../../hooks';

import {
	ModalFormSection,
	usePostMutation,
	useUpdateByIdMutation,
	FormMain,
	useLazyGetByIdToEditQuery,
	DiscardButton,
	Align,
	DialogCloseButton,
	DialogHeader,
	DialogFooter,
	Dialog,
	DialogBody,
	useGetSchemaQuery,
	convertToFormFields,
	createFormFields,
	MenuItem,
} from '../..';

import CreateModalProps from './types';

const CreateModal = (props: CreateModalProps) => {
	const {
		data,
		trigger,
		path,
		title,
		type,
		id,
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

	const [fetch, { data: prevData, isFetching, isUninitialized }] = useLazyGetByIdToEditQuery();
	const [formData, setFormData] = useFormData<any>(data, populate || prevData);
	const isMobile = useIsMobile();

	const [callApi, result] = usePostMutation();
	const [updateApi, updateResult] = useUpdateByIdMutation();

	const [schema, setSchema] = useState<any>([]);

	const { data: schemaData, isFetching: schemaLoading } = useGetSchemaQuery(path, {
		skip: !layout,
	});

	const onModalOpen = () => {
		onOpen();
		let newFieldData = {};

		data?.map(field => {
			if (field?.getValue) newFieldData = { ...newFieldData, [field.name]: field?.getValue(doc) };
			if (field?.value) newFieldData = { ...newFieldData, [field.name]: field?.value };
		});

		setFormData({ ...formData, ...newFieldData });
		if (type == 'update') {
			if (populate) {
				setFormData(populate);
				return;
			}
			fetch({ path, id });
		}
	};

	const { isSuccess, isLoading } = type === 'update' ? updateResult : result;

	const [changedData, setChangedData] = useState({});

	useEffect(() => {
		if (schemaData) {
			if (layout) {
				let newFieldData = {};
				const fields = convertToFormFields({ schema: schemaData, layout: layout });
				setSchema(fields);
				fields?.map(field => {
					if (field?.getValue)
						newFieldData = { ...newFieldData, [field.name]: field?.getValue(doc) };
					if (field?.value) newFieldData = { ...newFieldData, [field.name]: field?.value };
				});

				setFormData({ ...formData, ...newFieldData });
			} else {
				setSchema(data);
			}
		}
	}, [schemaLoading]);

	const successText = prompt?.successMsg
		? prompt?.successMsg
		: type == 'update'
		? 'Information Updated Successfully'
		: 'Item added successfully';

	useCustomToast({
		successText,
		...result,
	});

	useCustomToast({
		successText,
		...updateResult,
	});

	const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
		if (e.key === 'Enter') e.preventDefault();
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		let findExcludedFields: any = [];

		if (layout) {
			const fields: any = convertToFormFields({ schema: schemaData, layout: layout });
			findExcludedFields = fields.filter((field: any) => field?.isExcluded);
		} else {
			findExcludedFields = data.filter((field: any) => field?.isExcluded);
		}

		const toPostData = { ...formData };

		// Remove excluded fields from toPostData
		findExcludedFields.forEach((field: any) => {
			if (field.name in toPostData) delete toPostData[field.name];
		});

		if (type === 'update') updateApi({ path, id: id || 'id', body: changedData, invalidate });
		else callApi({ path, body: toPostData, invalidate });
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
		if (prevData) setFormData(prevData);
	}, [prevData, isFetching]);

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
					<DialogHeader>
						{prompt?.title || title || `${type === 'update' ? 'Update' : 'Create'} ${path}`}
					</DialogHeader>
					<DialogCloseButton />

					<DialogBody>
						<ModalFormSection>
							{layout ? (
								!schemaLoading && (
									<>
										<FormMain
											fields={createFormFields({ schema: schemaData, layout })}
											formData={formData}
											setFormData={setFormData}
											setChangedData={setChangedData}
											isModal={true}
										/>
									</>
								)
							) : (
								<FormMain
									fields={data}
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

export default CreateModal;
