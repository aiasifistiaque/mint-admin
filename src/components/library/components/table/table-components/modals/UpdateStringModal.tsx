'use client';

import { Dialog, Button, useDisclosure, Text } from '@chakra-ui/react';
import { useEffect, useRef, FC, useState } from 'react';

import {
	useCustomToast,
	MenuItem,
	AlertSubmitButton,
	useUpdateByIdMutation,
	PromptType,
	Column,
	Input,
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
				open={isOpen}
				onOpenChange={e => !e.open && closeItem()}
				role='alertdialog'>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<form onSubmit={handleSubmit}>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>{prompt?.title || `Update Item`}</Dialog.Title>
							</Dialog.Header>

							<Dialog.Body py={4}>
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

							<Dialog.Footer>
								{!isLoading && (
									<Dialog.CloseTrigger asChild>
										<Button
											ref={cancelRef}
											size='sm'
											colorPalette='white'>
											Discard
										</Button>
									</Dialog.CloseTrigger>
								)}
								<AlertSubmitButton
									disabled={!value}
									loading={isLoading}>
									{prompt?.btnText || 'Update'}
								</AlertSubmitButton>
							</Dialog.Footer>
						</Dialog.Content>
					</form>
				</Dialog.Positioner>
			</Dialog.Root>
		</>
	);
};

export default UpdateStringModal;
