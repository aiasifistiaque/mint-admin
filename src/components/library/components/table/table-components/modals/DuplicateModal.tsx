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

import { useCopyItemMutation } from '../../../../store';
import { useCustomToast, MenuItem, AlertDialogContent, AlertDialogHeader } from '../../../../';

type DeleteItemModalProps = {
	title?: string;
	id: string;
	path: string;
};

const DuplicateModal: React.FC<DeleteItemModalProps> = ({ title, path, id }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef<any>(undefined);

	const [trigger, result] = useCopyItemMutation();

	const closeItem = () => {
		result?.reset();
		onClose();
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger({ path: path, body: { id } });
	};

	useEffect(() => {
		if (result?.isSuccess && !result?.isLoading) {
			closeItem();
		}
	}, [result?.isLoading]);

	useCustomToast({
		successText: `${title ? title : 'Item'} Copied Successfully`,
		isSuccess: result?.isSuccess,
		isError: result?.isError,
		isLoading: result?.isLoading,
		error: result?.error,
	});

	return (
		<>
			<MenuItem onClick={onOpen}>Make Copy</MenuItem>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeItem}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>Create Duplicate Entry</AlertDialogHeader>

						<AlertDialogBody>Are you sure you want to make a copy of this item?</AlertDialogBody>

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
								onClick={handleSubmit}
								ml={2}
								size='sm'>
								Proceed
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default DuplicateModal;
