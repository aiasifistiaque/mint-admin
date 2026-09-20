type TableObjectProps = {
	padding: {
		bottom: number;
	};
	border: {
		color: {
			light: string;
			dark: string;
		};
		width: number;
		radius: number;
	};
	bg: {
		light: string;
		dark: string;
	};
	stroke: {
		light: string;
		dark: string;
	};
	row: {
		height: string;
		hover: {
			light: string;
			dark: string;
		};
	};
	cell: {
		paddingX: number;
		paddingY: number;
	};
	head: {
		fontSize: string;
		letterSpacing: string;
		height: string;
		paddingY: number;
	};
};

const TABLE: TableObjectProps = {
	padding: {
		bottom: 0,
	},

	border: {
		color: {
			light: 'table.outerBorder.light',
			dark: 'table.outerBorder.dark',
		},
		width: 1,
		radius: 10,
	},
	bg: {
		light: 'container.newLight',
		dark: 'table.dark',
	},
	stroke: {
		// light: 'container.borderLight',
		light: 'red',
		dark: 'transparent',
	},
	row: {
		// A minimum, not a fixed height — a cell that wraps still grows. It only
		// sets how tall a single-line row is, so it wants to be the tightest
		// height that still reads as a row rather than a list item.
		height: '44px',
		hover: {
			light: 'table.row.hoverLight',
			dark: 'table.row.hoverDark',
		},
	},
	cell: {
		paddingX: 3,
		paddingY: 2,
	},
	head: {
		fontSize: '11px',
		letterSpacing: '0.06em',
		height: '36px',
		// Applied to the `th` itself. Chakra's table recipe already pads the
		// column header, so Title used to stack its own `py` on top of that and
		// the label ended up with 16px of air on each side; this replaces the
		// recipe's padding instead of adding to it.
		paddingY: 2,
	},
};

export default TABLE;
