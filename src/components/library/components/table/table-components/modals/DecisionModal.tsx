'use client';

import { Dialog, Button, useDisclosure } from '@chakra-ui/react';
import { useEffect, FC, useRef } from 'react';

import { useCustomToast, MenuItem, useUpdateByIdMutation } from '../../../..';

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

	const { open: isOpen, onOpen, onClose } = useDisclosure();
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
				closeOnSelect={false}
				onClick={onOpen}
				icon={icon}>
				{title || 'Alert'}
			</MenuItem>

			<Dialog.Root
				open={isOpen}
				onOpenChange={(e: any) => !e.open && closeItem()}
				role='alertdialog'>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>{prompt?.title || 'Alert'}</Dialog.Title>
						</Dialog.Header>

						<Dialog.Body>
							{prompt?.body || 'Are you sure you want to take this action?'}
						</Dialog.Body>

						<Dialog.Footer>
							<Dialog.CloseTrigger asChild>
								<Button
									colorPalette='white'
									disabled={isLoading}
									ref={cancelRef}
									onClick={closeItem}
									size='sm'>
									Discard
								</Button>
							</Dialog.CloseTrigger>

							<Button
								spinnerPlacement='start'
								loadingText='Processing'
								loading={isLoading}
								colorPalette='brand'
								onClick={handleSubmit}
								ml={2}
								size='sm'>
								{prompt?.btnText || 'Proceed'}
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		</>
	);
};

export default DecisionModal;
