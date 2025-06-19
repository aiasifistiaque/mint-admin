import { FC, ReactNode } from 'react';
import { DrawerBody, Flex, PopoverBody } from '@chakra-ui/react';

type MenuModalBodyProps = {
	children: ReactNode;
	isMobile: boolean;
};

const PopModalBody: FC<MenuModalBodyProps> = ({ children, isMobile }) => {
	if (isMobile) {
		return (
			<DrawerBody
				gap={3}
				px={4}>
				<Flex
					flex={1}
					flexDir='column'
					gap={3}
					pb={1}>
					{children}
				</Flex>
			</DrawerBody>
		);
	}

	return (
		<PopoverBody>
			<Flex
				flexDir='column'
				gap={3}
				pb={1}>
				{children}
			</Flex>
		</PopoverBody>
	);
};

export default PopModalBody;
