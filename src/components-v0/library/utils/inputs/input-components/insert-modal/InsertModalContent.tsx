import { ModalContentProps, ModalContent } from '@chakra-ui/react';
import React, { FC } from 'react';
import { radius } from '../../../..';

type InsertModalContentProps = ModalContentProps & {
	children: React.ReactNode;
};

const InsertModalContent: FC<InsertModalContentProps> = ({ children, ...props }) => {
	return (
		<ModalContent
			borderRadius={radius.MODAL}
			bg='menu.light'
			_dark={{
				bg: 'menu.dark',
			}}
			{...props}>
			{children}
		</ModalContent>
	);
};

export default InsertModalContent;
