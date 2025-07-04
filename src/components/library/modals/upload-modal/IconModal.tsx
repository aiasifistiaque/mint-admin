import {
	Button,
	Flex,
	FlexProps,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	Grid,
	Tooltip,
	Input,
	GridProps,
} from '@chakra-ui/react';
import { FC, useState, ReactNode } from 'react';
import { DynamicIcon } from 'lucide-react/dynamic';
import ICON_LIST from './iconNames';

import { styles, MFooter } from '.';
import { AddImageButton, DeleteImageButton, EditImageButton } from '../..';

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

const IconModal: FC<UploadModalProps> = ({
	multiple,
	trigger,
	handleImage,
	title = 'Insert Photo/File',
	handleDelete,
	children,
	type = 'add',
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [img, setImg] = useState<string | null>(null);
	const [list, setList] = useState<string[]>(ICON_LIST);

	const handleImageSelect = (iconName: string) => setImg(iconName);

	const onModalClose = () => {
		setImg(null);
		setList(ICON_LIST);
		onClose();
	};

	const handleInsert = () => {
		handleImage(img);
		onModalClose();
	};

	const onSearch = (e: any) => {
		const searchTerm = e.target.value.toLowerCase();
		// Convert search term to kebab-case format
		const kebabSearchTerm = searchTerm
			.replace(/\s+/g, '-') // Replace spaces with dashes
			.replace(/([A-Z])/g, '-$1') // Add dash before uppercase letters
			.replace(/([0-9])/g, '-$1') // Add dash before numbers
			.toLowerCase()
			.replace(/^-/, ''); // Remove leading dash

		const filteredIcons = ICON_LIST.filter(
			(icon: string) =>
				icon.toLowerCase().includes(kebabSearchTerm) || icon.toLowerCase().includes(searchTerm)
		);
		setList(filteredIcons);
	};

	const buttonTypes = {
		add: (
			<AddImageButton
				size='200px'
				title={title || 'Choose Icon'}
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
				onClose={onModalClose}
				size='6xl'
				isCentered>
				<ModalOverlay />
				<ModalContent {...styles.modalContentCss}>
					<ModalHeader
						pb={2}
						pt={4}>
						Select Icon
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						minH='70vh'
						px={0}>
						<Flex px={4}>
							<Input
								placeholder='Search Icons...'
								onChange={onSearch}
							/>
						</Flex>

						<Flex
							h='70vh'
							w='full'>
							<Grid {...gridCss}>
								{list.map((icon: string) => {
									return (
										<Tooltip
											key={icon}
											label={icon}
											placement='bottom'>
											<Flex
												{...iconCss}
												bg={img === icon ? 'blue.50' : 'background.cardLight'}
												borderColor={img === icon ? 'blue.300' : 'transparent'}
												onClick={() => handleImageSelect(icon)}>
												<span>
													<DynamicIcon
														name={icon as any}
														size={26}
													/>
												</span>
											</Flex>
										</Tooltip>
									);
								})}
							</Grid>
						</Flex>
					</ModalBody>

					<MFooter>
						<Button
							variant='white'
							onClick={onModalClose}>
							Cancel
						</Button>
						<Button
							size='sm'
							isDisabled={!img}
							onClick={handleInsert}>
							Insert Icon
						</Button>
					</MFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

const gridCss: GridProps = {
	gridTemplateColumns: { base: 'repeat(4, 1fr)', md: 'repeat(16, 1fr)' },
	gap: 3,
	p: 4,
	overflowY: 'scroll',
	maxH: '70vh',
	w: 'full',
};

const iconCss: FlexProps = {
	direction: 'column',
	align: 'center',
	justify: 'center',
	p: 2,
	border: '1px solid',
	borderColor: 'gray.200',
	borderRadius: '6px',
	cursor: 'pointer',
	bg: 'teal',
	_dark: {
		bg: 'background.dark',
	},
	_hover: { bg: 'gray.50' },

	w: '56x',
	h: '56px',
};

export default IconModal;
