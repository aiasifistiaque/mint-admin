import { Portal, TableCellProps, Tooltip, useClipboard } from '@chakra-ui/react';
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
		return (
			<Tooltip.Root
				openDelay={200}
				closeDelay={100}
				positioning={{ placement: 'top' }}>
				{/* `asChild` is meant to merge these props onto TableBody's own root
				    element, but TableBody resolves to a dynamic `Cell` component
				    (getTableCell) that doesn't forward a single ref reliably, so Ark
				    falls back to rendering its own wrapper div. That wrapper is a
				    flex row with no width constraint of its own, so on the mobile
				    card grid a long value (a URL) could overflow past its column
				    instead of wrapping — minW/maxW here keep it inside the cell
				    whichever way the merge resolves. */}
				<Tooltip.Trigger
					asChild
					display='flex'
					minW={0}
					maxW='full'>
					<TableBody
						item={item}
						{...commonProps}
						cursor='pointer'
						onClick={onCopy}
						{...props}>
						{children}
						<CopyIcon
							size={16}
							style={{ marginLeft: '8px' }}
						/>
					</TableBody>
				</Tooltip.Trigger>
				<Portal>
					<Tooltip.Positioner>
						<Tooltip.Content>{hasCopied ? 'Copied!' : 'Click to Copy'}</Tooltip.Content>
					</Tooltip.Positioner>
				</Portal>
			</Tooltip.Root>
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
