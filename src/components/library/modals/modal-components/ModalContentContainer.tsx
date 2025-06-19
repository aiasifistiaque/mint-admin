import { ModalContent, ModalContentProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { styles } from '../../config';

type ModalContentContainerProps = ModalContentProps & {
	children: ReactNode;
};

const ModalContentContainer: FC<ModalContentContainerProps> = ({ children, ...props }) => {
	return (
		<ModalContent
			{...styles.MODAL}
			{...props}>
			{children}
		</ModalContent>
	);
};

export default ModalContentContainer;
