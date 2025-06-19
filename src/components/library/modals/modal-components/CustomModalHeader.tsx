import { FC, ReactNode } from 'react';
import { ModalHeader, ModalHeaderProps } from '@chakra-ui/react';
import { radius } from '../../config';

type CustomModalHeaderProps = ModalHeaderProps & {
	children?: ReactNode;
};

const CustomModalHeader: FC<CustomModalHeaderProps> = ({ children, ...props }) => {
	return (
		<ModalHeader
			_dark={{ bg: 'menu.dark', borderColor: 'border.containerDark', borderBottomWidth: 1 }}
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
