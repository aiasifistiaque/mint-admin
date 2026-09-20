'use client';
import { Drawer, Dialog as ChakraDialog, Portal, Box } from '@chakra-ui/react';
import { styles, useIsMobile, useModalLayout } from '../../../..';
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

/**
 * Most dialogs here wrap their header, body and footer in a single <form>, which
 * would otherwise sit between the content's flex column and the slots that rely
 * on it — leaving the body unable to scroll and its overflow clipped, so tall
 * forms were cut off with no way to reach the rest. Making the form the flex
 * column restores the usual header / scrolling body / pinned footer.
 */
const formLayoutCss = {
	'& > form': {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		minHeight: 0,
		overflow: 'hidden',
	},
};

/** The sheet's drag affordance — it reads as grabbable before you touch it. */
const Grabber = () => (
	<Box
		mx='auto'
		mt={3}
		mb={1}
		w='36px'
		h='4px'
		flexShrink={0}
		borderRadius='full'
		bg='border.emphasized'
	/>
);

const Dialog: FC<DialogProps> = ({
	children,
	open,
	isOpen,
	onClose,
	onOpenChange,
	size = 'xl',
	...props
}) => {
	const isMobile = useIsMobile();
	const layout = useModalLayout();

	// Handle both v2 and v3 prop patterns
	const isDialogOpen = open ?? isOpen ?? false;
	const handleOpenChange = (details: { open: boolean }) => {
		if (onOpenChange) {
			onOpenChange(details);
		} else if (onClose && !details.open) {
			onClose();
		}
	};

	if (!isMobile && layout === 'drawer') {
		return (
			<Drawer.Root
				preventScroll
				placement='end'
				size='xl'
				open={isDialogOpen}
				onOpenChange={handleOpenChange}
				closeOnInteractOutside={false}
				{...props}>
				<Portal>
					<Drawer.Backdrop />
					<Drawer.Positioner>
						<Drawer.Content
							onClick={(e: any) => e.stopPropagation()}
							css={formLayoutCss}
							{...styles.DRAWER_END}
							overflow='hidden'>
							{children}
						</Drawer.Content>
					</Drawer.Positioner>
				</Portal>
			</Drawer.Root>
		);
	}

	if (isMobile) {
		return (
			<Drawer.Root
				preventScroll={true}
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
							css={formLayoutCss}
							bg='container.newLight'
							_dark={{ bg: 'menu.dark' }}
							boxShadow={styles.DRAWER.boxShadow}
							w='100%'
							maxH='90vh'
							minH='20vh'
							userSelect='none'
							overflow='hidden'
							borderTopRadius='20px'>
							<Grabber />
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
			scrollBehavior='inside'
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
						{...styles.MODAL}
						css={formLayoutCss}>
						{children}
					</ChakraDialog.Content>
				</ChakraDialog.Positioner>
			</Portal>
		</ChakraDialog.Root>
	);
};

export default Dialog;
