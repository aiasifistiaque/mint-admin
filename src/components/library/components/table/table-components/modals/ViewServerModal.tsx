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
} from '../../../..';

type Props = {
	title?: string;
	id: string;
	path: string;
	trigger?: any;
};

const ViewItemModal: FC<Props> = ({ title, path, trigger, id }) => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
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
		if (trigger) {
			return <Flex onClick={onOpen}>{trigger}</Flex>;
		} else {
			return (
				<MenuItem
					closeOnSelect={false}
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
				placement='center'
				isOpen={isOpen}
				onClose={() => onClose()}>
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
