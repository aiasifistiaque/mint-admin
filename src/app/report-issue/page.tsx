'use client';

import { FC, FormEvent, useState } from 'react';
import NextLink from 'next/link';
import { Badge, Box, Button, Flex, Grid, Image, Input, Link, Skeleton, Text, Textarea } from '@chakra-ui/react';
import { CircleCheck, ImageIcon } from 'lucide-react';
import {
	FormInput,
	Layout,
	getFieldValue,
	getOnChangeHandler,
	useGetMyReportedIssuesQuery,
	useReportIssueMutation,
} from '@/components/library';
import Panel from '@/components/library/cl/Panel';

/**
 * Report issue: any signed-in admin can report a problem — a title, what
 * happened, and screenshots. It lands on the Issues table as an open bug for
 * whoever triages them; "Your reports" shows the reporter each one's status
 * as it moves.
 */

const STATUS_COLOR: Record<string, string> = {
	open: 'blue',
	'in-progress': 'orange',
	testing: 'purple',
	review: 'purple',
	'on-hold': 'yellow',
	pending: 'yellow',
	'needs-discussion': 'yellow',
	reopened: 'blue',
	resolved: 'green',
	closed: 'gray',
	invalid: 'gray',
};

const statusLabel = (s: string) => s.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());

const Label: FC<{ children: string; hint?: string; required?: boolean }> = ({ children, hint, required }) => (
	<Box mb={1.5}>
		<Text
			fontSize='13px'
			fontWeight='500'>
			{children}
			{required && (
				<Text
					as='span'
					color='red.fg'
					ml={0.5}>
					*
				</Text>
			)}
		</Text>
		{hint && (
			<Text
				fontSize='12px'
				color='fg.muted'>
				{hint}
			</Text>
		)}
	</Box>
);

const ReportForm: FC = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [formData, setFormData] = useState<any>({});
	const [, setChangedData] = useState({});
	const [report, { isLoading, error, reset }] = useReportIssueMutation();
	const [sent, setSent] = useState<{ code?: string } | null>(null);

	const images: string[] = Array.isArray(formData.images) ? formData.images : [];
	const canSend = name.trim().length > 0 && description.trim().length > 0 && !isLoading;

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!canSend) return;
		const res = await report({ name: name.trim(), description: description.trim(), images });
		if ('data' in res && res.data) {
			setSent({ code: res.data.code });
			setName('');
			setDescription('');
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
						Thanks — we’ve got it{sent.code ? ` (${sent.code})` : ''}.
					</Text>
					<Text
						fontSize='sm'
						color='fg.muted'
						maxW='420px'>
						It’s on the Issues list for the team. You can follow its status under “Your reports”.
					</Text>
					<Button
						mt={3}
						size='sm'
						variant='outline'
						onClick={() => {
							setSent(null);
							reset();
						}}>
						Report another
					</Button>
				</Flex>
			</Panel>
		);

	return (
		<Panel
			title='New report'
			subtitle='The more detail, the faster it gets fixed.'>
			<Box
				as='form'
				onSubmit={onSubmit}>
				<Flex
					direction='column'
					gap={5}>
					<Box>
						<Label required>Title</Label>
						<Input
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder='e.g. Invoices page won’t load'
							maxLength={200}
						/>
					</Box>
					<Box>
						<Label
							required
							hint='What were you doing, what did you expect, and what happened instead?'>
							Description
						</Label>
						<Textarea
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder='Steps to reproduce, error messages, the page address…'
							rows={6}
							maxLength={5000}
						/>
					</Box>
					<Box>
						<Label hint='Screenshots help a lot. Up to 10.'>Images</Label>
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
							loadingText='Sending'>
							Send report
						</Button>
					</Flex>
				</Flex>
			</Box>
		</Panel>
	);
};

const MyReports: FC = () => {
	const { data, isLoading } = useGetMyReportedIssuesQuery();
	const reports = data?.doc || [];
	return (
		<Panel
			title='Your reports'
			subtitle='Their status updates as the team works on them.'>
			{isLoading ? (
				<Flex
					direction='column'
					gap={3}>
					<Skeleton h='44px' />
					<Skeleton h='44px' />
				</Flex>
			) : reports.length === 0 ? (
				<Text
					fontSize='sm'
					color='fg.muted'>
					You haven’t reported anything yet.
				</Text>
			) : (
				<Flex direction='column'>
					{reports.map(r => (
						<Flex
							key={r._id}
							gap={3}
							py={3}
							borderTopWidth='1px'
							borderColor='border.muted'
							_first={{ borderTopWidth: 0, pt: 0 }}>
							<Box
								flex={1}
								minW={0}>
								{/* Code and status share a line, so the title gets the full width under them. */}
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
										{r.code || '—'}
									</Text>
									<Badge
										size='sm'
										colorPalette={STATUS_COLOR[r.status] || 'gray'}
										flexShrink={0}>
										{statusLabel(r.status)}
									</Badge>
								</Flex>
								<Text
									fontSize='sm'
									fontWeight='600'
									lineClamp={2}>
									{r.name}
								</Text>
								<Text
									fontSize='12px'
									color='fg.muted'
									lineClamp={2}
									mt={0.5}>
									{r.description}
								</Text>
								<Flex
									align='center'
									gap={3}
									mt={1.5}
									color='fg.muted'>
									<Text fontSize='11px'>
										{new Date(r.createdAt).toLocaleDateString(undefined, {
											day: 'numeric',
											month: 'short',
											year: 'numeric',
										})}
									</Text>
									{!!r.images?.length && (
										<Flex
											align='center'
											gap={1}>
											<ImageIcon size={12} />
											<Text fontSize='11px'>{r.images.length}</Text>
										</Flex>
									)}
								</Flex>
							</Box>
							{!!r.images?.length && (
								<Image
									src={r.images[0]}
									alt=''
									boxSize='48px'
									mt={7}
									objectFit='cover'
									borderRadius='md'
									bg='bg.muted'
									flexShrink={0}
								/>
							)}
						</Flex>
					))}
				</Flex>
			)}
		</Panel>
	);
};

const ReportIssuePage = () => (
	<Layout
		title='Report an issue'
		path='report-issue'>
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
				Report an issue
			</Text>
			<Text
				fontSize='sm'
				color='fg.muted'
				mb={4}>
				Something broken or confusing? Tell us and it goes straight to the team’s Issues list. For everything else, see the{' '}
				<Link asChild>
					<NextLink href='/docs'>docs</NextLink>
				</Link>{' '}
				or{' '}
				<Link asChild>
					<NextLink href='/system-status'>system status</NextLink>
				</Link>
				.
			</Text>
			<Grid
				templateColumns={{ base: '1fr', lg: 'minmax(0, 3fr) minmax(0, 2fr)' }}
				gap={5}
				alignItems='start'>
				<ReportForm />
				<MyReports />
			</Grid>
		</Flex>
	</Layout>
);

export default ReportIssuePage;
