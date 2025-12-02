import { Drawer } from '@chakra-ui/react';

const PopModalCloseButton = ({ isMobile }: { isMobile: boolean }) => {
	if (isMobile) {
		return <Drawer.CloseTrigger borderRadius='full' />;
	}

	return null;
};

export default PopModalCloseButton;
