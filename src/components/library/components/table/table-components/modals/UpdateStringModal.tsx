'use client';

import { Dialog, Button, useDisclosure, Text, Portal } from '@chakra-ui/react';
import { useEffect, useRef, FC, useState } from 'react';

import {
	useCustomToast,
	MenuItem,
	AlertSubmitButton,
	useUpdateByIdMutation,
	PromptType,
	Column,
	Input,
	AlertDialogHeader,
} from '../../../..';

type UpdateKeyProps = {
	id: string;
	path: string;
	type: 'text' | 'number';
	item: {
		title?: string;
		path: string;
		invalidate?: string[] | undefined;
		key: string;
		dataPath?: string;
		prompt?: PromptType;
	};
	doc?: any;
	icon?: string;
};

const UpdateStringModal: FC<UpdateKeyProps> = ({ item, doc, id, path, type, icon }) => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
	const { title, prompt, invalidate, dataPath, key } = item;

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

	const onModalOpen = () => {
		onOpen();
		setValue(doc?.[key]);
	};

	useCustomToast({
		successText: prompt?.successMsg || `Item updated successfully`,
		...result,
	});

	return (
		<>
			<MenuItem
				closeOnSelect={false}
				icon={'update-key'}
				onClick={onModalOpen}>
				{title}
			</MenuItem>

			<Dialog.Root
				placement='center'
				open={isOpen}
				onOpenChange={e => !e.open && closeItem()}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<form onSubmit={handleSubmit}>
								<AlertDialogHeader>
									<Dialog.Title>{prompt?.title || `Update Item`}</Dialog.Title>
								</AlertDialogHeader>

								<Dialog.Body p={6}>
									<Column gap={4}>
										<Text>{prompt?.body || 'Please select an option'}</Text>
										<Input
											size='sm'
											value={value}
											onChange={e => setValue(e.target.value)}
											type={type}
										/>
									</Column>
								</Dialog.Body>

								<Dialog.Footer
									px={6}
									py={4}>
									{!isLoading && (
										// <Dialog.CloseTrigger asChild>
										<Button
											px={3}
											onClick={closeItem}
											ref={cancelRef}
											size='sm'
											variant='outline'>
											Discard
										</Button>
										// </Dialog.CloseTrigger>
									)}
									<AlertSubmitButton
										disabled={!value}
										loading={isLoading}>
										{prompt?.btnText || 'Update'}
									</AlertSubmitButton>
								</Dialog.Footer>
							</form>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	);
};

export default UpdateStringModal;
