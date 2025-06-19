import { FC, ReactNode } from 'react';
import { AlertDialogHeader as AlertHeader, ModalHeaderProps } from '@chakra-ui/react';

type CustomModalHeaderProps = ModalHeaderProps & {
	children?: ReactNode;
};

const AlertDialogHeader: FC<CustomModalHeaderProps> = ({ children, ...props }) => {
	return (
		<AlertHeader
			bg='sidebar.light'
			borderColor='border.light'
			borderBottomWidth={1}
			_dark={{ bg: 'background.dark', borderColor: 'border.dark' }}
			borderTopRadius='2xl'
			fontWeight='bold'
			fontSize='.9rem'
			maxH='54px'
			{...props}>
			{children}
		</AlertHeader>
	);
};

export default AlertDialogHeader;
