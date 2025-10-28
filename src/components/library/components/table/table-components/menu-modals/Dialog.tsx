'use client';
import { Drawer, Dialog as ChakraDialog, Portal } from '@chakra-ui/react';
import { radius, styles, useIsMobile } from '../../../..';
import { FC, ReactNode } from 'react';

type DialogProps = {
	children: ReactNode;
	open?: boolean;
	onOpenChange?: (details: { open: boolean }) => void;
	// Legacy v2 props for compatibility
	isOpen?: boolean;
	onClose?: () => void;
	size?: 'xl' | 'sm' | 'md' | 'lg' | 'xs' | 'full' | 'cover';
	[key: string]: any;
};

const Dialog: FC<DialogProps> = ({
	children,
	open,
	isOpen,
	onClose,
	onOpenChange,
	size = 'lg',
	...props
}) => {
	const isMobile = useIsMobile();

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
		return (
			<Drawer.Root
				placement='bottom'
				size='full'
				open={isDialogOpen}
				onOpenChange={handleOpenChange}
				closeOnInteractOutside={false}
				{...props}>
				<Portal>
					<Drawer.Backdrop />
					<Drawer.Positioner>
						<Drawer.Content
							onClick={(e: any) => e.stopPropagation()}
							overflowY='scroll'
							bg='container.newLight'
							_dark={{ bg: 'menu.dark' }}
							shadow='2xl'
							w='100%'
							maxH='85vh'
							minH='20vh'
							userSelect='none'
							borderTopRadius='20px'>
							{children}
						</Drawer.Content>
					</Drawer.Positioner>
				</Portal>
			</Drawer.Root>
		);
	}

	return (
		<ChakraDialog.Root
			open={isDialogOpen}
			onOpenChange={handleOpenChange}
			size={size}
			closeOnInteractOutside={false}
			{...props}>
			<Portal>
				<ChakraDialog.Backdrop
					_light={{ bg: styles.color.MODAL_OVERLAY.LIGHT }}
					_dark={{ bg: styles.color.MODAL_OVERLAY.DARK }}
				/>
				<ChakraDialog.Positioner>
					<ChakraDialog.Content
						onClick={(e: any) => e.stopPropagation()}
						{...styles.MODAL}>
						{children}
					</ChakraDialog.Content>
				</ChakraDialog.Positioner>
			</Portal>
		</ChakraDialog.Root>
	);
};

export default Dialog;
