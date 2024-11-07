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
import React from 'react';
import Sidebar from './Sidebar';

import { useGetSelfQuery } from '@/store/services/authApi';
import { zIndex } from '@/lib/constants';

import { Icon } from '../../';

const SideDrawer = () => {
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
					<Sidebar
						w='100%'
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
		zIndex: zIndex.NAV,
		alignItems: 'center',
		h: '64px',
		px: 0,
		mr: 2,
	},
};

export default SideDrawer;
