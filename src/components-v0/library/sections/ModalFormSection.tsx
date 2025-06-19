'use client';
import { ContainerProps, Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import React, { FC } from 'react';
import Column from '../containers/Column';

type FormContainerProps = ContainerProps & {
	children: React.ReactNode;
	title?: string;
};

const W_BASE = '100%';
const W_MD = '100%';
const W_LG = '100%';

const PADDING = 2;

const ModalFormSection: FC<FormContainerProps> = ({ title, children, ...props }) => {
	const border = useColorModeValue('gray.200', 'gray.700');
	return (
		<Column
			_notLast={{
				borderBottom: '1px solid',
				borderColor: border,
			}}
			h='fit-content'
			mx='auto'
			py={PADDING}
			w={{ base: W_BASE, md: W_MD, lg: W_LG }}
			{...props}>
			{Boolean(title) && (
				<Heading
					size='md'
					mb={4}>
					{title}
				</Heading>
			)}
			<Column
				w='full'
				gap={4}>
				{children}
			</Column>
		</Column>
	);
};

export default ModalFormSection;
