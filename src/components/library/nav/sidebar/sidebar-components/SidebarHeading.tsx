import { TextProps, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

type SidebarHeadingProps = TextProps & {
	children: any;
	show: boolean | undefined;
	isLoading?: boolean;
};

const SidebarHeading: FC<SidebarHeadingProps> = ({ children, show = false, ...props }) => {
	if (!show) return null;
	return (
		<Text
			px={2}
			pt={4}
			fontSize={{ base: 'md', md: '2xs' }}
			fontWeight='700'
			// fontFamily='Bebas Neue'
			textTransform='uppercase'
			{...props}>
			{children}
		</Text>
	);
};

export default SidebarHeading;
