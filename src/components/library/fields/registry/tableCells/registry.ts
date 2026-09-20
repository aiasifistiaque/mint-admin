import type { ComponentType } from 'react';
import type { TableTypeId } from '../types';
import {
	CheckboxCell,
	TagCell,
	NumberCell,
	ImageTextCell,
	TimeCell,
	DateOnlyCell,
	DateCell,
	BooleanCell,
	ExternalLinkCell,
	FileCell,
	TextCell,
	PriceCell,
	DataArrayCell,
	DataArrayCountCell,
} from './cells';

// WO-13: TableData.tsx's `TableBody` switch, as data. 'menu' is deliberately
// absent — convertToTableFields.ts appends the menu column separately and
// TableRowComponent intercepts it upstream of TableData, same as before.
export const TABLE_CELLS: Partial<Record<TableTypeId, ComponentType<any>>> = {
	checkbox: CheckboxCell,
	tag: TagCell,
	number: NumberCell,
	'image-text': ImageTextCell,
	time: TimeCell,
	'date-only': DateOnlyCell,
	date: DateCell,
	boolean: BooleanCell,
	'external-link': ExternalLinkCell,
	file: FileCell,
	text: TextCell,
	price: PriceCell,
	'data-array': DataArrayCell,
	'data-array-count': DataArrayCountCell,
};

export const getTableCell = (type: TableTypeId | string | undefined) =>
	(type && TABLE_CELLS[type as TableTypeId]) || TextCell;
