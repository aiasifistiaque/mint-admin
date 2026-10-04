'use client';

import { FC, useMemo } from 'react';
import { Badge, Box, Button, Flex, Grid, IconButton, Input, Switch, Text } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Dropdown, Panel } from '@/components/library/cl';
import { toKey } from '@/app/model-builder/_components/modelKinds';
import { GuideLink, Intro, Label, PART_LABEL } from '../../_components/ui';
import type { TabProps } from './types';

/**
 * The Questions tab: what's asked when someone starts a project from the
 * template. Each answer replaces {{key}} wherever the template uses it — a
 * default currency, a company name in the site's title.
 */

export type Question = { key: string; label: string; help: string; kind: string; options?: { value: string; label: string }[]; default: string; required: boolean };

const KIND_HELP: Record<string, string> = {
	text: 'A short answer',
	textarea: 'A few lines',
	select: 'One of the choices you give',
	currency: 'A currency code, like USD',
	locale: 'A language and region, like en-GB',
	color: 'A colour, like #2563eb',
	image: 'An image (its address)',
	email: 'An email address',
	url: 'A web address',
};

/** Where each {{key}} appears in the saved draft: part → how many times. */
const usage = (draft: any) => {
	const out: Record<string, Record<string, number>> = {};
	const walk = (v: any, part: string) => {
		if (typeof v === 'string') {
			for (const m of v.matchAll(/\{\{\s*([a-zA-Z][\w]*)\s*\}\}/g)) {
				out[m[1]] = out[m[1]] || {};
				out[m[1]][part] = (out[m[1]][part] || 0) + 1;
			}
		} else if (Array.isArray(v)) v.forEach(x => walk(x, part));
		else if (v && typeof v === 'object') Object.values(v).forEach(x => walk(x, part));
	};
	Object.entries(draft || {}).forEach(([part, v]) => part !== 'questions' && walk(v, part));
	return out;
};

const QuestionsTab: FC<TabProps<Question[]>> = ({ doc, meta, value, onChange }) => {
	const used = useMemo(() => usage(doc.draft), [doc.draft]);
	const builtins: string[] = meta?.builtinPlaceholders || ['project', 'slug', 'api'];
	const kinds: string[] = meta?.questionKinds || Object.keys(KIND_HELP);
	const keys = new Set(value.map(q => q.key));
	const unanswered = Object.keys(used).filter(k => !keys.has(k) && !builtins.includes(k));

	const set = (i: number, patch: Partial<Question>) => onChange(value.map((q, j) => (j === i ? { ...q, ...patch } : q)));
	const move = (i: number, by: number) => {
		const j = i + by;
		if (j < 0 || j >= value.length) return;
		const next = [...value];
		[next[i], next[j]] = [next[j], next[i]];
		onChange(next);
	};
	const add = (key = '') => onChange([...value, { key, label: '', help: '', kind: 'text', default: '', required: false }]);

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='questions'>
				What’s asked when someone starts a project from this template. Each answer replaces <code>{'{{key}}'}</code> wherever
				the template uses it — a field’s default, a page’s text, the site’s name. Ask only what changes from one project to
				the next; everything else belongs in the template itself. {builtins.map(b => `{{${b}}}`).join(', ')} are filled in
				for you and never asked.
			</Intro>

			{unanswered.length > 0 && (
				<Box
					px={4}
					py={3}
					borderRadius='md'
					bg='red.subtle'
					fontSize='sm'>
					<Text fontWeight='500'>
						The template uses {unanswered.map(k => `{{${k}}}`).join(', ')} but doesn’t ask for {unanswered.length === 1 ? 'it' : 'them'}.
					</Text>
					<Flex
						gap={2}
						mt={2}
						flexWrap='wrap'>
						{unanswered.map(k => (
							<Button
								key={k}
								size='2xs'
								variant='outline'
								onClick={() => add(k)}>
								<Plus size={11} />
								Ask for {k}
							</Button>
						))}
					</Flex>
				</Box>
			)}

			<Panel
				title={`Questions (${value.length})`}
				subtitle='In the order they’re asked.'
				actions={
					<Flex
						gap={3}
						align='center'>
						<GuideLink section='questions' />
						<Button
							size='2xs'
							variant='outline'
							onClick={() => add()}>
							<Plus size={12} />
							Add a question
						</Button>
					</Flex>
				}>
				{!value.length ? (
					<Text
						fontSize='sm'
						color='fg.muted'>
						No questions — a project made from this template is the same for everyone. Add one when something should be
						chosen per project, then use it as <code>{'{{key}}'}</code> in a field default, a page or the site settings.
					</Text>
				) : (
					<Flex
						direction='column'
						gap={4}>
						{value.map((q, i) => {
							const where = used[q.key] || {};
							return (
								<Box
									key={i}
									p={4}
									borderWidth='1px'
									borderColor='border'
									borderRadius='md'>
									<Grid
										templateColumns={{ base: '1fr', md: '160px minmax(0, 1fr) 180px' }}
										gap={3}>
										<Box>
											<Label hint='Used as {{key}}.'>Key</Label>
											<Input
												size='sm'
												fontFamily='mono'
												value={q.key}
												placeholder='currency'
												onChange={e => set(i, { key: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
											/>
										</Box>
										<Box>
											<Label hint='The question, as the person starting the project reads it.'>Question</Label>
											<Input
												size='sm'
												value={q.label}
												placeholder='Which currency do you work in?'
												onChange={e => set(i, { label: e.target.value, ...(!q.key && { key: toKey(e.target.value).slice(0, 40) }) })}
											/>
										</Box>
										<Box>
											<Label hint={KIND_HELP[q.kind] || ''}>Answer</Label>
											<Dropdown
												value={q.kind}
												onChange={kind => set(i, { kind })}>
												{kinds.map(k => (
													<option
														key={k}
														value={k}>
														{k}
													</option>
												))}
											</Dropdown>
										</Box>
										<Box gridColumn={{ md: 'span 2' }}>
											<Label hint='A line under the question: why it’s asked, or an example.'>Help</Label>
											<Input
												size='sm'
												value={q.help}
												onChange={e => set(i, { help: e.target.value })}
											/>
										</Box>
										<Box>
											<Label hint='Filled in to start with.'>Default</Label>
											<Input
												size='sm'
												value={q.default}
												onChange={e => set(i, { default: e.target.value })}
											/>
										</Box>
										{q.kind === 'select' && (
											<Box gridColumn={{ md: 'span 3' }}>
												<Label hint='The choices, comma-separated.'>Choices</Label>
												<Input
													size='sm'
													value={(q.options || []).map(o => o.value).join(', ')}
													placeholder='USD, EUR, GBP'
													onChange={e =>
														set(i, {
															options: e.target.value.split(',').map(v => ({ value: v.trimStart(), label: v.trim() })),
														})
													}
												/>
											</Box>
										)}
									</Grid>
									<Flex
										mt={3}
										align='center'
										gap={3}
										flexWrap='wrap'>
										<Switch.Root
											size='sm'
											checked={q.required}
											onCheckedChange={e => set(i, { required: e.checked })}>
											<Switch.HiddenInput />
											<Switch.Control>
												<Switch.Thumb />
											</Switch.Control>
											<Switch.Label fontSize='sm'>Must be answered</Switch.Label>
										</Switch.Root>
										<Flex
											gap={1}
											align='center'
											fontSize='xs'
											color='fg.muted'
											flexWrap='wrap'>
											{Object.keys(where).length ? (
												<>
													Used in
													{Object.entries(where).map(([part, n]) => (
														<Badge
															key={part}
															size='xs'
															variant='outline'>
															{PART_LABEL[part] || part}
															{n > 1 ? ` ×${n}` : ''}
														</Badge>
													))}
												</>
											) : q.key ? (
												<Text color='orange.fg'>Not used anywhere yet — put {`{{${q.key}}}`} where the answer belongs.</Text>
											) : null}
										</Flex>
										<Flex ml='auto'>
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
									</Flex>
								</Box>
							);
						})}
					</Flex>
				)}
			</Panel>
		</Flex>
	);
};

export default QuestionsTab;
