import React, { FC, ReactNode } from 'react';
import { ModalFooter, ModalFooterProps } from '@chakra-ui/react';

type CustomModalHeaderProps = ModalFooterProps & {
	children?: ReactNode;
};

const CustomModalFooter: FC<CustomModalHeaderProps> = ({ children, ...props }) => {
	return (
		<ModalFooter
			borderTopWidth={1}
			borderColor='container.borderLight'
			_dark={{ borderColor: 'border.dark' }}
			borderBottomRadius='2xl'
			py={3}
			{...props}>
			{children}
		</ModalFooter>
	);
};

export default CustomModalFooter;
