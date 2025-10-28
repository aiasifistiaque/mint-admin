'use client';

import { FC, useEffect, useState } from 'react';
import { useDisclosure, Dialog, Flex, Portal } from '@chakra-ui/react';
import {
	ViewModalDataModelProps,
	Column,
	useIsMobile,
	useGetByIdQuery,
	MenuItem,
	getValue,
	useGetSchemaQuery,
	convertToViewFields,
	ViewItem,
} from '../../../..';

type Props = {
	title?: string;
	id: string;
	path: string;
	dataModel?: ViewModalDataModelProps[];
	trigger?: any;
	item?: any;
};

const ViewItemModal: FC<Props> = ({ title, path, dataModel, trigger, id, item }) => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();

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

	const isMobile = useIsMobile();

	const renderTrigger = () => {
		if (trigger) {
			return <Flex onClick={onOpen}>{trigger}</Flex>;
		} else {
			return (
				<MenuItem
					closeOnSelect={false}
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
			<Dialog.Root
				open={isOpen}
				onOpenChange={e => !e.open && onClose()}
				size='xl'
				placement={isMobile ? 'bottom' : 'center'}
				motionPreset={isMobile ? 'slide-in-bottom' : 'scale'}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>{title || 'Item Details'}</Dialog.Header>
							<Dialog.CloseTrigger />

							<Dialog.Body px={0}>
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
												key={i}>
												{data && getValue({ dataKey, type, data })}
											</ViewItem>
										);
									})}
								</Column>
							</Dialog.Body>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	);
};

export default ViewItemModal;
