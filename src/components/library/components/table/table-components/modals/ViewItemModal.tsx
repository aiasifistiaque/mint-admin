'use client';

import { FC } from 'react';
import {
	useDisclosure,
	Modal,
	ModalBody,
	ModalOverlay,
	ModalCloseButton,
	Drawer,
	DrawerOverlay,
	DrawerCloseButton,
	DrawerBody,
	Flex,
} from '@chakra-ui/react';
import {
	ViewModalDataModelProps,
	Column,
	ModalContent,
	ModalHeader,
	useIsMobile,
	DrawerHeader,
	useGetByIdQuery,
	MenuItem,
	getValue,
	DrawerContentContainer,
} from '../../../..';
import { ViewItem } from '.';

type Props = {
	title?: string;
	id: string;
	path: string;
	dataModel: ViewModalDataModelProps[];
	trigger?: any;
};

const ViewItemModal: FC<Props> = ({ title, path, dataModel, trigger, id }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { data, isFetching, isError } = useGetByIdQuery(
		{
			path: path,
			id: id,
		},
		{ skip: !id || !isOpen }
	);

	const isMobile = useIsMobile();

	const Container = isMobile ? Drawer : Modal;
	const Overlay = isMobile ? DrawerOverlay : ModalOverlay;
	const Content = isMobile ? DrawerContentContainer : ModalContent;
	const Header = isMobile ? DrawerHeader : ModalHeader;
	const CloseButton = isMobile ? DrawerCloseButton : ModalCloseButton;
	const Body = isMobile ? DrawerBody : ModalBody;

	const renderTrigger = () => {
		if (trigger) {
			return <Flex onClick={onOpen}>{trigger}</Flex>;
		} else {
			return <MenuItem onClick={onOpen}>{title || 'View'}</MenuItem>;
		}
	};

	return (
		<>
			{renderTrigger()}
			<Container
				isCentered
				{...(isMobile && { placement: 'bottom' })}
				{...(isMobile && { isFullHeight: false })}
				isOpen={isOpen}
				size='2xl'
				onClose={onClose}>
				<Overlay />
				<Content>
					<Header>{title || 'Item Details'}</Header>
					<CloseButton />

					<Body px={0}>
						<Column
							gap={4}
							pt={2}>
							{dataModel.map((item: ViewModalDataModelProps, i: number) => {
								const { title, dataKey, type, colorScheme, path, copy } = item;

								return (
									<ViewItem
										copy={copy}
										isLoading={isFetching}
										title={title}
										type={type}
										colorScheme={colorScheme}
										path={path}
										key={i}>
										{data && getValue({ dataKey, type, data })}
									</ViewItem>
								);
							})}
						</Column>
					</Body>
				</Content>
			</Container>
		</>
	);
};

export default ViewItemModal;
