'use client';

import { Dialog, Button, Flex, useDisclosure, Portal, Text, ButtonProps } from '@chakra-ui/react';
import { useEffect, FC, ReactNode, useRef } from 'react';

import { MenuItem, Align, AlertDialogHeader, AlertDialogContent, PromptType } from '../../../..';
import DiscardButton from '../../../buttons/DiscardButton';

type ConfirmModalProps = {
	title?: string;
	icon?: string;
	prompt?: PromptType;
	isLoading?: boolean;
	isSuccess?: boolean;
	colorPalette?: ButtonProps['colorPalette'];
	onConfirm: (e: any) => void;
	onClose?: () => void;
	children?: ReactNode;
	// Controlled mode: when `open` is passed, the dialog's open state is driven
	// by the caller instead of an internal useDisclosure, and no trigger is
	// rendered — used by TableMenu so the dialog lives outside the dropdown
	// menu's own mount lifecycle.
	open?: boolean;
};

/**
 * A generic "are you sure?" confirmation dialog for menu actions that aren't a
 * delete (disable/enable, resend, renew, etc). Mirrors DeleteItemModal's dialog
 * chrome so every confirm prompt in a table's row menu looks and behaves the same.
 */
const ConfirmModal: FC<ConfirmModalProps> = ({
	title,
	icon,
	prompt,
	isLoading,
	isSuccess,
	colorPalette = 'blackAlpha',
	onConfirm,
	onClose,
	children,
	open: controlledOpen,
}) => {
	const isControlled = controlledOpen !== undefined;
	const { open: internalOpen, onOpen, onClose: close } = useDisclosure();
	const isOpen = isControlled ? controlledOpen : internalOpen;
	const cancelRef = useRef<any>(undefined);

	const closeItem = () => {
		onClose?.();
		if (!isControlled) close();
	};

	useEffect(() => {
		if (isSuccess && !isLoading) {
			closeItem();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);

	const titleText = prompt?.title || 'Confirm Action';
	const bodyText = prompt?.body || 'Are you sure you want to proceed?';

	return (
		<>
			{isControlled ? null : children ? (
				<Flex onClick={onOpen}>{children}</Flex>
			) : (
				<MenuItem
					icon={icon}
					onClick={onOpen}>
					{title || 'Confirm'}
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
										loadingText='Processing'
										spinnerPlacement='start'
										loading={isLoading}
										ref={cancelRef}
										colorPalette={colorPalette}
										onClick={onConfirm}
										px={3}
										size='sm'>
										{prompt?.btnText || 'Proceed'}
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

export default ConfirmModal;
