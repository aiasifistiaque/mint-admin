'use client';

import { FC, FormEvent, useState } from 'react';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import { Badge, Box, Button, Center, Flex, Grid, Image, Skeleton, Text, Textarea } from '@chakra-ui/react';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import {
	FormInput,
	FullScreenImage,
	Layout,
	getFieldValue,
	getOnChangeHandler,
	useGetTicketThreadQuery,
	useReplyToTicketMutation,
	useSetTicketStatusMutation,
	type TicketStatus,
} from '@/components/library';
import { Dropdown, Panel } from '@/components/library/cl';
import { STAFF_STATUS_LABEL, StatusBadge, categoryLabel, dayTime } from '../_shared';

/**
 * One support ticket's thread: the request, then every reply, then a box to
 * answer. The person who opened it and the support team (edit-support-tickets)
 * both land here — the requester can close or reopen it, the team can set
 * any status.
 */

const initialsOf = (name?: string) =>
	(name || '?')
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map(p => p[0])
		.join('')
		.toUpperCase();

type MessageProps = {
	name?: string;
	at?: string;
	message: string;
	images?: string[];
	staff?: boolean;
	first?: boolean;
};

const Message: FC<MessageProps> = ({ name, at, message, images, staff, first }) => (
	<Flex
		gap={3}
		px={{ base: 4, md: 5 }}
		py={4}
		borderTopWidth={first ? 0 : '1px'}
		borderColor='border.muted'
		// The team's replies sit on a tint, so the conversation reads at a glance.
		bg={staff ? 'bg.subtle' : undefined}>
		<Center
			flexShrink={0}
			boxSize='32px'
			borderRadius='full'
			bg={staff ? 'gray.solid' : 'bg.muted'}
			color={staff ? 'gray.contrast' : 'fg.muted'}
			fontSize='11px'
			fontWeight='600'>
			{initialsOf(name)}
		</Center>
		<Box
			flex={1}
			minW={0}>
			<Flex
				align='center'
				gap={2}
				wrap='wrap'
				mb={1}>
				<Text
					fontSize='13px'
					fontWeight='600'>
					{name || 'Someone'}
				</Text>
				{staff && (
					<Badge
						size='xs'
						variant='outline'>
						Support team
					</Badge>
				)}
				<Text
					fontSize='12px'
					color='fg.muted'>
					{dayTime(at)}
				</Text>
			</Flex>
			<Text
				fontSize='sm'
				whiteSpace='pre-wrap'
				overflowWrap='anywhere'>
				{message}
			</Text>
			{!!images?.length && (
				<Grid
					templateColumns='repeat(auto-fill, minmax(88px, 1fr))'
					gap={2}
					mt={3}
					maxW='460px'>
					{images.map(src => (
						<FullScreenImage
							key={src}
							src={src}>
							<Image
								src={src}
								alt=''
								w='full'
								aspectRatio={1}
								objectFit='cover'
								borderRadius='md'
								borderWidth='1px'
								borderColor='border.muted'
								bg='bg.muted'
							/>
						</FullScreenImage>
					))}
				</Grid>
			)}
		</Box>
	</Flex>
);

const Reply: FC<{ id: string; disabled?: boolean }> = ({ id, disabled }) => {
	const [message, setMessage] = useState('');
	const [formData, setFormData] = useState<any>({});
	const [, setChangedData] = useState({});
	const [reply, { isLoading, error }] = useReplyToTicketMutation();
	// The uploader is a big drop zone; most replies are text, so it waits for a click.
	const [attach, setAttach] = useState(false);
	const images: string[] = Array.isArray(formData.images) ? formData.images : [];
	const canSend = !!message.trim() && !isLoading && !disabled;

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!canSend) return;
		const res = await reply({ id, message: message.trim(), images });
		if ('data' in res) {
			setMessage('');
			setFormData({});
			setAttach(false);
		}
	};

	return (
		<Box
			as='form'
			onSubmit={onSubmit}
			px={{ base: 4, md: 5 }}
			py={4}
			borderTopWidth='1px'
			borderColor='border.muted'>
			<Textarea
				value={message}
				onChange={e => setMessage(e.target.value)}
				placeholder='Write a reply…'
				rows={4}
				maxLength={5000}
				disabled={disabled}
			/>
			{attach && (
				<Box mt={3}>
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
			)}
			{error && (
				<Text
					mt={2}
					fontSize='sm'
					color='red.fg'>
					{(error as any)?.data?.message || 'The reply couldn’t be sent. Try again in a moment.'}
				</Text>
			)}
			<Flex
				justify='space-between'
				align='center'
				gap={2}
				mt={3}>
				<Button
					size='sm'
					variant='ghost'
					color='fg.muted'
					disabled={disabled}
					onClick={() => setAttach(a => !a)}>
					<ImagePlus size={15} />
					{attach ? 'Hide images' : images.length ? `Images (${images.length})` : 'Add images'}
				</Button>
				<Button
					type='submit'
					disabled={!canSend}
					loading={isLoading}
					loadingText='Sending'>
					Send reply
				</Button>
			</Flex>
		</Box>
	);
};

const STAFF_STATUSES = (Object.keys(STAFF_STATUS_LABEL) as TicketStatus[]).map(value => ({
	value,
	label: STAFF_STATUS_LABEL[value],
}));

const TicketPage = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, isError, error } = useGetTicketThreadQuery(id, { skip: !id });
	const [setStatus, statusResult] = useSetTicketStatusMutation();

	const ticket = data?.doc;
	const viewer = data?.viewer;
	// The team working someone else's ticket, rather than a requester on their own.
	const asStaff = !!viewer?.staff && !viewer?.owner;
	const closed = ticket?.status === 'closed';

	const back = asStaff ? { href: '/support-tickets', label: 'Support tickets' } : { href: '/support', label: 'Support' };

	return (
		<Layout
			title='Support'
			path={asStaff ? 'support-tickets' : 'support'}>
			<Flex
				direction='column'
				gap={4}
				pt={{ base: 2, md: 4 }}
				pb={10}
				maxW='860px'>
				<NextLink href={back.href}>
					<Flex
						align='center'
						gap={1.5}
						fontSize='13px'
						color='fg.muted'
						_hover={{ color: 'fg' }}
						w='fit-content'>
						<ArrowLeft size={14} />
						<Text fontSize='13px'>{back.label}</Text>
					</Flex>
				</NextLink>

				{isLoading ? (
					<Flex
						direction='column'
						gap={3}>
						<Skeleton h='28px' w='60%' />
						<Skeleton h='160px' />
					</Flex>
				) : isError || !ticket ? (
					<Panel>
						<Text fontSize='sm'>
							{(error as any)?.status === 404
								? 'This ticket doesn’t exist, or it isn’t yours to see.'
								: 'The ticket couldn’t be loaded. Try again in a moment.'}
						</Text>
					</Panel>
				) : (
					<>
						<Flex
							direction={{ base: 'column', md: 'row' }}
							align={{ base: 'stretch', md: 'flex-start' }}
							justify='space-between'
							gap={3}>
							<Box minW={0}>
								<Flex
									align='center'
									gap={2}
									mb={1}>
									<Text
										fontSize='12px'
										color='fg.muted'
										fontFamily='mono'>
										{ticket.code}
									</Text>
									<StatusBadge
										status={ticket.status}
										staff={asStaff}
									/>
								</Flex>
								<Text
									as='h1'
									fontSize='xl'
									fontWeight='600'
									letterSpacing='-0.01em'
									overflowWrap='anywhere'>
									{ticket.name}
								</Text>
								<Text
									fontSize='12px'
									color='fg.muted'
									mt={1}>
									{[
										categoryLabel(ticket.category),
										asStaff && ticket.priority && `${ticket.priority} priority`,
										ticket.assignedTo?.name && `Assigned to ${ticket.assignedTo.name}`,
									]
										.filter(Boolean)
										.join(' · ')}
								</Text>
							</Box>
							{asStaff ? (
								<Box
									w={{ base: 'full', md: '220px' }}
									flexShrink={0}>
									<Dropdown
										aria-label='Ticket status'
										value={ticket.status}
										onChange={v => setStatus({ id, status: v as TicketStatus })}
										items={STAFF_STATUSES}
										disabled={statusResult.isLoading}
									/>
								</Box>
							) : (
								<Button
									size='sm'
									variant='outline'
									flexShrink={0}
									loading={statusResult.isLoading}
									onClick={() => setStatus({ id, status: closed ? 'open' : 'closed' })}>
									{closed ? 'Reopen ticket' : 'Close ticket'}
								</Button>
							)}
						</Flex>

						<Panel flush>
							<Message
								first
								name={ticket.addedBy?.name}
								at={ticket.createdAt}
								message={ticket.description}
								images={ticket.images}
							/>
							{(ticket.replies || []).map(r => (
								<Message
									key={r._id}
									name={r.author?.name}
									at={r.createdAt}
									message={r.message}
									images={r.images}
									staff={r.staff}
								/>
							))}
							{closed && !asStaff ? (
								<Box
									px={{ base: 4, md: 5 }}
									py={4}
									borderTopWidth='1px'
									borderColor='border.muted'>
									<Text
										fontSize='sm'
										color='fg.muted'>
										This ticket is closed. Reopen it to reply.
									</Text>
								</Box>
							) : (
								<Reply id={id} />
							)}
						</Panel>
					</>
				)}
			</Flex>
		</Layout>
	);
};

export default TicketPage;
