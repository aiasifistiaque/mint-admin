import { Flex, FlexProps } from '@chakra-ui/react';
import React, { FC } from 'react';

type AlignCenterProps = FlexProps & {
	children: React.ReactNode;
};

const AlignCenter: FC<AlignCenterProps> = ({ children, ...props }) => {
	return (
		<Flex
			align='center'
			{...props}>
			{children}
		</Flex>
	);
};

export default AlignCenter;
