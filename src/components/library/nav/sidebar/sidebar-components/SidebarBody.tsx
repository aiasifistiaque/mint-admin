import { FC, ReactNode } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';
import { padding, sizes } from '../../..';

type SidebarBodyProps = FlexProps & {
	children: ReactNode;
};

const SidebarBody: FC<SidebarBodyProps> = ({ children, ...props }) => {
	return (
		<Flex
			flexDir='column'
			pr={sizes.SIDEBAR_PX}
			pb={{ base: 28, md: 8 }}
			pt={padding.BODY_TOP}
			h='100vh'
			overflowY='scroll'
			zIndex={9999}
			gap={{ base: 0, md: 0.4 }}
			{...props}>
			{children}
		</Flex>
	);
};

export default SidebarBody;
