import React, { FC, ReactNode } from 'react';
import { ModalHeader, ModalHeaderProps } from '@chakra-ui/react';
import { radius } from '../../config';

type CustomModalHeaderProps = ModalHeaderProps & {
	children?: ReactNode;
};

const CustomModalHeader: FC<CustomModalHeaderProps> = ({ children, ...props }) => {
	return (
		<ModalHeader
			_dark={{ bg: 'background.dark', borderColor: 'border.dark' }}
			borderTopRadius={radius.MODAL}
			fontWeight='600'
			fontSize='1rem'
			h='80px'
			{...props}>
			{children}
		</ModalHeader>
	);
};

export default CustomModalHeader;
