import { ReactNode } from 'react';
import { ModalFooter, ModalFooterProps } from '@chakra-ui/react';

const InsertModalFooter = ({ children, ...props }: ModalFooterProps & { children: ReactNode }) => {
	return <ModalFooter {...props}>{children}</ModalFooter>;
};

export default InsertModalFooter;
