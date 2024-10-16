'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import {
	useCustomToast,
	AlertDialogHeader,
	MenuItem,
	AlertDialogContent,
	useDeleteByIdMutation,
} from '../../../..';

type DeleteItemModalProps = {
	title?: string;
	id: string;
	path: string;
};

const DeleteItemModal: React.FC<DeleteItemModalProps> = ({ title, path, id }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef<any>();

	const [trigger, result] = useDeleteByIdMutation();

	const closeItem = () => {
		result?.reset();
		onClose();
	};

	const handleDelete = (e: any) => {
		e.preventDefault();
		trigger({ path: path, id: id });
	};

	useCustomToast({
		successText: `${title ? title : 'Item'} Deleted Successfully`,
		isSuccess: result?.isSuccess,
		isError: result?.isError,
		isLoading: result?.isLoading,
		error: result?.error,
	});

	return (
		<>
			<MenuItem
				color='red'
				onClick={onOpen}>
				Delete
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
							{!result?.isLoading && (
								<Button
									ref={cancelRef}
									onClick={closeItem}
									size='sm'
									colorScheme='gray'>
									Discard
								</Button>
							)}
							<Button
								isLoading={result?.isLoading}
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
