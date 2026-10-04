'use client';

import { FC, useMemo, useState } from 'react';
import { Badge, Box, Button, Checkbox, Flex, Grid, IconButton, Input, Switch, Text } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Dropdown, Panel } from '@/components/library/cl';
import { RANGE_LABEL, SIZE_LABEL, SIZE_SPAN, TYPE_LABEL, Widget, WidgetType, newWidget } from '@/components/library/dashboard/types';
import { GuideLink, Intro, Label } from '../../_components/ui';
import { DATE_KINDS, GROUP_KINDS, NUMBER_KINDS, TemplateModel, templateModels } from './models';
import type { TabProps } from './types';

/**
 * The Dashboard tab: the new project's home page — numbers, charts and lists
 * of recent records — as the dashboard builder's widgets, pointed at the
 * template's models by name (the apply engine swaps in their routes). Nothing
 * exists to show yet, so each widget is described in words instead of drawn.
 */

const METRIC = { count: 'How many', sum: 'Total of', avg: 'Average of' } as const;

const labelOf = (m: TemplateModel | undefined, key?: string) =>
	key === 'createdAt' ? 'Created' : m?.fields.find(f => f.key === key)?.label || key || '';

/** "Total of Amount in Transactions, last 30 days" — what the widget will show. */
const describe = (w: Widget, m?: TemplateModel) => {
	const where = m?.title || w.route || 'a model';
	if (w.type === 'recent') return `The latest ${w.limit || 5} ${where}${w.columns?.length ? `, showing ${w.columns.map(c => labelOf(m, c)).join(', ')}` : ''}`;
	const what = `${METRIC[w.metric || 'count']}${w.metric && w.metric !== 'count' ? ` ${labelOf(m, w.field)} in` : ''} ${where}`;
	const range = (RANGE_LABEL as any)[w.range || 'all']?.toLowerCase();
	if (w.type === 'stat') return `${what}, ${range}`;
	return w.group === 'field' ? `${what} by ${labelOf(m, w.by) || '…'}, ${range}` : `${what} per ${w.interval || 'day'}, ${range}`;
};

const WidgetEditor: FC<{ w: Widget; models: TemplateModel[]; onChange: (w: Widget) => void }> = ({ w, models, onChange }) => {
	const m = models.find(x => x.name === w.route);
	const fields = m?.fields || [];
	const set = (patch: Partial<Widget>) => onChange(Object.fromEntries(Object.entries({ ...w, ...patch }).filter(([, v]) => v !== undefined)) as Widget);
	const pickType = (type: WidgetType) => type !== w.type && onChange({ ...newWidget(type), id: w.id, route: w.route, title: w.title, filters: w.filters });
	const numbers = fields.filter(f => NUMBER_KINDS.includes(f.kind));
	const groups = fields.filter(f => GROUP_KINDS.includes(f.kind));
	const dates = [{ key: 'createdAt', label: 'Created' }, ...fields.filter(f => DATE_KINDS.includes(f.kind))];
	const columns = fields.filter(f => !['sectionlist', 'section', 'password', 'editor'].includes(f.kind));

	return (
		<Flex
			direction='column'
			gap={4}
			pt={3}>
			<Flex
				gap={1.5}
				flexWrap='wrap'>
				{(['stat', 'chart', 'recent'] as WidgetType[]).map(t => (
					<Button
						key={t}
						size='xs'
						variant={w.type === t ? 'solid' : 'outline'}
						onClick={() => pickType(t)}>
						{TYPE_LABEL[t]}
					</Button>
				))}
			</Flex>
			<Grid
				templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}
				gap={3}>
				<Box>
					<Label hint='The model it reads.'>Model</Label>
					<Dropdown
						value={w.route}
						placeholder='Pick a model'
						onChange={route => set({ route, field: undefined, by: undefined, columns: w.type === 'recent' ? [] : undefined, dateField: w.type === 'recent' ? undefined : 'createdAt' })}>
						{models.map(x => (
							<option
								key={x.name}
								value={x.name}>
								{x.title}
							</option>
						))}
					</Dropdown>
				</Box>
				<Box>
					<Label hint='Says what the number or chart shows.'>Title</Label>
					<Input
						size='sm'
						value={w.title || ''}
						maxLength={80}
						onChange={e => set({ title: e.target.value })}
					/>
				</Box>
				<Box>
					<Label hint='Of the dashboard’s width.'>Size</Label>
					<Dropdown
						value={w.size}
						onChange={size => set({ size: size as any })}>
						{Object.entries(SIZE_LABEL).map(([k, v]) => (
							<option
								key={k}
								value={k}>
								{v}
							</option>
						))}
					</Dropdown>
				</Box>
				{w.type !== 'recent' && (
					<>
						<Box>
							<Label>Shows</Label>
							<Dropdown
								value={w.metric || 'count'}
								onChange={metric => set({ metric: metric as any, ...(metric === 'count' && { field: undefined }) })}>
								<option value='count'>How many records</option>
								<option value='sum'>The total of a number</option>
								<option value='avg'>The average of a number</option>
							</Dropdown>
						</Box>
						{w.metric && w.metric !== 'count' && (
							<Box>
								<Label hint={numbers.length ? undefined : 'This model has no number fields.'}>Number field</Label>
								<Dropdown
									value={w.field || ''}
									placeholder='Pick a field'
									onChange={field => set({ field })}>
									{numbers.map(f => (
										<option
											key={f.key}
											value={f.key}>
											{f.label || f.key}
										</option>
									))}
								</Dropdown>
							</Box>
						)}
						<Box>
							<Label>Over</Label>
							<Dropdown
								value={w.range || 'all'}
								onChange={range => set({ range: range as any, ...(range === 'all' && { compare: undefined }) })}>
								{Object.entries(RANGE_LABEL).map(([k, v]) => (
									<option
										key={k}
										value={k}>
										{v}
									</option>
								))}
							</Dropdown>
						</Box>
						{(w.range || 'all') !== 'all' && (
							<Box>
								<Label hint='Which date puts a record in the range.'>Dated by</Label>
								<Dropdown
									value={w.dateField || 'createdAt'}
									onChange={dateField => set({ dateField })}>
									{dates.map(f => (
										<option
											key={f.key}
											value={f.key}>
											{f.label || f.key}
										</option>
									))}
								</Dropdown>
							</Box>
						)}
					</>
				)}
				{w.type === 'stat' && (
					<>
						<Box>
							<Label hint='e.g. $ or {{currency}}'>Before the number</Label>
							<Input
								size='sm'
								value={w.prefix || ''}
								maxLength={12}
								onChange={e => set({ prefix: e.target.value || undefined })}
							/>
						</Box>
						<Box>
							<Label hint='e.g. % or “days”'>After the number</Label>
							<Input
								size='sm'
								value={w.suffix || ''}
								maxLength={12}
								onChange={e => set({ suffix: e.target.value || undefined })}
							/>
						</Box>
						{(w.range || 'all') !== 'all' && (
							<Flex align='flex-end'>
								<Switch.Root
									size='sm'
									checked={!!w.compare}
									onCheckedChange={e => set({ compare: e.checked || undefined })}>
									<Switch.HiddenInput />
									<Switch.Control>
										<Switch.Thumb />
									</Switch.Control>
									<Switch.Label fontSize='sm'>Compare with the period before</Switch.Label>
								</Switch.Root>
							</Flex>
						)}
					</>
				)}
				{w.type === 'chart' && (
					<>
						<Box>
							<Label>Along</Label>
							<Dropdown
								value={w.group || 'time'}
								onChange={group =>
									set(group === 'field' ? { group: 'field', chart: 'bar', interval: undefined, limit: 6 } : { group: 'time', chart: 'bar', interval: 'day', by: undefined, limit: undefined })
								}>
								<option value='time'>Time</option>
								<option value='field'>A field’s values</option>
							</Dropdown>
						</Box>
						<Box>
							<Label>Chart</Label>
							<Dropdown
								value={w.chart || 'bar'}
								onChange={chart => set({ chart: chart as any })}>
								<option value='bar'>Bars</option>
								{w.group !== 'field' && <option value='line'>Line</option>}
								{w.group === 'field' && <option value='donut'>Donut</option>}
							</Dropdown>
						</Box>
						{w.group === 'field' ? (
							<Box>
								<Label hint={groups.length ? 'A choice, yes/no or link field.' : 'This model has no choice, yes/no or link fields.'}>Broken down by</Label>
								<Dropdown
									value={w.by || ''}
									placeholder='Pick a field'
									onChange={by => set({ by })}>
									{groups.map(f => (
										<option
											key={f.key}
											value={f.key}>
											{f.label || f.key}
										</option>
									))}
								</Dropdown>
							</Box>
						) : (
							<Box>
								<Label>One bar per</Label>
								<Dropdown
									value={w.interval || 'day'}
									onChange={interval => set({ interval: interval as any })}>
									<option value='day'>Day</option>
									<option value='week'>Week</option>
									<option value='month'>Month</option>
								</Dropdown>
							</Box>
						)}
					</>
				)}
				{w.type === 'recent' && (
					<Box>
						<Label>How many</Label>
						<Input
							size='sm'
							type='number'
							min={1}
							max={20}
							value={w.limit || 5}
							onChange={e => set({ limit: Math.min(Math.max(Number(e.target.value) || 5, 1), 20) })}
						/>
					</Box>
				)}
			</Grid>
			{w.type === 'recent' && m && (
				<Box>
					<Label hint='The columns of the list, in this order.'>Columns</Label>
					<Flex
						gap={3}
						flexWrap='wrap'>
						{columns.map(f => (
							<Checkbox.Root
								key={f.key}
								size='sm'
								checked={(w.columns || []).includes(f.key)}
								onCheckedChange={e =>
									set({ columns: e.checked ? [...(w.columns || []), f.key] : (w.columns || []).filter(c => c !== f.key) })
								}>
								<Checkbox.HiddenInput />
								<Checkbox.Control />
								<Checkbox.Label fontSize='sm'>{f.label || f.key}</Checkbox.Label>
							</Checkbox.Root>
						))}
					</Flex>
				</Box>
			)}
			{(w.filters || []).length > 0 && (
				<Text
					fontSize='xs'
					color='fg.muted'>
					{w.filters!.length} condition{w.filters!.length === 1 ? '' : 's'} on the records counted (written by Claude) — kept as they are.
				</Text>
			)}
		</Flex>
	);
};

const DashboardTab: FC<TabProps<Widget[]>> = ({ doc, value, onChange }) => {
	const models = useMemo(() => templateModels(doc), [doc]);
	const [open, setOpen] = useState<string | null>(null);
	const issues = [...(doc.validation?.errors || []), ...(doc.validation?.warnings || [])].filter((i: any) => i.part === 'dashboard');
	const set = (i: number, w: Widget) => onChange(value.map((x, j) => (j === i ? w : x)));
	const move = (i: number, by: number) => {
		const j = i + by;
		if (j < 0 || j >= value.length) return;
		const next = [...value];
		[next[i], next[j]] = [next[j], next[i]];
		onChange(next);
	};
	const add = (type: WidgetType) => {
		const w = { ...newWidget(type), route: models[0]?.name || '' };
		onChange([...value, w]);
		setOpen(w.id);
	};

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='dashboard'>
				The new project’s home page: numbers, charts and lists of recent records from the template’s models — the money
				moved this month, open invoices by status, the latest bookings. These are the dashboard builder’s widgets; the
				project can change them later. Pick what someone opening the project every morning wants to see first.
			</Intro>

			<Grid
				templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 300px' }}
				gap={4}
				alignItems='start'>
				<Panel
					title={`Widgets (${value.length})`}
					subtitle='In the order they appear, left to right.'
					flush
					actions={<GuideLink section='dashboard' />}>
					{value.map((w, i) => {
						const m = models.find(x => x.name === w.route);
						const isOpen = open === (w.id || String(i));
						const mine = issues.filter((x: any) => x.path.startsWith(`dashboard[${i}]`));
						return (
							<Box
								key={w.id || i}
								px={4}
								py={3}
								borderTopWidth={i ? '1px' : 0}
								borderColor='border.muted'>
								<Flex
									align='center'
									gap={2}>
									<IconButton
										aria-label={isOpen ? 'Close' : 'Edit'}
										size='xs'
										variant='ghost'
										onClick={() => setOpen(isOpen ? null : w.id || String(i))}>
										{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
									</IconButton>
									<Box
										flex='1'
										minW={0}
										cursor='pointer'
										onClick={() => setOpen(isOpen ? null : w.id || String(i))}>
										<Flex
											align='center'
											gap={2}>
											<Text
												fontSize='sm'
												fontWeight='600'
												truncate>
												{w.title || 'Untitled'}
											</Text>
											<Badge
												size='xs'
												variant='outline'>
												{TYPE_LABEL[w.type]}
											</Badge>
										</Flex>
										<Text
											fontSize='xs'
											color={m ? 'fg.muted' : 'red.fg'}>
											{m ? describe(w, m) : `Reads “${w.route || '—'}”, which isn’t a model of this template`}
										</Text>
									</Box>
									<IconButton
										aria-label='Move up'
										size='xs'
										variant='ghost'
										disabled={i === 0}
										onClick={() => move(i, -1)}>
										<ArrowUp size={13} />
									</IconButton>
									<IconButton
										aria-label='Move down'
										size='xs'
										variant='ghost'
										disabled={i === value.length - 1}
										onClick={() => move(i, 1)}>
										<ArrowDown size={13} />
									</IconButton>
									<IconButton
										aria-label='Remove'
										size='xs'
										variant='ghost'
										onClick={() => onChange(value.filter((_, j) => j !== i))}>
										<Trash2 size={13} />
									</IconButton>
								</Flex>
								{mine.map((x: any, n: number) => (
									<Text
										key={n}
										fontSize='xs'
										color={x.severity === 'error' ? 'red.fg' : 'orange.fg'}
										pl={9}>
										{x.message} {x.fix}
									</Text>
								))}
								{isOpen && (
									<Box pl={9}>
										<WidgetEditor
											w={w}
											models={models}
											onChange={next => set(i, next)}
										/>
									</Box>
								)}
							</Box>
						);
					})}
					<Flex
						gap={2}
						p={4}
						borderTopWidth={value.length ? '1px' : 0}
						borderColor='border.muted'
						flexWrap='wrap'>
						{!models.length ? (
							<Text
								fontSize='sm'
								color='fg.muted'>
								Add and save models first — widgets read them.
							</Text>
						) : (
							(['stat', 'chart', 'recent'] as WidgetType[]).map(t => (
								<Button
									key={t}
									size='xs'
									variant='outline'
									onClick={() => add(t)}>
									<Plus size={12} />
									{TYPE_LABEL[t]}
								</Button>
							))
						)}
					</Flex>
				</Panel>

				<Panel
					title='Layout'
					subtitle='How the widgets sit on a wide screen; on a phone each is full width.'>
					<Grid
						templateColumns='repeat(12, 1fr)'
						gap={1.5}>
						{value.map((w, i) => (
							<Flex
								key={w.id || i}
								gridColumn={`span ${SIZE_SPAN[w.size] || 6}`}
								h={w.type === 'stat' ? '40px' : '72px'}
								align='center'
								justify='center'
								px={1}
								borderRadius='sm'
								borderWidth='1px'
								borderColor='border'
								bg='bg.subtle'
								fontSize='10px'
								color='fg.muted'
								textAlign='center'
								overflow='hidden'>
								{w.title || TYPE_LABEL[w.type]}
							</Flex>
						))}
					</Grid>
					{!value.length && (
						<Text
							fontSize='sm'
							color='fg.muted'>
							No widgets — the project opens on its setup checklist alone.
						</Text>
					)}
				</Panel>
			</Grid>
		</Flex>
	);
};

export default DashboardTab;
