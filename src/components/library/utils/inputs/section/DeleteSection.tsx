'use client';

import { Button, IconButton, useDisclosure, Dialog } from '@chakra-ui/react';
import { FC, useRef } from 'react';

import { Icon } from '../../..';

type DeleteItemModalProps = {
	idx: number;
	value: any;
	handleDataChange: any;
	name: string;
};

const DeleteSection: FC<DeleteItemModalProps> = ({ value, handleDataChange, name, idx }) => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
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
				colorPalette='red'
				onClick={onOpen}>
				<Icon
					name='delete'
					color='red'
				/>
			</IconButton>

			<Dialog.Root
				open={isOpen}
				onOpenChange={e => (e.open ? onOpen() : closeItem())}
				role='alertdialog'>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>Delete Section</Dialog.Header>
						<Dialog.CloseTrigger />

						<Dialog.Body>Are you sure? You {`can't`} undo this action afterwards.</Dialog.Body>

						<Dialog.Footer>
							<Button
								ref={cancelRef}
								onClick={closeItem}
								size='sm'
								colorPalette='gray'>
								Discard
							</Button>

							<Button
								colorPalette='red'
								onClick={handleDelete}
								ml={2}
								size='sm'>
								Delete
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		</>
	);
};

export default DeleteSection;
