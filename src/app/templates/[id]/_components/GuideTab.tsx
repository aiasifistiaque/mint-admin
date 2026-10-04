'use client';

import { FC } from 'react';
import { Box, Button, Flex, Grid, IconButton, Input, Text, Textarea } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, Circle, Plus, Trash2 } from 'lucide-react';
import { Dropdown, Panel } from '@/components/library/cl';
import { GuideLink, Intro, Label } from '../../_components/ui';
import type { TabProps } from './types';

/**
 * The Setup guide tab: the checklist a project made from the template opens
 * with — what to do first and why, each step opening the page it's about —
 * and a few questions people will ask. Publishing needs at least one step.
 */

export type Guide = { steps: { title: string; body: string; page: string }[]; faq: { q: string; a: string }[] };

/** Panel pages a step can open besides the template's own models. */
const PANEL_PAGES: Record<string, { value: string; label: string }[]> = {
	app: [
		{ value: '/settings', label: 'Project settings' },
		{ value: '/public-api', label: 'Public API' },
	],
	api: [
		{ value: '/public-api', label: 'Public API' },
		{ value: '/settings', label: 'Project settings' },
	],
	website: [
		{ value: '/site-setup', label: 'Site setup' },
		{ value: '/public-api', label: 'Public API' },
		{ value: '/settings', label: 'Project settings' },
	],
};

const GuideTab: FC<TabProps<Guide>> = ({ doc, value, onChange }) => {
	const models: { name: string; title: string }[] = doc.whatsInside?.models || [];
	const pages = PANEL_PAGES[doc.type] || PANEL_PAGES.app;
	const known = new Set([...models.map(m => m.name), ...pages.map(p => p.value)]);
	const setStep = (i: number, patch: any) => onChange({ ...value, steps: value.steps.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
	const setFaq = (i: number, patch: any) => onChange({ ...value, faq: value.faq.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
	const move = (i: number, by: number) => {
		const j = i + by;
		if (j < 0 || j >= value.steps.length) return;
		const steps = [...value.steps];
		[steps[i], steps[j]] = [steps[j], steps[i]];
		onChange({ ...value, steps });
	};

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='setup-guide'>
				The checklist a new project opens with: the first things to do, in order, each with a line on how and why and a button
				to the page it’s about. Write steps as actions — “Add your accounts”, “Invite your team”. Publishing needs at least
				one step. The questions below appear under the checklist.
			</Intro>

			<Grid
				templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 320px' }}
				gap={4}
				alignItems='start'>
				<Flex
					direction='column'
					gap={4}
					minW={0}>
					<Panel
						title={`Steps (${value.steps.length})`}
						actions={
							<Flex
								gap={3}
								align='center'>
								<GuideLink section='setup-guide' />
								<Button
									size='2xs'
									variant='outline'
									onClick={() => onChange({ ...value, steps: [...value.steps, { title: '', body: '', page: '' }] })}>
									<Plus size={12} />
									Add a step
								</Button>
							</Flex>
						}>
						{!value.steps.length ? (
							<Text
								fontSize='sm'
								color='fg.muted'>
								No steps yet. Start with what someone does first in a new project — usually adding the records everything
								else hangs off.
							</Text>
						) : (
							<Flex
								direction='column'
								gap={3}>
								{value.steps.map((s, i) => (
									<Box
										key={i}
										p={4}
										borderWidth='1px'
										borderColor='border'
										borderRadius='md'>
										<Grid
											templateColumns={{ base: '1fr', md: 'minmax(0, 1fr) 220px' }}
											gap={3}>
											<Box>
												<Label hint='An action, e.g. “Add your first client”.'>
													{i + 1}. Step
												</Label>
												<Input
													size='sm'
													value={s.title}
													maxLength={120}
													onChange={e => setStep(i, { title: e.target.value })}
												/>
											</Box>
											<Box>
												<Label hint='Its button opens this page.'>Opens</Label>
												<Dropdown
													value={known.has(s.page) || !s.page ? s.page : '__other'}
													onChange={v => setStep(i, { page: v === '__other' ? s.page || '/' : v })}>
													<option value=''>No page</option>
													<optgroup label='This template’s models'>
														{models.map(m => (
															<option
																key={m.name}
																value={m.name}>
																{m.title || m.name}
															</option>
														))}
													</optgroup>
													<optgroup label='Project pages'>
														{pages.map(p => (
															<option
																key={p.value}
																value={p.value}>
																{p.label}
															</option>
														))}
													</optgroup>
													<option value='__other'>Another page (type its path)</option>
												</Dropdown>
												{s.page && !known.has(s.page) && (
													<Input
														size='sm'
														mt={2}
														fontFamily='mono'
														value={s.page}
														onChange={e => setStep(i, { page: e.target.value })}
													/>
												)}
											</Box>
											<Box gridColumn={{ md: 'span 2' }}>
												<Label hint='How, and why it matters — two or three sentences.'>Explanation</Label>
												<Textarea
													size='sm'
													rows={2}
													value={s.body}
													maxLength={2000}
													onChange={e => setStep(i, { body: e.target.value })}
												/>
											</Box>
										</Grid>
										<Flex
											justify='flex-end'
											mt={2}>
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
												disabled={i === value.steps.length - 1}
												onClick={() => move(i, 1)}>
												<ArrowDown size={13} />
											</IconButton>
											<IconButton
												aria-label='Remove'
												size='xs'
												variant='ghost'
												onClick={() => onChange({ ...value, steps: value.steps.filter((_, j) => j !== i) })}>
												<Trash2 size={13} />
											</IconButton>
										</Flex>
									</Box>
								))}
							</Flex>
						)}
					</Panel>

					<Panel
						title={`Questions people ask (${value.faq.length})`}
						subtitle='Short answers to what someone new to the template will wonder.'
						actions={
							<Button
								size='2xs'
								variant='outline'
								onClick={() => onChange({ ...value, faq: [...value.faq, { q: '', a: '' }] })}>
								<Plus size={12} />
								Add a question
							</Button>
						}>
						<Flex
							direction='column'
							gap={3}>
							{!value.faq.length && (
								<Text
									fontSize='sm'
									color='fg.muted'>
									None yet — e.g. “Can I add more currencies?”
								</Text>
							)}
							{value.faq.map((f, i) => (
								<Flex
									key={i}
									gap={2}
									align='flex-start'>
									<Flex
										direction='column'
										gap={2}
										flex='1'>
										<Input
											size='sm'
											value={f.q}
											placeholder='The question'
											onChange={e => setFaq(i, { q: e.target.value })}
										/>
										<Textarea
											size='sm'
											rows={2}
											value={f.a}
											placeholder='The answer'
											onChange={e => setFaq(i, { a: e.target.value })}
										/>
									</Flex>
									<IconButton
										aria-label='Remove'
										size='xs'
										variant='ghost'
										onClick={() => onChange({ ...value, faq: value.faq.filter((_, j) => j !== i) })}>
										<Trash2 size={13} />
									</IconButton>
								</Flex>
							))}
						</Flex>
					</Panel>
				</Flex>

				<Panel
					title='As tenants see it'
					subtitle='On the new project’s home page.'>
					<Flex
						direction='column'
						gap={3}>
						<Text
							fontSize='sm'
							fontWeight='600'>
							Get started with {doc.name}
						</Text>
						{value.steps.filter(s => s.title.trim()).map((s, i) => (
							<Flex
								key={i}
								gap={2}
								align='flex-start'>
								<Box
									mt={0.5}
									color='fg.subtle'>
									<Circle size={14} />
								</Box>
								<Box minW={0}>
									<Text
										fontSize='sm'
										fontWeight='500'>
										{s.title}
									</Text>
									{s.body && (
										<Text
											fontSize='xs'
											color='fg.muted'>
											{s.body}
										</Text>
									)}
									{s.page && (
										<Text
											fontSize='xs'
											color='fg'
											textDecoration='underline'
											mt={0.5}>
											Open {models.find(m => m.name === s.page)?.title || pages.find(p => p.value === s.page)?.label || s.page}
										</Text>
									)}
								</Box>
							</Flex>
						))}
						{value.faq.some(f => f.q.trim()) && (
							<Box
								pt={2}
								borderTopWidth='1px'
								borderColor='border.muted'>
								{value.faq
									.filter(f => f.q.trim())
									.map((f, i) => (
										<Box
											key={i}
											mb={2}>
											<Text
												fontSize='xs'
												fontWeight='600'>
												{f.q}
											</Text>
											<Text
												fontSize='xs'
												color='fg.muted'>
												{f.a}
											</Text>
										</Box>
									))}
							</Box>
						)}
					</Flex>
				</Panel>
			</Grid>
		</Flex>
	);
};

export default GuideTab;
