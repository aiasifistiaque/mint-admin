// 'use client';

// import {
// 	AlertDialog,
// 	AlertDialogBody,
// 	AlertDialogFooter,
// 	AlertDialogOverlay,
// 	Button,
// 	Flex,
// 	useDisclosure,
// } from '@chakra-ui/react';
// import  { useEffect } from 'react';

// import {
// 	useCustomToast,
// 	AlertDialogHeader,
// 	AlertDialogContent,
// 	useDeleteByIdMutation,
// } from '../../';

// type DeleteItemModalProps = {
// 	title?: string;
// 	id: string;
// 	path?: string;
// 	children: ReactNode;
// };

// const DeleteProductListModal: FC<DeleteItemModalProps> = ({
// 	title,
// 	id,
// 	children,
// 	path = 'nexa',
// }) => {
// 	const { isOpen, onOpen, onClose } = useDisclosure();
// 	const cancelRef = useRef<any>(undefined);

// 	const [trigger, result] = useDeleteByIdMutation();

// 	const closeItem = () => {
// 		result?.reset();
// 		onClose();
// 	};

// 	const handleDelete = (e: any) => {
// 		e.preventDefault();
// 		trigger({
// 			id: id,
// 			path: `/contents/product/${path}`,
// 			invalidate: ['content', 'product', 'products'],
// 		});
// 	};

// 	useEffect(() => {
// 		if (result?.isSuccess && !result?.isLoading) {
// 			closeItem();
// 		}
// 	}, [result?.isLoading]);

// 	useCustomToast({
// 		successText: `${title ? title : 'Item'} Deleted Successfully`,
// 		isSuccess: result?.isSuccess,
// 		isError: result?.isError,
// 		isLoading: result?.isLoading,
// 		error: result?.error,
// 	});

// 	return (
// 		<>
// 			<Flex onClick={onOpen}>{children}</Flex>

// 			<AlertDialog
// 				isOpen={isOpen}
// 				leastDestructiveRef={cancelRef}
// 				onClose={closeItem}>
// 				<AlertDialogOverlay>
// 					<AlertDialogContent>
// 						<AlertDialogHeader>Delete {title}</AlertDialogHeader>

// 						<AlertDialogBody>
// 							Are you sure? You {`can't`} undo this action afterwards.
// 						</AlertDialogBody>

// 						<AlertDialogFooter>
// 							{!result?.isLoading && (
// 								<Button
// 									ref={cancelRef}
// 									onClick={closeItem}
// 									size='sm'
// 									colorScheme='gray'>
// 									Discard
// 								</Button>
// 							)}
// 							<Button
// 								isLoading={result?.isLoading}
// 								colorScheme='red'
// 								onClick={handleDelete}
// 								ml={2}
// 								size='sm'>
// 								Delete
// 							</Button>
// 						</AlertDialogFooter>
// 					</AlertDialogContent>
// 				</AlertDialogOverlay>
// 			</AlertDialog>
// 		</>
// 	);
// };

// export default DeleteProductListModal;

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
import { useEffect, ReactNode, FC, useRef } from 'react';

import {
	useCustomToast,
	AlertDialogHeader,
	AlertDialogContent,
	useDeleteByIdMutation,
	useDeleteProductlistByKeyIdMutation,
} from '../..';

type DeleteItemModalProps = {
	title?: string;
	id: string;
	path?: string;
	children: ReactNode;
	productListKeys?: any;
};

const DeleteProductListModal: FC<DeleteItemModalProps> = ({
	title,
	id,
	children,
	path = 'pulse',
	productListKeys,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);
	const [trigger, result] = useDeleteByIdMutation();
	const [triggerProduct, productResult] = useDeleteProductlistByKeyIdMutation();
	const closeItem = () => {
		result?.reset();
		productResult?.reset();
		onClose();
	};

	const handleDelete = (e: any) => {
		e.preventDefault();
		if (productListKeys) {
			triggerProduct({
				id: id,
				path: `/contents/product/${path}`,
				key: productListKeys,
				invalidate: ['content', 'product', 'products'],
			});
		} else {
			trigger({
				id: id,
				path: `/contents/product/${path}`,
				invalidate: ['content', 'product', 'products'],
			});
		}
	};

	useEffect(() => {
		if (result?.isSuccess && !result?.isLoading) {
			closeItem();
		}
	}, [result?.isLoading]);

	useEffect(() => {
		if (productResult?.isSuccess && !productResult?.isLoading) {
			closeItem();
		}
	}, [productResult?.isLoading]);

	useCustomToast({
		successText: `${title ? title : 'Item'} Deleted Successfully`,
		isSuccess: result?.isSuccess,
		isError: result?.isError,
		isLoading: result?.isLoading,
		error: result?.error,
	});
	useCustomToast({
		successText: `${title ? title : 'Item'} Deleted Successfully`,
		isSuccess: productResult?.isSuccess,
		isError: productResult?.isError,
		isLoading: productResult?.isLoading,
		error: productResult?.error,
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
