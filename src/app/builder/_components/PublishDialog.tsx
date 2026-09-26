'use client';

import { FC, useState } from 'react';
import { Button, Dialog, Input, Portal, Text } from '@chakra-ui/react';
import { AlertDialogContent, AlertDialogHeader, Align } from '@/components/library';
import DiscardButton from '@/components/library/components/buttons/DiscardButton';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	/** Called with the version note (trimmed; undefined when left blank). */
	onConfirm: (note?: string) => void;
	route: string;
	/** Unsaved edits are saved before publishing — said so in the text. */
	isDirty: boolean;
	isLoading?: boolean;
};

/**
 * "Publish /route?" — the same portalled Dialog as the table's confirm and
 * delete prompts (ConfirmModal, DeleteItemModal).
 *
 * The version note's state lives here, not in RouteEditor: held there, every
 * keystroke re-rendered the whole editor — all its tabs and the settings
 * editor — which is what made typing in the old prompt lag. The content is
 * mounted only while open, so a fresh note each time and no hidden DOM.
 */
const PublishDialog: FC<Props> = ({ isOpen, onClose, onConfirm, route, isDirty, isLoading }) => {
	const [note, setNote] = useState('');

	const close = () => {
		setNote('');
		onClose();
	};

	return (
		<Dialog.Root
			placement='center'
			lazyMount
			unmountOnExit
			open={isOpen}
			onOpenChange={e => !e.open && !isLoading && close()}>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<AlertDialogContent
						borderWidth='1px'
						borderColor='border'
						_dark={{ bg: 'background.dark' }}>
						<AlertDialogHeader>Publish /{route}?</AlertDialogHeader>

						<Dialog.Body
							p={4}
							pb={6}>
							<Text
								fontSize='sm'
								color='fg.muted'>
								The draft{isDirty ? ' (including your unsaved changes)' : ''} goes live: the table, its filters
								and buttons change for every admin straight away. The current version is kept and can be restored.
							</Text>
							<Input
								mt={3}
								size='sm'
								autoFocus
								placeholder='Note for the version history (optional)'
								value={note}
								onChange={e => setNote(e.target.value)}
								onKeyDown={e => e.key === 'Enter' && !isLoading && onConfirm(note.trim() || undefined)}
							/>
						</Dialog.Body>

						<Dialog.Footer
							borderBottomRadius='2xl'
							borderTopWidth='1px'
							borderTopColor='border'
							bg='menu.light'
							_dark={{ bg: 'menu.dark' }}>
							<Align
								gap={2}
								p={4}>
								<DiscardButton
									disabled={isLoading}
									onClick={close}>
									Cancel
								</DiscardButton>
								<Button
									size='sm'
									px={3}
									loading={isLoading}
									loadingText='Publishing'
									spinnerPlacement='start'
									onClick={() => onConfirm(note.trim() || undefined)}>
									Publish
								</Button>
							</Align>
						</Dialog.Footer>
					</AlertDialogContent>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};

export default PublishDialog;
