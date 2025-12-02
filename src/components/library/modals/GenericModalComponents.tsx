'use client';

import { FC, ReactNode } from 'react';
import { Dialog, IconButton } from '@chakra-ui/react';
import { Icon } from '../icon';

/**
 * ModalHeader - Generic modal header component
 */
export const ModalHeader: FC<{ children: ReactNode } & any> = ({ children, ...props }) => {
	return (
		<Dialog.Header
			fontSize='lg'
			fontWeight='600'
			color={{ _light: 'text.light', _dark: 'text.dark' }}
			{...props}>
			{children}
		</Dialog.Header>
	);
};

/**
 * ModalBody - Generic modal body component
 */
export const ModalBody: FC<{ children: ReactNode } & any> = ({ children, ...props }) => {
	return <Dialog.Body {...props}>{children}</Dialog.Body>;
};

/**
 * ModalFooter - Generic modal footer component
 */
export const ModalFooter: FC<{ children: ReactNode } & any> = ({ children, ...props }) => {
	return <Dialog.Footer {...props}>{children}</Dialog.Footer>;
};

/**
 * ModalCloseButton - Generic modal close button
 */
export const ModalCloseButton: FC<any> = props => {
	return (
		<Dialog.CloseTrigger asChild>
			<IconButton
				variant='ghost'
				size='sm'
				position='absolute'
				right={2}
				top={2}
				aria-label='Close modal'
				{...props}>
				<Icon
					name='close'
					size={18}
				/>
			</IconButton>
		</Dialog.CloseTrigger>
	);
};

/**
 * ModalOverlay - For backward compatibility (handled by GenericModal)
 * This is a no-op component since GenericModal handles the backdrop
 */
export const ModalOverlay: FC<any> = () => null;

/**
 * ModalContent - Generic modal content wrapper
 * Use this when you need custom styling for the modal content container
 */
export const ModalContent: FC<{ children: ReactNode } & any> = ({ children, ...props }) => {
	return <Dialog.Content {...props}>{children}</Dialog.Content>;
};
