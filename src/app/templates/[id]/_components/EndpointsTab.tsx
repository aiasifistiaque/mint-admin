'use client';

import { FC, useMemo, useState } from 'react';
import { Badge, Box, Button, Checkbox, Flex, Input, Switch, Text } from '@chakra-ui/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Dropdown, Panel } from '@/components/library/cl';
import { BACKEND } from '@/components/library/config/lib/constants/panel';
import ExampleRequest from '@/app/public-api/_components/ExampleRequest';
import { ApiModel, endpointsOf } from '@/app/public-api/_components/api';
import { Intro, Label } from '../../_components/ui';
import { TemplateModel, templateModels } from './models';
import type { TabProps } from './types';

/**
 * The Public API tab: which of the template's models the new project opens to
 * the tenant's own site or app, with which actions, for whom, and a note the
 * project's API reference shows. Each model's endpoints come with example
 * requests (curl and fetch) — the same as the project's reference shows.
 */

export type EndpointSpec = { model: string; actions: string[]; auth: 'none' | 'customer'; ownerOnly: boolean; note: string };

const ACTIONS = [
	{ value: 'list', label: 'List', method: 'GET /<route>' },
	{ value: 'get', label: 'Read one', method: 'GET /<route>/:id' },
	{ value: 'create', label: 'Create', method: 'POST /<route>' },
	{ value: 'update', label: 'Update', method: 'PUT /<route>/:id' },
	{ value: 'delete', label: 'Delete', method: 'DELETE /<route>/:id' },
];

/** Where a project's public API lives; the project's own address goes at the end. */
const BASE = `${BACKEND.replace(/\/(admin|tenant)\/api\/?$/, '')}/public/api/<project>`;

/** The template's model as the API reference sees it, for the examples. */
const asApiModel = (m: TemplateModel, e: EndpointSpec): ApiModel => ({
	route: m.route || m.name.toLowerCase(),
	title: m.title,
	actions: e.actions,
	auth: e.auth,
	ownerOnly: e.ownerOnly,
	fields: m.fields
		.filter((f: any) => f.key && f.kind !== 'section' && f.kind !== 'sectionlist')
		.map((f: any) => ({ key: f.key, label: f.label || f.key, kind: f.kind, required: !!f.required, options: (f.options || []).map((o: any) => o?.value ?? o) })),
});

const Examples: FC<{ m: TemplateModel; e: EndpointSpec }> = ({ m, e }) => {
	const [open, setOpen] = useState(false);
	const endpoints = endpointsOf(asApiModel(m, e));
	return (
		<Box mt={3}>
			<Button
				size='xs'
				variant='ghost'
				px={1}
				onClick={() => setOpen(o => !o)}>
				{open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
				Example requests ({endpoints.length})
			</Button>
			{open && (
				<Flex
					direction='column'
					gap={3}
					mt={2}>
					{endpoints.map(ep => (
						<Box key={`${ep.method} ${ep.path}`}>
							<Text
								fontSize='12px'
								fontWeight='600'
								mb={1}>
								{ep.summary}
							</Text>
							<ExampleRequest
								base={BASE}
								e={ep}
							/>
						</Box>
					))}
				</Flex>
			)}
		</Box>
	);
};

const EndpointsTab: FC<TabProps<EndpointSpec[]>> = ({ doc, value, onChange }) => {
	const models = useMemo(() => templateModels(doc), [doc]);
	const issues = [...(doc.validation?.errors || []), ...(doc.validation?.warnings || [])].filter((i: any) => i.part === 'endpoints');
	const find = (name: string) => value.findIndex(e => e.model === name);
	const set = (name: string, patch: Partial<EndpointSpec> | null) => {
		const i = find(name);
		if (patch === null) return onChange(value.filter((_, j) => j !== i));
		if (i < 0) return onChange([...value, { model: name, actions: ['list', 'get'], auth: 'none', ownerOnly: false, note: '', ...patch }]);
		onChange(value.map((e, j) => (j === i ? { ...e, ...patch } : e)));
	};
	const orphans = value.filter(e => !models.some(m => m.name === e.model));

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='endpoints'>
				Which of the template’s models the new project opens to the tenant’s own site or app — a booking form that creates
				bookings, an app that lists products — and who may call them: anyone, or customers who signed in to the project. The note
				says what each is for; the project’s API reference shows it. Everything else stays private to the panel.
			</Intro>

			<Panel
				title='Models'
				subtitle={`${value.length} of ${models.length} public`}
				flush>
				{models.map(m => {
					const i = find(m.name);
					const e = value[i];
					const mine = issues.filter((x: any) => x.path.startsWith(`endpoints[${i}]`));
					return (
						<Box
							key={m.name}
							px={4}
							py={3.5}
							borderTopWidth='1px'
							borderColor='border.muted'
							_first={{ borderTopWidth: 0 }}>
							<Flex
								align='center'
								gap={3}>
								<Box
									flex={1}
									minW={0}>
									<Flex
										align='center'
										gap={2}>
										<Text
											fontSize='13.5px'
											fontWeight='600'>
											{m.title}
										</Text>
										{e && (
											<Badge
												size='sm'
												colorPalette={e.auth === 'customer' ? 'blue' : 'green'}>
												{e.auth === 'customer' ? (e.ownerOnly ? 'Customers · own records' : 'Customers') : 'Anyone'}
											</Badge>
										)}
									</Flex>
									<Text
										fontSize='12px'
										color='fg.muted'
										fontFamily='mono'>
										/{m.route || m.name.toLowerCase()}
										{e ? '' : ' — not public'}
									</Text>
								</Box>
								<Switch.Root
									size='sm'
									checked={!!e}
									onCheckedChange={x => set(m.name, x.checked ? {} : null)}>
									<Switch.HiddenInput aria-label={`Public API for ${m.title}`} />
									<Switch.Control />
									<Switch.Label fontSize='12.5px'>Public</Switch.Label>
								</Switch.Root>
							</Flex>

							{e && (
								<>
									<Flex
										mt={3}
										gap={4}
										wrap='wrap'
										align='center'>
										<Flex
											gap={3}
											wrap='wrap'>
											{ACTIONS.map(a => (
												<Checkbox.Root
													key={a.value}
													size='sm'
													title={a.method}
													checked={e.actions.includes(a.value)}
													onCheckedChange={x =>
														set(m.name, { actions: ACTIONS.map(y => y.value).filter(v => (v === a.value ? !!x.checked : e.actions.includes(v))) })
													}>
													<Checkbox.HiddenInput />
													<Checkbox.Control />
													<Checkbox.Label fontSize='12.5px'>{a.label}</Checkbox.Label>
												</Checkbox.Root>
											))}
										</Flex>
										<Box w='230px'>
											<Dropdown
												size='sm'
												value={e.auth === 'customer' ? (e.ownerOnly ? 'own' : 'customer') : 'none'}
												onChange={v => set(m.name, { auth: v === 'none' ? 'none' : 'customer', ownerOnly: v === 'own' })}
												items={[
													{ value: 'none', label: 'Anyone' },
													{ value: 'customer', label: 'Signed-in customers' },
													{ value: 'own', label: 'Customers — own records only' },
												]}
											/>
										</Box>
									</Flex>
									<Box mt={3}>
										<Label hint='What the site or app uses it for — shown in the project’s API reference.'>Note</Label>
										<Input
											size='sm'
											value={e.note}
											maxLength={300}
											placeholder='The booking form on the website creates these'
											onChange={x => set(m.name, { note: x.target.value })}
										/>
									</Box>
									{mine.map((x: any, k: number) => (
										<Text
											key={k}
											fontSize='12px'
											mt={1.5}
											color={x.severity === 'error' ? 'red.fg' : 'orange.fg'}>
											{x.message} {x.fix}
										</Text>
									))}
									<Examples
										m={m}
										e={e}
									/>
								</>
							)}
						</Box>
					);
				})}
				{!models.length && (
					<Text
						px={4}
						py={3}
						fontSize='13px'
						color='fg.muted'>
						Add and save models first — endpoints open them.
					</Text>
				)}
				{orphans.length > 0 && (
					<Flex
						px={4}
						py={3}
						gap={2}
						align='center'
						borderTopWidth='1px'
						borderColor='border.muted'>
						<Text
							fontSize='12.5px'
							color='red.fg'
							flex={1}>
							Endpoints for models the template doesn’t have: {orphans.map(o => o.model).join(', ')}.
						</Text>
						<Button
							size='xs'
							variant='outline'
							onClick={() => onChange(value.filter(e => models.some(m => m.name === e.model)))}>
							Remove them
						</Button>
					</Flex>
				)}
			</Panel>
		</Flex>
	);
};

export default EndpointsTab;
