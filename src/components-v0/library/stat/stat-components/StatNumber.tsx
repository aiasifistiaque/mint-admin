import React, { ReactNode } from 'react';
import { StatNumber as CStatNumber, StatNumberProps } from '@chakra-ui/react';

const StatNumber = ({ children, ...props }: StatNumberProps & { children: ReactNode }) => {
	return (
		<CStatNumber
			fontSize='1.4rem'
			{...props}>
			{children}
		</CStatNumber>
	);
};

export default StatNumber;
