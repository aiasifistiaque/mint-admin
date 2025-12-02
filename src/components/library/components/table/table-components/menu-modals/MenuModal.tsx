import { Dialog as ChakraDialog, Portal, Drawer } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { styles, useIsMobile } from '../../../..';

type MenuModalProps = {
	children: ReactNode;
	open?: boolean;
	onOpenChange?: (details: { open: boolean }) => void;
	// Legacy v2 props for compatibility
	isOpen?: boolean;
	onClose?: () => void;
	[key: string]: any;
};

const MenuModal: FC<MenuModalProps> = ({
	children,
	open,
	isOpen,
	onClose,
	onOpenChange,
	...props
}) => {
	const isMobile = useIsMobile();
	const drawerStyleProps: any = styles.DRAWER;

	// Handle both v2 and v3 prop patterns
	const isDialogOpen = open ?? isOpen ?? false;
	const handleOpenChange = (details: { open: boolean }) => {
		if (onOpenChange) {
			onOpenChange(details);
		} else if (onClose && !details.open) {
			onClose();
		}
	};

	if (isMobile) {
		// Still use Drawer for mobile - Chakra v3 Drawer
		return (
			<Drawer.Root
				preventScroll
				placement='bottom'
				size='full'
				open={isDialogOpen}
				onOpenChange={handleOpenChange}
				{...props}>
				<Portal>
					<Drawer.Backdrop />
					<Drawer.Positioner>
						<Drawer.Content {...drawerStyleProps}>{children}</Drawer.Content>
					</Drawer.Positioner>
				</Portal>
			</Drawer.Root>
		);
	}

	return (
		<ChakraDialog.Root
			preventScroll={true}
			open={isDialogOpen}
			onOpenChange={handleOpenChange}
			{...props}>
			<Portal>
				<ChakraDialog.Backdrop
					_light={{ bg: styles?.color?.MODAL_OVERLAY?.LIGHT }}
					_dark={{ bg: styles?.color?.MODAL_OVERLAY?.DARK }}
				/>
				<ChakraDialog.Positioner>
					<ChakraDialog.Content {...styles?.MODAL}>{children}</ChakraDialog.Content>
				</ChakraDialog.Positioner>
			</Portal>
		</ChakraDialog.Root>
	);
};

export default MenuModal;
