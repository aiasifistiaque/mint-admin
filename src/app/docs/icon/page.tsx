'use client';

import { Icon, iconOptionsArrayData as iconOptions } from '@/components/library';
import { Center, Flex, FlexProps, Text, TextProps } from '@chakra-ui/react';
import React from 'react';

const IconPage = () => {
	return (
		<Flex {...bodyCss}>
			{iconOptions.map((icon: any, i: number) => (
				<Center
					key={i}
					{...iconBox}>
					<Icon
						name={icon}
						size={24}
					/>
					<Text {...textCss}>{icon}</Text>
				</Center>
			))}
		</Flex>
	);
};

const bodyCss: FlexProps = {
	flex: 1,
	bg: '#fafafa',
	w: '100vw',
	minH: '100vh',
	py: '32px',
	px: { base: '16px', md: '64px' },
	flexWrap: 'wrap',
	gap: 4,
};

const iconBox: FlexProps = {
	w: '120px',
	h: '100px',
	bg: 'white',
	flexDir: 'column',
	gap: 4,
	boxShadow: 'md',
	borderRadius: 8,
};

const textCss: TextProps = {
	fontSize: '12px',
	textAlign: 'center',
	fontWeight: 'semibold',
};

export default IconPage;
