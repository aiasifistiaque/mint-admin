'use client';

import { Dialog, Button, Flex, Portal } from '@chakra-ui/react';
import { ReactNode, useEffect, FC, useState, useRef } from 'react';

import { AlertDialogHeader, AlertDialogContent } from '../../../..';

type DeleteItemModalProps = {
	prompt?: {
		title?: string;
		body?: string;
		btnText?: string;
		successMsg?: string;
	};
	children: ReactNode;
	handler: () => void;
	loading?: boolean;
	success?: boolean;
};

const Alert: FC<DeleteItemModalProps> = ({ prompt, loading, children, success, handler }) => {
	const [isOpen, setIsOpen] = useState(false);
	const cancelRef = useRef<any>(undefined);

	const [isLoading, setIsLoading] = useState<boolean>(loading || false);

	const closeItem = () => {
		setIsOpen(false);
	};

	const openItem = () => {
		setIsOpen(true);
	};

	const handleDelete = (e: any) => {
		setIsLoading(true);
		handler();
	};

	useEffect(() => {
		if (!loading && success) {
			closeItem();
			setIsLoading(false);
		}
	}, [isLoading, success]);

	return (
		<>
			<Flex onClick={openItem}>{children}</Flex>

			<Dialog.Root
				open={isOpen}
				onOpenChange={details => setIsOpen(details.open)}
				role='alertdialog'
				initialFocusEl={() => cancelRef.current}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<AlertDialogContent>
							<AlertDialogHeader>{prompt?.title}</AlertDialogHeader>

							<Dialog.Body>{prompt?.body}</Dialog.Body>

							<Dialog.Footer>
								<Button
									disabled={isLoading}
									ref={cancelRef}
									onClick={closeItem}
									size='sm'
									colorPalette='gray'>
									Discard
								</Button>

								<Button
									loading={isLoading}
									loadingText='Processing'
									colorPalette='red'
									onClick={handleDelete}
									ml={2}
									size='sm'>
									{prompt?.btnText || 'Proceed'}
								</Button>
							</Dialog.Footer>
						</AlertDialogContent>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	);
};

export default Alert;
