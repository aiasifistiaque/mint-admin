'use client';

import { Button, useDisclosure, Portal } from '@chakra-ui/react';
import { useEffect, FC, useRef } from 'react';

import {
	Dialog,
	useCustomToast,
	MenuItem,
	useUpdateByIdMutation,
	DialogHeader,
	DialogContent,
	DialogFooter,
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

			<Dialog
				placenemt='center'
				isOpen={isOpen}
				onOpenChange={(e: any) => !e.open && closeItem()}>
				<DialogHeader>{prompt?.title || 'Alert'}</DialogHeader>

				<DialogContent>
					{prompt?.body || 'Are you sure you want to take this action?'}
				</DialogContent>

				<DialogFooter>
					{/* <Dialog.CloseTrigger asChild> */}
					<Button
						variant='outline'
						disabled={isLoading}
						ref={cancelRef}
						onClick={closeItem}
						size='sm'
						px={2}>
						Discard
					</Button>
					{/* </Dialog.CloseTrigger> */}

					<Button
						px={2}
						spinnerPlacement='start'
						loadingText='Processing'
						loading={isLoading}
						onClick={handleSubmit}
						ml={2}
						size='sm'>
						{prompt?.btnText || 'Proceed'}
					</Button>
				</DialogFooter>
			</Dialog>
		</>
	);
};

export default DecisionModal;
