'use client';

import { useDisclosure, Flex, Heading, IconButton, Portal } from '@chakra-ui/react';
import { Drawer, CloseButton } from '@chakra-ui/react';
import Sidebar from './Sidebar';

import { useGetSelfQuery } from '../../';

import { Icon, styles } from '../..';
import MobileSidebar from './MobileSidebar';
import { SidebarLogo } from './sidebar-components';

const SideDrawer = () => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
	const { data } = useGetSelfQuery({});

	const title = data?.shop?.name || process.env.NEXT_PUBLIC_STORE_NAME || 'Admin';

	return (
		<Drawer.Root
			open={isOpen}
			placement='start'
			size='full'
			preventScroll={true}
			onOpenChange={(e: any) => (e.open ? onOpen() : onClose())}>
			<Drawer.Trigger>
				<Flex
					ml={-3}
					onClick={onOpen}
					{...style.container}
					gap={0}>
					<IconButton
						aria-label='menu'
						size='md'
						variant='ghost'>
						<Icon
							name='menu'
							size={28}
						/>
					</IconButton>
					<Heading size='md'>{data?.store?.name}</Heading>
				</Flex>
			</Drawer.Trigger>
			<Portal>
				<Drawer.Backdrop />
				<Drawer.Positioner>
					<Drawer.Content>
						<Drawer.Header>
							<Flex
								pl={4}
								w='full'
								{...styles?.SIDEBAR_NAV}>
								<Drawer.Title
									color='sidebar.headerText.light'
									_dark={{ color: 'sidebar.headerText.dark' }}
									fontSize='20px'
									fontFamily='Bebas Neue'>
									{title}
								</Drawer.Title>
								<Drawer.CloseTrigger asChild>
									<CloseButton size='sm' />
								</Drawer.CloseTrigger>
							</Flex>
						</Drawer.Header>
						<Drawer.Body>
							<MobileSidebar />
						</Drawer.Body>
					</Drawer.Content>
				</Drawer.Positioner>
			</Portal>
		</Drawer.Root>
	);
};

const style = {
	container: {
		gap: 0,
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
