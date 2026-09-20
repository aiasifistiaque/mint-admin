import { TableCellProps, useClipboard } from '@chakra-ui/react';
import { FC } from 'react';
import { TableObjectDataProps } from '../../../..';
import { Copy as CopyIcon } from 'lucide-react';
import { getTableCell } from '@/components/library/fields/registry/tableCells';

// Define the type for the props of the TableData component
type TableDataPropsType = TableCellProps &
	TableObjectDataProps & {
		children: any;
		key: string;
		colorPalette?: any;
		item?: any;
		copy?: boolean;
		colorTheme?: any;
	};

const TableData: FC<TableDataPropsType> = ({
	children,
	id,
	copy,
	type,
	colorPalette,
	toLocaleStr,
	tagType,
	imageKey,
	key,
	item,
	...props
}) => {
	const { copy: onCopy, copied: hasCopied } = useClipboard(children);
	const commonProps = {
		toLocaleStr,
		colorPalette,
		key,
		type,
		tagType,
		imageKey,
		...props,
	};
	if (copy) {
		if (!children) return <TableBody {...commonProps}>--</TableBody>;
		// A Tooltip.Trigger `asChild` around this used to be here, but
		// TableBody resolves to a dynamic `Cell` component (getTableCell) that
		// doesn't forward a single ref, so Ark fell back to rendering its own
		// wrapper <div>. A <div> isn't a valid child of <tr> next to the real
		// <td> cells, so the browser foster-parented it out of the table
		// entirely — breaking row height calculation and overlapping this
		// row's wrapped text over the next row. A native `title` attribute
		// gives the same "click to copy" hint without adding any element.
		return (
			<TableBody
				item={item}
				{...commonProps}
				cursor='pointer'
				onClick={onCopy}
				title={hasCopied ? 'Copied!' : 'Click to Copy'}
				{...props}>
				{children}
				<CopyIcon
					size={16}
					style={{ marginLeft: '8px' }}
				/>
			</TableBody>
		);
	}

	return (
		<TableBody
			item={item}
			{...commonProps}>
			{children}
		</TableBody>
	);
};

// WO-13: was a 15-case switch (TableBody delegates to a `type -> cell
// component` map now — see fields/registry/tableCells/). 'price', 'data-array'
// and 'data-array-count' used to have no case at all (silently fell to
// `default`, i.e. rendered raw); they're real cells now.
const TableBody: FC<TableDataPropsType> = ({ type, ...props }) => {
	const Cell = getTableCell(type);
	return (
		<Cell
			type={type}
			{...props}
		/>
	);
};

export default TableData;
