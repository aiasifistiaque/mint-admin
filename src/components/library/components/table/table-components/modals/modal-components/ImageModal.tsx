import { Dialog, useDisclosure, Flex, Image } from '@chakra-ui/react';

const FullScreenImage = ({ src, children }: any) => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Flex
				onClick={onOpen}
				cursor='pointer'>
				{children}
			</Flex>

			<Dialog.Root
				open={isOpen}
				onOpenChange={e => !e.open && onClose()}
				size='full'
				placement='center'
				scrollBehavior='inside'>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content bg='black'>
						<Dialog.Header color='whitesmoke'></Dialog.Header>
						<Dialog.CloseTrigger color='whitesmoke' />
						<Dialog.Body
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
						</Dialog.Body>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		</>
	);
};

export default FullScreenImage;
