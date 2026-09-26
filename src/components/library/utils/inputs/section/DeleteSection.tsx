'use client';

import { Button, CloseButton, IconButton, useDisclosure, Dialog, Portal } from '@chakra-ui/react';
import { FC, useRef } from 'react';

import { Icon, radius } from '../../..';
import ModalFooter from '../../../modals/modal-components/CustomModalFooter';
import { SECTION_BUTTON } from './sectionButtons';

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
				aria-label='Delete'
				size='xs'
				colorPalette='red'
				onClick={onOpen}>
				<Icon name='delete' />
			</IconButton>

			<Dialog.Root
				size='sm'
				placement='center'
				open={isOpen}
				onOpenChange={e => (e.open ? onOpen() : closeItem())}
				role='alertdialog'>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content
							borderRadius={radius.MODAL}
							bg='bg.panel'
							borderWidth='1px'
							borderColor='border'>
							<Dialog.Header
								px={{ base: 4, md: 6 }}
								pt={{ base: 4, md: 5 }}
								pb={{ base: 3, md: 4 }}>
								<Dialog.Title fontSize='16px'>Delete this entry?</Dialog.Title>
							</Dialog.Header>
							<Dialog.CloseTrigger
								asChild
								top={3}
								right={3}>
								<CloseButton size='sm' />
							</Dialog.CloseTrigger>

							<Dialog.Body
								px={{ base: 4, md: 6 }}
								pt={0}
								pb={{ base: 4, md: 5 }}
								fontSize='sm'>
								It&apos;s removed from the list; the change is kept when you save the record.
							</Dialog.Body>

							<ModalFooter>
								<Button
									{...SECTION_BUTTON}
									ref={cancelRef}
									onClick={closeItem}
									variant='outline'>
									Cancel
								</Button>

								<Button
									{...SECTION_BUTTON}
									colorPalette='red'
									onClick={handleDelete}>
									Delete
								</Button>
							</ModalFooter>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	);
};

export default DeleteSection;
