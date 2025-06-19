import React, { FC } from 'react';
import { Modal, ModalProps } from '@chakra-ui/react';

type InsertModalProps = ModalProps & {
	children: React.ReactNode;
};

const InsertModal: FC<InsertModalProps> = ({ children, ...props }) => {
	return (
		<Modal
			size='6xl'
			isCentered
			{...props}>
			{children}
		</Modal>
	);
};

export default InsertModal;
