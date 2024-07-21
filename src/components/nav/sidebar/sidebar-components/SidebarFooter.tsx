import React, { FC, ReactNode } from 'react';
import { Spacer, Flex } from '@chakra-ui/react';
import useIsMobile from '@/components/library/hooks/useIsMobile';

type SidebarFooterProps = {
	children: ReactNode;
};

const SidebarFooter: FC<SidebarFooterProps> = ({ children }) => {
	const isMobile = useIsMobile();
	return <Flex mb={isMobile ? 12 : 0}>{children}</Flex>;
};

export default SidebarFooter;
