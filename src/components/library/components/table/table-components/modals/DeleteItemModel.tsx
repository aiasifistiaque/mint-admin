'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

import {
	useCustomToast,
	AlertDialogHeader,
	MenuItem,
	AlertDialogContent,
	useDeleteByIdMutation,
} from '../../../../';

type DeleteItemModalProps = {
	title?: string;
	id: string;
	path: string;
};

const DeleteItemModal: React.FC<DeleteItemModalProps> = ({ title, path, id }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef<any>(undefined);

	const [trigger, result] = useDeleteByIdMutation();
	const { isSuccess, isError, isLoading, error } = result;

	const closeItem = () => {
		result?.reset();
		onClose();
	};

	const handleDelete = (e: any) => {
		e.preventDefault();
		trigger({ path: path, id: id });
	};

	useEffect(() => {
		if (isSuccess && !isLoading) {
			closeItem();
		}
	}, [result?.isSuccess]);

	useCustomToast({
		successText: `${title ? title : 'Item'} Deleted Successfully`,
		...result,
	});

	return (
		<>
			<MenuItem
				color='red'
				onClick={onOpen}>
				{title || 'Delete'}
			</MenuItem>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeItem}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>Delete {title}</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure? You {`can't`} undo this action afterwards.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button
								isDisabled={isLoading}
								ref={cancelRef}
								onClick={closeItem}
								size='sm'
								colorScheme='gray'>
								Discard
							</Button>

							<Button
								isLoading={isLoading}
								colorScheme='red'
								onClick={handleDelete}
								ml={2}
								size='sm'>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default DeleteItemModal;
