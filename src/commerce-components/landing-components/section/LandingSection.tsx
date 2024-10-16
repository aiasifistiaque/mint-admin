import { FlexChild, padding } from '../..';
import React, { FC } from 'react';
import { Flex } from '@chakra-ui/react';

const LandingSection: FC<FlexChild> = ({ children, ...props }) => {
	return (
		<Flex
			p={padding.LAYOUT}
			{...props}>
			{children}
		</Flex>
	);
};

export default LandingSection;
