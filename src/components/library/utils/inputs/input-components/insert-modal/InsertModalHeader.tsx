import { ReactNode } from 'react';
import { Dialog } from '@chakra-ui/react';

const InsertModalHeader = ({ children, ...props }: { children: ReactNode; [key: string]: any }) => {
	return <Dialog.Header {...props}>{children}</Dialog.Header>;
};

export default InsertModalHeader;
