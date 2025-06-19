import { ReactNode } from 'react';
import { ModalHeader, ModalHeaderProps } from '@chakra-ui/react';

const InsertModalHeader = ({ children, ...props }: ModalHeaderProps & { children: ReactNode }) => {
	return <ModalHeader {...props}>{children}</ModalHeader>;
};

export default InsertModalHeader;
