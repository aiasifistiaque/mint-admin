'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	useDisclosure,
	Text,
	Select,
} from '@chakra-ui/react';
import React, { useEffect, useRef, FC, useState } from 'react';
import {
	useCustomToast,
	MenuItem,
	AlertDialogHeader,
	AlertDialogContent,
	EditDataSelect,
} from '../../../..';
import { useUpdateManyMutation } from '../../../../store';

type EditManyModalType = {
	title?: string;
	path: string;
	keys: string;
	items: any[];
	dataPath: string;
	dataModel?: any;
	keyType?: string;
	prompt?: {
		title?: string;
		body?: string;
	};
};

const EditManySelectModal: FC<EditManyModalType> = ({
	title,
	path,
	prompt,
	keys,
	items,
	dataPath,
	dataModel,
	keyType = 'string',
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>();
	const [value, setValue] = useState<any>();

	const [trigger, result] = useUpdateManyMutation();
	const { isLoading, isSuccess, isError, error, reset } = result;

	const closeItem = () => {
		reset();
		setValue(undefined);
		onClose();
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger({
			path,
			body: {
				ids: items,
				type: keyType,
				updates: {
					[keys]: value,
				},
			},
		});
	};

	useEffect(() => {
		if (!isLoading && isSuccess) {
			closeItem();
		}
	}, [isLoading]);

	useCustomToast({
		successText: `Batch item updated successfully`,
		isSuccess,
		isError,
		isLoading,
		error,
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
							<AlertDialogHeader>{prompt?.title || `Edit Item`}</AlertDialogHeader>

							<AlertDialogBody
								pt={4}
								gap={4}>
								<Text mb={2}>{prompt?.body || 'Please select an option'}</Text>

								<EditDataSelect
									dataModel={dataModel}
									isRequired={true}
									dataPath={dataPath}
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
								<Button
									type='submit'
									isDisabled={!value}
									isLoading={isLoading}
									colorScheme='brand'
									ml={2}
									size='sm'>
									Edit
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</form>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default EditManySelectModal;
