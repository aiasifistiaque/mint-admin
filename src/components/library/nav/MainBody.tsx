import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import { padding, sizes } from '../config';

const PX = { base: padding.BASE, md: padding.MD, lg: padding.LG };

const MainBody = ({ children }: { children: ReactNode }) => (
	<Flex
		pt={{ base: 2, md: 1 }}
		flexDir='column'
		gap={4}
		// `clip`, not `hidden`: hidden makes this a scroll container (and turns
		// overflow-x into `auto`), which pins every `position: sticky` inside —
		// a guide's "On this page" list, a toolbar — to a box that never
		// scrolls, so nothing stuck. Clip cuts off the same overflow without it.
		overflow='clip'
		h={`calc(100vh - ${sizes.NAV_HEIGHT})`}
		px={PX}
		pb='32px'
		w='full'>
		{children}
	</Flex>
);

export default MainBody;
