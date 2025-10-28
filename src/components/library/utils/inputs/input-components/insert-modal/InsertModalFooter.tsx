import { ReactNode } from 'react';
import { Dialog } from '@chakra-ui/react';

const InsertModalFooter = ({ children, ...props }: { children: ReactNode; [key: string]: any }) => {
	return <Dialog.Footer {...props}>{children}</Dialog.Footer>;
};

export default InsertModalFooter;
