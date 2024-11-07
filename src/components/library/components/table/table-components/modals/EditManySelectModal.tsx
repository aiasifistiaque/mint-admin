'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	useDisclosure,
	Text,
	Select,
} from '@chakra-ui/react';
import React, { useEffect, useRef, FC, useState } from 'react';
import { useCustomToast, MenuItem, AlertDialogHeader, AlertDialogContent } from '../../../../';
import { useUpdateManyMutation } from '../../../../store';

type EditManyModalType = {
	title?: string;
	items: any[];
	path: string;
	keys: string;
	options: {
		label: string;
		value: string | number | boolean;
	}[];
	keyType?: string;
	prompt?: {
		title?: string;
		body?: string;
	};
};

const EditManySelectModal: FC<EditManyModalType> = ({
	title,
	path,
	items,
	prompt,
	keys,
	options,
	keyType = 'string',
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);
	const [value, setValue] = useState<any>();

	const [trigger, result] = useUpdateManyMutation();
	const { isLoading, isSuccess, isError, error, reset } = result;

	const closeItem = () => {
		reset();
		setValue(undefined);
		onClose();
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger({
			path,
			body: {
				ids: items,
				type: keyType,
				updates: {
					[keys]: value,
				},
			},
		});
	};

	useEffect(() => {
		if (!isLoading && isSuccess) {
			closeItem();
		}
	}, [isLoading]);

	useCustomToast({
		successText: `Batch item updated successfully`,
		isSuccess,
		isError,
		isLoading,
		error,
	});

	return (
		<>
			<MenuItem onClick={onOpen}>{title}</MenuItem>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeItem}>
				<AlertDialogOverlay>
					<form onSubmit={handleSubmit}>
						<AlertDialogContent>
							<AlertDialogHeader>{prompt?.title || `Edit Item`}</AlertDialogHeader>

							<AlertDialogBody pt={4}>
								<Text>{prompt?.body || 'Please select an option'}</Text>
								<Select
									isRequired={true}
									borderRadius='md'
									size='sm'
									mt={4}
									value={value}
									onChange={e => setValue(e.target.value)}>
									<option
										selected
										disabled>
										Select option
									</option>
									{options?.map(({ label, value }: { label: string; value: any }, i: number) => (
										<option
											key={i}
											value={value}>
											{label}
										</option>
									))}
								</Select>
							</AlertDialogBody>

							<AlertDialogFooter>
								{!isLoading && (
									<Button
										ref={cancelRef}
										onClick={closeItem}
										size='sm'
										colorScheme='gray'>
										Discard
									</Button>
								)}
								<Button
									type='submit'
									isDisabled={!value}
									isLoading={isLoading}
									colorScheme='brand'
									ml={2}
									size='sm'>
									Edit
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</form>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default EditManySelectModal;
