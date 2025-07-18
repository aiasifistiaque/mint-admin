import { FC, Fragment } from 'react';

import { format } from 'date-fns';
import { GridItem, Heading, StackProps, TableRowProps, Flex } from '@chakra-ui/react';
import { TableRow, EditableTableData, TableData, TableMenu } from '../../../..';

import { useIsMobile } from '../../../../hooks';

import { formatDataKey, formatFieldTitle } from '../../../../functions';
import { Column } from '../../../../containers';

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
			{data?.map((val: any) => {
				const {
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
					displayValue,
					colorScheme,
					colorTheme,
					copy,
				} = val;
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
									editType == 'date' ? format(new Date(item[dataKey]), 'yyyy-MM-dd') : item[dataKey]
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
					<Container
						key={dataKey}
						type={type}
						copy={copy}
						isMobile={isMobile}
						value={value}>
						{isMobile && type !== 'image-text' && (
							<Heading size='xs'>{formatFieldTitle({ field: dataKey, schema: data })}</Heading>
						)}

						<TableData
							colorTheme={colorTheme}
							copy={copy}
							toLocaleStr={toLocaleStr}
							colorScheme={colorScheme}
							key={dataKey}
							type={type}
							item={val}
							tagType={tagType}
							imageKey={item[imageKey]}>
							{value}
						</TableData>
					</Container>
				);
			})}
		</TableRow>
	);
};

const Container = ({ children, isMobile, type, value, copy, ...props }: any) => {
	const styleProps = {
		...props,
	};
	if (isMobile && type !== 'image-text') {
		return (
			<Column
				gap={0}
				{...styleProps}>
				{children}
			</Column>
		);
	}
	if (isMobile) {
		return (
			<GridItem
				{...styleProps}
				colSpan={2}>
				{children}
			</GridItem>
		);
	}

	return (
		<Flex
			as={Fragment}
			{...styleProps}>
			{children}
		</Flex>
	);
};

export default TableRowComponent;
