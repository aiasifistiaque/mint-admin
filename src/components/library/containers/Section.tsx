import { FlexProps, Heading } from '@chakra-ui/react';
import React, { FC } from 'react';
import { SpaceBetween, Column, shadow, sizes } from '..';

type SectionProps = FlexProps & {
	heading?: string;
	children?: React.ReactNode;
	rightComponent?: React.ReactNode;
};

const Section: FC<SectionProps> = ({ heading, children, rightComponent, ...props }) => {
	return (
		<Column
			bg={{ base: 'menu.light', md: 'transparent' }}
			_dark={{ base: 'menu.dark', md: 'transparent' }}
			borderRadius={sizes.CARD_RADIUS}
			boxShadow={{ base: shadow.CARD, md: 'none' }}
			p={4}
			gap={6}
			{...props}>
			<SpaceBetween>
				{heading && <Heading size='md'>{heading}</Heading>}
				{rightComponent}
			</SpaceBetween>

			{children}
		</Column>
	);
};

export default Section;
