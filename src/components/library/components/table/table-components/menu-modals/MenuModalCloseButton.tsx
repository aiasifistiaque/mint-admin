import { useIsMobile, useModalLayout } from '../../../..';
import { Drawer, Dialog, CloseButton } from '@chakra-ui/react';

const buttonCss = {
	size: 'sm' as const,
	position: 'absolute' as const,
	top: '3',
	insetEnd: '3',
	borderRadius: 'full',
	color: 'fg.muted',
	_hover: { bg: 'bg.muted', color: 'fg' },
};

const MenuModalCloseButton = () => {
	const isMobile = useIsMobile();
	const layout = useModalLayout();

	if (isMobile || layout === 'drawer') {
		return (
			<Drawer.CloseTrigger asChild>
				<CloseButton {...buttonCss} />
			</Drawer.CloseTrigger>
		);
	}

	return (
		<Dialog.CloseTrigger asChild>
			<CloseButton {...buttonCss} />
		</Dialog.CloseTrigger>
	);
};

export default MenuModalCloseButton;
