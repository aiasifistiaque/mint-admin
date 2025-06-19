import { ReactNode } from 'react';
import { TableContainer as ChakraTableContainer } from '@chakra-ui/react';
import { useIsMobile, theme, shadow, Column } from '../../../..';

const { TABLE } = theme;

const style = {
	w: '100%',
	borderRadius: TABLE.border.radius,
	pb: TABLE.padding.bottom,

	borderColor: TABLE.border.color.light,
	_dark: {
		bg: TABLE.bg.dark,
		borderColor: TABLE.border.color.dark,
	},
};

const TableContainer = ({ children }: { children: ReactNode }) => {
	const isMobile = useIsMobile();

	const Container = isMobile ? Column : ChakraTableContainer;

	return (
		<Container
			sx={style}
			bg={{ base: 'transparent', md: TABLE.bg.light }}
			borderWidth={{ base: 0, md: TABLE.border.width }}
			shadow={{ base: 'none', md: shadow.DASH }}>
			{children}
		</Container>
	);
};

export default TableContainer;
