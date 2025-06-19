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
import { FC, useRef } from 'react';

import { AlertDialogHeader, AlertDialogContent } from '../../..';

type DeleteItemModalProps = {
	title?: string;
	trigger: any;
	onClick: any;
	description?: string;
};

const EmptyCartModal: FC<DeleteItemModalProps> = ({ trigger, title, description, onClick }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);

	const closeItem = () => {
		onClose();
	};

	const handleDelete = () => {
		onClick();
		closeItem();
	};

	return (
		<>
			<Flex onClick={onOpen}>{trigger}</Flex>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeItem}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>{title || 'Delete'}</AlertDialogHeader>

						<AlertDialogBody>
							{description || `Are you sure? You can't undo this action afterwards.`}
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button
								ref={cancelRef}
								onClick={closeItem}
								size='sm'
								colorScheme='gray'>
								Discard
							</Button>

							<Button
								colorScheme='red'
								onClick={handleDelete}
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

export default EmptyCartModal;
