'use client';

import { FC, useMemo } from 'react';
import { Box, Button, Checkbox, Flex, Grid, IconButton, Input, Text } from '@chakra-ui/react';
import { Plus, Trash2 } from 'lucide-react';
import { Dropdown, Panel } from '@/components/library/cl';
import { PAYLOAD_EXAMPLE } from '@/app/webhooks/_components/verify';
import { GuideLink, Intro, Label } from '../../_components/ui';
import { templateModels } from './models';
import type { TabProps } from './types';

/**
 * The Webhooks tab (API templates): which models' changes the new project
 * sends to the tenant's own server, on which events, and to what address —
 * usually a question's answer (`{{orders_webhook_url}}`), since every tenant's
 * server is different. Without an address the webhook is made switched off for
 * the project to fill in. Deliveries are signed (x-mint-signature).
 */

export type WebhookSpec = { model: string; events: string[]; url: string; note: string };

const EVENTS = [
	{ value: 'create', label: 'Created' },
	{ value: 'update', label: 'Changed' },
	{ value: 'delete', label: 'Deleted' },
];

const WebhooksTab: FC<TabProps<WebhookSpec[]>> = ({ doc, value, onChange }) => {
	const models = useMemo(() => templateModels(doc), [doc]);
	const urlQuestions: { key: string; label: string }[] = (doc.draft?.questions || []).filter((q: any) => q.kind === 'url' && q.key);
	const issues = [...(doc.validation?.errors || []), ...(doc.validation?.warnings || [])].filter((i: any) => i.part === 'webhooks');
	const set = (i: number, patch: Partial<WebhookSpec>) => onChange(value.map((w, j) => (j === i ? { ...w, ...patch } : w)));

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='webhooks'>
				Calls the new project makes to the tenant’s own server when records change — a new booking tells their front-desk
				system, a paid order tells the warehouse. Every tenant’s server is different, so the address is usually a question asked
				when the template is used: add a question of kind “A web address” on the Questions tab and pick it here. Without an address
				the webhook is made switched off, for the project to fill in. Each delivery is signed so their server can tell it’s real.
			</Intro>

			<Grid
				templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 340px' }}
				gap={4}
				alignItems='start'>
				<Flex
					direction='column'
					gap={4}
					minW={0}>
					{value.map((w, i) => {
						const mine = issues.filter((x: any) => x.path.startsWith(`webhooks[${i}]`));
						const asked = urlQuestions.find(q => w.url.trim() === `{{${q.key}}}`);
						return (
							<Panel
								key={i}
								title={`${models.find(m => m.name === w.model)?.title || w.model || 'Webhook'} → ${asked ? asked.label : w.url || 'no address yet'}`}
								actions={
									<IconButton
										aria-label='Remove the webhook'
										size='xs'
										variant='ghost'
										onClick={() => onChange(value.filter((_, j) => j !== i))}>
										<Trash2 size={13} />
									</IconButton>
								}>
								<Flex
									direction='column'
									gap={4}>
									<Grid
										templateColumns={{ base: '1fr', md: '1fr 1fr' }}
										gap={4}>
										<Box>
											<Label
												required
												hint='Its records are what’s sent.'>
												Model
											</Label>
											<Dropdown
												size='sm'
												value={w.model}
												placeholder='Pick a model'
												onChange={model => set(i, { model })}
												items={models.map(m => ({ value: m.name, label: m.title }))}
											/>
										</Box>
										<Box>
											<Label
												required
												hint='One request per change.'>
												Send when a record is
											</Label>
											<Flex
												gap={4}
												pt={1.5}>
												{EVENTS.map(ev => (
													<Checkbox.Root
														key={ev.value}
														size='sm'
														checked={w.events.includes(ev.value)}
														onCheckedChange={x => set(i, { events: EVENTS.map(y => y.value).filter(v => (v === ev.value ? !!x.checked : w.events.includes(v))) })}>
														<Checkbox.HiddenInput />
														<Checkbox.Control />
														<Checkbox.Label fontSize='12.5px'>{ev.label}</Checkbox.Label>
													</Checkbox.Root>
												))}
											</Flex>
										</Box>
									</Grid>
									<Box>
										<Label hint='Usually the answer to a question; a fixed address only when every tenant sends to the same place.'>Address</Label>
										<Flex
											gap={2}
											wrap='wrap'>
											{urlQuestions.length > 0 && (
												<Box w='260px'>
													<Dropdown
														size='sm'
														value={asked?.key || ''}
														placeholder='The answer to…'
														onChange={key => set(i, { url: key ? `{{${key}}}` : '' })}
														items={urlQuestions.map(q => ({ value: q.key, label: q.label || q.key }))}
													/>
												</Box>
											)}
											<Input
												size='sm'
												flex={1}
												minW='220px'
												fontFamily='mono'
												value={w.url}
												placeholder='{{orders_webhook_url}} or https://…'
												onChange={x => set(i, { url: x.target.value })}
											/>
										</Flex>
										{!urlQuestions.length && (
											<Text
												fontSize='12px'
												color='fg.muted'
												mt={1.5}>
												No question asks for an address yet — add one of kind “A web address” on the Questions tab (key e.g.{' '}
												<code>orders_webhook_url</code>), save, and pick it here.
											</Text>
										)}
									</Box>
									<Box>
										<Label hint='What their server does with it — shown on the project’s Webhooks page.'>Note</Label>
										<Input
											size='sm'
											value={w.note}
											maxLength={300}
											placeholder='Tells the front desk about the booking'
											onChange={x => set(i, { note: x.target.value })}
										/>
									</Box>
									{mine.map((x: any, k: number) => (
										<Text
											key={k}
											fontSize='12px'
											color={x.severity === 'error' ? 'red.fg' : 'orange.fg'}>
											{x.message} {x.fix}
										</Text>
									))}
								</Flex>
							</Panel>
						);
					})}
					<Flex
						gap={3}
						align='center'>
						<Button
							size='sm'
							variant='outline'
							disabled={!models.length}
							onClick={() => onChange([...value, { model: models[0]?.name || '', events: ['create'], url: urlQuestions[0] ? `{{${urlQuestions[0].key}}}` : '', note: '' }])}>
							<Plus size={14} />
							Add a webhook
						</Button>
						<GuideLink section='webhooks' />
					</Flex>
					{!models.length && (
						<Text
							fontSize='13px'
							color='fg.muted'>
							Add and save models first — webhooks send their records.
						</Text>
					)}
				</Flex>

				<Panel
					title='What their server receives'
					subtitle='A POST per change, signed with the webhook’s secret'>
					<Text
						fontSize='12px'
						color='fg.muted'
						mb={2}>
						Headers <code>x-mint-event</code>, <code>x-mint-delivery</code>, <code>x-mint-timestamp</code> and{' '}
						<code>x-mint-signature</code> (HMAC-SHA256). No 2xx back, and it’s tried 3 more times. The project’s Webhooks page shows
						the secret, a test button and every delivery.
					</Text>
					<Box
						as='pre'
						m={0}
						p={2.5}
						fontSize='11.5px'
						fontFamily='mono'
						bg='bg.subtle'
						borderWidth='1px'
						borderColor='border.muted'
						borderRadius='md'
						whiteSpace='pre-wrap'
						wordBreak='break-all'>
						{PAYLOAD_EXAMPLE}
					</Box>
				</Panel>
			</Grid>
		</Flex>
	);
};

export default WebhooksTab;
