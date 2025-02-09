import { ModalContent, ModalContentProps } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { shadow, radius } from '../../config';

type ModalContentContainerProps = ModalContentProps & {
	children: ReactNode;
};

const ModalContentContainer: FC<ModalContentContainerProps> = ({ children, ...props }) => {
	return (
		<ModalContent
			boxShadow={shadow.DASH}
			borderRadius={radius.MODAL}
			bg='menu.light'
			_light={{
				borderWidth: 1,
				borderColor: 'container.borderLight',
			}}
			_dark={{
				bg: 'menu.dark',
			}}
			{...props}>
			{children}
		</ModalContent>
	);
};

export default ModalContentContainer;
