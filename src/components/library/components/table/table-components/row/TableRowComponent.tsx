import React, { FC, ReactNode } from 'react';

import { format } from 'date-fns';
import { GridItem, Heading, StackProps, TableRowProps } from '@chakra-ui/react';
import {
	useIsMobile,
	formatDataKey,
	TableRow,
	Column,
	EditableTableData,
	TableData,
	TableMenu,
} from '../../../..';

type TableProps = StackProps &
	TableRowProps & {
		item: any;
		data: any[];
		menu: any;
		path: string;
		fields?: string[] | [];
		selectable?: boolean;
		clickable?: boolean;
	};

const TableRowComponent: FC<TableProps> = ({
	item,
	data,
	menu,
	path,
	fields = [],
	clickable,
	selectable,
	...props
}) => {
	const isMobile = useIsMobile();

	return (
		// Create a TableRow for each item
		<TableRow
			cursor={clickable ? 'pointer' : 'default'}
			selectable={selectable}
			id={item?._id}
			key={item?._id}
			actions={<div></div>}
			{...props}>
			{/* If the table is selectable, return a TableData cell with a checkbox */}
			{/* Map over the data keys and create a TableData cell for each */}
			{data?.map(
				({
					dataKey,
					type,
					image,
					imageKey,
					toLocaleStr,
					editable,
					editType,
					options,
					style,
					tagType,
					colorScheme,
				}) => {
					// Split the dataKey into keys
					const keys = dataKey?.split('.');
					// Use the keys to get the value from the item
					const value =
						keys && keys?.length > 1
							? keys?.reduce((o: any, k: any) => (o && o[k] ? o[k] : undefined), item)
							: item[dataKey];

					// If the type is 'menu', return a TableMenu component
					if (type == 'menu')
						if (!menu) return null;
						else
							return (
								<TableMenu
									item={item}
									path={path}
									data={menu}
									id={item?._id}
									doc={item}
									key={dataKey}
									title={item[dataKey]}
								/>
							);

					// If the item name is not in the fields array and type is not 'menu', return null
					if (!fields?.includes(dataKey) && type !== 'menu') {
						return null;
					}

					const Container = ({ children }: { children: ReactNode }) =>
						isMobile && type !== 'image-text' ? (
							<Column gap={0}>{children}</Column>
						) : isMobile ? (
							<GridItem colSpan={2}>{children}</GridItem>
						) : (
							<>{children}</>
						);

					// If the item is editable, return an EditableTableData component
					if (editable && !clickable)
						return (
							<Container key={dataKey}>
								{isMobile && <Heading size='xs'>{formatDataKey(dataKey)}</Heading>}
								<EditableTableData
									type={type}
									dataKey={dataKey}
									path={path}
									value={
										editType == 'date'
											? format(new Date(item[dataKey]), 'yyyy-MM-dd')
											: item[dataKey]
									}
									id={item?._id}
									key={dataKey}
									editType={editType}
									options={options}
									style={style}
								/>
							</Container>
						);

					// Return a TableData cell with the value
					return (
						<Container key={dataKey}>
							{isMobile && type !== 'image-text' && (
								<Heading size='xs'>{formatDataKey(dataKey)}</Heading>
							)}

							<TableData
								toLocaleStr={toLocaleStr}
								colorScheme={colorScheme}
								key={dataKey}
								type={type}
								tagType={tagType}
								imageKey={item[imageKey]}>
								{value}
							</TableData>
						</Container>
					);
				}
			)}
		</TableRow>
	);
};

export default TableRowComponent;
