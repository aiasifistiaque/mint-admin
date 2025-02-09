'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
	useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useRef, FC } from 'react';
import { useCustomToast, MenuItem, AlertDialogHeader } from '../../../..';
import { useGetByIdToEditQuery, useUpdateManyMutation } from '../../../../store';

type EditManyModalType = {
	title?: string;
	item: string;
	path: string;
	keys: string;
	value: any;
	keyType: string;

	prompt?: {
		title?: string;
		body?: string;
	};
};

const EditFieldModal: FC<EditManyModalType> = ({
	title,
	path,
	item,
	prompt,
	keys,
	keyType = 'string',
	value,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);

	const { data, isFetching } = useGetByIdToEditQuery({ path, id: item });

	const [trigger, result] = useUpdateManyMutation();
	const { isLoading, isSuccess, isError, error, reset } = result;

	const closeItem = () => {
		reset();
		onClose();
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger({
			path,
			body: {
				ids: [item],
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
		successText: `Info Updated Successfully`,
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
					<AlertDialogContent
						boxShadow='lg'
						borderRadius='xl'
						bg='menu.light'
						_dark={{
							bg: 'menu.dark',
						}}>
						<AlertDialogHeader>{prompt?.title || `Edit ${title}`}</AlertDialogHeader>

						<AlertDialogBody pt={4}>
							{prompt?.body || 'Are you sure you want to edit these items?'}
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
								isLoading={isLoading}
								colorScheme='brand'
								onClick={handleSubmit}
								ml={2}
								size='sm'>
								Edit
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default EditFieldModal;
