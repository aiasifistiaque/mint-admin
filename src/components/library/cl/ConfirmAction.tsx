'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import {
	GenericModal,
	GenericModalHeader,
	GenericModalBody,
	GenericModalFooter,
	GenericModalContent,
	radius,
} from '../index';

type ConfirmActionProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	/** What will actually happen. Plain language, no hedging. */
	consequence: ReactNode;
	confirmLabel?: string;
	destructive?: boolean;
	isLoading?: boolean;
	/**
	 * When set, the action stays disabled until the user types this exact
	 * string — the app's own name, normally.
	 */
	typeToConfirm?: string;
	children?: ReactNode;
};

/**
 * One confirm dialog for every action that changes something on Heroku.
 *
 * The `consequence` line is required rather than optional on purpose. "Are you
 * sure?" tells nobody anything; "this restarts all dynos and the app will be
 * briefly unavailable" is the thing that actually prevents the mistake.
 *
 * No backdrop blur — the scrim dims and that is enough. Blur is expensive to
 * composite and buys nothing a stronger dim doesn't.
 */
const ConfirmAction: FC<ConfirmActionProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	consequence,
	confirmLabel = 'Confirm',
	destructive,
	isLoading,
	typeToConfirm,
	children,
}) => {
	const [typed, setTyped] = useState('');

	// Reopening after a cancel must not inherit the previous attempt's text,
	// or the guard is already satisfied before the dialog is even read.
	useEffect(() => {
		if (isOpen) setTyped('');
	}, [isOpen]);

	const blocked = !!typeToConfirm && typed.trim() !== typeToConfirm;

	return (
		<GenericModal
			isOpen={isOpen}
			onClose={onClose}
			size='md'>
			<GenericModalContent borderRadius={radius.MODAL}>
				<GenericModalHeader>{title}</GenericModalHeader>

				<GenericModalBody>
					<Flex
						direction='column'
						gap={4}>
						<Text
							fontSize='sm'
							color='fg.muted'>
							{consequence}
						</Text>

						{children}

						{typeToConfirm && (
							<Flex
								direction='column'
								gap={2}>
								<Text fontSize='sm'>
									Type <strong>{typeToConfirm}</strong> to confirm.
								</Text>
								<Input
									size='sm'
									value={typed}
									autoComplete='off'
									placeholder={typeToConfirm}
									borderRadius={radius.INPUT}
									onChange={event => setTyped(event.target.value)}
								/>
							</Flex>
						)}
					</Flex>
				</GenericModalBody>

				<GenericModalFooter>
					<Flex
						gap={2}
						justify='flex-end'
						w='full'>
						<Button
							size='sm'
							variant='outline'
							onClick={onClose}
							disabled={isLoading}>
							Cancel
						</Button>
						<Button
							size='sm'
							colorPalette={destructive ? 'red' : undefined}
							loading={isLoading}
							disabled={blocked}
							onClick={onConfirm}>
							{confirmLabel}
						</Button>
					</Flex>
				</GenericModalFooter>
			</GenericModalContent>
		</GenericModal>
	);
};

export default ConfirmAction;
