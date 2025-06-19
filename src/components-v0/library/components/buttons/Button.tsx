import { Box, Button as Btn, ButtonProps } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

const Button: FC<ButtonProps & { children: ReactNode }> = ({ children, ...props }) => {
	return (
		<Box>
			<Btn {...props}>{children}</Btn>
		</Box>
	);
};

export default Button;
