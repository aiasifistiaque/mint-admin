import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalHeader,
	ModalBody,
	useDisclosure,
	Flex,
	Input,
	Text,
	FlexProps,
	TextProps,
} from '@chakra-ui/react';
import { Icon, THEME, sidebarData } from '../';
import ModalContentContainer from '../modals/modal-components/ModalContentContainer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SearchMenu = () => {
	const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
	const [search, setSearch] = React.useState('');

	const initialRef = React.useRef(null);
	const finalRef = React.useRef(null);
	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const onClose = () => {
		closeModal();
		setSearch('');
		//setSelectedIndex(0);
	};

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Command + K (Mac) or Ctrl + K
			if ((e.metaKey || e.altKey) && e.key === 'k') {
				e.preventDefault();
				if (isOpen) {
					onClose();
				} else {
					onOpen();
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onOpen, onClose, isOpen]);

	const router = useRouter();

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === 'ArrowDown') {
				e.preventDefault();
				setSelectedIndex(prev => (prev < data.length - 1 ? prev + 1 : prev));
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
			} else if (e.key === 'Enter') {
				e.preventDefault();
				if (data[selectedIndex]) {
					router.push(data[selectedIndex].href);
					onClose();
				}
			} else if (e.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [selectedIndex, isOpen, onClose]);

	const restructureSidebar = (items: any): any[] => {
		let currentSection = '';

		return items.map((item: any, index: number) => {
			if (item.sectionTitle) {
				currentSection = item.sectionTitle;
			}

			return {
				...item,
				sectionTitle: currentSection,
				index,
			};
		});
	};

	const restructData = restructureSidebar(sidebarData);

	const data = restructData
		.filter(
			item =>
				!search ||
				search.length === 0 ||
				item.title.toLowerCase().includes(search.toLowerCase()) ||
				item.sectionTitle.toLowerCase().includes(search.toLowerCase())
		)
		.sort((a, b) => {
			if (a.title < b.title) return -1;
			if (a.title > b.title) return 1;
			return 0;
		});

	React.useEffect(() => {
		if (data.length < selectedIndex) {
			setSelectedIndex(0);
		}
	});

	return (
		<>
			<Flex
				onClick={onOpen}
				cursor='pointer'>
				<Icon
					name='search'
					size={24}
					color={THEME == 'basic' ? 'inherit' : 'white'}
				/>
			</Flex>

			<Modal
				initialFocusRef={initialRef}
				finalFocusRef={finalRef}
				scrollBehavior='inside'
				size='xl'
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />
				<ModalContentContainer
					borderRadius='lg'
					px={0}
					gap={0}>
					<ModalHeader px={4}>
						<Input
							variant='unstyled'
							size='lg'
							value={search}
							onChange={(e: any) => setSearch(e.target.value)}
							placeholder='Search the docs'
							_placeholder={{ fontSize: '15px', fontWeight: '600' }}
						/>
					</ModalHeader>
					<ModalBody {...modalBodyCss}>
						<Flex {...bodyCss}>
							{data?.map((item: any, i: number) => (
								<Link
									key={i}
									href={item?.href}>
									<Flex
										{...itemContainerCss}
										bg={selectedIndex === i ? 'whitesmoke' : 'transparent'}
										_dark={{
											bg: selectedIndex === i ? 'container.dark' : 'transparent',
										}}
										onMouseEnter={() => setSelectedIndex(i)}>
										<Text {...titleCss}>{item?.sectionTitle}</Text>
										<Text {...textCss}>{item?.title}</Text>
									</Flex>
								</Link>
							))}
						</Flex>
					</ModalBody>
				</ModalContentContainer>
			</Modal>
		</>
	);
};

const PX = 3;

const modalBodyCss: any = {
	px: PX,
	mt: 0,
	pt: 0,
};

const bodyCss: FlexProps = {
	py: 2,
	borderTopWidth: 1,
	borderTopColor: 'gray.200',
	_dark: {
		borderTopColor: 'black',
	},
	flexDir: 'column',
};

const itemContainerCss: FlexProps = {
	borderRadius: 2,
	cursor: 'pointer',
	p: 2,
	flexDir: 'column',
	gap: 0.2,
};

const titleCss: TextProps = {
	fontWeight: '400',
	fontSize: '12px',
};

const textCss: TextProps = {
	fontWeight: '600',
	fontSize: '16px',
};

export default SearchMenu;
