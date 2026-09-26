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
import ModalFooter from '../../../../modals/modal-components/CustomModalFooter';

type DeleteItemModalProps = {
	title?: string;
	id: string;
	path: string;
	item: any;
	children?: React.ReactNode;
	// Controlled mode: when `open` is passed, the dialog's open state is driven
	// by the caller instead of an internal useDisclosure, and no trigger is
	// rendered — used by TableMenu so the dialog lives outside the dropdown
	// menu's own mount lifecycle.
	open?: boolean;
	onClose?: () => void;
};

const DeleteItemModal: FC<DeleteItemModalProps> = ({
	title,
	path,
	id,
	item,
	children,
	open: controlledOpen,
	onClose: onControlledClose,
}) => {
	const { page, limit, search, sort, filters }: any = useAppSelector((state: any) => state.table);
	const isControlled = controlledOpen !== undefined;
	const { open: internalOpen, onOpen, onClose: internalOnClose } = useDisclosure();
	const isOpen = isControlled ? controlledOpen : internalOpen;
	const cancelRef = useRef<any>(undefined);

	const [trigger, result] = useDeleteByIdMutation();
	const [getAllTrigger, getAllResults] = useLazyGetAllQuery();

	const { isSuccess, isError, isLoading, error } = result;

	const closeItem = () => {
		result?.reset();
		if (isControlled) onControlledClose?.();
		else internalOnClose();
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
			{isControlled ? null : children ? (
				<Flex onClick={onOpen}>{children}</Flex>
			) : (
				<MenuItem
					color='red.500'
					_dark={{ color: 'red.300' }}
					icon='delete-outline'
					onClick={onOpen}>
					{title || 'Delete'}
				</MenuItem>
			)}
			<Dialog.Root
				lazyMount
				unmountOnExit
				placement='center'
				open={isOpen}
				onOpenChange={(e: any) => !e.open && closeItem()}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<AlertDialogContent
							border='1px solid border.light'
							_dark={{ bg: 'background.dark', border: '1px solid', borderColor: 'border' }}>
							<AlertDialogHeader>{titleText}</AlertDialogHeader>

							<Dialog.Body
								p={4}
								pb={8}>
								<Text>{bodyText}</Text>
							</Dialog.Body>

							<ModalFooter>
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
							</ModalFooter>
						</AlertDialogContent>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	);
};

export default DeleteItemModal;
