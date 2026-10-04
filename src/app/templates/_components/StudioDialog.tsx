'use client';

import { FC, ReactNode } from 'react';
import { Button, Dialog, Flex, Portal } from '@chakra-ui/react';
import { ModalFooter } from '@/components/library';
import { radius } from '@/components/library/config';
import { GuideLink } from './ui';

/**
 * Template Studio's form dialogs, from Chakra's Dialog parts: the title with
 * its guide link, the body, and Cancel / the action on the footer.
 */
const StudioDialog: FC<{
	open: boolean;
	onClose: () => void;
	title: ReactNode;
	section: string;
	children: ReactNode;
	confirmLabel: ReactNode;
	onConfirm: () => void;
	loading?: boolean;
	disabled?: boolean;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	/** Left of the buttons: a note. */
	aside?: ReactNode;
}> = ({ open, onClose, title, section, children, confirmLabel, onConfirm, loading, disabled, size = 'md', aside }) => (
	<Dialog.Root
		placement='top'
		size={size}
		open={open}
		onOpenChange={e => !e.open && onClose()}>
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
						<Flex
							align='center'
							justify='space-between'
							gap={3}
							w='full'>
							<Dialog.Title fontSize='16px'>{title}</Dialog.Title>
							<GuideLink section={section} />
						</Flex>
					</Dialog.Header>
					<Dialog.Body
						px={{ base: 4, md: 6 }}
						pt={0}
						pb={{ base: 4, md: 5 }}>
						{children}
					</Dialog.Body>
					<ModalFooter>
						<Flex
							gap={2}
							align='center'
							w='full'>
							{aside}
							<Flex
								gap={2}
								ml='auto'>
								<Button
									px={3}
									size='sm'
									variant='outline'
									onClick={onClose}>
									Cancel
								</Button>
								<Button
									px={3}
									size='sm'
									loading={loading}
									disabled={disabled}
									onClick={onConfirm}>
									{confirmLabel}
								</Button>
							</Flex>
						</Flex>
					</ModalFooter>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
	</Dialog.Root>
);

export default StudioDialog;
