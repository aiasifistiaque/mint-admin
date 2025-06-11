'use client';
import {
	Button,
	Flex,
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
} from '@chakra-ui/react';
import { FC, useState, ReactNode } from 'react';

import InsertUrl from './InsertUrl';
import MyPhotos from './MyPhotos';
import UploadImage from './UploadImage';
import { styles } from '.';

type UploadModalProps = {
	album?: string;
	trigger?: ReactNode;
	handleImage: any;
	type?: 'add' | 'edit' | 'delete';
	multiple?: boolean;
	handleDelete?: any;
	isOpen: boolean;
	onClose: any;
	onOpen: any;
	prompt?: {
		title?: string;
		body?: string;
		btnText?: string;
	};
};

const tabs = ['Photos', 'Upload', 'Web Address (URL)'];

const ImageUploader: FC<UploadModalProps> = ({
	album,
	multiple,
	trigger,
	handleImage,
	handleDelete,
	type = 'add',
	isOpen,
	onClose,
	onOpen,
	prompt,
}) => {
	// const { isOpen, onOpen, onClose } = useDisclosure();

	const [img, setImg] = useState(null);
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

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='6xl'
				isCentered>
				<ModalOverlay />
				<ModalContent {...styles.modalContentCss}>
					<ModalHeader>{prompt?.title || 'Insert Photo/File'}</ModalHeader>
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
									<MyPhotos handleSelect={handleImageSelect} />
								</TabPanel>
								<TabPanel sx={styles.panel}>
									<UploadImage handleSelect={handleUploadComplete} />
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
								{prompt?.btnText || 'Insert'}
							</Button>
							<Button
								{...styles.cancelBtnCss}
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

export default ImageUploader;
