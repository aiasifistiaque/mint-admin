import React, { FC, ReactNode } from 'react';
import { Td as TableData } from '@chakra-ui/react';
import { useIsMobile } from '../../../..';

const Td: FC<{ children: ReactNode }> = ({ children }) => {
	const isMobile = useIsMobile();
	return <TableData>{children}</TableData>;
};

export default Td;
