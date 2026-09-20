import { ReactNode } from 'react';
import { Table } from '@chakra-ui/react';
import { useIsMobile, theme, shadow, Column } from '../../../..';

const { TABLE } = theme;

const style = {
	w: '100%',
	borderRadius: TABLE.border.radius,
	pb: TABLE.padding.bottom,
	// Clip to the radius so the header band and the last row follow the corners
	// instead of squaring them off.
	overflow: 'hidden',

	borderColor: TABLE.border.color.light,
	_dark: {
		bg: TABLE.bg.dark,
		borderColor: TABLE.border.color.dark,
	},
};

const TableContainer = ({ children }: { children: ReactNode }) => {
	const isMobile = useIsMobile();

	const Container = isMobile ? Column : Table.ScrollArea;

	return (
		<Container
			css={style}
			bg={{ base: 'transparent', md: TABLE.bg.light }}
			borderWidth={{ base: 0, md: TABLE.border.width }}
			shadow={{ base: 'none', md: shadow.DASH }}>
			{children}
		</Container>
	);
};

export default TableContainer;
