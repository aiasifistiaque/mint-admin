'use client';

import { FC } from 'react';
import { Badge, Box, Button, Flex, IconButton, Input, Text } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, Link2, Plus, Trash2 } from 'lucide-react';
import {
	radius,
	useGetBuilderBacklinksQuery,
	useGetBuilderModelFieldsQuery,
	useLazyGetBuilderModelFieldsQuery,
} from '@/components/library';
import { Dropdown, Panel } from '@/components/library/cl';
import { ModelField } from './filterTypes';
import { DocLink } from './ui';

/**
 * The detail page's tabs — the config's `viewTabs`. The page opens on
 * Overview (the view sections); each tab after it lists the records of
 * another route that link to this one: an author's blogs, a client's
 * invoices. Only routes with a field referencing this model can be linked,
 * so the choices come from the server's backlinks.
 */

export type ViewTab = { related: string; foreignField: string; title?: string; columns: string[]; pageSize?: number };

type RouteOption = { route: string; model: string | null; title?: string | null };

type Props = {
	tabs: ViewTab[];
	onChange: (tabs: ViewTab[]) => void;
	/** This route's model name — what the linked routes reference. */
	model: string;
	routes: RouteOption[];
};

const ICON = { size: 14, strokeWidth: 1.75 };
const PREFERRED = ['code', 'name', 'title', 'status', 'price', 'total', 'createdAt'];

/** A new tab's columns: the usual naming/summary fields the related model has, else its first few. */
const defaultColumns = (fields: ModelField[], foreignField: string) => {
	const keys = fields.map(f => f.key).filter(k => k !== '_id' && k !== '__v' && k !== foreignField && !k.includes('.'));
	const picked = PREFERRED.filter(k => keys.includes(k)).slice(0, 4);
	return picked.length ? picked : keys.slice(0, 3);
};

export const tabProblems = (tabs: ViewTab[] = []) => {
	const out: string[] = [];
	tabs.forEach((t, i) => {
		const where = t.title || `tab ${i + 1}`;
		if (!t.foreignField) out.push(`${where}: pick the field linking ${t.related}`);
		if (!t.columns?.length) out.push(`${where}: pick columns`);
	});
	return out;
};

const TabCard: FC<{
	tab: ViewTab;
	index: number;
	count: number;
	titleOf: (route: string) => string;
	links: string[];
	onChange: (t: ViewTab) => void;
	onMove: (to: number) => void;
	onRemove: () => void;
	relatedModel?: string;
}> = ({ tab, index, count, titleOf, links, onChange, onMove, onRemove, relatedModel }) => {
	const { data } = useGetBuilderModelFieldsQuery(relatedModel as string, { skip: !relatedModel });
	const fields: ModelField[] = (data?.fields || []).filter(
		(f: ModelField) => !['_id', '__v'].includes(f.key) && f.key !== tab.foreignField && !f.key.includes('.')
	);
	const problems = tabProblems([tab]).map(p => p.replace(/^[^:]*: /, ''));

	return (
		<Box
			borderWidth='1px'
			borderColor={problems.length ? 'red.muted' : 'border'}
			borderRadius='md'
			p={3}>
			<Flex
				align='center'
				gap={2}
				flexWrap='wrap'
				mb={3}>
				<Badge
					variant='outline'
					fontSize='10px'>
					Tab {index + 2}
				</Badge>
				<Input
					size='xs'
					w='200px'
					placeholder={titleOf(tab.related)}
					value={tab.title || ''}
					onChange={e => onChange({ ...tab, title: e.target.value || undefined })}
				/>
				<Text
					fontSize='xs'
					color='fg.muted'>
					lists {titleOf(tab.related)} where
				</Text>
				<Dropdown
					size='xs'
					w='160px'
					value={tab.foreignField}
					placeholder='Link field'
					onChange={(v: string) => onChange({ ...tab, foreignField: v })}>
					{links.map(k => (
						<option
							key={k}
							value={k}>
							{k}
						</option>
					))}
				</Dropdown>
				<Text
					fontSize='xs'
					color='fg.muted'>
					is this record
				</Text>
				<Flex
					ml='auto'
					gap={1}>
					<IconButton
						size='2xs'
						variant='ghost'
						aria-label='Move left'
						title='Earlier'
						disabled={index === 0}
						onClick={() => onMove(index - 1)}>
						<ArrowUp {...ICON} />
					</IconButton>
					<IconButton
						size='2xs'
						variant='ghost'
						aria-label='Move right'
						title='Later'
						disabled={index === count - 1}
						onClick={() => onMove(index + 1)}>
						<ArrowDown {...ICON} />
					</IconButton>
					<IconButton
						size='2xs'
						variant='ghost'
						color='red.fg'
						aria-label='Remove tab'
						title='Remove'
						onClick={onRemove}>
						<Trash2 {...ICON} />
					</IconButton>
				</Flex>
			</Flex>

			<Text
				fontSize='xs'
				fontWeight='600'
				mb={1.5}>
				Columns
			</Text>
			<Flex
				gap={1}
				flexWrap='wrap'
				mb={3}>
				{fields.map(f => {
					const on = tab.columns.includes(f.key);
					return (
						<Button
							key={f.key}
							size='2xs'
							variant={on ? 'solid' : 'outline'}
							onClick={() =>
								onChange({ ...tab, columns: on ? tab.columns.filter(k => k !== f.key) : [...tab.columns, f.key] })
							}>
							{f.key}
						</Button>
					);
				})}
			</Flex>

			<Flex
				align='center'
				gap={2}>
				<Text
					fontSize='xs'
					color='fg.muted'>
					Rows per page
				</Text>
				<Input
					size='xs'
					w='64px'
					type='number'
					min={5}
					max={100}
					value={tab.pageSize ?? 20}
					onChange={e => onChange({ ...tab, pageSize: Math.min(100, Math.max(5, Number(e.target.value) || 20)) })}
				/>
			</Flex>

			{problems.length > 0 && (
				<Text
					mt={2}
					fontSize='11px'
					color='red.fg'>
					{problems.join(' · ')}
				</Text>
			)}
		</Box>
	);
};

const ViewTabsEditor: FC<Props> = ({ tabs, onChange, model, routes }) => {
	const { data: backlinks, isLoading } = useGetBuilderBacklinksQuery(model, { skip: !model });
	const [loadFields] = useLazyGetBuilderModelFieldsQuery();
	const linked = backlinks?.doc || [];

	const titleOf = (route: string) => routes.find(r => r.route === route)?.title || route;
	const has = (route: string, field: string) => tabs.some(t => t.related === route && t.foreignField === field);
	const suggestions = linked.flatMap(l => l.fields.map(f => ({ route: l.route, model: l.model, field: f }))).filter(s => !has(s.route, s.field));

	const add = async (s: { route: string; model: string; field: string }) => {
		const res: any = await loadFields(s.model, true).unwrap().catch(() => null);
		const columns = defaultColumns(res?.fields || [], s.field);
		// Two links from the same route (e.g. author, editor) need telling apart.
		const twoWays = linked.find(l => l.route === s.route)!.fields.length > 1;
		onChange([
			...tabs,
			{
				related: s.route,
				foreignField: s.field,
				...(twoWays && { title: `${titleOf(s.route)} (${s.field})` }),
				columns,
				pageSize: 20,
			},
		]);
	};

	const move = (from: number, to: number) => {
		const next = [...tabs];
		const [t] = next.splice(from, 1);
		next.splice(to, 0, t);
		onChange(next);
	};

	return (
		<Panel
			title='Tabs'
			subtitle='The detail page opens on Overview — the sections above. Each tab after it lists records of another route that link to this one, like an author’s blogs.'
			actions={<DocLink section='view' />}>
			<Flex
				direction='column'
				gap={3}>
				{/* The order the page shows them in. */}
				<Flex
					gap={1}
					flexWrap='wrap'>
					{['Overview', ...tabs.map(t => t.title || titleOf(t.related))].map((label, i) => (
						<Box
							key={i}
							px={3}
							py={1}
							fontSize='12px'
							borderRadius={radius.PILL}
							bg={i === 0 ? 'bg.inverted' : 'bg.muted'}
							color={i === 0 ? 'fg.inverted' : 'fg'}>
							{label}
						</Box>
					))}
				</Flex>

				{tabs.map((tab, i) => (
					<TabCard
						key={`${tab.related}-${tab.foreignField}-${i}`}
						tab={tab}
						index={i}
						count={tabs.length}
						titleOf={titleOf}
						links={linked.find(l => l.route === tab.related)?.fields || (tab.foreignField ? [tab.foreignField] : [])}
						relatedModel={routes.find(r => r.route === tab.related)?.model || linked.find(l => l.route === tab.related)?.model}
						onChange={t => onChange(tabs.map((x, j) => (j === i ? t : x)))}
						onMove={to => move(i, to)}
						onRemove={() => onChange(tabs.filter((_, j) => j !== i))}
					/>
				))}

				<Box>
					<Flex
						align='center'
						gap={1.5}
						mb={1.5}>
						<Link2 size={13} />
						<Text
							fontSize='xs'
							fontWeight='600'>
							Add a tab
						</Text>
					</Flex>
					{isLoading ? (
						<Text
							fontSize='xs'
							color='fg.muted'>
							Looking for routes that link here…
						</Text>
					) : suggestions.length ? (
						<Flex
							gap={1.5}
							flexWrap='wrap'>
							{suggestions.map(s => (
								<Button
									key={`${s.route}-${s.field}`}
									size='xs'
									variant='outline'
									onClick={() => add(s)}>
									<Plus {...ICON} />
									{titleOf(s.route)}
									<Text
										as='span'
										color='fg.muted'>
										via {s.field}
									</Text>
								</Button>
							))}
						</Flex>
					) : (
						<Text
							fontSize='xs'
							color='fg.muted'>
							{linked.length
								? 'Every route that links here already has a tab.'
								: `No route links to ${model} yet. Add a reference field pointing at ${model} to another model, and it shows up here.`}
						</Text>
					)}
				</Box>
			</Flex>
		</Panel>
	);
};

export default ViewTabsEditor;
