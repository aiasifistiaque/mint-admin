'use client';

import { Dialog, Button, useDisclosure, Text } from '@chakra-ui/react';
import { useEffect, useRef, FC, useState } from 'react';

import {
	useCustomToast,
	MenuItem,
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
	const { open: isOpen, onOpen, onClose } = useDisclosure();
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
			<MenuItem
				onClick={onOpen}
				closeOnSelect={false}>
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
								<Text>{prompt?.body || 'Please select an option'}</Text>

								<EditDataSelect
									isRequired={true}
									dataPath={dataPath || ''}
									value={value}
									onChange={e => {
										setValue(e.target.value);
									}}
								/>
							</Dialog.Body>

							<Dialog.Footer>
								{!isLoading && (
									<Dialog.CloseTrigger asChild>
										<Button
											ref={cancelRef}
											size='sm'
											colorPalette='gray'>
											Discard
										</Button>
									</Dialog.CloseTrigger>
								)}
								<AlertSubmitButton
									disabled={!value}
									isLoading={isLoading}>
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

export default UpdateDataMenuModal;
