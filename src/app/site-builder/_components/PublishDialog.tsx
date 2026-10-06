'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { Box, Button, Dialog, Flex, Input, Portal, Skeleton, Text } from '@chakra-ui/react';
import { CircleAlert, FileMinus, FilePen, FilePlus, Palette } from 'lucide-react';
import { radius, ModalFooter, DiscardButton } from '@/components/library';
import { toaster } from '@/components/ui/toaster';
import { useSiteBuilderChangesQuery, useSiteBuilderPublishMutation, type SbProblem } from '@/components/library/store/services/siteBuilderApi';
import SiteGuide from './SiteGuide';

/**
 * Publish (docs/site-builder #publish): what goes live — pages added, changed
 * and removed, the design — and the problems that stop it, each one a link to
 * its block. A note says what this version is. Nothing is published while a
 * problem is left.
 */

type Props = {
	open: boolean;
	onClose: () => void;
	/** Saves the open page first. */
	beforeOpen: () => Promise<void>;
	onProblem: (p: SbProblem) => void;
};

const Line: FC<{ icon: ReactNode; children: ReactNode }> = ({ icon, children }) => (
	<Flex
		align='center'
		gap={2}
		fontSize='13px'
		py={1}>
		<Box color='fg.muted'>{icon}</Box>
		{children}
	</Flex>
);

const PublishDialog: FC<Props> = ({ open, onClose, beforeOpen, onProblem }) => {
	const [note, setNote] = useState('');
	const [flushed, setFlushed] = useState(false);
	// Asked fresh each time the dialog opens, once the open page is saved.
	const { data, isFetching, refetch } = useSiteBuilderChangesQuery(undefined, { skip: !open || !flushed, refetchOnMountOrArgChange: true });
	const [publish, publishing] = useSiteBuilderPublishMutation();

	useEffect(() => {
		if (!open) {
			setFlushed(false);
			return;
		}
		setNote('');
		beforeOpen()
			.catch(() => undefined)
			.finally(() => setFlushed(true));
	}, [open]); // eslint-disable-line react-hooks/exhaustive-deps

	const blocking = (data?.problems || []).filter(p => p.level !== 'warning');
	const go = async () => {
		try {
			const out = await publish({ note: note.trim() }).unwrap();
			toaster.create({
				type: 'success',
				title: `Published — version ${out.version}`,
				description: out.url ? `Live at ${out.url}` : 'Your site is up to date.',
			});
			onClose();
		} catch (e: any) {
			toaster.create({ type: 'error', title: e?.data?.message || 'Not published — try again.' });
			refetch();
		}
	};

	const c = data?.pages;
	const loading = !flushed || isFetching || !data;
	return (
		<Dialog.Root
			placement='top'
			size='md'
			open={open}
			onOpenChange={e => !e.open && !publishing.isLoading && onClose()}>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content
						borderRadius={radius.MODAL}
						bg='bg.panel'
						borderWidth='1px'
						borderColor='border'>
						<Dialog.Header
							px={{ base: 4, md: 6 }}
							pt={{ base: 4, md: 5 }}
							pb={3}>
							<Flex
								align='center'
								justify='space-between'
								w='full'>
								<Dialog.Title fontSize='16px'>Publish the site</Dialog.Title>
								<SiteGuide section='publish' />
							</Flex>
						</Dialog.Header>
						<Dialog.Body
							px={{ base: 4, md: 6 }}
							pt={0}
							pb={5}>
							{loading ? (
								<Flex
									direction='column'
									gap={2}>
									<Skeleton h='20px' />
									<Skeleton h='20px' />
									<Skeleton h='20px' />
								</Flex>
							) : (
								<Flex
									direction='column'
									gap={4}>
									<Text
										fontSize='12.5px'
										color='fg.muted'>
										{data.live ? `Live now: version ${data.live.version}.` : 'Nothing is live yet — this is the first publish.'} Everything below goes live together.
									</Text>
									{data.any ? (
										<Box>
											{c!.added.map(p => (
												<Line
													key={p.id}
													icon={<FilePlus size={14} />}>
													<Text>New page: {p.name}</Text>
													<Text
														color='fg.muted'
														fontFamily='mono'
														fontSize='12px'>
														{p.path}
													</Text>
												</Line>
											))}
											{c!.changed.map(p => (
												<Line
													key={p.id}
													icon={<FilePen size={14} />}>
													<Text>Changed: {p.name}</Text>
													<Text
														color='fg.muted'
														fontFamily='mono'
														fontSize='12px'>
														{p.path}
													</Text>
												</Line>
											))}
											{c!.removed.map(p => (
												<Line
													key={p.id}
													icon={<FileMinus size={14} />}>
													<Text>Removed: {p.name}</Text>
													<Text
														color='fg.muted'
														fontFamily='mono'
														fontSize='12px'>
														{p.path}
													</Text>
												</Line>
											))}
											{data.design && (
												<Line icon={<Palette size={14} />}>
													<Text>The design: theme, header and footer</Text>
												</Line>
											)}
										</Box>
									) : (
										<Text fontSize='13px'>Nothing has changed since the last publish.</Text>
									)}
									{blocking.length > 0 && (
										<Box
											p={3}
											borderRadius='md'
											bg='red.subtle'>
											<Text
												fontSize='13px'
												fontWeight='600'
												color='red.fg'
												mb={2}>
												Fix {blocking.length === 1 ? 'this' : `these ${blocking.length}`} first
											</Text>
											{blocking.slice(0, 20).map((p, i) => (
												<Flex
													key={i}
													as='button'
													w='full'
													textAlign='left'
													align='flex-start'
													gap={2}
													py={1}
													fontSize='12.5px'
													_hover={{ textDecoration: 'underline' }}
													onClick={() => {
														onProblem(p);
														onClose();
													}}>
													<Box
														mt='2px'
														color='red.fg'>
														<CircleAlert size={13} />
													</Box>
													<Text>
														{p.part === 'design' ? 'Design' : p.pageName}: {p.message}
													</Text>
												</Flex>
											))}
										</Box>
									)}
									<Box>
										<Text
											fontSize='12px'
											fontWeight='600'
											mb={1}>
											Note (optional)
										</Text>
										<Input
											size='sm'
											value={note}
											maxLength={300}
											placeholder='What changed — e.g. New prices'
											onChange={e => setNote(e.target.value)}
										/>
									</Box>
								</Flex>
							)}
						</Dialog.Body>
						<ModalFooter>
							<DiscardButton
								size='sm'
								onClick={onClose}
								disabled={publishing.isLoading}>
								Cancel
							</DiscardButton>
							<Button
								size='sm'
								loading={publishing.isLoading}
								disabled={loading || !data?.canPublish || (!data?.any && !!data?.live)}
								onClick={go}>
								Publish
							</Button>
						</ModalFooter>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};

export default PublishDialog;
