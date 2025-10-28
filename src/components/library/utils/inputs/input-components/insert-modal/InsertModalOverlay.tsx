import { Dialog } from '@chakra-ui/react';

// Note: In v3, Dialog.Backdrop is already part of Dialog.Root structure
// This component is deprecated but kept for backward compatibility
const InsertModalOverlay = () => {
	console.warn(
		'InsertModalOverlay is deprecated in Chakra v3. Dialog.Backdrop is automatically included in Dialog.Root.'
	);
	return <Dialog.Backdrop />;
};

export default InsertModalOverlay;
