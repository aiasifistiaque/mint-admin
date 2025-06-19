import React, { FC } from 'react';
import { ModalBody, ModalBodyProps } from '@chakra-ui/react';

type InsertModalBodyProps = ModalBodyProps & {
	children: React.ReactNode;
};

const InsertModalBody: FC<InsertModalBodyProps> = ({ children, ...props }) => {
	return (
		<ModalBody
			minH='70vh'
			{...props}>
			{children}
		</ModalBody>
	);
};

export default InsertModalBody;
