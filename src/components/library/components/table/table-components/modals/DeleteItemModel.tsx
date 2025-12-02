'use client';

import { Dialog, Button, Flex, useDisclosure, Portal, Text, Box } from '@chakra-ui/react';
import { useEffect, FC, useRef } from 'react';

import {
	useCustomToast,
	MenuItem,
	useDeleteByIdMutation,
	useAppSelector,
	useLazyGetAllQuery,
	Align,
	AlertDialogHeader,
	AlertDialogContent,
	styles,
} from '../../../..';
import DiscardButton from '../../../buttons/DiscardButton';

type DeleteItemModalProps = {
	title?: string;
	id: string;
	path: string;
	item: any;
	children?: React.ReactNode;
};

const DeleteItemModal: FC<DeleteItemModalProps> = ({ title, path, id, item, children }) => {
	const { page, limit, search, sort, filters }: any = useAppSelector((state: any) => state.table);
	const { open: isOpen, onOpen, onClose } = useDisclosure();
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
			{children ? (
				<Flex onClick={onOpen}>{children}</Flex>
			) : (
				<MenuItem
					closeOnSelect={false}
					color='red.500'
					_dark={{ color: 'red.300' }}
					icon='delete-outline'
					onClick={onOpen}>
					{title || 'Delete'}
				</MenuItem>
			)}
			<Dialog.Root
				placement='center'
				open={isOpen}
				onOpenChange={(e: any) => !e.open && closeItem()}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<AlertDialogContent
							border='1px solid border.light'
							_dark={{ bg: 'background.dark', border: '1px solid #222' }}>
							<AlertDialogHeader>{titleText}</AlertDialogHeader>

							<Dialog.Body
								p={4}
								pb={8}>
								<Text>{bodyText}</Text>
							</Dialog.Body>

							<Dialog.Footer
								borderBottomRadius='2xl'
								borderTop='1px solid border.light'
								bg='menu.light'
								_dark={{ bg: 'menu.dark', borderTop: '1px solid #222' }}>
								<Align
									gap={2}
									p={4}>
									<DiscardButton
										disabled={isLoading}
										onClick={closeItem}>
										Discard
									</DiscardButton>

									<Button
										loadingText='Deleting...'
										spinnerPlacement='start'
										loading={isLoading}
										colorPalette='red'
										onClick={handleDelete}
										px={3}
										size='sm'>
										Delete
									</Button>
								</Align>
							</Dialog.Footer>
						</AlertDialogContent>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	);
};

export default DeleteItemModal;
