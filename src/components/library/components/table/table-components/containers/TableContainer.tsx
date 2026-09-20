import { ReactNode } from 'react';
import { Table } from '@chakra-ui/react';
import { useIsCardView, theme, shadow, Column } from '../../../..';

const { TABLE } = theme;

const style = {
	w: '100%',
	borderRadius: TABLE.border.radius,
	pb: TABLE.padding.bottom,
	// Clip vertically to the radius so the header band and last row follow the
	// corners, but keep horizontal scroll (Table.ScrollArea's own `overflow:
	// auto`) working for tables wider than their container.
	overflowX: 'auto',
	overflowY: 'hidden',

	borderColor: TABLE.border.color.light,
	_dark: {
		bg: TABLE.bg.dark,
		borderColor: TABLE.border.color.dark,
	},
};

const TableContainer = ({ children }: { children: ReactNode }) => {
	const isCardView = useIsCardView();

	const Container = isCardView ? Column : Table.ScrollArea;

	// Cards carry their own border and shadow, so the frame that holds a table
	// together would just be a box drawn around boxes. Keyed off the view rather
	// than the `base`/`md` breakpoints, because card view is now something a
	// desktop can be in too.
	const frame = isCardView
		? { bg: 'transparent', borderWidth: 0, shadow: 'none' }
		: { bg: TABLE.bg.light, borderWidth: TABLE.border.width, shadow: shadow.DASH };

	return (
		<Container
			css={style}
			{...frame}>
			{children}
		</Container>
	);
};

export default TableContainer;
