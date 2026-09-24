'use client';

import { FC, useEffect, useState } from 'react';
import { useDisclosure, Flex } from '@chakra-ui/react';
import {
	Column,
	useIsMobile,
	useGetByIdQuery,
	MenuItem,
	getValue,
	ViewItem,
	useGetConfigQuery,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogCloseButton,
	DocumentHistory,
} from '../../../..';

type Props = {
	title?: string;
	id: string;
	path: string;
	trigger?: any;
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
	trigger,
	id,
	open: controlledOpen,
	onClose: onControlledClose,
}) => {
	const isControlled = controlledOpen !== undefined;
	const { open: internalOpen, onOpen, onClose: internalOnClose } = useDisclosure();
	const isOpen = isControlled ? controlledOpen : internalOpen;
	const closeItem = () => (isControlled ? onControlledClose?.() : internalOnClose());

	const [schema, setSchema] = useState<any>([]);

	const { data: schemaData, isFetching: schemaLoading } = useGetConfigQuery(path, {
		skip: !isOpen || !path,
	});

	useEffect(() => {
		if (schemaData) {
			setSchema(schemaData?.view);
		}
	}, [schemaData, schemaLoading]);

	const { data, isFetching, isError } = useGetByIdQuery(
		{
			path: path,
			id: id,
		},
		{ skip: !id || !isOpen }
	);

	const isMobile = useIsMobile();

	const renderTrigger = () => {
		if (isControlled) return null;
		if (trigger) {
			return <Flex onClick={onOpen}>{trigger}</Flex>;
		} else {
			return (
				<MenuItem
					icon='view-outline'
					onClick={onOpen}>
					{title || 'View'}
				</MenuItem>
			);
		}
	};

	return (
		<>
			{renderTrigger()}
			<Dialog
				isOpen={isOpen}
				onClose={closeItem}>
				<DialogHeader>{title || 'Item Details'}</DialogHeader>
				<DialogCloseButton />

				<DialogBody>
					<Column
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
									field={item}
									doc={data}
									key={i}>
									{data && getValue({ dataKey, type, data })}
								</ViewItem>
							);
						})}

						{/* Who did what to this record, under its fields. */}
						<DocumentHistory
							id={id}
							path={path}
						/>
					</Column>
				</DialogBody>
			</Dialog>
		</>
	);
};

export default ViewItemModal;
