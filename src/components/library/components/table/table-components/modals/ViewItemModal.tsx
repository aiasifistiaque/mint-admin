'use client';

import { FC, useEffect, useState } from 'react';
import { useDisclosure, Flex } from '@chakra-ui/react';
import {
	ViewModalDataModelProps,
	Column,
	useIsMobile,
	useGetByIdQuery,
	MenuItem,
	getValue,
	useGetSchemaQuery,
	convertToViewFields,
	Dialog,
	ViewItem,
	DialogHeader,
	DialogBody,
	DialogCloseButton,
} from '../../../..';

type Props = {
	title?: string;
	id: string;
	path: string;
	dataModel?: ViewModalDataModelProps[];
	trigger?: any;
	item?: any;
	// Controlled mode: when `open` is passed, the dialog's open state is driven
	// by the caller instead of an internal useDisclosure, and no trigger is
	// rendered — used by TableMenu so the dialog lives outside the dropdown
	// menu's own mount lifecycle.
	open?: boolean;
	onClose?: () => void;
};

const ViewItemModal: FC<Props> = ({
	title,
	path,
	dataModel,
	trigger,
	id,
	item,
	open: controlledOpen,
	onClose: onControlledClose,
}) => {
	const isControlled = controlledOpen !== undefined;
	const { open: internalOpen, onOpen, onClose: internalOnClose } = useDisclosure();
	const isOpen = isControlled ? controlledOpen : internalOpen;
	const closeItem = () => (isControlled ? onControlledClose?.() : internalOnClose());

	const [schema, setSchema] = useState<any>([]);
	const { data: schemaData, isFetching: schemaLoading } = useGetSchemaQuery(path, {
		skip: !isOpen || !path,
	});

	useEffect(() => {
		if (dataModel) {
			setSchema(dataModel);
		} else if (schemaData) {
			if (item?.fields) {
				const viewFields = convertToViewFields({ schema: schemaData, fields: item?.fields });
				setSchema(viewFields);
			} else {
				const viewFields = convertToViewFields({ schema: schemaData });
				setSchema(viewFields);
			}
		}
	}, [schemaData, schemaLoading]);

	const { data, isFetching, isError } = useGetByIdQuery(
		{
			path: path,
			id: id,
		},
		{ skip: !id || !isOpen }
	);

	const renderTrigger = () => {
		if (isControlled) return null;
		if (trigger) {
			return <Flex onClick={onOpen}>{trigger}</Flex>;
		} else {
			return (
				<MenuItem
					asChild
					icon='view-outline'
					onClick={onOpen}>
					{title || 'Quick View'}
				</MenuItem>
			);
		}
	};

	return (
		<>
			{renderTrigger()}
			<Dialog
				// placement='center'
				isOpen={isOpen}
				onClose={closeItem}>
				<DialogHeader>{title || 'Item Details'}</DialogHeader>
				<DialogCloseButton />

				<DialogBody>
					<Column
						// bg='red'
						gap={4}
						pt={2}>
						{schema?.map((item: any, i: number) => {
							const { title, dataKey, type, colorPalette, path, copy, model } = item;

							return (
								<ViewItem
									copy={copy}
									isLoading={isFetching}
									title={title}
									type={type}
									colorPalette={colorPalette}
									path={model || path}
									key={i}>
									{data && getValue({ dataKey, type, data })}
								</ViewItem>
							);
						})}
					</Column>
				</DialogBody>
			</Dialog>
		</>
	);
};

export default ViewItemModal;
