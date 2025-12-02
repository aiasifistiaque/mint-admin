'use client';

import { Dialog, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { FC, useRef } from 'react';

type DeleteItemModalProps = {
	title?: string;
	trigger: any;
	onClick: any;
	description?: string;
};

const EmptyCartModal: FC<DeleteItemModalProps> = ({ trigger, title, description, onClick }) => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
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

			<Dialog.Root
				open={isOpen}
				onOpenChange={e => !e.open && closeItem()}
				role='alertdialog'>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>{title || 'Delete'}</Dialog.Title>
						</Dialog.Header>

						<Dialog.Body>
							{description || `Are you sure? You can't undo this action afterwards.`}
						</Dialog.Body>

						<Dialog.Footer>
							<Dialog.CloseTrigger asChild>
								<Button
									ref={cancelRef}
									size='sm'
									colorPalette='gray'>
									Discard
								</Button>
							</Dialog.CloseTrigger>

							<Button
								colorPalette='red'
								onClick={handleDelete}
								ml={2}
								size='sm'>
								Proceed
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		</>
	);
};

export default EmptyCartModal;
