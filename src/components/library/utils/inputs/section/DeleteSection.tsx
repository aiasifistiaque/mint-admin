'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	IconButton,
	useDisclosure,
} from '@chakra-ui/react';
import { FC, useRef } from 'react';

import { AlertDialogHeader, AlertDialogContent, Icon } from '../../..';

type DeleteItemModalProps = {
	idx: number;
	value: any;
	handleDataChange: any;
	name: string;
};

const DeleteSection: FC<DeleteItemModalProps> = ({ value, handleDataChange, name, idx }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);

	const closeItem = () => {
		onClose();
	};

	const handleDelete = () => {
		const newArr = Array.isArray(value) ? [...value] : [];
		if (idx >= 0 && idx < newArr.length) {
			newArr.splice(idx, 1);
		}
		if (handleDataChange) {
			const event = {
				target: {
					name: name,
					value: newArr,
				},
			} as any;
			handleDataChange(event);
		}

		onClose();
	};

	return (
		<>
			<IconButton
				variant='outline'
				aria-label='delete-section'
				size='xs'
				colorScheme='red'
				onClick={onOpen}
				icon={
					<Icon
						name='delete'
						color='red'
					/>
				}
			/>

			<AlertDialog
				isCentered
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeItem}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>Delete Section</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure? You {`can't`} undo this action afterwards.
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
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default DeleteSection;
