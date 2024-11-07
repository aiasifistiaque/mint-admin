'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	Flex,
	useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

import {
	useCustomToast,
	AlertDialogHeader,
	AlertDialogContent,
	useDeleteByIdMutation,
} from '../../';

type DeleteItemModalProps = {
	title?: string;
	id: string;
	path?: string;
	children: React.ReactNode;
};

const DeleteProductListModal: React.FC<DeleteItemModalProps> = ({ title, id, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef<any>(undefined);

	const [trigger, result] = useDeleteByIdMutation();

	const closeItem = () => {
		result?.reset();
		onClose();
	};

	const handleDelete = (e: any) => {
		e.preventDefault();
		trigger({ id: id, path: '/contents/product', invalidate: ['content', 'product', 'products'] });
	};

	useEffect(() => {
		if (result?.isSuccess && !result?.isLoading) {
			closeItem();
		}
	}, [result?.isLoading]);

	useCustomToast({
		successText: `${title ? title : 'Item'} Deleted Successfully`,
		isSuccess: result?.isSuccess,
		isError: result?.isError,
		isLoading: result?.isLoading,
		error: result?.error,
	});

	return (
		<>
			<Flex onClick={onOpen}>{children}</Flex>

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

export default DeleteProductListModal;
