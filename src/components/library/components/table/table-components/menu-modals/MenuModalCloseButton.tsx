import { useIsMobile } from '../../../..';
import { Drawer, Dialog, CloseButton } from '@chakra-ui/react';

const MenuModalCloseButton = () => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return <Drawer.CloseTrigger />;
	}

	return (
		<Dialog.CloseTrigger
			asChild
			color='text.light'
			_dark={{ color: 'text.dark' }}>
			<CloseButton size='sm' />
		</Dialog.CloseTrigger>
	);
};

export default MenuModalCloseButton;
