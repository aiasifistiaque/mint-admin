import { FC, ReactNode } from 'react';
import { Drawer, Flex, Popover } from '@chakra-ui/react';

type PopModalBodyProps = {
	children: ReactNode;
	isMobile: boolean;
};

const PopModalBody: FC<PopModalBodyProps> = ({ children, isMobile }) => {
	if (isMobile) {
		return (
			<Drawer.Body
				gap={3}
				px={4}>
				<Flex
					flex={1}
					flexDir='column'
					gap={3}
					pb={1}>
					{children}
				</Flex>
			</Drawer.Body>
		);
	}

	return (
		<Popover.Body>
			<Flex
				flexDir='column'
				gap={3}>
				{children}
			</Flex>
		</Popover.Body>
	);
};

export default PopModalBody;
