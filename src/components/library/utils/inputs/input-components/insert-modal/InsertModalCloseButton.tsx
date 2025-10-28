import { Dialog } from '@chakra-ui/react';

// Note: In v3, Dialog.CloseTrigger is the new component
// This component is kept for backward compatibility
const InsertModalCloseButton = () => {
	return <Dialog.CloseTrigger />;
};

export default InsertModalCloseButton;
