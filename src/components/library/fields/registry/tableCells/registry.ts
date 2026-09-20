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
	InvitationStatusCell,
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

// Not in TABLE_CELLS/TableTypeId — a genuinely new, narrow field (invitation
// status) rather than an extension of the shared type vocabulary, so it's
// special-cased here instead of widening TableDataFieldType for one column.
export const getTableCell = (type: TableTypeId | string | undefined) => {
	if (type === 'invitation-status') return InvitationStatusCell;
	return (type && TABLE_CELLS[type as TableTypeId]) || TextCell;
};
