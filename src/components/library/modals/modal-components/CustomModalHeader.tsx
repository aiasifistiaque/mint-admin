import { FC, ReactNode } from 'react';
import { Dialog } from '@chakra-ui/react';
import { radius } from '../../config';

type CustomModalHeaderProps = {
	children?: ReactNode;
	[key: string]: any;
};

const CustomModalHeader: FC<CustomModalHeaderProps> = ({ children, ...props }) => {
	return (
		<Dialog.Header
			_dark={{ bg: 'menu.dark', borderColor: 'border.containerDark', borderBottomWidth: 1 }}
			borderTopRadius={radius.MODAL}
			fontWeight='600'
			fontSize='1rem'
			h='80px'
			{...props}>
			{children}
		</Dialog.Header>
	);
};

export default CustomModalHeader;
