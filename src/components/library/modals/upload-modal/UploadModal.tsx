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

import { MyFolders, styles, MyPhotos, UploadImage, InsertUrl } from '.';
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

const tabs = ['All Photos', 'Browse by folder', 'Upload', 'Web Address (URL)'];

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
					<ModalHeader
						pb={2}
						pt={4}>
						Insert Photo/File
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						minH='70vh'
						px={0}>
						<Tabs {...styles.tabsCss}>
							<TabList
								px={{ base: 4, md: 6 }}
								gap={2}>
								{tabs.map((label: string, i: number) => (
									<Tab
										px={2}
										key={i}>
										{label}
									</Tab>
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
									<MyFolders
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

					<ModalFooter
						borderTopWidth={1}
						borderTopColor='border.light'
						borderBottomRadius='20px'
						w='full'
						gap={2}
						py={2}
						_light={{ bg: 'background.light' }}
						_dark={{ bg: 'background.dark', borderTopColor: 'border.dark' }}
						justifyContent='flex-end'
						alignItems='center'>
						<Button
							variant='white'
							onClick={onClose}>
							Cancel
						</Button>
						<Button
							size='sm'
							isDisabled={!img}
							onClick={handleInsert}>
							Insert Media
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UploadModal;
