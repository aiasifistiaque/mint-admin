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
		radius: 6,
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
};

export default TABLE;
