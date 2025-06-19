'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	useDisclosure,
} from '@chakra-ui/react';
import { useEffect, FC, useRef } from 'react';

import {
	useCustomToast,
	AlertDialogHeader,
	MenuItem,
	AlertDialogContent,
	useDeleteByIdMutation,
	useAppSelector,
	useLazyGetAllQuery,
} from '../../../..';

type DeleteItemModalProps = {
	title?: string;
	id: string;
	path: string;
	item: any;
};

const DeleteItemModal: FC<DeleteItemModalProps> = ({ title, path, id, item }) => {
	const { page, limit, search, sort, filters, preferences, selectedItems }: any = useAppSelector(
		(state: any) => state.table
	);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);

	const [trigger, result] = useDeleteByIdMutation();
	const [getAllTrigger, getAllResults] = useLazyGetAllQuery();

	const { isSuccess, isError, isLoading, error } = result;

	const closeItem = () => {
		result?.reset();
		onClose();
	};

	const handleDelete = (e: any) => {
		e.preventDefault();
		trigger({ path: path, id: id, invalidate: [path, item?.invalidate] });
	};

	useEffect(() => {
		if (isSuccess && !isLoading) {
			getAllTrigger({
				page,
				limit,
				search,
				sort,
				filters,
				path,
			});
			closeItem();
		}
	}, [result?.isSuccess]);

	useCustomToast({
		successText: item?.prompt?.successMsg || `${title ? title : 'Item'} Deleted Successfully`,
		...result,
	});

	const titleText = item?.prompt?.title || 'Delete Item';
	const bodyText =
		item?.prompt?.body ||
		"Are you sure you want to delete this item? You can't undo this action afterwards.";

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
						<AlertDialogHeader>{titleText}</AlertDialogHeader>
						<AlertDialogBody>{bodyText}</AlertDialogBody>

						<AlertDialogFooter>
							<Button
								variant='white'
								isDisabled={isLoading}
								ref={cancelRef}
								onClick={closeItem}
								size='sm'>
								Discard
							</Button>
							<Button
								loadingText='Deleting'
								spinnerPlacement='start'
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
