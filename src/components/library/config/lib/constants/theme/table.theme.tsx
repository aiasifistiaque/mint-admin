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
		height: '56px',
		hover: {
			light: 'table.row.hoverLight',
			dark: 'table.row.hoverDark',
		},
	},
	cell: {
		paddingX: 4,
		paddingY: 3,
	},
	head: {
		fontSize: '11px',
		letterSpacing: '0.06em',
		height: '42px',
	},
};

export default TABLE;
