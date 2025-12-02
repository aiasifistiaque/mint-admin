import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import { padding, sizes } from '../config';

const PX = { base: padding.BASE, md: padding.MD, lg: padding.LG };

const MainBody = ({ children }: { children: ReactNode }) => (
	<Flex
		pt={{ base: 2, md: 1 }}
		flexDir='column'
		gap={4}
		overflowY='hidden'
		h={`calc(100vh - ${sizes.NAV_HEIGHT})`}
		px={PX}
		pb='32px'
		w='full'>
		{children}
	</Flex>
);

export default MainBody;
