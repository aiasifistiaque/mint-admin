import assertSchema from './assertSchema';

// WO-03 note: this should be `schema: SchemaType<T>`, but a second, incompatible
// schema-prop vocabulary (`SchemaProps`/`SchemaField` in
// `model/types/index.ts` — defect #15) is still passed in by ~20 call sites.
// Unifying the two vocabularies is Phase 1 registry work, not a Phase 0
// mechanical fix, so this stays loosely typed until then; assertSchema below
// still validates the actual shape at runtime in dev.
type TableDataFieldConverter<T = any> = {
	schema: any;
	menu?: boolean;
	fields?: string[];
	modelName?: string;
};

const createTableField = ({ key, field }: { key: string; field: any }): any => {
	return {
		title: field?.tableLabel || field?.label || field?.title,
		dataKey: field?.tableKey || key,
		default: field?.default || false,
		...(field?.sort && { sort: key }),
		...(field?.type && {
			type: field?.tableType || field.type,
		}),
		...(field?.imageKey && { imageKey: field.imageKey }),
		...(field?.colorPalette && { colorPalette: field.colorPalette }),
		...(field?.helperText && { helperText: field.helperText }),
		...(field?.editable && { editable: field.editable }),
		...(field?.copy && { copy: field.copy }),
		...(field?.tooltip && { tooltip: field.tooltip }),
		...(field?.colorTheme && { colorTheme: field.colorTheme }),
	};
};

const convertToTableFields = <T = any,>({
	schema,
	menu = true,
	fields,
	modelName = 'unknown',
}: TableDataFieldConverter<T>): any[] => {
	assertSchema(schema as any, modelName);

	const tableFields: any[] = [];

	const processField = (key: string) => {
		const field = (schema as any)[key];

		if (!field?.displayInTable) return;

		const tableField = createTableField({ key, field });
		tableFields.push(tableField);
	};

	if (fields && fields.length > 0) {
		fields.forEach(processField);
	} else {
		Object.keys(schema).forEach(processField);
	}

	if (menu) tableFields.push({ title: '...', type: 'menu' });

	return tableFields;
};

export default convertToTableFields;
