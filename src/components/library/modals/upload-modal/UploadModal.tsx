'use client';
import { Button, Flex, FlexProps, Tabs, useDisclosure } from '@chakra-ui/react';
import { FC, useState, ReactNode } from 'react';

import { MyFolders, styles, MyPhotos, UploadImage, InsertUrl, MFooter } from '.';
import { AddImageButton, DeleteImageButton, EditImageButton, useAppSelector } from '../..';
import {
	GenericModal,
	GenericModalHeader,
	GenericModalCloseButton,
	GenericModalBody,
	GenericModalContent,
} from '../..';

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
	const { open: isOpen, onOpen, onClose } = useDisclosure();
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
			<GenericModal
				isOpen={isOpen}
				onClose={onClose}
				size='xl'
				isCentered>
				<GenericModalContent {...styles.modalContentCss}>
					<GenericModalHeader
						px={{ base: 4, md: 6 }}
						pb={2}
						pt={4}>
						Insert Photo/File
					</GenericModalHeader>
					<GenericModalCloseButton />
					<GenericModalBody minH='70vh'>
						<Tabs.Root
							{...styles.tabsCss}
							defaultValue='0'>
							<Tabs.List
								px={{ base: 4, md: 4 }}
								gap={2}>
								{tabs?.map((label: string, i: number) => (
									<Tabs.Trigger
										color={{ _light: 'text.light', _dark: 'text.dark' }}
										px={2}
										key={i}
										value={String(i)}>
										{label}
									</Tabs.Trigger>
								))}
							</Tabs.List>
							<Tabs.Content
								value='0'
								px={{ base: 4, md: 6 }}>
								<MyPhotos
									handleSelect={handleImageSelect}
									type={fileType || 'image'}
								/>
							</Tabs.Content>
							<Tabs.Content
								value='1'
								px={{ base: 4, md: 6 }}
								mt={6}>
								<MyFolders
									handleSelect={handleImageSelect}
									type={fileType || 'image'}
								/>
							</Tabs.Content>
							<Tabs.Content
								value='2'
								h='full'
								mt={1}
								px={{ base: 4, md: 4 }}>
								<UploadImage
									fileType={fileType || 'image'}
									handleSelect={handleUploadComplete}
									folder={folder || currentPath}
								/>
							</Tabs.Content>
							<Tabs.Content
								h='full'
								value='3'
								px={{ base: 4, md: 8 }}>
								<InsertUrl handleSelect={handleImageSelect} />
							</Tabs.Content>
						</Tabs.Root>
					</GenericModalBody>

					<MFooter
						px={{ base: 4, md: 6 }}
						border='1px solid'
						borderBottomRadius='md'
						borderColor={{ _light: 'border.light', _dark: 'border.dark' }}>
						<Button
							px={3}
							size='sm'
							variant='outline'
							onClick={onClose}>
							Cancel
						</Button>
						<Button
							px={3}
							size='sm'
							disabled={!img}
							onClick={handleInsert}>
							Insert Media
						</Button>
					</MFooter>
				</GenericModalContent>
			</GenericModal>
		</>
	);
};

export default UploadModal;
