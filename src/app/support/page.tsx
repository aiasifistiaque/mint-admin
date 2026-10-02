'use client';

import { FC, FormEvent, useState } from 'react';
import NextLink from 'next/link';
import { Box, Button, Flex, Grid, Input, Link, Skeleton, Text, Textarea } from '@chakra-ui/react';
import { ChevronRight, CircleCheck, MessageSquare } from 'lucide-react';
import {
	FormInput,
	Layout,
	getFieldValue,
	getOnChangeHandler,
	useGetMyTicketsQuery,
	useOpenTicketMutation,
} from '@/components/library';
import { Dropdown, Panel } from '@/components/library/cl';
import { CATEGORIES, FieldLabel, PRIORITIES, StatusBadge, categoryLabel, day } from './_shared';

/**
 * Support: any signed-in admin asks the support team for help. Each ticket
 * gets a thread (/support/<id>) where the two sides reply until it's sorted;
 * the team works them from the Support Tickets table. Broken things that
 * need a fix go to Report issue instead.
 */

const NewTicket: FC = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('question');
	const [priority, setPriority] = useState('normal');
	const [formData, setFormData] = useState<any>({});
	const [, setChangedData] = useState({});
	const [open, { isLoading, error, reset }] = useOpenTicketMutation();
	const [sent, setSent] = useState<{ _id: string; code?: string } | null>(null);

	const images: string[] = Array.isArray(formData.images) ? formData.images : [];
	const canSend = name.trim().length > 0 && description.trim().length > 0 && !isLoading;

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!canSend) return;
		const res = await open({ name: name.trim(), description: description.trim(), category, priority, images });
		if ('data' in res && res.data) {
			setSent({ _id: res.data._id, code: res.data.code });
			setName('');
			setDescription('');
			setCategory('question');
			setPriority('normal');
			setFormData({});
		}
	};

	if (sent)
		return (
			<Panel>
				<Flex
					direction='column'
					align='center'
					textAlign='center'
					gap={2}
					py={6}>
					<Box color='green.fg'>
						<CircleCheck size={28} />
					</Box>
					<Text
						fontSize='md'
						fontWeight='600'>
						Ticket {sent.code || ''} is open
					</Text>
					<Text
						fontSize='sm'
						color='fg.muted'
						maxW='420px'>
						The support team will reply in its thread. You’ll get a notification when they do.
					</Text>
					<Flex
						gap={2}
						mt={3}
						wrap='wrap'
						justify='center'>
						<Button
							asChild
							size='sm'>
							<NextLink href={`/support/${sent._id}`}>Open the ticket</NextLink>
						</Button>
						<Button
							size='sm'
							variant='outline'
							onClick={() => {
								setSent(null);
								reset();
							}}>
							New ticket
						</Button>
					</Flex>
				</Flex>
			</Panel>
		);

	return (
		<Panel
			title='New ticket'
			subtitle='Questions, account or billing problems — anything you need a hand with.'>
			<Box
				as='form'
				onSubmit={onSubmit}>
				<Flex
					direction='column'
					gap={5}>
					<Box>
						<FieldLabel required>Subject</FieldLabel>
						<Input
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder='e.g. I can’t invite a new team member'
							maxLength={200}
						/>
					</Box>
					<Grid
						templateColumns={{ base: '1fr', sm: '1fr 1fr' }}
						gap={4}>
						<Box>
							<FieldLabel>Category</FieldLabel>
							<Dropdown
								value={category}
								onChange={setCategory}
								items={CATEGORIES}
							/>
						</Box>
						<Box>
							<FieldLabel>Priority</FieldLabel>
							<Dropdown
								value={priority}
								onChange={setPriority}
								items={PRIORITIES}
							/>
						</Box>
					</Grid>
					<Box>
						<FieldLabel
							required
							hint='What are you trying to do, and what happened?'>
							Message
						</FieldLabel>
						<Textarea
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder='The more detail, the quicker we can help.'
							rows={6}
							maxLength={5000}
						/>
					</Box>
					<Box>
						<FieldLabel hint='Screenshots help. Up to 10.'>Images</FieldLabel>
						<FormInput
							formData={formData}
							setFormData={setFormData}
							setChangedData={setChangedData}
							isRequired={false}
							name='images'
							label=''
							type='image-array'
							value={getFieldValue({ name: 'images', formData })}
							onChange={getOnChangeHandler({
								type: 'image-array',
								key: 'images',
								formData,
								setFormData,
								setChangedData,
							})}
							item={{}}
						/>
					</Box>
					{error && (
						<Text
							fontSize='sm'
							color='red.fg'>
							{(error as any)?.data?.message || 'It couldn’t be sent. Try again in a moment.'}
						</Text>
					)}
					<Flex justify='flex-end'>
						<Button
							w={{ base: 'full', sm: 'auto' }}
							type='submit'
							disabled={!canSend}
							loading={isLoading}
							loadingText='Opening'>
							Open ticket
						</Button>
					</Flex>
				</Flex>
			</Box>
		</Panel>
	);
};

const MyTickets: FC = () => {
	const { data, isLoading } = useGetMyTicketsQuery();
	const tickets = data?.doc || [];
	return (
		<Panel
			title='Your tickets'
			subtitle='Latest activity first.'
			flush>
			{isLoading ? (
				<Flex
					direction='column'
					gap={3}
					p={4}>
					<Skeleton h='52px' />
					<Skeleton h='52px' />
				</Flex>
			) : tickets.length === 0 ? (
				<Text
					fontSize='sm'
					color='fg.muted'
					p={4}>
					You haven’t opened any tickets yet.
				</Text>
			) : (
				<Flex direction='column'>
					{tickets.map((t, i) => (
						<NextLink
							key={t._id}
							href={`/support/${t._id}`}>
							<Flex
								align='center'
								gap={3}
								px={4}
								py={3}
								// The panel's header already rules off the first one.
								borderTopWidth={i ? '1px' : 0}
								borderColor='border.muted'
								transition='background .12s ease'
								_hover={{ bg: 'bg.muted' }}>
								<Box
									flex={1}
									minW={0}>
									<Flex
										align='center'
										justify='space-between'
										gap={2}
										mb={1}>
										<Text
											fontSize='12px'
											color='fg.muted'
											fontFamily='mono'
											whiteSpace='nowrap'>
											{t.code || '—'}
										</Text>
										<StatusBadge status={t.status} />
									</Flex>
									<Text
										fontSize='sm'
										fontWeight='600'
										lineClamp={2}>
										{t.name}
									</Text>
									<Flex
										align='center'
										gap={3}
										mt={1}
										color='fg.muted'>
										<Text fontSize='11px'>{categoryLabel(t.category)}</Text>
										<Text fontSize='11px'>{day(t.lastReplyAt || t.createdAt)}</Text>
										{!!t.replyCount && (
											<Flex
												align='center'
												gap={1}>
												<MessageSquare size={12} />
												<Text fontSize='11px'>{t.replyCount}</Text>
											</Flex>
										)}
									</Flex>
								</Box>
								<Box
									color='fg.subtle'
									flexShrink={0}>
									<ChevronRight size={16} />
								</Box>
							</Flex>
						</NextLink>
					))}
				</Flex>
			)}
		</Panel>
	);
};

const SupportPage = () => (
	<Layout
		title='Support'
		path='support'>
		<Flex
			direction='column'
			gap={2}
			pt={{ base: 2, md: 4 }}
			pb={10}>
			<Text
				as='h1'
				fontSize='xl'
				fontWeight='600'
				letterSpacing='-0.01em'>
				Support
			</Text>
			<Text
				fontSize='sm'
				color='fg.muted'
				mb={4}>
				Open a ticket and the support team will reply here. Something broken that needs fixing?{' '}
				<Link asChild>
					<NextLink href='/report-issue'>Report an issue</NextLink>
				</Link>
				. Looking for how-tos? See the{' '}
				<Link asChild>
					<NextLink href='/docs'>docs</NextLink>
				</Link>
				.
			</Text>
			<Grid
				templateColumns={{ base: '1fr', lg: 'minmax(0, 3fr) minmax(0, 2fr)' }}
				gap={5}
				alignItems='start'>
				<NewTicket />
				<MyTickets />
			</Grid>
		</Flex>
	</Layout>
);

export default SupportPage;
