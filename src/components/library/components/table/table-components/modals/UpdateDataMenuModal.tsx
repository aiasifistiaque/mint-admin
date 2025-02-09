'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	useDisclosure,
	Text,
} from '@chakra-ui/react';
import React, { useEffect, useRef, FC, useState } from 'react';

import {
	useCustomToast,
	MenuItem,
	AlertDialogHeader,
	AlertDialogContent,
	EditDataSelect,
	AlertSubmitButton,
	useUpdateByIdMutation,
	PromptType,
} from '../../../..';

type UpdateKeyProps = {
	id: string;
	item: {
		title?: string;
		path: string;
		invalidate?: string[] | undefined;
		key: string;
		dataPath?: string;
		prompt?: PromptType;
	};
	doc?: any;
};

const UpdateDataMenuModal: FC<UpdateKeyProps> = ({ item, doc, id }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { title, path, prompt, invalidate, dataPath, key } = item;

	const cancelRef = useRef<any>(undefined);
	const [value, setValue] = useState<any>();

	const [trigger, result] = useUpdateByIdMutation();
	const { isLoading, isSuccess, reset } = result;

	const closeItem = () => {
		reset();
		setValue(undefined);
		onClose();
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger({
			path: path,
			id,
			body: {
				[key]: value,
			},
			invalidate,
		});
	};

	useEffect(() => {
		if (!isLoading && isSuccess) {
			closeItem();
		}
	}, [isLoading]);

	useCustomToast({
		successText: prompt?.successMsg || `Item updated successfully`,
		...result,
	});

	return (
		<>
			<MenuItem onClick={onOpen}>{title}</MenuItem>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeItem}>
				<AlertDialogOverlay>
					<form onSubmit={handleSubmit}>
						<AlertDialogContent>
							<AlertDialogHeader>{prompt?.title || `Update Item`}</AlertDialogHeader>

							<AlertDialogBody py={4}>
								<Text>{prompt?.body || 'Please select an option'}</Text>

								<EditDataSelect
									isRequired={true}
									dataPath={dataPath || ''}
									value={value}
									onChange={e => {
										setValue(e.target.value);
									}}
								/>
							</AlertDialogBody>

							<AlertDialogFooter>
								{!isLoading && (
									<Button
										ref={cancelRef}
										onClick={closeItem}
										size='sm'
										colorScheme='gray'>
										Discard
									</Button>
								)}
								<AlertSubmitButton
									isDisabled={!value}
									isLoading={isLoading}>
									{prompt?.btnText || 'Update'}
								</AlertSubmitButton>
							</AlertDialogFooter>
						</AlertDialogContent>
					</form>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default UpdateDataMenuModal;
