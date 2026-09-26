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
	/** Lets the "All Photos"/"Browse by folder" grids pick several images
	 *  before inserting, instead of inserting on the first click. On insert,
	 *  `handleImage` is called once with the whole array and a second
	 *  argument of `'add-many'` — see `VImageArray`'s "add" tile, the only
	 *  current caller. Unrelated to `multiple`, which only changes what
	 *  trigger button is rendered for the `delete` type. */
	multiSelect?: boolean;
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
	multiSelect = false,
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
	const emptySelection = multiSelect ? [] : null;
	const [img, setImg] = useState<any>(emptySelection);
	const { currentPath } = useAppSelector(state => state.table);

	// A selection left over from a previous open must never carry into the
	// next one — reset it both when the modal opens and after it closes.
	const resetSelection = () => setImg(emptySelection);

	const handleClose = () => {
		onClose();
		resetSelection();
	};

	const handleOpen = () => {
		resetSelection();
		onOpen();
	};

	const handleImageSelect = (e: any) => setImg(e);

	const selectionCount = multiSelect ? (Array.isArray(img) ? img.length : 0) : img ? 1 : 0;

	const handleInsert = () => {
		if (multiSelect) {
			if (Array.isArray(img) && img.length) handleImage(img, 'add-many');
		} else {
			handleImage(img);
		}
		handleClose();
	};

	const handleUploadComplete = (e: any) => {
		// Direct upload (the "Upload" tab) always inserts immediately, even in
		// multi-select mode — picking several existing images is what the grid
		// tabs are for; a freshly uploaded file is wanted right away.
		setImg(e);
		handleImage(e);
		handleClose();
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
					onClick={handleOpen}
					{...flexCss}>
					{children || triggerButton}
				</Flex>
			)}
			<GenericModal
				isOpen={isOpen}
				onClose={handleClose}
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
									multiple={multiSelect}
								/>
							</Tabs.Content>
							<Tabs.Content
								value='1'
								px={{ base: 4, md: 6 }}
								mt={6}>
								<MyFolders
									handleSelect={handleImageSelect}
									type={fileType || 'image'}
									multiple={multiSelect}
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

					<MFooter>
						<Button
							px={3}
							size='sm'
							variant='outline'
							onClick={handleClose}>
							Cancel
						</Button>
						<Button
							px={3}
							size='sm'
							disabled={!selectionCount}
							onClick={handleInsert}>
							{multiSelect && selectionCount > 1 ? `Insert ${selectionCount} Images` : 'Insert Media'}
						</Button>
					</MFooter>
				</GenericModalContent>
			</GenericModal>
		</>
	);
};

export default UploadModal;
