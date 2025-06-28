'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	useDisclosure,
} from '@chakra-ui/react';
import { useEffect, FC, useRef } from 'react';

import {
	useCustomToast,
	AlertDialogHeader,
	MenuItem,
	AlertDialogContent,
	useUpdateByIdMutation,
} from '../../../..';

type DecisionModalProps = {
	itemId: string;
	path: string;
	icon?: string;
	item: {
		title?: string;
		id?: (doc: any) => string;
		path: string;
		invalidate?: string[];
		body?: object;
		bodyFn?: any;

		prompt?: {
			title: string;
			body: string;
			btnText?: string;
			successMsg?: string;
		};
	};
	doc: any;
};

const DecisionModal: FC<DecisionModalProps> = ({ item, doc, path, icon, itemId }) => {
	const { title, id, prompt, invalidate, body, bodyFn } = item;
	const getId = id ? id(doc) : itemId;
	const getBody = bodyFn ? bodyFn(doc) : body;

	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);

	const [trigger, result] = useUpdateByIdMutation();
	const { isSuccess, isLoading } = result;

	const closeItem = () => {
		result?.reset();
		onClose();
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger({ path: path, id: getId, body: getBody, invalidate });
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
			<MenuItem
				onClick={onOpen}
				icon={icon}>
				{title || 'Alert'}
			</MenuItem>

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
								variant='white'>
								Discard
							</Button>

							<Button
								spinnerPlacement='start'
								loadingText='Processing'
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
