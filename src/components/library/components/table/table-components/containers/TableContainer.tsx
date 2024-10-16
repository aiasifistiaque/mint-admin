import React, { ReactNode } from 'react';
import { TableContainer as ChakraTableContainer, Flex } from '@chakra-ui/react';
import { useIsMobile, theme } from '../../../..';

const { TABLE } = theme;

const style = {
	w: '100%',
	borderRadius: TABLE.border.radius,
	borderWidth: TABLE.border.width,
	bg: TABLE.bg.light,
	pb: TABLE.padding.bottom,
	borderColor: TABLE.border.color.light,
	_dark: {
		bg: TABLE.bg.dark,
		borderColor: TABLE.border.color.dark,
	},
};

const TableContainer = ({ children }: { children: ReactNode }) => {
	const isMobile = useIsMobile();

	const Container = isMobile ? Flex : ChakraTableContainer;

	return <Container sx={style}>{children}</Container>;
};

export default TableContainer;
