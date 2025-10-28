import { Drawer, Popover, Button, Flex } from '@chakra-ui/react';

import { FC, ReactNode } from 'react';
import { Column, FilterButton } from '../../../..';
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
								pt={2}
								px={4}>
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
							pt={3}
							pb={0}
							w='full'>
							<FilterButton
								w='full'
								onClick={handleClick}>
								Apply
							</FilterButton>
						</Flex>
					</Column>
				</PopoverContentContainer>
			</Popover.Positioner>
		</Popover.Root>
	);
};

export default PopModal;
