import React, { FC, ReactNode } from 'react';
import { ModalHeader, ModalHeaderProps } from '@chakra-ui/react';

type CustomModalHeaderProps = ModalHeaderProps & {
	children?: ReactNode;
};

const CustomDrawerHeader: FC<CustomModalHeaderProps> = ({ children, ...props }) => {
	return (
		<ModalHeader
			bg='sidebar.light'
			borderColor='border.light'
			borderBottomWidth={1}
			_dark={{ bg: 'background.dark', borderColor: 'border.dark' }}
			borderTopRadius='2xl'
			fontWeight='bold'
			fontSize='.9rem'
			h='100px'
			{...props}>
			{children}
		</ModalHeader>
	);
};

export default CustomDrawerHeader;
