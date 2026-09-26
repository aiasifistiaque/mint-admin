'use client';

import { DragEvent, FC, memo, useMemo, useRef, useState } from 'react';
import { Badge, Box, Button, Flex, Grid, IconButton, Input, Text, Textarea } from '@chakra-ui/react';
import { Calculator, ChevronDown, ChevronRight, GripVertical, Link2, Lock, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { inputDataOptions, radius } from '@/components/library';
import { TABLE_CELLS } from '@/components/library/fields/registry/tableCells';
import { ModelField } from './filterTypes';
import { Dropdown } from '@/components/library/cl';
import { FieldInfo, checkFormula } from '@/components/library/functions/formula';
import FormulaModal from './FormulaModal';

/**
 * A route's settings file, field by field — the same properties the file
 * holds, in the same order. These drive the admin API once published:
 * `edit` is which fields a PUT may change, `required`/`min`/`max`/`type` are
 * the validators, `sort`/`search` what the table can sort and search on,
 * `exclude` what's never returned, `populate` what's joined in.
 *
 * The rules the server enforces are mirrored here so they can't be tripped
 * by accident: sensitive fields can't be loosened, access-control routes are
 * read-only.
 */

export type SettingsField = { key: string; [prop: string]: any };

// Same list the server validates against (library/controllers/builder/validate.ts).
const DATA_TYPES = [
	'string',
	'email',
	'uri',
	'date',
	'text',
	'number',
	'boolean',
	'object',
	'array',
	'array-string',
	'array-number',
	'array-object',
	'date-only',
	'tag',
	'mixed',
	'profit',
];

/**
 * Form inputs by name, grouped — with the data type each stores, so picking
 * an input keeps the validator in step (an image list is an array of strings).
 * Inputs not listed here still appear, under "Other", by their id.
 */
const INPUTS: { value: string; label: string; group: string; data?: string }[] = [
	{ value: 'text', label: 'Text', group: 'Text', data: 'string' },
	{ value: 'textarea', label: 'Long text', group: 'Text', data: 'string' },
	{ value: 'editor', label: 'Rich text', group: 'Text', data: 'string' },
	{ value: 'basic-editor', label: 'Rich text (basic)', group: 'Text', data: 'string' },
	{ value: 'slug', label: 'Slug', group: 'Text', data: 'string' },
	{ value: 'password', label: 'Password', group: 'Text', data: 'string' },
	{ value: 'read-only', label: 'Read only', group: 'Text' },
	{ value: 'view-only', label: 'View only', group: 'Text' },
	{ value: 'number', label: 'Number', group: 'Values', data: 'number' },
	{ value: 'formula', label: 'Formula (calculated)', group: 'Values', data: 'number' },
	{ value: 'slider', label: 'Slider', group: 'Values', data: 'number' },
	{ value: 'checkbox', label: 'Checkbox', group: 'Values', data: 'boolean' },
	{ value: 'switch', label: 'Switch', group: 'Values', data: 'boolean' },
	{ value: 'date', label: 'Date', group: 'Values', data: 'date' },
	{ value: 'time', label: 'Time', group: 'Values', data: 'string' },
	{ value: 'color', label: 'Color', group: 'Values', data: 'string' },
	{ value: 'select', label: 'Select (from options)', group: 'Choices', data: 'string' },
	{ value: 'select-tag', label: 'Multi-select (from options)', group: 'Choices', data: 'array-string' },
	{ value: 'tag', label: 'Tags', group: 'Choices', data: 'array-string' },
	{ value: 'case-tag', label: 'Tags (keep case)', group: 'Choices', data: 'array-string' },
	{ value: 'image', label: 'Image', group: 'Media', data: 'string' },
	{ value: 'image-array', label: 'Images', group: 'Media', data: 'array-string' },
	{ value: 'file', label: 'File', group: 'Media', data: 'string' },
	{ value: 'file-array', label: 'Files', group: 'Media', data: 'array-string' },
	{ value: 'video', label: 'Video', group: 'Media', data: 'string' },
	{ value: 'icon', label: 'Icon', group: 'Media', data: 'string' },
	{ value: 'data-menu', label: 'Pick a record', group: 'Links to records', data: 'string' },
	{ value: 'data-select', label: 'Pick a record (select)', group: 'Links to records', data: 'string' },
	{ value: 'data-tag', label: 'Pick records', group: 'Links to records', data: 'array' },
	{ value: 'nested-data-menu', label: 'Pick a record (nested)', group: 'Links to records' },
	{ value: 'seo', label: 'SEO', group: 'Structured', data: 'object' },
	{ value: 'custom-attribute', label: 'Attributes', group: 'Structured' },
	{ value: 'array-string', label: 'List of texts', group: 'Structured', data: 'array-string' },
];
const INPUT_GROUPS = [...new Set(INPUTS.map(i => i.group))];
const OTHER_INPUTS = inputDataOptions.filter((t: string) => !INPUTS.some(i => i.value === t));

/**
 * The input list for a Dropdown: named groups, then the rest by id. A plain
 * function, not a component: Dropdown reads its <option>/<optgroup> children
 * directly, and can't see inside a component's render.
 */
const inputOptions = (current?: string) => (
	<>
		{INPUT_GROUPS.map(g => (
			<optgroup
				key={g}
				label={g}>
				{INPUTS.filter(i => i.group === g).map(i => (
					<option
						key={i.value}
						value={i.value}>
						{i.label}
					</option>
				))}
			</optgroup>
		))}
		<optgroup label='Other'>
			{OTHER_INPUTS.map((t: string) => (
				<option
					key={t}
					value={t}>
					{t}
				</option>
			))}
			{current && !inputDataOptions.includes(current) && <option value={current}>{current}</option>}
		</optgroup>
	</>
);

/**
 * System fields (backend validate.ts, lockedKeys / withSystemFields): when a
 * record was created, and on an access-restricted model its owner, privacy
 * and access list. They're generated and read-only — shown exactly as the
 * code generates them, whatever a draft holds, and put back that way by the
 * server on save.
 */
const ACCESS_FIELD_KEYS = ['privacy', 'access', 'addedBy'];
const SYSTEM_HINT: Record<string, string> = {
	createdAt: 'Set when the record is created.',
	addedBy: 'The record’s owner — whoever created it.',
	privacy: 'Only me, private or public — access control reads it.',
	access: 'Who a private record is shared with — access control reads it.',
};

// Same as the server's: these fields can be tightened, never loosened.
const SENSITIVE = /pass(word)?|token|secret|api_?key|apikey|private|otp|salt|hash/i;

const FLAGS: { prop: string; label: string; hint: string }[] = [
	{ prop: 'required', label: 'Required', hint: 'Must be sent when creating' },
	{ prop: 'unique', label: 'Unique', hint: 'Creating a duplicate is refused' },
	{ prop: 'edit', label: 'Editable', hint: 'Can be changed after creation' },
	{ prop: 'sort', label: 'Sortable', hint: 'The table can sort by it' },
	{ prop: 'search', label: 'Searchable', hint: 'The search box matches it' },
	{ prop: 'exclude', label: 'Hidden', hint: 'Never returned by the API' },
	{ prop: 'trim', label: 'Trim', hint: 'Surrounding spaces are removed' },
];

const ICON = { size: 14, strokeWidth: 1.75 };

type Props = {
	fields: SettingsField[];
	codeFields: SettingsField[];
	modelFields: ModelField[];
	readOnly?: boolean;
	onChange: (fields: SettingsField[]) => void;
};

const Small: FC<{ children: any }> = ({ children }) => (
	<Text
		fontSize='xs'
		fontWeight='600'
		mb={1.5}>
		{children}
	</Text>
);

/** `schema` as JSON — every presentation option, including ones without a control here. */
const SchemaJson: FC<{ value: any; onChange: (v: any) => void; disabled?: boolean }> = ({ value, onChange, disabled }) => {
	const [text, setText] = useState(JSON.stringify(value || {}, null, 2));
	const [bad, setBad] = useState(false);
	return (
		<>
			<Textarea
				size='sm'
				fontFamily='mono'
				fontSize='xs'
				rows={6}
				value={text}
				disabled={disabled}
				onChange={e => {
					setText(e.target.value);
					try {
						const parsed = JSON.parse(e.target.value || '{}');
						if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
							onChange(parsed);
							setBad(false);
						} else setBad(true);
					} catch {
						setBad(true);
					}
				}}
			/>
			{bad && (
				<Text
					fontSize='11px'
					color='red.fg'>
					Not a valid JSON object yet — the last valid value is kept.
				</Text>
			)}
		</>
	);
};

/** What a row changes — stable across renders, so an untouched row doesn't re-render. */
type RowActions = {
	set: (key: string, patch: any) => void;
	setSchema: (key: string, patch: any) => void;
	pickInput: (key: string, input: string) => void;
	pickType: (key: string, type: string) => void;
	reset: (key: string, code: SettingsField) => void;
	remove: (key: string) => void;
	toggle: (key: string) => void;
	editFormula: (key: string) => void;
	dragStart: (index: number) => void;
	dragOver: (index: number) => void;
	drop: (index: number) => void;
	dragEnd: () => void;
};

/** Would turning `prop` to `value` loosen a sensitive field beyond its code? */
const unsafe = (f: SettingsField, code: SettingsField | undefined, prop: string, value: boolean) => {
	if (!SENSITIVE.test(f.key)) return false;
	const c: SettingsField = code || { key: f.key };
	if (prop === 'edit' || prop === 'search') return value && !c[prop];
	if (prop === 'exclude') return !value && !!c.exclude;
	return false;
};

type RowProps = {
	f: SettingsField;
	index: number;
	/** The field as the settings file has it, if it does. */
	code?: SettingsField;
	isOpen: boolean;
	isTarget: boolean;
	dragging: boolean;
	system: boolean;
	link?: string;
	readOnly?: boolean;
	/** The model stores a number here, so `formula` is offered. */
	modelNumber: boolean;
	/** A formula field's button: its text, tooltip, and whether the formula checks out. */
	formulaLabel?: string;
	formulaTitle?: string;
	formulaOk?: boolean;
	/** Remounts the JSON editor when a control changes `schema`. */
	schemaRev: number;
	actions: RowActions;
};

/**
 * One settings field. Memoized: a settings list is 20–40 of these, each with
 * three dropdowns, and re-rendering them all on every keystroke or toggle is
 * what made the Settings tab (and the formula window on it) slow.
 */
const FieldRow = memo(function FieldRow({
	f,
	index,
	code,
	isOpen,
	isTarget,
	dragging,
	system,
	link,
	readOnly,
	modelNumber,
	formulaLabel,
	formulaTitle,
	formulaOk,
	schemaRev,
	actions,
}: RowProps) {
	const sensitive = SENSITIVE.test(f.key);
	const changed = !code || JSON.stringify(code) !== JSON.stringify(f);
	const formula = formulaLabel === undefined ? null : { ok: formulaOk, label: formulaLabel, title: formulaTitle };
	return (
			<Box
				draggable={!isOpen && !readOnly && !system}
				onDragStart={(e: DragEvent) => {
					actions.dragStart(index);
					e.dataTransfer.effectAllowed = 'move';
					e.dataTransfer.setData('text/plain', f.key);
				}}
				onDragOver={(e: DragEvent) => {
					e.preventDefault();
					actions.dragOver(index);
				}}
				onDrop={(e: DragEvent) => {
					e.preventDefault();
					actions.drop(index);
				}}
				onDragEnd={actions.dragEnd}
				borderWidth='1px'
				borderStyle={isTarget ? 'dashed' : 'solid'}
				borderColor={isTarget ? 'fg' : 'border'}
				borderRadius={radius.CONTAINER}
				bg='bg.panel'
				opacity={dragging ? 0.4 : 1}>
				<Flex
					align='center'
					gap={2}
					px={2.5}
					py={1.5}
					flexWrap='wrap'>
					{!readOnly && (
						<Flex
							color='fg.subtle'
							cursor='grab'
							title='Drag to reorder'>
							<GripVertical {...ICON} />
						</Flex>
					)}
					<Flex
						align='center'
						gap={1.5}
						w='190px'
						minW={0}>
						{(sensitive || system) && (
							<Flex
								color={system ? 'fg.muted' : 'orange.fg'}
								title={system ? `System field — generated, read only. ${SYSTEM_HINT[f.key] || ''}` : 'Sensitive: can be made stricter, never looser'}>
								<Lock size={12} />
							</Flex>
						)}
						<Text
							fontSize='xs'
							fontFamily='mono'
							fontWeight='600'
							truncate
							title={f.key}>
							{f.key}
						</Text>
						{system && (
							<Badge
								size='xs'
								variant='outline'
								title={SYSTEM_HINT[f.key]}>
								system
							</Badge>
						)}
						{changed && !system && (
							<Badge
								size='xs'
								colorPalette='blue'
								variant='subtle'
								title={code ? 'Differs from the settings file' : 'Not in the settings file'}>
								{code ? 'changed' : 'new'}
							</Badge>
						)}
					</Flex>
					<Input
						size='xs'
						w='170px'
						value={f.title || ''}
						placeholder='Title'
						disabled={readOnly || system}
						onChange={e => actions.set(f.key, { title: e.target.value })}
					/>
					<Dropdown
						size='xs'
						w='130px'
						disabled={readOnly || system}
						title={
							system
								? 'Fixed on a system field'
								: 'How the value is stored and validated. “formula”: a number calculated from other number fields'
						}
						value={f.schema?.type === 'formula' ? 'formula' : f.type || 'string'}
						onChange={v => actions.pickType(f.key, v)}>
						{DATA_TYPES.map(t => (
							<option
								key={t}
								value={t}>
								{t}
							</option>
						))}
						{/* Offered where the model stores a number — a formula's result has to fit. */}
						{(f.type === 'number' || f.schema?.type === 'formula' || modelNumber) && (
							<option value='formula'>formula</option>
						)}
					</Dropdown>
					{link ? (
						<Flex
							w='170px'
							h={8}
							align='center'
							gap={1.5}
							px={2.5}
							borderWidth='1px'
							borderRadius='md'
							bg='bg.muted'
							fontSize='xs'
							title={`Links to the ${link} model — fixed: access control checks the signed-in ${link.toLowerCase()}`}>
							<Link2 size={12} />
							<Text truncate>
								Linked to <b>{link}</b>
							</Text>
						</Flex>
					) : formula ? (
						// A formula field has no input to pick — it's calculated. Its
						// formula sits here instead; the data type switches it back.
						<Button
							size='xs'
							variant='outline'
							w='170px'
							justifyContent='flex-start'
							disabled={readOnly}
							borderColor={formula.ok ? undefined : 'red.solid'}
							color={formula.ok ? undefined : 'red.fg'}
							title={formula.title}
							onClick={() => actions.editFormula(f.key)}>
							<Calculator size={12} />
							<Text
								as='span'
								fontFamily='mono'
								truncate>
								{formula.label}
							</Text>
						</Button>
					) : (
						<Dropdown
							size='xs'
							w='170px'
							disabled={readOnly || system}
							title={system ? 'Fixed on a system field' : 'The form input — also how the table and detail page show it'}
							value={f.schema?.type || ''}
							onChange={v => actions.pickInput(f.key, v)}>
							<option value=''>Input: from the data type</option>
							{inputOptions(f.schema?.type)}
						</Dropdown>
					)}
					<Flex
						gap={1}
						flexWrap='wrap'
						flex='1'>
						{FLAGS.map(flag => {
							const on = !!f[flag.prop];
							const fixed = system || (f.schema?.type === 'formula' && (flag.prop === 'edit' || flag.prop === 'required'));
							const blocked = fixed || unsafe(f, code, flag.prop, !on);
							return (
								<Button
									key={flag.prop}
									size='2xs'
									variant={on ? 'solid' : 'outline'}
									disabled={readOnly || blocked}
									title={
										fixed
											? f.schema?.type === 'formula' && !system
												? `${flag.label}: a formula is calculated, never typed`
												: `${flag.label}: fixed on a system field`
											: blocked
											? `${flag.label}: not allowed on a sensitive field`
											: flag.hint
									}
									// Off goes back to however the settings file says it —
									// explicit false or absent — so on-then-off isn't a change.
									onClick={() =>
										actions.set(f.key, { [flag.prop]: !on ? true : code && flag.prop in code ? code[flag.prop] && false : undefined })
									}>
									{flag.label}
								</Button>
							);
						})}
					</Flex>
					<IconButton
						size='xs'
						variant='ghost'
						aria-label={isOpen ? 'Hide details' : 'Show details'}
						onClick={() => actions.toggle(f.key)}>
						{isOpen ? <ChevronDown {...ICON} /> : <ChevronRight {...ICON} />}
					</IconButton>
					{!readOnly && !system && (
						<IconButton
							size='xs'
							variant='ghost'
							aria-label={`Remove ${f.key}`}
							title='Remove from settings: the API stops validating, editing and returning it'
							color='red.500'
							_dark={{ color: 'red.300' }}
							onClick={() => actions.remove(f.key)}>
							<Trash2 {...ICON} />
						</IconButton>
					)}
				</Flex>

				{isOpen && (
					<Flex
						direction='column'
						gap={3}
						p={3}
						pt={1}
						borderTopWidth='1px'
						borderColor='border.muted'>
						<Grid
							templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
							gap={3}>
							<Box>
								<Small>Label in the admin</Small>
								<Input
									size='sm'
									value={f.schema?.label || ''}
									placeholder={f.title || f.key}
									disabled={readOnly || system}
									onChange={e => actions.setSchema(f.key, { label: e.target.value || undefined })}
								/>
							</Box>
							<Box>
								<Small>Form input</Small>
								<Dropdown
									size='sm'
									disabled={readOnly || system}
									value={f.schema?.type || ''}
									onChange={v => actions.pickInput(f.key, v)}>
									<option value=''>From the data type</option>
									{inputOptions(f.schema?.type)}
								</Dropdown>
							</Box>
							<Box>
								<Small>Table cell</Small>
								<Dropdown
									size='sm'
									disabled={readOnly || system}
									value={f.schema?.tableType || ''}
									onChange={v => actions.setSchema(f.key, { tableType: v || undefined })}>
									<option value=''>Same as the form input</option>
									{Object.keys(TABLE_CELLS).map(t => (
										<option
											key={t}
											value={t}>
											{t}
										</option>
									))}
									{f.schema?.tableType && !(f.schema.tableType in TABLE_CELLS) && (
										<option value={f.schema.tableType}>{f.schema.tableType}</option>
									)}
								</Dropdown>
							</Box>
							<Box>
								<Small>In the table by default</Small>
								<Button
									size='sm'
									variant={f.schema?.default ? 'solid' : 'outline'}
									disabled={readOnly || system}
									onClick={() =>
										actions.setSchema(f.key, {
											default: !f.schema?.default ? true : code?.schema && 'default' in code.schema ? false : undefined,
										})
									}>
									{f.schema?.default ? 'Shown' : 'Hidden until chosen'}
								</Button>
							</Box>
						</Grid>

						<Grid
							templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
							gap={3}>
							<Box>
								<Small>Min</Small>
								<Input
									size='sm'
									type='number'
									value={f.min ?? ''}
									disabled={readOnly || system}
									onChange={e => actions.set(f.key, { min: e.target.value === '' ? undefined : Number(e.target.value) })}
								/>
							</Box>
							<Box>
								<Small>Max</Small>
								<Input
									size='sm'
									type='number'
									value={f.max ?? ''}
									disabled={readOnly || system}
									onChange={e => actions.set(f.key, { max: e.target.value === '' ? undefined : Number(e.target.value) })}
								/>
							</Box>
							<Box>
								<Small>Populate path</Small>
								<Input
									size='sm'
									value={typeof f.populate === 'object' ? f.populate?.path || '' : f.populate || ''}
									placeholder='Not populated'
									disabled={readOnly || system}
									onChange={e =>
										actions.set(f.key, {
											populate: e.target.value
												? { ...(typeof f.populate === 'object' ? f.populate : {}), path: e.target.value }
												: undefined,
										})
									}
								/>
							</Box>
							<Box>
								<Small>Populate fields</Small>
								<Input
									size='sm'
									value={typeof f.populate === 'object' ? f.populate?.select || '' : ''}
									placeholder='name email'
									disabled={readOnly || system || !f.populate}
									onChange={e =>
										actions.set(f.key, {
											populate: { ...(typeof f.populate === 'object' ? f.populate : { path: f.populate }), select: e.target.value || undefined },
										})
									}
								/>
							</Box>
						</Grid>

						<Box>
							<Small>All presentation options (schema)</Small>
							<SchemaJson
								key={`${f.key}-${schemaRev}`}
								value={f.schema}
								disabled={readOnly || system}
								onChange={schema => actions.set(f.key, { schema })}
							/>
						</Box>

						{code && changed && !readOnly && (
							<Box>
								<Button
									size='xs'
									variant='ghost'
									onClick={() => {
										actions.reset(f.key, code);
									}}>
									<RotateCcw size={14} />
									Back to the settings file for this field
								</Button>
							</Box>
						)}
					</Flex>
				)}
			</Box>
	);
});

const SettingsEditor: FC<Props> = ({ fields, codeFields, modelFields, readOnly, onChange }) => {
	const [open, setOpen] = useState<string | null>(null);
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [overIndex, setOverIndex] = useState<number | null>(null);
	const [adding, setAdding] = useState('');
	// Remounts the JSON editor when a control changes `schema`, so it shows the new value.
	const [schemaRev, setSchemaRev] = useState(0);

	const codeByKey = new Map(codeFields.map(f => [f.key, f]));
	const modelByKey = new Map(modelFields.map(f => [f.key, f]));
	const restricted = ACCESS_FIELD_KEYS.every(k => modelByKey.has(k));
	/** Generated and read-only. */
	const locked = new Set(
		[...(modelByKey.has('createdAt') ? ['createdAt'] : []), ...(restricted ? ACCESS_FIELD_KEYS : [])].filter(k => codeByKey.has(k))
	);
	/** What's shown: system fields as generated (a missing one too, at the end — the server adds it back on save). */
	const shown: SettingsField[] = [
		...fields.map(f => (locked.has(f.key) ? codeByKey.get(f.key)! : f)),
		...[...locked].filter(k => !fields.some(f => f.key === k)).map(k => codeByKey.get(k)!),
	];
	/** The model a system field links to — shown, not chosen. */
	const linkOf = (key: string) => (locked.has(key) ? modelByKey.get(key)?.ref : undefined);
	const present = new Set(fields.map(f => f.key));
	// A field can be added if the model has it, or the code file declares it.
	const addable = [
		...modelFields.map(f => f.key),
		...codeFields.map(f => f.key),
	].filter((k, i, all) => !present.has(k) && !locked.has(k) && k !== '_id' && all.indexOf(k) === i);

	const set = (key: string, patch: any) =>
		onChange(fields.map(f => (f.key === key ? clean({ ...f, ...patch }) : f)));
	const setSchema = (key: string, patch: any) => {
		const f = fields.find(x => x.key === key)!;
		set(key, { schema: clean({ ...(f.schema || {}), ...patch }) });
		setSchemaRev(r => r + 1);
	};

	/** A new input, and the data type it stores when that differs — images are a list, a checkbox a boolean. */
	const pickInput = (key: string, input: string) => {
		const f = fields.find(x => x.key === key)!;
		const data = INPUTS.find(i => i.value === input)?.data;
		if (input === 'formula') {
			// Calculated, never typed: a number, not editable, not required.
			set(key, {
				type: 'number',
				edit: undefined,
				required: undefined,
				schema: clean({ ...(f.schema || {}), type: 'formula', formula: f.schema?.formula || '', tableType: 'number', viewType: 'number' }),
			});
			setSchemaRev(r => r + 1);
			setFormulaFor(key);
			return;
		}
		const { formula: _dropped, ...schema } = f.schema || {};
		set(key, {
			schema: clean({
				...schema,
				type: input || undefined,
				// The number cells a formula set, not a choice of their own.
				...(f.schema?.type === 'formula' && { tableType: undefined, viewType: undefined }),
			}),
			...(data && data !== f.type && { type: data }),
		});
		setSchemaRev(r => r + 1);
	};

	/** A data type; `formula` makes it a calculated number, and any other type undoes that. */
	const pickType = (key: string, type: string) => {
		const f = fields.find(x => x.key === key)!;
		if (type === 'formula') return pickInput(key, 'formula');
		if (f.schema?.type !== 'formula') return set(key, { type });
		const { formula: _dropped, type: _input, tableType: _t, viewType: _v, ...schema } = f.schema || {};
		set(key, { type, schema: clean(schema) });
		setSchemaRev(r => r + 1);
	};

	// Formula fields: what a formula may use, and which field's formula is being edited.
	const [formulaFor, setFormulaFor] = useState<string | null>(null);
	const formulaInfo: FieldInfo[] = shown.map(f => ({
		key: f.key,
		label: f.title,
		numeric: f.type === 'number' || f.schema?.type === 'formula' || modelByKey.get(f.key)?.instance === 'Number',
		...(f.schema?.type === 'formula' && { formula: f.schema?.formula }),
	}));
	const formulaField = formulaFor ? fields.find(f => f.key === formulaFor) : undefined;

	const drop = (index: number) => {
		if (dragIndex !== null && dragIndex !== index) {
			const next = [...fields];
			const [moved] = next.splice(dragIndex, 1);
			next.splice(index, 0, moved);
			onChange(next);
		}
		setDragIndex(null);
		setOverIndex(null);
	};

	// The rows get one actions object for good: it reads the latest render's
	// handlers through a ref, so memoized rows never see a stale `fields`.
	const latest = useRef({ set, setSchema, pickInput, pickType, drop, fields, onChange });
	latest.current = { set, setSchema, pickInput, pickType, drop, fields, onChange };
	const actions = useMemo<RowActions>(
		() => ({
			set: (key, patch) => latest.current.set(key, patch),
			setSchema: (key, patch) => latest.current.setSchema(key, patch),
			pickInput: (key, input) => latest.current.pickInput(key, input),
			pickType: (key, type) => latest.current.pickType(key, type),
			reset: (key, code) => {
				latest.current.set(key, code);
				setSchemaRev(r => r + 1);
			},
			remove: key => latest.current.onChange(latest.current.fields.filter(x => x.key !== key)),
			toggle: key => setOpen(o => (o === key ? null : key)),
			editFormula: key => setFormulaFor(key),
			dragStart: index => setDragIndex(index),
			dragOver: index => setOverIndex(o => (o === index ? o : index)),
			drop: index => latest.current.drop(index),
			dragEnd: () => {
				setDragIndex(null);
				setOverIndex(null);
			},
		}),
		[]
	);


	return (
		<Flex
			direction='column'
			gap={2}>
			{shown.map((f, i) => {
				const isFormula = f.schema?.type === 'formula';
				const check = isFormula ? checkFormula(f.schema?.formula || '', formulaInfo, f.key) : null;
				const empty = !String(f.schema?.formula || '').trim();
				const isOpen = open === f.key;
				return (
					<FieldRow
						key={f.key}
						f={f}
						index={i}
						code={codeByKey.get(f.key)}
						isOpen={isOpen}
						isTarget={dragIndex !== null && overIndex === i && dragIndex !== i}
						dragging={dragIndex === i}
						system={locked.has(f.key)}
						link={linkOf(f.key)}
						readOnly={readOnly}
						modelNumber={modelByKey.get(f.key)?.instance === 'Number'}
						formulaLabel={check ? (empty ? 'Set formula' : `= ${check.formatted || f.schema.formula}`) : undefined}
						formulaTitle={
							check ? (check.ok ? 'Edit the formula' : empty ? 'Set the formula' : check.errors.map(e => e.message).join('; ')) : undefined
						}
						formulaOk={check?.ok}
						schemaRev={isOpen ? schemaRev : 0}
						actions={actions}
					/>
				);
			})}

			{!readOnly && addable.length > 0 && (
				<Flex
					gap={2}
					align='center'>
					<Dropdown
						size='sm'
						w='260px'
						value={adding}
						onChange={v => setAdding(v)}>
						<option value=''>Add a field of this model…</option>
						{addable.map(k => (
							<option
								key={k}
								value={k}>
								{k}
							</option>
						))}
					</Dropdown>
					<Button
						size='sm'
						variant='outline'
						disabled={!adding}
						onClick={() => {
							const code = codeByKey.get(adding);
							const model = modelFields.find(m => m.key === adding);
							// From the settings file if it declares it; otherwise a plain
							// read-only-ish field typed from the model.
							const field: SettingsField = code || {
								key: adding,
								title: adding.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase()),
								type: modelTypeToData(model?.instance),
							};
							onChange([...fields, field]);
							setOpen(adding);
							setAdding('');
						}}>
						<Plus {...ICON} />
						Add
					</Button>
				</Flex>
			)}

			<FormulaModal
				isOpen={!!formulaField}
				onClose={() => setFormulaFor(null)}
				fieldKey={formulaField?.key || ''}
				fieldTitle={formulaField?.title}
				formula={formulaField?.schema?.formula || ''}
				fields={formulaInfo}
				onSave={formula => {
					if (formulaField) setSchema(formulaField.key, { formula });
					setFormulaFor(null);
				}}
			/>
		</Flex>
	);
};

/** Drops undefined values so an untouched property doesn't read as a change. */
const clean = (o: any) => {
	const out: any = {};
	for (const [k, v] of Object.entries(o)) if (v !== undefined) out[k] = v;
	return out;
};

const modelTypeToData = (instance?: string) => {
	switch (instance) {
		case 'Number':
		case 'Decimal128':
			return 'number';
		case 'Boolean':
			return 'boolean';
		case 'Date':
			return 'date';
		case 'Array':
			return 'array';
		case 'Mixed':
			return 'object';
		default:
			return 'string';
	}
};

export default SettingsEditor;
