import { Flex, FlexProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

type FlexPropsType = FlexProps & {
	children?: ReactNode;
};

const SpaceBetween: FC<FlexPropsType> = ({ children, ...props }) => {
	return (
		<Flex
			w='100%'
			alignItems='center'
			justifyContent='space-between'
			gap={2}
			{...props}>
			{children}
		</Flex>
	);
};

export default SpaceBetween;
