import React, { FC, ReactNode } from 'react';
import { Stack, StackProps } from '@chakra-ui/react';
import { padding, sizes, theme } from '../../..';

type SidebarBodyProps = StackProps & {
	children: ReactNode;
};

const SidebarBody: FC<SidebarBodyProps> = ({ children, ...props }) => {
	return (
		<Stack
			pr={sizes.SIDEBAR_PX}
			pb={{ base: 28, md: 8 }}
			pt={padding.BODY_TOP}
			h='100vh'
			overflowY='scroll'
			zIndex={9999}
			spacing={{ base: 0, md: 0.4 }}
			{...props}>
			{children}
		</Stack>
	);
};

export default SidebarBody;
