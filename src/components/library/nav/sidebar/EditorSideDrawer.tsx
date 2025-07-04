'use client';

import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	useDisclosure,
	Flex,
	Heading,
	IconButton,
} from '@chakra-ui/react';
import Sidebar from './Sidebar';

import { EditorSidebar, Icon, useGetSelfQuery } from '../..';

const EditorSideDrawer = ({ sidebarData, doc }: { sidebarData: any; doc: any }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { data } = useGetSelfQuery({});

	return (
		<>
			<Flex
				sx={styles.container}
				onClick={onOpen}>
				<IconButton
					aria-label='menu'
					icon={
						<Icon
							name='menu'
							size={20}
						/>
					}
					size='xs'
					variant='ghost'
				/>
				<Heading size='md'>{data?.store?.name}</Heading>
			</Flex>

			<Drawer
				isOpen={isOpen}
				placement='left'
				onClose={onClose}>
				<DrawerOverlay />

				<DrawerContent>
					{/* <DrawerBody> */}
					<EditorSidebar
						doc={doc}
						data={sidebarData}
						closeBtn={<DrawerCloseButton />}
					/>
					{/* </DrawerBody> */}
				</DrawerContent>
			</Drawer>
		</>
	);
};

const styles = {
	container: {
		gap: 2,
		zIndex: 999,
		alignItems: 'center',
		h: '64px',
		px: 0,
		mr: 2,
	},
};

export default EditorSideDrawer;
