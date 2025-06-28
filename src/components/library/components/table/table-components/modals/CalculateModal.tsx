'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
	useDisclosure,
	Checkbox,
	Grid,
	Flex,
} from '@chakra-ui/react';
import { useEffect, useRef, FC, useState } from 'react';
import { useCustomToast, MenuItem, AlertDialogHeader } from '../../../..';
import {
	useGetConfigQuery,
	useGetSchemaQuery,
	useGetSumQuery,
	useUpdateManyMutation,
} from '../../../../store';
import { IoThermometerSharp } from 'react-icons/io5';

type EditManyModalType = {
	title?: string;
	items: any[];
	path: string;
	keys: string;
	value: any;
	keyType: string;

	prompt?: {
		title?: string;
		body?: string;
		successMsg?: string;
	};
};

const CalculateModal: FC<any> = ({
	title,
	path,
	items,
	prompt,
	keys,
	keyType = 'string',
	value,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);

	const [trigger, result] = useUpdateManyMutation();
	const { isLoading, isSuccess, isError, error, reset } = result;
	const [fields, setFields] = useState<any>([]);
	const { data, isFetching } = useGetSchemaQuery(path);
	const [selected, setSelected] = useState<any>([]);

	useEffect(() => {
		if (!isFetching && data) {
			const numericFieldsArray = Object.entries(data).filter(
				([key, field]: [string, any]) => field.type === 'number'
			);

			// Create label-value pairs array
			const numericFieldOptions =
				numericFieldsArray?.map(([key, field]: [string, any]) => ({
					label: field.label || key,
					value: key,
				})) || [];

			setFields(numericFieldOptions);
		}
	}, [isFetching]);

	const handleCheckboxChange = (e: any, field: any) => {
		if (e.target.checked) {
			setSelected((prevSelected: any) => [...prevSelected, field]);
		} else {
			setSelected((prevSelected: any) => prevSelected.filter((item: any) => item !== field));
		}
	};

	const checkboxes = fields.map((field: any, i: number) => (
		<Checkbox
			{...checkboxCss}
			key={i}
			isChecked={selected?.includes(field)}
			onChange={e => handleCheckboxChange(e, field)}>
			{field.label}
		</Checkbox>
	));

	const closeItem = () => {
		setSelected([]);
		reset();
		onClose();
	};

	useEffect(() => {
		if (!isLoading && isSuccess) {
			closeItem();
		}
	}, [isLoading]);

	useCustomToast({
		successText: prompt?.successMsg || `Batch item updated successfully`,
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
					<AlertDialogContent
						boxShadow='lg'
						borderRadius='xl'
						bg='menu.light'
						_dark={{
							bg: 'menu.dark',
						}}>
						<AlertDialogHeader>Get Total Values</AlertDialogHeader>

						<AlertDialogBody pt={4}>
							<Grid
								templateColumns='repeat(2, 1fr)'
								gap={4}>
								{checkboxes}
							</Grid>

							{selected.length > 0 && (
								<Flex
									flexDir='column'
									mt='10px'
									pt='10px'
									borderTop='1px solid #e2e8f0'>
									{selected.map((field: any, index: number) => (
										<div
											key={index}
											style={{ marginBottom: '10px', fontSize: '14px' }}>
											<strong>
												{field.label} value for {items?.length} items is:{' '}
											</strong>
											<ShowValue
												key={field.value}
												path={path}
												ids={items}
												field={field.value}
												filters={{}}
											/>
										</div>
									))}
								</Flex>
							)}
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button
								ref={cancelRef}
								onClick={closeItem}
								size='sm'
								colorScheme='brand'>
								Close
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

const ShowValue = ({ path, field, ids, filters }: any) => {
	const idsString = Array.isArray(ids) ? ids.join(',') : ids;
	const { data, isFetching, isError } = useGetSumQuery(
		{
			path,
			field,
			filters: { ids: idsString },
		},
		{ skip: !path }
	);

	return <span>{data?.total?.toLocaleString()}</span>;
};

const checkboxCss: any = {
	size: 'md',
	fontWeight: '500',
	colorScheme: 'brand',
};

export default CalculateModal;
