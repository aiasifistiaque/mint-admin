'use client';

import { useDisclosure, Flex, Heading, IconButton, Portal } from '@chakra-ui/react';
import { Drawer, CloseButton } from '@chakra-ui/react';
import Sidebar from './Sidebar';

import { useGetSelfQuery } from '../../';

import { Icon, styles } from '../..';

const SideDrawer = () => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
	const { data } = useGetSelfQuery({});

	return (
		<Drawer.Root
			open={isOpen}
			placement='start'
			onOpenChange={(e: any) => (e.open ? onOpen() : onClose())}>
			<Drawer.Trigger>
				<Flex
					onClick={onOpen}
					{...style.container}>
					<IconButton
						aria-label='menu'
						size='xs'
						variant='ghost'>
						<Icon
							name='menu'
							size={20}
						/>
					</IconButton>
					<Heading size='md'>{data?.store?.name}</Heading>
				</Flex>
			</Drawer.Trigger>
			<Portal>
				<Drawer.Backdrop />
				<Drawer.Positioner>
					<Drawer.Content>
						<Drawer.CloseTrigger asChild>
							<CloseButton size='sm' />
						</Drawer.CloseTrigger>
						<Sidebar w='320px' />
					</Drawer.Content>
				</Drawer.Positioner>
			</Portal>
		</Drawer.Root>
	);
};

const style = {
	container: {
		gap: 2,
		zIndex: 999,
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
