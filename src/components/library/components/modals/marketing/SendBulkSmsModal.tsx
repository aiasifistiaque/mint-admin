'use client';

import { Button, useDisclosure, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import {
	MenuModal,
	MenuModalHeader,
	MenuModalBody,
	MenuModalCloseButton,
	MenuModalFooter,
	DiscardButton,
	MenuItem,
	VTextarea,
	usePostMutation,
} from '../../../';

const SendBulkSmsModal = ({ path, ids }: { path: string; ids: string[] }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [text, setText] = useState<string>('');

	const [trigger, result] = usePostMutation();

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger({
			path: '/customers/sms',
			body: {
				ids: ids,
				message: text,
			},
		});
	};

	const close = () => {
		onClose();
	};

	useEffect(() => {
		if (!result?.isLoading && result?.isSuccess) {
			onClose();
		}
	}, [result]);

	return (
		<>
			<MenuItem onClick={onOpen}>Send Marketing SMS</MenuItem>

			<MenuModal
				isOpen={isOpen}
				onClose={close}>
				<MenuModalHeader>Write your custom Message</MenuModalHeader>
				<MenuModalCloseButton />
				<MenuModalBody>
					<VTextarea
						label='Message'
						placeholder='Enter your message'
						value={text}
						onChange={(e: any) => setText(e.target.value)}
					/>
					<Text>Character Count: {text?.length || 0}</Text>
				</MenuModalBody>
				<MenuModalFooter>
					<>
						<DiscardButton
							mr={2}
							onClick={close}>
							Discard
						</DiscardButton>
						<Button
							size='xs'
							onClick={handleSubmit}
							isLoading={result?.isLoading}>
							Send
						</Button>
					</>
				</MenuModalFooter>
			</MenuModal>
		</>
	);
};

export default SendBulkSmsModal;
