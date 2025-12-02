import { Dialog } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { radius } from '../../../..';

type InsertModalContentProps = {
	children: ReactNode;
	[key: string]: any;
};

// Note: In v3, Dialog.Content is already part of Dialog.Root structure
// This component is deprecated but kept for backward compatibility
const InsertModalContent: FC<InsertModalContentProps> = ({ children, ...props }) => {
	console.warn(
		'InsertModalContent is deprecated in Chakra v3. Use Dialog.Content directly within Dialog.Root.'
	);
	return (
		<Dialog.Content
			borderRadius={radius.MODAL}
			bg='menu.light'
			_dark={{ bg: 'menu.dark' }}
			{...props}>
			{children}
		</Dialog.Content>
	);
};

export default InsertModalContent;
