'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	Flex,
	useDisclosure,
} from '@chakra-ui/react';
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
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);

	const [isLoading, setIsLoading] = useState<boolean>(loading || false);

	const closeItem = () => {
		onClose();
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
			<Flex onClick={onOpen}>{children}</Flex>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeItem}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>{prompt?.title}</AlertDialogHeader>

						<AlertDialogBody>{prompt?.body}</AlertDialogBody>

						<AlertDialogFooter>
							<Button
								isDisabled={isLoading}
								ref={cancelRef}
								onClick={closeItem}
								size='sm'
								colorScheme='gray'>
								Discard
							</Button>

							<Button
								isLoading={isLoading}
								loadingText='Processing'
								spinnerPlacement='start'
								colorScheme='red'
								onClick={handleDelete}
								ml={2}
								size='sm'>
								{prompt?.btnText || 'Proceed'}
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default Alert;
