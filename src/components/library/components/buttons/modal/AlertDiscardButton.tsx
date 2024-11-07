import React, { FC, ReactNode } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

type Props = ButtonProps & {
	children?: ReactNode;
};

const AlertDiscardButton: FC<Props> = ({ children, ...props }) => {
	return (
		<Button
			size='sm'
			colorScheme='gray'
			{...props}>
			{children || 'Discard'}
		</Button>
	);
};

export default AlertDiscardButton;
