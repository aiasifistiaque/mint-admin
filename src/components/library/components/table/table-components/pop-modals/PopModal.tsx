import { Drawer, Popover, Button, Flex } from '@chakra-ui/react';

import { FC, ReactNode } from 'react';
import { Column } from '../../../..';
import { DrawerContentContainer, PopoverContentContainer } from '.';

type MenuModalProps = {
	children: ReactNode;
	trigger: any;
	onOpen: any;
	onClose: any;
	isOpen: any;
	isMobile: boolean;
	handleClick: any;
};

const PopModal: FC<MenuModalProps> = ({
	children,
	trigger,
	onClose,
	isOpen,
	onOpen,
	isMobile,
	handleClick,
}) => {
	if (isMobile) {
		return (
			<>
				{trigger}
				<Drawer.Root
					placement='bottom'
					onOpenChange={e => !e.open && onClose()}
					open={isOpen}>
					<Drawer.Backdrop />
					<Drawer.Positioner>
						<DrawerContentContainer>
							{children}
							<Drawer.Footer
								px={4}
								py={3}
								pb={5}
								borderTopWidth={1}
								borderColor='border.muted'
								bg='bg.subtle'>
								<Button
									w='full'
									size='md'
									onClick={handleClick}>
									Apply
								</Button>
							</Drawer.Footer>
						</DrawerContentContainer>
					</Drawer.Positioner>
				</Drawer.Root>
			</>
		);
	}

	return (
		<Popover.Root
			onOpenChange={e => {
				if (e.open) onOpen();
				else onClose();
			}}
			open={isOpen}>
			<Popover.Trigger asChild>
				<span>{trigger}</span>
			</Popover.Trigger>
			<Popover.Positioner>
				<PopoverContentContainer>
					<Popover.Arrow />
					<Column gap={0}>
						{children}
						<Flex
							px={4}
							pt={3}
							pb={4}
							w='full'>
							{/* Solid, not the muted outline chip used elsewhere in the
							    toolbar — this is the primary action of the popup. */}
							<Button
								w='full'
								size='sm'
								onClick={handleClick}>
								Apply
							</Button>
						</Flex>
					</Column>
				</PopoverContentContainer>
			</Popover.Positioner>
		</Popover.Root>
	);
};

export default PopModal;
