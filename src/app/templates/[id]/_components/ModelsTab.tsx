'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { Badge, Box, Button, Flex, Grid, IconButton, Input, Switch, Text, Textarea } from '@chakra-ui/react';
import { ArrowDown, ArrowRight, ArrowUp, CircleAlert, Plus, Trash2 } from 'lucide-react';
import { PromptDialog } from '@/components/library';
import { Panel } from '@/components/library/cl';
import ModelPanels, { ModelWorking, emptyModel, requestedName } from '@/app/model-builder/_components/ModelPanels';
import { LinkTarget } from '@/app/model-builder/_components/FieldsEditor';
import { REFERENCE_KINDS, fromServer, newUid, toModelName, toServer } from '@/app/model-builder/_components/modelKinds';
import { GuideLink, Intro, Label } from '../../_components/ui';
import type { TabProps } from './types';

/**
 * The Models tab: the template's models, each edited with the model
 * builder's own panels (fields, record code, access) — writing into the
 * blueprint, never building. Steps are the feature-plan shape the apply
 * engine builds as one plan (backend docs/templates TD7).
 */

type Item = {
	id: string;
	working: ModelWorking;
	rationale: string;
	/** The rest of the step as it came: a page layout from Claude (table, filters, form, view), tabs… */
	extra: Record<string, any>;
};
export type ModelsWorking = { sidebarCategory: string; items: Item[] };

const OWN = ['action', 'name', 'route', 'title', 'description', 'displayField', 'code', 'access', 'fields', 'rationale', 'requested'];
const LAYOUT = ['table', 'filters', 'form', 'view', 'buttonTitle'];

const itemFromStep = (s: any): Item => ({
	id: newUid(),
	working: {
		...emptyModel(),
		title: s.title || '',
		name: s.name || s.requested || '',
		route: s.route || '',
		description: s.description || '',
		displayField: s.displayField || '',
		code: { enabled: false, padding: 4, start: 1, ...(s.code || {}), prefix: s.code?.prefix || '' },
		access: { enabled: !!s.access?.enabled, default: 'private' },
		fields: fromServer(s.fields || []),
	},
	rationale: s.rationale || '',
	extra: Object.fromEntries(Object.entries(s).filter(([k]) => !OWN.includes(k))),
});

export const modelsFrom = (part: any): ModelsWorking => ({
	sidebarCategory: part?.sidebarCategory || '',
	items: (part?.steps || []).filter((s: any) => s?.action !== 'update').map(itemFromStep),
});

export const modelsTo = (w: ModelsWorking) => ({
	sidebarCategory: w.sidebarCategory.trim(),
	steps: w.items.map(({ working: m, rationale, extra }) => ({
		action: 'create',
		...(m.name.trim() && { name: m.name.trim() }),
		...(m.route.trim() && { route: m.route.trim() }),
		title: m.title.trim(),
		description: m.description,
		rationale,
		displayField: m.displayField,
		...(m.code.enabled && { code: { ...m.code, prefix: m.code.prefix.trim() } }),
		...(m.access.enabled && { access: { enabled: true } }),
		fields: toServer(m.fields),
		...extra,
	})),
});

const nameOf = (w: ModelWorking) => toModelName(requestedName(w));

const ModelsTab: FC<TabProps<ModelsWorking>> = ({ doc, value, onChange, focus }) => {
	const [at, setAt] = useState(0);
	const [removing, setRemoving] = useState<number | null>(null);
	const items = value.items;
	const item = items[Math.min(at, items.length - 1)];
	const planned = doc.validation?.models || [];
	const issues = [...(doc.validation?.errors || []), ...(doc.validation?.explain || [])].filter((i: any) => i.part === 'models');

	useEffect(() => {
		if (focus?.part === 'models' && focus.index !== undefined) setAt(focus.index);
	}, [focus]);

	const setItems = (next: Item[]) => onChange({ ...value, items: next });
	const setItem = (patch: Partial<Item>) => setItems(items.map((x, i) => (x === item ? { ...x, ...patch } : x)));

	const targets: LinkTarget[] = useMemo(
		() => [
			...items.map(x => {
				const name = nameOf(x.working);
				const p = planned.find((m: any) => m.name === name);
				return { name, route: p?.route || x.working.route || '', title: x.working.title || name, display: x.working.displayField || 'name', built: false };
			}),
			// A website project already has the kit: link to it, don't recreate it.
			...planned.filter((m: any) => m.kit).map((m: any) => ({ name: m.name, route: m.route, title: `${m.title} (website kit)`, display: 'name', built: true })),
		],
		[items, planned]
	);

	const links = items.flatMap(x =>
		x.working.fields
			.filter(f => REFERENCE_KINDS.includes(f.kind) && f.ref)
			.map(f => ({ from: x.working.title || nameOf(x.working), field: f.label || f.key, to: f.ref as string, many: f.kind === 'references' }))
	);

	const add = () => {
		setItems([...items, { id: newUid(), working: emptyModel(), rationale: '', extra: {} }]);
		setAt(items.length);
	};
	const move = (i: number, by: number) => {
		const j = i + by;
		if (j < 0 || j >= items.length) return;
		const next = [...items];
		[next[i], next[j]] = [next[j], next[i]];
		setItems(next);
		setAt(j);
	};
	const problemsOf = (i: number) => issues.filter((x: any) => x.path.startsWith(`models.steps[${i}]`)).length;

	const p = item ? planned.find((m: any) => m.name === nameOf(item.working)) : null;
	const name: any = item
		? {
				availability: p ? { requested: nameOf(item.working), name: p.name, route: p.route, collectionName: p.route, changed: false, reasons: [] } : undefined,
				error: undefined,
				checking: false,
				query: nameOf(item.working),
		  }
		: undefined;
	const layout = item ? LAYOUT.filter(k => item.extra[k] !== undefined) : [];

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='models'>
				The records a project built from this template keeps — Invoices, Clients, Bookings. Each model becomes a page with a
				table, a form and a detail page. Link models with a <strong>Link</strong> field on the “many” side (a Transaction
				links to its Account); the linked model’s page gets a tab of them. Nothing is built when you save: the models are
				built together, all or nothing, when a project is made from the template or you preview it.
			</Intro>

			<Grid
				templateColumns={{ base: '1fr', lg: '260px minmax(0, 1fr)' }}
				gap={4}
				alignItems='start'>
				<Flex
					direction='column'
					gap={3}>
					<Panel
						title={`Models (${items.length})`}
						flush
						actions={
							<Button
								size='2xs'
								variant='outline'
								onClick={add}>
								<Plus size={12} />
								Add
							</Button>
						}>
						{!items.length ? (
							<Text
								p={4}
								fontSize='sm'
								color='fg.muted'>
								No models yet. Add the first — usually the thing the others belong to (Accounts before Transactions).
							</Text>
						) : (
							items.map((x, i) => {
								const n = problemsOf(i);
								const on = x === item;
								return (
									<Flex
										key={x.id}
										align='center'
										gap={2}
										px={3}
										py={2}
										cursor='pointer'
										bg={on ? 'bg.muted' : undefined}
										borderTopWidth={i ? '1px' : 0}
										borderColor='border.muted'
										onClick={() => setAt(i)}>
										<Box
											flex='1'
											minW={0}>
											<Text
												fontSize='sm'
												fontWeight={on ? '600' : '500'}
												truncate>
												{x.working.title || nameOf(x.working) || 'New model'}
											</Text>
											<Text
												fontSize='xs'
												color='fg.muted'
												truncate>
												{nameOf(x.working) || '—'} · {x.working.fields.length} field{x.working.fields.length === 1 ? '' : 's'}
											</Text>
										</Box>
										{n > 0 && (
											<Box
												color='red.fg'
												title={`${n} problem(s)`}>
												<CircleAlert size={14} />
											</Box>
										)}
										{on && (
											<Flex>
												<IconButton
													aria-label='Move up'
													size='2xs'
													variant='ghost'
													disabled={i === 0}
													onClick={e => (e.stopPropagation(), move(i, -1))}>
													<ArrowUp size={12} />
												</IconButton>
												<IconButton
													aria-label='Move down'
													size='2xs'
													variant='ghost'
													disabled={i === items.length - 1}
													onClick={e => (e.stopPropagation(), move(i, 1))}>
													<ArrowDown size={12} />
												</IconButton>
												<IconButton
													aria-label='Remove'
													size='2xs'
													variant='ghost'
													onClick={e => (e.stopPropagation(), setRemoving(i))}>
													<Trash2 size={12} />
												</IconButton>
											</Flex>
										)}
									</Flex>
								);
							})
						)}
					</Panel>

					<Panel
						title='Links'
						subtitle='How the models connect.'
						actions={<GuideLink section='models' />}>
						{!links.length ? (
							<Text
								fontSize='xs'
								color='fg.muted'>
								None yet. A Link field on one model to another connects them.
							</Text>
						) : (
							<Flex
								direction='column'
								gap={1.5}>
								{links.map((l, i) => (
									<Flex
										key={i}
										align='center'
										gap={1.5}
										fontSize='xs'
										flexWrap='wrap'>
										<Text fontWeight='600'>{l.from}</Text>
										<Text color='fg.muted'>· {l.field}</Text>
										<ArrowRight size={11} />
										<Text fontWeight='600'>{l.to}</Text>
										{l.many && (
											<Badge
												size='xs'
												variant='outline'>
												several
											</Badge>
										)}
									</Flex>
								))}
							</Flex>
						)}
					</Panel>

					<Panel title='Sidebar section'>
						<Label hint='Where these pages go when the Sidebar part doesn’t place them. Empty: the project’s first section.'>
							Section name
						</Label>
						<Input
							size='sm'
							value={value.sidebarCategory}
							placeholder='Finance'
							onChange={e => onChange({ ...value, sidebarCategory: e.target.value })}
						/>
					</Panel>
				</Flex>

				{item ? (
					<Flex
						key={item.id}
						direction='column'
						gap={4}
						minW={0}>
						{issues
							.filter((x: any) => x.path.startsWith(`models.steps[${items.indexOf(item)}]`))
							.map((x: any, i: number) => (
								<Box
									key={i}
									px={4}
									py={2.5}
									borderRadius='md'
									bg={x.severity === 'error' ? 'red.subtle' : 'orange.subtle'}
									fontSize='sm'>
									<Text fontWeight='500'>{x.message}</Text>
									<Text
										fontSize='xs'
										color='fg.muted'>
										{x.fix}
									</Text>
								</Box>
							))}
						<ModelPanels
							working={item.working}
							onChange={working => setItem({ working })}
							mode='create'
							targets={targets.filter(t => t.name !== nameOf(item.working))}
							name={name}
						/>
						<Panel
							title='Why it’s there'
							subtitle='A line on what this model is for in the template — shown to whoever edits the template, and to Claude.'>
							<Textarea
								size='sm'
								rows={2}
								value={item.rationale}
								placeholder='Every transaction belongs to an account.'
								onChange={e => setItem({ rationale: e.target.value })}
							/>
						</Panel>
						{layout.length > 0 && (
							<Panel
								title='Page layout'
								subtitle='Columns, filters, form sections and the detail page that came with this model (usually from Claude). Off: the generated layout is used.'>
								<Flex
									direction='column'
									gap={2}
									fontSize='xs'
									color='fg.muted'>
									{item.extra.table?.length ? <Text>Columns: {item.extra.table.join(', ')}</Text> : null}
									{item.extra.filters?.length ? <Text>Filters: {item.extra.filters.join(', ')}</Text> : null}
									{item.extra.form?.length ? <Text>Form sections: {item.extra.form.map((s: any) => s.sectionTitle || 'Untitled').join(', ')}</Text> : null}
									{item.extra.view?.length ? <Text>Detail sections: {item.extra.view.map((s: any) => s.title || 'Untitled').join(', ')}</Text> : null}
									<Switch.Root
										size='sm'
										checked
										onCheckedChange={() => setItem({ extra: Object.fromEntries(Object.entries(item.extra).filter(([k]) => !LAYOUT.includes(k))) })}>
										<Switch.HiddenInput />
										<Switch.Control>
											<Switch.Thumb />
										</Switch.Control>
										<Switch.Label fontSize='sm'>Use this layout</Switch.Label>
									</Switch.Root>
								</Flex>
							</Panel>
						)}
					</Flex>
				) : (
					<Panel title='No model selected'>
						<Button
							size='sm'
							onClick={add}>
							<Plus size={14} />
							Add a model
						</Button>
					</Panel>
				)}
			</Grid>

			<PromptDialog
				open={removing !== null}
				onClose={() => setRemoving(null)}
				onConfirm={() => {
					if (removing === null) return;
					setItems(items.filter((_, i) => i !== removing));
					setAt(Math.max(0, removing - 1));
					setRemoving(null);
				}}
				title='Remove this model from the template?'
				subject={removing !== null ? items[removing]?.working.title || nameOf(items[removing]?.working || emptyModel()) : ''}
				description='Links to it, its sample data, and sidebar, dashboard or guide entries that name it will be reported as problems until you change them. Nothing is saved until you press Save.'
				confirmLabel='Remove'
			/>
		</Flex>
	);
};

export default ModelsTab;
