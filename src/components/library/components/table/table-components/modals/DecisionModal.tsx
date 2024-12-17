'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

import {
	useCustomToast,
	AlertDialogHeader,
	MenuItem,
	AlertDialogContent,
	useUpdateByIdMutation,
} from '../../../../';

type DecisionModalProps = {
	itemId: string;
	path: string;
	item: {
		title?: string;
		id?: (doc: any) => string;
		path: string;
		invalidate?: string[];
		body?: object;
		prompt?: {
			title: string;
			body: string;
			btnText?: string;
			successMsg?: string;
		};
	};
	doc: any;
};

const DecisionModal: React.FC<DecisionModalProps> = ({ item, doc, path, itemId }) => {
	const { title, id, prompt, invalidate, body } = item;
	const getId = id ? id(doc) : itemId;

	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef<any>(undefined);

	const [trigger, result] = useUpdateByIdMutation();
	const { isSuccess, isLoading } = result;

	const closeItem = () => {
		result?.reset();
		onClose();
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger({ path: path, id: getId, body, invalidate });
	};

	useEffect(() => {
		if (isSuccess && !isLoading) {
			closeItem();
		}
	}, [result?.isSuccess]);

	useCustomToast({
		successText: prompt?.successMsg || `Updated Successfully`,
		...result,
	});

	return (
		<>
			<MenuItem onClick={onOpen}>{title || 'Alert'}</MenuItem>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeItem}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>{prompt?.title || 'Alert'}</AlertDialogHeader>

						<AlertDialogBody>
							{prompt?.body || 'Are you sure you want to take this action?'}
						</AlertDialogBody>

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
								colorScheme='brand'
								onClick={handleSubmit}
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

export default DecisionModal;
