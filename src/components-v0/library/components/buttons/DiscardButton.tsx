import { ButtonProps, Button } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

type DiscardButtonProps = ButtonProps & {
	children: ReactNode;
};

const DiscardButton: FC<DiscardButtonProps> = ({ children, ...props }) => {
	return (
		<Button
			size='xs'
			colorScheme='gray'
			{...props}>
			{children}
		</Button>
	);
};

export default DiscardButton;
