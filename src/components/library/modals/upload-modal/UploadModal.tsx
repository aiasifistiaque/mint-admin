'use client';
import {
	Button,
	Flex,
	FlexProps,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useDisclosure,
} from '@chakra-ui/react';
import { FC, useState, ReactNode } from 'react';

import InsertUrl from './InsertUrl';
import MyPhotos from './MyPhotos';
import UploadImage from './UploadImage';
import { styles } from '.';

import { AddImageButton, DeleteImageButton, EditImageButton, useAppSelector } from '../..';

type UploadModalProps = {
	album?: string;
	trigger?: React.ReactNode;
	handleImage: any;
	type?: 'add' | 'edit' | 'delete';
	multiple?: boolean;
	handleDelete?: any;
	title?: string;
	fileType?: any;
	folder?: string;
	children?: ReactNode;
};

const tabs = ['Photos', 'Upload', 'Web Address (URL)'];

const UploadModal: FC<UploadModalProps> = ({
	album,
	multiple,
	trigger,
	handleImage,
	folder,
	title = 'Insert Photo/File',
	handleDelete,
	children,
	fileType = 'image',
	type = 'add',
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [img, setImg] = useState(null);
	const { currentPath } = useAppSelector(state => state.table);

	const handleImageSelect = (e: any) => setImg(e);

	const handleInsert = () => {
		handleImage(img);
		onClose();
	};

	const handleUploadComplete = (e: any) => {
		setImg(e);
		handleImage(e);
		onClose();
	};

	const buttonTypes = {
		add: (
			<AddImageButton
				size='200px'
				title={title || 'Add Image'}
			/>
		),
		edit: <EditImageButton />,
		delete: <DeleteImageButton onClick={handleDelete} />,
	};

	const flexCss: FlexProps =
		type == 'add'
			? {
					w: 'full',
					h: 'full',
			  }
			: {};

	let triggerButton = (buttonTypes[type] as any) || trigger;

	return (
		<>
			{multiple && type == 'delete' ? (
				<DeleteImageButton onClick={handleDelete} />
			) : (
				<Flex
					onClick={onOpen}
					{...flexCss}>
					{children || triggerButton}
				</Flex>
			)}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='6xl'
				isCentered>
				<ModalOverlay />
				<ModalContent {...styles.modalContentCss}>
					<ModalHeader>Insert Photo/File</ModalHeader>
					<ModalCloseButton />
					<ModalBody minH='70vh'>
						<Tabs {...styles.tabsCss}>
							<TabList>
								{tabs.map((label: string, i: number) => (
									<Tab key={i}>{label}</Tab>
								))}
							</TabList>
							<TabPanels {...styles.tabPanelCss}>
								<TabPanel sx={styles.panel}>
									<MyPhotos
										handleSelect={handleImageSelect}
										type={fileType || 'image'}
									/>
								</TabPanel>
								<TabPanel sx={styles.panel}>
									<UploadImage
										fileType={fileType || 'image'}
										handleSelect={handleUploadComplete}
										folder={folder || currentPath}
									/>
								</TabPanel>
								<TabPanel sx={styles.panel}>
									<InsertUrl handleSelect={handleImageSelect} />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</ModalBody>

					<ModalFooter>
						<Flex
							gap={2}
							flex={1}>
							<Button
								size='sm'
								isDisabled={!img}
								onClick={handleInsert}>
								Insert
							</Button>
							<Button
								colorScheme='gray'
								size='sm'
								onClick={onClose}>
								Cancel
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UploadModal;
