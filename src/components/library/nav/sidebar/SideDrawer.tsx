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
import Sidebar from './Sidebar.v0';

import { useGetSelfQuery } from '@/store/services/authApi';
import { zIndex } from '@/lib/constants';

import { Icon, styles } from '../..';

const SideDrawer = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { data } = useGetSelfQuery({});

	return (
		<>
			<Flex
				{...style.container}
				onClick={onOpen}>
				<IconButton
					aria-label='menu'
					size='xs'
					variant='ghost'
					icon={
						<Icon
							name='menu'
							size={20}
						/>
					}
				/>
				<Heading size='md'>{data?.store?.name}</Heading>
			</Flex>

			<Drawer
				isOpen={isOpen}
				placement='left'
				onClose={onClose}>
				{/* <DrawerOverlay _light={{ bg: styles.color.MODAL_OVERLAY.LIGHT }} /> */}

				<DrawerContent>
					{/* <DrawerBody> */}
					<Sidebar
						w='320px'
						closeBtn={<DrawerCloseButton />}
					/>
					{/* </DrawerBody> */}
				</DrawerContent>
			</Drawer>
		</>
	);
};

const style = {
	container: {
		gap: 2,
		zIndex: zIndex.NAV,
		alignItems: 'center',
		h: '64px',
		px: 0,
		mr: 2,
	},
	menuIcon: {
		size: 'xs',
		variant: 'ghost',
		'aria-label': 'menu',
	},
};

export default SideDrawer;
