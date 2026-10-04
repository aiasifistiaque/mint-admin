'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Button, Flex, Grid, IconButton, Input, Switch, Table, Text, Textarea } from '@chakra-ui/react';
import { Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useGenerateTemplateSampleDataMutation } from '@/components/library';
import { Dropdown, Panel } from '@/components/library/cl';
import { toaster } from '@/components/ui/toaster';
import StudioDialog from '../../_components/StudioDialog';
import { GuideLink, Intro, Label, errorMessage } from '../../_components/ui';
import type { TabProps } from './types';

/**
 * The Sample data tab: example records per model, so a new project (and a
 * preview) isn't empty. Tenants choose whether to include them. Links are
 * written as the linked record's display value; the apply engine finds the
 * record by it, so linked-to models' records come first.
 */

export type SampleData = Record<string, any[]>;

const SKIP = ['image', 'images', 'file', 'files', 'video', 'section', 'sectionlist', 'formula', 'password'];
const MAX = 50;

/** The saved models, named as the server names them (a step may only have a title). */
const stepsOf = (doc: any) => {
	const named = doc.whatsInside?.models || [];
	return (doc.draft?.models?.steps || [])
		.filter((s: any) => s?.action !== 'update')
		.map((s: any, i: number) => ({ ...s, name: named[i]?.name || s.name, title: s.title || named[i]?.title }))
		.filter((s: any) => s.name);
};

const displayOf = (step: any) =>
	step?.displayField || (step?.fields || []).find((f: any) => ['text', 'email', 'select'].includes(f.kind))?.key || 'name';

const show = (v: any) => (v === undefined || v === null || v === '' ? '—' : Array.isArray(v) ? v.join(', ') : typeof v === 'object' ? JSON.stringify(v) : String(v));

const SampleDataTab: FC<TabProps<SampleData>> = ({ doc, value, onChange }) => {
	const steps = useMemo(() => stepsOf(doc), [doc]);
	const [model, setModel] = useState<string>(steps[0]?.name || '');
	const [editing, setEditing] = useState<{ index: number; record: any } | null>(null);
	const [asking, setAsking] = useState(false);
	const step = steps.find((s: any) => s.name === model);
	const rows: any[] = value[model] || [];
	const fields: any[] = (step?.fields || []).filter((f: any) => !SKIP.includes(f.kind));
	const columns = fields.slice(0, 5);

	useEffect(() => {
		if (!step && steps[0]) setModel(steps[0].name);
	}, [step, steps]);

	const setRows = (next: any[]) => onChange({ ...value, [model]: next });
	const orphans = Object.keys(value).filter(k => !steps.some((s: any) => s.name === k));

	if (!steps.length)
		return (
			<Flex
				direction='column'
				gap={4}>
				<Intro section='sample-data'>
					Example records, so a project made from the template — and its preview — isn’t empty on day one.
				</Intro>
				<Panel title='No models yet'>
					<Text
						fontSize='sm'
						color='fg.muted'>
						Add and save models first; sample records are kept per model.
					</Text>
				</Panel>
			</Flex>
		);

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='sample-data'>
				Example records, so a project made from the template — and its preview — isn’t empty on day one. Tenants choose
				whether to include them when they start a project. A link is written as the linked record’s name (its display
				field), so add records to linked-to models first: an Account before the Transactions on it.
			</Intro>

			<Flex
				gap={1}
				flexWrap='wrap'>
				{steps.map((s: any) => (
					<Button
						key={s.name}
						size='xs'
						borderRadius='full'
						variant={s.name === model ? 'solid' : 'outline'}
						onClick={() => setModel(s.name)}>
						{s.title || s.name} · {(value[s.name] || []).length}
					</Button>
				))}
			</Flex>

			{orphans.length > 0 && (
				<Box
					px={4}
					py={3}
					borderRadius='md'
					bg='orange.subtle'
					fontSize='sm'>
					Sample data for {orphans.join(', ')}, which {orphans.length === 1 ? 'isn’t a model' : 'aren’t models'} in this
					template any more.{' '}
					<Text
						as='span'
						textDecoration='underline'
						cursor='pointer'
						onClick={() => onChange(Object.fromEntries(Object.entries(value).filter(([k]) => !orphans.includes(k))))}>
						Remove it
					</Text>
				</Box>
			)}

			<Panel
				title={`${step?.title || model} (${rows.length})`}
				subtitle={`Up to ${MAX} records. Pictures, files and sections aren’t part of sample data.`}
				flush
				actions={
					<Flex
						gap={2}
						align='center'>
						<GuideLink section='sample-data' />
						<Button
							size='2xs'
							variant='outline'
							onClick={() => setAsking(true)}>
							<Sparkles size={12} />
							Generate with AI
						</Button>
						<Button
							size='2xs'
							variant='outline'
							disabled={rows.length >= MAX}
							onClick={() => setEditing({ index: -1, record: {} })}>
							<Plus size={12} />
							Add a record
						</Button>
					</Flex>
				}>
				{!rows.length ? (
					<Text
						p={4}
						fontSize='sm'
						color='fg.muted'>
						No records for {step?.title || model} yet.
					</Text>
				) : (
					<Box overflowX='auto'>
						<Table.Root size='sm'>
							<Table.Header>
								<Table.Row bg='bg.subtle'>
									{columns.map(f => (
										<Table.ColumnHeader
											key={f.key}
											fontSize='xs'>
											{f.label || f.key}
										</Table.ColumnHeader>
									))}
									<Table.ColumnHeader w='80px' />
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{rows.map((r, i) => (
									<Table.Row key={i}>
										{columns.map(f => (
											<Table.Cell
												key={f.key}
												fontSize='sm'
												maxW='220px'
												truncate>
												{show(r[f.key])}
											</Table.Cell>
										))}
										<Table.Cell textAlign='right'>
											<IconButton
												aria-label='Edit'
												size='xs'
												variant='ghost'
												onClick={() => setEditing({ index: i, record: r })}>
												<Pencil size={13} />
											</IconButton>
											<IconButton
												aria-label='Remove'
												size='xs'
												variant='ghost'
												onClick={() => setRows(rows.filter((_, j) => j !== i))}>
												<Trash2 size={13} />
											</IconButton>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</Box>
				)}
			</Panel>

			{editing && (
				<RecordDialog
					title={`${editing.index < 0 ? 'Add' : 'Edit'} a sample ${step?.title || model} record`}
					fields={fields}
					record={editing.record}
					linkChoices={(f: any) => (value[f.ref] || []).map((r: any) => r?.[displayOf(steps.find((s: any) => s.name === f.ref))]).filter(Boolean)}
					onClose={() => setEditing(null)}
					onSave={record => {
						setRows(editing.index < 0 ? [...rows, record] : rows.map((r, j) => (j === editing.index ? record : r)));
						setEditing(null);
					}}
				/>
			)}
			<GenerateDialog
				open={asking}
				doc={doc}
				model={model}
				title={step?.title || model}
				room={MAX - rows.length}
				onClose={() => setAsking(false)}
				onRecords={records => setRows([...rows, ...records].slice(0, MAX))}
			/>
		</Flex>
	);
};

/** One record, a form from the model's fields. */
const RecordDialog: FC<{
	title: string;
	fields: any[];
	record: any;
	linkChoices: (f: any) => string[];
	onClose: () => void;
	onSave: (record: any) => void;
}> = ({ title, fields, record, linkChoices, onClose, onSave }) => {
	const [r, setR] = useState<any>(record);
	const set = (key: string, v: any) => setR((x: any) => ({ ...x, [key]: v }));
	const clean = () => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== '' && v !== undefined && v !== null && !(Array.isArray(v) && !v.length)));

	return (
		<StudioDialog
			open
			onClose={onClose}
			title={title}
			section='sample-data'
			size='lg'
			confirmLabel='Keep'
			onConfirm={() => onSave(clean())}
			aside={
				<Text
					fontSize='xs'
					color='fg.muted'>
					Saved with the template when you press Save.
				</Text>
			}>
			<Grid
				templateColumns={{ base: '1fr', md: '1fr 1fr' }}
				gap={4}>
				{fields.map(f => {
					const v = r[f.key];
					const hint = f.helper || (f.required ? 'Required in the model' : undefined);
					let input;
					if (f.kind === 'boolean')
						input = (
							<Switch.Root
								size='sm'
								checked={!!v}
								onCheckedChange={e => set(f.key, e.checked)}>
								<Switch.HiddenInput />
								<Switch.Control>
									<Switch.Thumb />
								</Switch.Control>
								<Switch.Label fontSize='sm'>{v ? 'Yes' : 'No'}</Switch.Label>
							</Switch.Root>
						);
					else if (f.kind === 'select')
						input = (
							<Dropdown
								value={v ?? ''}
								onChange={x => set(f.key, x)}>
								<option value=''>—</option>
								{(f.options || []).map((o: any) => (
									<option
										key={o.value}
										value={o.value}>
										{o.label || o.value}
									</option>
								))}
							</Dropdown>
						);
					else if (f.kind === 'reference') {
						const choices = linkChoices(f);
						input = choices.length ? (
							<Dropdown
								value={v ?? ''}
								onChange={x => set(f.key, x)}>
								<option value=''>—</option>
								{choices.map(c => (
									<option
										key={c}
										value={c}>
										{c}
									</option>
								))}
							</Dropdown>
						) : (
							<Text
								fontSize='xs'
								color='fg.muted'>
								Add sample {f.ref} records first — this links to one of them by name.
							</Text>
						);
					} else if (['multiselect', 'tags', 'references'].includes(f.kind))
						input = (
							<Input
								size='sm'
								value={Array.isArray(v) ? v.join(', ') : v || ''}
								placeholder={f.kind === 'references' ? linkChoices(f).slice(0, 3).join(', ') : 'Comma-separated'}
								onChange={e => set(f.key, e.target.value.split(',').map(x => x.trimStart()))}
								onBlur={() => Array.isArray(r[f.key]) && set(f.key, r[f.key].map((x: string) => x.trim()).filter(Boolean))}
							/>
						);
					else if (['textarea', 'editor'].includes(f.kind))
						input = (
							<Textarea
								size='sm'
								rows={3}
								value={v || ''}
								onChange={e => set(f.key, e.target.value)}
							/>
						);
					else
						input = (
							<Input
								size='sm'
								type={f.kind === 'number' ? 'number' : f.kind === 'date' ? 'date' : f.kind === 'email' ? 'email' : 'text'}
								value={v ?? ''}
								onChange={e => set(f.key, f.kind === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
							/>
						);
					return (
						<Box
							key={f.key}
							gridColumn={['textarea', 'editor'].includes(f.kind) ? { md: 'span 2' } : undefined}>
							<Label
								hint={hint}
								required={f.required}>
								{f.label || f.key}
							</Label>
							{input}
						</Box>
					);
				})}
			</Grid>
		</StudioDialog>
	);
};

/** Claude writes records for one model; they're added to the list, not saved. */
const GenerateDialog: FC<{
	open: boolean;
	doc: any;
	model: string;
	title: string;
	room: number;
	onClose: () => void;
	onRecords: (records: any[]) => void;
}> = ({ open, doc, model, title, room, onClose, onRecords }) => {
	const [count, setCount] = useState('5');
	const [note, setNote] = useState('');
	const [generate, { isLoading }] = useGenerateTemplateSampleDataMutation();
	const n = useMemo(() => Math.min(Math.max(Number(count) || 1, 1), 20, Math.max(room, 0)), [count, room]);

	const run = async () => {
		try {
			const res = await generate({ id: doc._id, model, count: n, note: note.trim() || undefined }).unwrap();
			onRecords(res.records);
			toaster.create({ type: 'success', title: `${res.records.length} ${title} records added`, description: 'Check them, then Save.' });
			onClose();
		} catch (e) {
			toaster.create({ type: 'error', title: 'Could not generate records', description: errorMessage(e, 'Try again') });
		}
	};

	return (
		<StudioDialog
			open={open}
			onClose={onClose}
			title={`Generate ${title} records with AI`}
			section='sample-data'
			confirmLabel={isLoading ? 'Writing…' : `Generate ${n}`}
			onConfirm={run}
			loading={isLoading}
			disabled={room <= 0}>
			<Flex
				direction='column'
				gap={4}>
				<Text
					fontSize='sm'
					color='fg.muted'>
					Claude writes believable records from the model’s fields and the template’s overview, linking to the sample
					records other models already have. They’re added to the list for you to check — nothing is saved until you press
					Save. Uses the server’s Anthropic key.
				</Text>
				<Box>
					<Label hint='Up to 20 at a time.'>How many</Label>
					<Input
						size='sm'
						type='number'
						min={1}
						max={20}
						w='100px'
						value={count}
						onChange={e => setCount(e.target.value)}
					/>
				</Box>
				<Box>
					<Label hint='Optional: a theme, a country, what to vary.'>Anything to keep in mind</Label>
					<Input
						size='sm'
						value={note}
						placeholder='A small design studio in Lisbon; amounts in EUR'
						onChange={e => setNote(e.target.value)}
					/>
				</Box>
			</Flex>
		</StudioDialog>
	);
};

export default SampleDataTab;
