'use client';

import { Dialog, Button, useDisclosure, Portal } from '@chakra-ui/react';
import { useEffect, FC, useRef } from 'react';

import { useCopyItemMutation } from '../../../../store';
import { useCustomToast, MenuItem } from '../../../..';

type DeleteItemModalProps = {
	title?: string;
	id: string;
	path: string;
};

const DuplicateModal: FC<DeleteItemModalProps> = ({ title, path, id }) => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);

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
			<MenuItem
				closeOnSelect={false}
				onClick={onOpen}
				icon='duplicate'>
				Make Copy
			</MenuItem>

			<Dialog.Root
				open={isOpen}
				onOpenChange={(e: any) => !e.open && closeItem()}
				placement='center'>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Create Duplicate Entry</Dialog.Title>
							</Dialog.Header>

							<Dialog.Body>Are you sure you want to make a copy of this item?</Dialog.Body>

							<Dialog.Footer>
								{!result?.isLoading && (
									<Dialog.CloseTrigger asChild>
										<Button
											ref={cancelRef}
											onClick={closeItem}
											size='sm'
											colorPalette='white'>
											Discard
										</Button>
									</Dialog.CloseTrigger>
								)}
								<Button
									loading={result?.isLoading}
									onClick={handleSubmit}
									ml={2}
									size='sm'>
									Proceed
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	);
};

export default DuplicateModal;
