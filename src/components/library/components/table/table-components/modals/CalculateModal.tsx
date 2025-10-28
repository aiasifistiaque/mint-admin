'use client';

import { Dialog, Button, useDisclosure, Checkbox, Grid, Flex } from '@chakra-ui/react';
import { useEffect, useRef, FC, useState } from 'react';
import { useCustomToast, MenuItem } from '../../../..';
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
	const { open: isOpen, onOpen, onClose } = useDisclosure();
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

	const handleCheckboxChange = (details: any, field: any) => {
		if (details.checked) {
			setSelected((prevSelected: any) => [...prevSelected, field]);
		} else {
			setSelected((prevSelected: any) => prevSelected.filter((item: any) => item !== field));
		}
	};

	const checkboxes = fields.map((field: any, i: number) => (
		<Checkbox.Root
			{...checkboxCss}
			key={i}
			checked={selected?.includes(field)}
			onCheckedChange={(e: any) => handleCheckboxChange(e, field)}>
			<Checkbox.HiddenInput />
			<Checkbox.Control>
				<Checkbox.Indicator />
			</Checkbox.Control>
			<Checkbox.Label>{field.label}</Checkbox.Label>
		</Checkbox.Root>
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

			<Dialog.Root
				open={isOpen}
				onOpenChange={(e: any) => !e.open && closeItem()}>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content
						boxShadow='lg'
						borderRadius='xl'
						bg='menu.light'
						_dark={{
							bg: 'menu.dark',
						}}>
						<Dialog.Header>
							<Dialog.Title>Get Total Values</Dialog.Title>
						</Dialog.Header>

						<Dialog.Body pt={4}>
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
						</Dialog.Body>

						<Dialog.Footer>
							<Dialog.CloseTrigger asChild>
								<Button
									ref={cancelRef}
									onClick={closeItem}
									size='sm'
									colorPalette='brand'>
									Close
								</Button>
							</Dialog.CloseTrigger>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
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
	colorPalette: 'brand',
};

export default CalculateModal;
