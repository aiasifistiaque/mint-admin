import {
	Drawer,
	DrawerOverlay,
	Popover,
	useColorModeValue,
	PopoverArrow,
	Button,
	DrawerFooter,
	Flex,
} from '@chakra-ui/react';

import React, { FC } from 'react';
import { Column, FilterButton } from '../../../..';
import { DrawerContentContainer, PopoverContentContainer } from '.';

type MenuModalProps = {
	children: React.ReactNode;
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
	const arrow = useColorModeValue('menu.light', 'menu.dark');

	if (isMobile) {
		return (
			<>
				{trigger}
				<Drawer
					isFullHeight={false}
					placement='bottom'
					onClose={onClose}
					isOpen={isOpen}>
					<DrawerOverlay />
					<DrawerContentContainer>
						{children}
						<DrawerFooter
							pt={2}
							px={4}>
							<Button
								w='full'
								size='md'
								onClick={handleClick}>
								Apply
							</Button>
						</DrawerFooter>
					</DrawerContentContainer>
				</Drawer>
			</>
		);
	}

	return (
		<Popover
			onOpen={onOpen}
			onClose={onClose}
			isOpen={isOpen}>
			<span> {trigger}</span>
			<PopoverContentContainer>
				<PopoverArrow bg={arrow} />
				<Column gap={1}>
					{children}
					<Flex
						px={3}
						pb={3}
						w='full'>
						<FilterButton
							w='full'
							onClick={handleClick}>
							Apply
						</FilterButton>
					</Flex>
				</Column>
			</PopoverContentContainer>
		</Popover>
	);
};

export default PopModal;
