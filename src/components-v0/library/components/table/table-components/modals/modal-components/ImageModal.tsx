import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Flex,
	Image,
	Center,
} from '@chakra-ui/react';

const FullScreenImage = ({ src, children }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Flex
				onClick={onOpen}
				cursor='pointer'>
				{children}
			</Flex>

			<Modal
				isCentered
				scrollBehavior='inside'
				size='full'
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg='black'>
					<ModalHeader color='whitesmoke'></ModalHeader>
					<ModalCloseButton
						color='whitesmoke'
						// size='xl'
					/>
					<ModalBody
						px={0}
						flex={1}
						w='full'
						alignItems={'center'}
						justifyContent={'center'}>
						<Image
							my={4}
							w='full'
							h='auto'
							maxH='80vh'
							objectFit='contain'
							src={src}
							alt={src}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default FullScreenImage;
