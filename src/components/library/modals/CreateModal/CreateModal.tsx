'use client';

import React, { FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { Box, Button, Flex, Skeleton, Text, useDisclosure } from '@chakra-ui/react';

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
import { withoutHidden } from '../../functions/formRules';

/** 'invoice-items' -> 'invoice item', for "Edit invoice item". */
export const nounOf = (path?: string) => {
	const words = String(path || 'record')
		.replace(/[-_]+/g, ' ')
		.trim()
		.toLowerCase();
	if (/ies$/.test(words)) return words.replace(/ies$/, 'y');
	if (/(ss|us)$/.test(words)) return words;
	return words.replace(/s$/, '');
};

/** How a record is named in the header: its code and its name, when it has them. */
export const recordLabel = (doc: any) => {
	if (!doc || typeof doc !== 'object') return '';
	const name = doc.name || doc.title || doc.label || doc.email || '';
	const code = doc.code || doc.invoiceId || '';
	return [code, name].filter(Boolean).join(' · ');
};

/** Placeholder rows while the record loads, instead of an empty form. */
export const FormSkeleton = () => (
	<Flex
		direction='column'
		gap={5}
		py={2}>
		<Skeleton
			h='14px'
			w='120px'
		/>
		{[0, 1, 2].map(i => (
			<Flex
				key={i}
				gap={4}>
				<Box flex={1}>
					<Skeleton
						h='12px'
						w='80px'
						mb={2}
					/>
					<Skeleton h='36px' />
				</Box>
				<Box flex={1}>
					<Skeleton
						h='12px'
						w='80px'
						mb={2}
					/>
					<Skeleton h='36px' />
				</Box>
			</Flex>
		))}
	</Flex>
);

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
		open: controlledOpen,
		onClose: onControlledClose,
	} = props;

	// Controlled mode (see types.tsx): when `open` is passed, this dialog is
	// rendered by the caller outside its own trigger's lifecycle — no internal
	// trigger, no internal open state.
	const isControlled = controlledOpen !== undefined;
	const { open: internalOpen, onOpen, onClose: internalOnClose } = useDisclosure();
	const isOpen = isControlled ? controlledOpen : internalOpen;

	const [fetch, { data: prevData, isFetching, isUninitialized }] = useLazyGetByIdToEditQuery();
	const [formData, setFormData] = useFormData<any>(data, populate || prevData);
	const isMobile = useIsMobile();

	const [callApi, result] = usePostMutation();
	const [updateApi, updateResult] = useUpdateByIdMutation();

	const [schema, setSchema] = useState<any>([]);

	const { data: schemaData, isFetching: schemaLoading } = useGetSchemaQuery(path, {
		skip: !layout,
	});

	const initializeForm = () => {
		let newFieldData = {};

		data?.map(field => {
			if (field?.getValue) newFieldData = { ...newFieldData, [field.name]: field?.getValue(doc) };
			if (field?.value) newFieldData = { ...newFieldData, [field.name]: field?.value };
		});

		setFormData((prev: any) => ({ ...prev, ...newFieldData }));
		if (type == 'update') {
			if (populate) {
				setFormData(populate);
				return;
			}
			fetch({ path, id });
		}
	};

	// Uncontrolled path: the trigger's onClick calls this directly.
	const onModalOpen = () => {
		onOpen();
		initializeForm();
	};

	// Controlled path: there's no trigger onClick to hang initialization off
	// of, so run it whenever the caller flips `open` to true.
	useEffect(() => {
		if (isControlled && controlledOpen) initializeForm();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isControlled, controlledOpen]);

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

		// Fields hidden by their conditions aren't sent (the server drops them too).
		const shownFields = layout ? convertToFormFields({ schema: schemaData, layout: layout }) : data;
		if (type === 'update')
			updateApi({ path, id: id || 'id', body: withoutHidden(changedData, shownFields, formData), invalidate });
		else callApi({ path, body: withoutHidden(toPostData, shownFields, formData), invalidate });
	};

	const onModalClose = () => {
		setFormData({});
		result.reset();
		if (isControlled) onControlledClose?.();
		else internalOnClose();
	};

	useEffect(() => {
		if (isLoading) return;
		if (isSuccess) onModalClose();
	}, [isLoading]);

	useEffect(() => {
		if (populate) return;
		if (prevData) setFormData(prevData);
	}, [prevData, isFetching]);

	const isUpdate = type === 'update';
	const changes = Object.keys(changedData || {}).length;
	const loadingRecord = isUpdate && !populate && (isFetching || isUninitialized) && !prevData;

	// A generic "Edit" / "Update" from a menu says less than "Edit invoice".
	const genericTitle = !title || ['edit', 'update', 'create', 'add'].includes(String(title).toLowerCase());
	const heading =
		prompt?.title || (genericTitle ? `${isUpdate ? 'Edit' : 'New'} ${nounOf(path)}` : title);
	const subheading = isUpdate ? recordLabel(prevData || populate || doc) : undefined;

	const footer = (
		<>
			{!isMobile && (
				<Text
					mr='auto'
					fontSize='xs'
					color={changes ? 'fg' : 'fg.muted'}>
					{isUpdate ? (changes ? `${changes} unsaved change${changes === 1 ? '' : 's'}` : 'No changes yet') : ''}
				</Text>
			)}
			{!isMobile && (
				<DiscardButton
					px={3}
					disabled={isLoading}
					onClick={onModalClose}>
					Cancel
				</DiscardButton>
			)}
			<Button
				{...(isMobile && { w: 'full' })}
				px={3}
				type='submit'
				size={{ base: 'md', md: 'sm' }}
				disabled={loadingRecord}
				loading={isLoading}
				loadingText={isUpdate ? 'Saving' : 'Creating'}
				spinnerPlacement='start'>
				{prompt?.btnText || (isUpdate ? 'Save changes' : 'Create')}
			</Button>
		</>
	);

	return (
		<>
			{isControlled ? null : isMenu ? (
				<MenuItem
					asChild
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
					<DialogHeader description={subheading || undefined}>{heading}</DialogHeader>
					<DialogCloseButton />

					<DialogBody pt={{ base: 4, md: 5 }}>
						<ModalFormSection>
							{loadingRecord ? (
								<FormSkeleton />
							) : layout ? (
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
						{isMobile && <Align p={4}>{footer}</Align>}
					</DialogBody>
					{!isMobile && <DialogFooter>{footer}</DialogFooter>}
				</form>
			</Dialog>
		</>
	);
};

export default CreateModal;
