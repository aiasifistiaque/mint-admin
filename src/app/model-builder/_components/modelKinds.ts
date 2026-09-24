/**
 * The field kinds the model builder offers — the same list the backend
 * compiles (library/functions/dynamicModels.function.ts, FIELD_KINDS). Each
 * becomes a Mongoose type plus the settings a hand-written model would have:
 * validation, the form input, the table cell and, for some, a filter chip.
 */

export type FieldKind =
	| 'text'
	| 'textarea'
	| 'editor'
	| 'email'
	| 'url'
	| 'number'
	| 'boolean'
	| 'date'
	| 'select'
	| 'multiselect'
	| 'tags'
	| 'color'
	| 'image'
	| 'images'
	| 'file'
	| 'files'
	| 'video'
	| 'reference'
	| 'references';

export const KINDS: { value: FieldKind; label: string; hint: string; group: string; hidden?: boolean }[] = [
	{ value: 'text', label: 'Text', hint: 'A short line: a name, a title, a phone number', group: 'Text' },
	{ value: 'textarea', label: 'Long text', hint: 'Several lines of plain text', group: 'Text' },
	{ value: 'editor', label: 'Rich text', hint: 'Formatted text with headings, lists and links', group: 'Text' },
	{ value: 'email', label: 'Email', hint: 'Checked to be an email address, stored in lower case', group: 'Text' },
	{ value: 'url', label: 'Link', hint: 'A web address, shown as a link', group: 'Text' },
	{ value: 'color', label: 'Color', hint: 'A colour, picked with a colour picker', group: 'Text' },
	{ value: 'number', label: 'Number', hint: 'Sortable; can have a minimum and maximum', group: 'Values' },
	{ value: 'boolean', label: 'Yes / No', hint: 'A checkbox, with a Yes/No filter', group: 'Values' },
	{ value: 'date', label: 'Date', hint: 'With a date filter', group: 'Values' },
	// One entry in the kind picker: "Options". Whether one or several can be
	// picked is a switch beside it — multiselect is the "several" form.
	{ value: 'select', label: 'Options', hint: 'One of a list of options you type in, with a filter', group: 'Choices' },
	{
		value: 'multiselect',
		label: 'Options (several)',
		hint: 'Any number of a list of options you type in, with a filter',
		group: 'Choices',
		hidden: true,
	},
	{ value: 'tags', label: 'Tags', hint: 'A list of short texts — free, or limited to a list', group: 'Choices' },
	{ value: 'image', label: 'Image', hint: 'One uploaded image', group: 'Media' },
	{ value: 'images', label: 'Images', hint: 'A gallery of uploaded images', group: 'Media' },
	{ value: 'file', label: 'File', hint: 'One uploaded file: a PDF, a document…', group: 'Media' },
	{ value: 'files', label: 'Files', hint: 'Several uploaded files', group: 'Media' },
	{ value: 'video', label: 'Video', hint: 'An uploaded video', group: 'Media' },
	{ value: 'reference', label: 'Link to a record', hint: 'One record of another model — or this one', group: 'Links' },
	{ value: 'references', label: 'Link to records', hint: 'Several records of another model', group: 'Links' },
];

export const KIND_GROUPS = ['Text', 'Values', 'Choices', 'Media', 'Links'];

export const kindLabel = (kind?: string) => KINDS.find(k => k.value === kind)?.label || kind || '—';

/** Kinds that can name a record when it's linked from elsewhere. */
export const TEXT_KINDS: FieldKind[] = ['text', 'email', 'url', 'select'];
export const REFERENCE_KINDS: FieldKind[] = ['reference', 'references'];
/** Kinds that can be limited to allowed values (an enum); select and multi-select must be. */
export const ENUM_KINDS: FieldKind[] = ['text', 'number', 'select', 'multiselect', 'tags'];
export const NEEDS_OPTIONS: FieldKind[] = ['select', 'multiselect'];
/** Kinds stored as a list — their default is a list too. */
export const ARRAY_KINDS: FieldKind[] = ['multiselect', 'tags', 'images', 'files', 'references'];
export const NO_DEFAULT_KINDS: FieldKind[] = ['reference', 'references'];
const CANT_BE_UNIQUE: FieldKind[] = ['boolean', 'editor', 'textarea', ...ARRAY_KINDS];
export const canBeUnique = (kind: FieldKind) => !CANT_BE_UNIQUE.includes(kind);
export const hasLength = (kind: FieldKind) => ['text', 'email', 'url', 'textarea', 'editor'].includes(kind);
export const hasOptions = (f: Pick<EditableField, 'kind' | 'options'>) =>
	ENUM_KINDS.includes(f.kind) && (f.options || []).some(o => o.value?.trim());

/** Same as the backend's: Mongoose's own names, and the paths every model gets. */
export const RESERVED_KEYS = [
	'_id', 'id', '__v', 'code', 'createdAt', 'updatedAt',
	'collection', 'db', 'emit', 'errors', 'get', 'init', 'isModified', 'isNew', 'listeners', 'modelName',
	'on', 'once', 'populated', 'prototype', 'remove', 'removeListener', 'save', 'schema', 'set',
	'toObject', 'toJSON', 'validate', 'isSelected', 'model', 'baseModel',
];
const SENSITIVE = /pass(word)?|token|secret|api_?key|apikey|private|otp|salt|hash/i;

/** Stands for "the model being edited" in a link picker; the server resolves it. */
export const SELF = '__self__';

export type EditableField = {
	uid: string;
	key: string;
	label?: string;
	kind: FieldKind;
	required?: boolean;
	unique?: boolean;
	index?: boolean;
	default?: any;
	options?: { value: string; label?: string }[];
	ref?: string;
	min?: number | null;
	max?: number | null;
	showInTable?: boolean;
	searchable?: boolean;
	helper?: string;
	/** Editor-only: the key follows the label until it's typed by hand. */
	keyTouched?: boolean;
};

let counter = 0;
export const newUid = () => `m${Date.now().toString(36)}${(counter++).toString(36)}`;

/** 'Due date' -> 'dueDate'. */
export const toKey = (label: string) => {
	const words = label
		.replace(/[^a-zA-Z0-9]+/g, ' ')
		.trim()
		.split(' ')
		.filter(Boolean);
	const key = words.map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w[0].toLowerCase() + w.slice(1))).join('');
	return /^[a-zA-Z]/.test(key) ? key : key ? `f${key}` : '';
};

/** 'Invoice item' -> 'InvoiceItem', as the server registers it (before numbering). */
export const toModelName = (value: string) =>
	value
		.replace(/[^a-zA-Z0-9]+/g, ' ')
		.trim()
		.split(' ')
		.filter(Boolean)
		.map(w => w[0].toUpperCase() + w.slice(1))
		.join('');

/** 'Invoices' -> 'Invoice', 'Categories' -> 'Category' — the default model name for a title. */
export const singular = (title: string) =>
	title
		.trim()
		.replace(/ies$/i, 'y')
		.replace(/(ch|sh|x|ss)es$/i, '$1')
		.replace(/([^s])s$/i, '$1');

export const fromServer = (fields: any[] = []): EditableField[] =>
	fields.map(f => ({ ...f, uid: newUid(), keyTouched: true }));

export const toServer = (fields: EditableField[]) =>
	fields.map(({ uid, keyTouched, ...f }) => {
		const out: any = { ...f, label: f.label || '' };
		if (!ENUM_KINDS.includes(f.kind)) delete out.options;
		else out.options = (f.options || []).filter(o => o.value?.trim());
		if (!out.options?.length) delete out.options;
		if (!REFERENCE_KINDS.includes(f.kind)) delete out.ref;
		if (out.min === null || out.min === undefined || Number.isNaN(out.min)) delete out.min;
		if (out.max === null || out.max === undefined || Number.isNaN(out.max)) delete out.max;
		if (!canBeUnique(f.kind)) delete out.unique;
		if (NO_DEFAULT_KINDS.includes(f.kind)) delete out.default;
		if (Array.isArray(out.default) && !ARRAY_KINDS.includes(f.kind)) delete out.default;
		if (ARRAY_KINDS.includes(f.kind) && out.default !== undefined && !Array.isArray(out.default)) delete out.default;
		if (out.default === '' || out.default === undefined || out.default === null || (Array.isArray(out.default) && !out.default.length))
			delete out.default;
		return out;
	});

/** A field's default in the terms of its allowed values, for comparison. */
const defaultValues = (f: EditableField): string[] =>
	f.default === undefined || f.default === null || f.default === '' ? [] : (Array.isArray(f.default) ? f.default : [f.default]).map(String);

/** Which input a field problem is about — where it's shown, and which input turns red. */
export type FieldErrorOn = 'key' | 'ref' | 'options' | 'default' | 'range';
export type FieldError = { message: string; on: FieldErrorOn };

/** Keys access control adds to every record; no field may use them while it's on. */
export const ACCESS_KEYS = ['privacy', 'access', 'addedBy'];

/** Problems per field (by uid) that would make the server refuse the model. */
export const validateFields = (fields: EditableField[], { accessEnabled = false }: { accessEnabled?: boolean } = {}) => {
	const errors: Record<string, FieldError> = {};
	const seen = new Map<string, string>();
	const fail = (uid: string, on: FieldErrorOn, message: string) => (errors[uid] = { on, message });
	fields.forEach(f => {
		if (!f.key) return fail(f.uid, 'key', 'Needs a key');
		if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(f.key)) return fail(f.uid, 'key', 'Starts with a letter; letters, digits and _ only');
		if (RESERVED_KEYS.includes(f.key)) return fail(f.uid, 'key', `“${f.key}” is reserved`);
		if (accessEnabled && ACCESS_KEYS.includes(f.key))
			return fail(f.uid, 'key', `“${f.key}” is used by access control — pick another key`);
		if (SENSITIVE.test(f.key)) return fail(f.uid, 'key', 'Secrets (passwords, tokens…) can’t be stored here');
		const lower = f.key.toLowerCase();
		if (seen.has(lower)) return fail(f.uid, 'key', 'Another field has this key');
		seen.set(lower, f.uid);
		if (REFERENCE_KINDS.includes(f.kind) && !f.ref) return fail(f.uid, 'ref', 'Pick the model it links to');
		const values = (f.options || []).map(o => o.value?.trim()).filter(Boolean);
		if (NEEDS_OPTIONS.includes(f.kind) && !values.length) return fail(f.uid, 'options', 'Add at least one option');
		if (ENUM_KINDS.includes(f.kind) && new Set(values).size !== values.length)
			return fail(f.uid, 'options', 'An option is listed twice');
		if (f.kind === 'number' && values.some(v => !Number.isFinite(Number(v))))
			return fail(f.uid, 'options', 'The options of a number must be numbers');
		if (ENUM_KINDS.includes(f.kind) && values.length) {
			const outside = defaultValues(f).filter(d => !values.includes(d));
			if (outside.length) return fail(f.uid, 'default', `${outside.join(', ')} isn’t one of the options`);
		}
		if (typeof f.min === 'number' && typeof f.max === 'number' && f.min > f.max) return fail(f.uid, 'range', 'Min is above max');
	});
	return errors;
};
