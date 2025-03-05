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
} from '@chakra-ui/react';
import { Icon, THEME, sidebarData } from '../';
import ModalContentContainer from '../modals/modal-components/ModalContentContainer';
import Link from 'next/link';

const SearchMenu = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = React.useState('');

	const initialRef = React.useRef(null);
	const finalRef = React.useRef(null);

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Command + K (Mac) or Ctrl + K
			if ((e.metaKey || e.altKey) && e.key === 'k') {
				e.preventDefault();
				onOpen();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onOpen]);

	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const data = sidebarData
		.filter(
			item =>
				!search || search.length === 0 || item.title.toLowerCase().includes(search.toLowerCase())
		)
		.sort((a, b) => {
			if (a.title < b.title) return -1;
			if (a.title > b.title) return 1;
			return 0;
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
				size='2xl'
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />
				<ModalContentContainer
					borderRadius='xl'
					gap={0}>
					<ModalHeader>
						<Input
							variant='unstyled'
							size='xl'
							value={search}
							onChange={(e: any) => setSearch(e.target.value)}
							placeholder='Search the docs...'
						/>
					</ModalHeader>
					{/* <ModalCloseButton /> */}
					<ModalBody
						px={4}
						mt={0}
						pt={0}
						display={search?.length > 1 ? 'block' : 'block'}>
						<Flex
							py={2}
							gap={2}
							pt={4}
							borderTopWidth={1}
							borderTopColor='gray.200'
							_dark={{
								borderTopColor: 'black',
							}}
							flexDir='column'>
							{data?.map((item: any, i: number) => (
								<Link
									key={i}
									href={item?.href}>
									<Flex
										borderRadius='8px'
										bg='whitesmoke'
										_dark={{ bg: 'black' }}
										p={4}>
										<Text
											fontWeight='600'
											fontSize='16px'>
											{item?.title}
										</Text>
									</Flex>
								</Link>
							))}
						</Flex>
					</ModalBody>

					{/* <ModalFooter>
						<Button
							colorScheme='blue'
							mr={3}
							onClick={onClose}>
							Close
						</Button>
						<Button variant='ghost'>Secondary Action</Button>
					</ModalFooter> */}
				</ModalContentContainer>
			</Modal>
		</>
	);
};

export default SearchMenu;
