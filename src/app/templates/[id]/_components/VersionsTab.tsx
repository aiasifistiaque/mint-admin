'use client';

import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Box, Button, Flex, Grid, IconButton, Input, Text } from '@chakra-ui/react';
import { Archive, ArchiveRestore, Copy, Download, RotateCcw, Rocket, Trash2, X } from 'lucide-react';
import {
	PromptDialog,
	useDeleteTemplateMutation,
	useDuplicateTemplateMutation,
	useExportTemplateMutation,
	useGetAllQuery,
	useRestoreTemplateVersionMutation,
	useSaveTemplateSettingsMutation,
} from '@/components/library';
import { Dropdown, Panel, when } from '@/components/library/cl';
import { toaster } from '@/components/ui/toaster';
import { GuideLink, Intro, Label, errorMessage } from '../../_components/ui';

/**
 * Versions & publish: the published versions with their notes (restore one
 * into the draft), who can use the template, its key, and duplicate /
 * export / archive / delete.
 */
const VersionsTab: FC<{ doc: any; dirty: boolean; onPublish: () => void }> = ({ doc, dirty, onPublish }) => {
	const router = useRouter();
	const [restoring, setRestoring] = useState<number | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [visibility, setVisibility] = useState(doc.visibility || 'everyone');
	const [orgs, setOrgs] = useState<string[]>((doc.organizations || []).map(String));
	const [key, setKey] = useState(doc.key);
	const [restore, restoreState] = useRestoreTemplateVersionMutation();
	const [saveSettings, settingsState] = useSaveTemplateSettingsMutation();
	const [duplicate, dupState] = useDuplicateTemplateMutation();
	const [exportTemplate] = useExportTemplateMutation();
	const [remove, removeState] = useDeleteTemplateMutation();
	const { data: orgData } = useGetAllQuery({ path: 'organizations', limit: 500, sort: 'name' }, { skip: visibility !== 'organizations' });
	const allOrgs: any[] = orgData?.doc || [];
	const v = doc.validation || {};
	const versions = [...(doc.versions || [])].reverse();
	const archived = doc.status === 'archived';

	useEffect(() => {
		setVisibility(doc.visibility || 'everyone');
		setOrgs((doc.organizations || []).map(String));
		setKey(doc.key);
	}, [doc.visibility, doc.organizations, doc.key]);

	const settingsChanged =
		visibility !== (doc.visibility || 'everyone') || orgs.join() !== (doc.organizations || []).map(String).join() || key !== doc.key;

	const settings = async (body: any, done: string) => {
		try {
			await saveSettings({ id: doc._id, ...body }).unwrap();
			toaster.create({ type: 'success', title: done });
		} catch (e) {
			toaster.create({ type: 'error', title: 'Not saved', description: errorMessage(e, 'Try again') });
		}
	};

	const download = async () => {
		try {
			const data = await exportTemplate({ id: doc._id }).unwrap();
			const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
			const a = document.createElement('a');
			a.href = url;
			a.download = `${doc.key}.template.json`;
			a.click();
			URL.revokeObjectURL(url);
		} catch (e) {
			toaster.create({ type: 'error', title: 'Could not export it', description: errorMessage(e, 'Try again') });
		}
	};

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='publish'>
				Tenants only ever see published versions. Publishing turns the draft into the next version with a note on what
				changed; projects already made from the template keep the version they were built with. The draft is yours to
				change in the meantime — restore an older version into it if you need to go back.
			</Intro>

			<Grid
				templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) minmax(0, 1fr)' }}
				gap={4}
				alignItems='start'>
				<Flex
					direction='column'
					gap={4}
					minW={0}>
					<Panel
						title='Publish'
						actions={<GuideLink section='publish' />}>
						<Flex
							direction='column'
							gap={3}>
							<Text fontSize='sm'>
								{!doc.version
									? 'Never published — tenants can’t see it yet.'
									: doc.changed
									? `Version ${doc.version} is live; the draft has changes since.`
									: `Version ${doc.version} is live and matches the draft.`}
							</Text>
							<Flex
								gap={1.5}
								flexWrap='wrap'>
								<Badge
									colorPalette={v.errors?.length ? 'red' : 'green'}
									variant='subtle'>
									{v.errors?.length || 0} problems
								</Badge>
								<Badge
									colorPalette={v.explain?.length ? 'orange' : 'green'}
									variant='subtle'>
									{v.explain?.length || 0} to explain
								</Badge>
								<Badge variant='outline'>{v.warnings?.length || 0} warnings</Badge>
							</Flex>
							<Box>
								<Button
									size='sm'
									disabled={archived || !v.canPublish || dirty || (doc.version > 0 && !doc.changed)}
									onClick={onPublish}>
									<Rocket size={14} />
									Publish version {(doc.version || 0) + 1}
								</Button>
								{!archived && !v.canPublish && (
									<Text
										fontSize='xs'
										color='fg.muted'
										mt={1.5}>
										Fix the problems and add the missing explanations first — the list at the top says what and where.
									</Text>
								)}
							</Box>
						</Flex>
					</Panel>

					<Panel
						title='Versions'
						subtitle='Newest first. Restoring copies a version into the draft; nothing is published until you publish.'
						flush
						actions={<GuideLink section='versions' />}>
						{!versions.length ? (
							<Text
								p={4}
								fontSize='sm'
								color='fg.muted'>
								No versions yet.
							</Text>
						) : (
							versions.map((x: any, i: number) => (
								<Flex
									key={x.version}
									px={4}
									py={3}
									gap={3}
									align='flex-start'
									borderTopWidth={i ? '1px' : 0}
									borderColor='border.muted'>
									<Badge
										variant={x.version === doc.version ? 'solid' : 'outline'}
										mt={0.5}>
										v{x.version}
									</Badge>
									<Box
										flex='1'
										minW={0}>
										<Text fontSize='sm'>{x.notes}</Text>
										<Text
											fontSize='xs'
											color='fg.muted'>
											{when(x.publishedAt)}
											{x.version === doc.version ? ' · live' : ''}
										</Text>
									</Box>
									<Button
										size='2xs'
										variant='outline'
										disabled={archived}
										onClick={() => setRestoring(x.version)}>
										<RotateCcw size={11} />
										Restore into draft
									</Button>
								</Flex>
							))
						)}
					</Panel>
				</Flex>

				<Flex
					direction='column'
					gap={4}
					minW={0}>
					<Panel
						title='Who can use it'
						actions={<GuideLink section='visibility' />}>
						<Flex
							direction='column'
							gap={4}>
							<Box>
								<Label hint='Which organizations see the published version when they start a project. Changes apply at once.'>
									Visibility
								</Label>
								<Dropdown
									value={visibility}
									onChange={setVisibility}>
									<option value='everyone'>Everyone</option>
									<option value='organizations'>Only some organizations</option>
									<option value='hidden'>Hidden — nobody, for now</option>
								</Dropdown>
							</Box>
							{visibility === 'organizations' && (
								<Box>
									<Label hint='The organizations that can pick it.'>Organizations</Label>
									<Dropdown
										value=''
										placeholder='Add an organization'
										searchable
										onChange={id => id && !orgs.includes(id) && setOrgs([...orgs, id])}>
										{allOrgs
											.filter(o => !orgs.includes(String(o._id)))
											.map(o => (
												<option
													key={o._id}
													value={String(o._id)}>
													{o.name}
												</option>
											))}
									</Dropdown>
									<Flex
										gap={1.5}
										mt={2}
										flexWrap='wrap'>
										{orgs.map(id => (
											<Badge
												key={id}
												variant='outline'
												gap={1}>
												{allOrgs.find(o => String(o._id) === id)?.name || id}
												<IconButton
													aria-label='Remove'
													size='2xs'
													variant='ghost'
													minW='auto'
													h='auto'
													onClick={() => setOrgs(orgs.filter(x => x !== id))}>
													<X size={10} />
												</IconButton>
											</Badge>
										))}
									</Flex>
								</Box>
							)}
							<Box>
								<Label hint={doc.version ? 'Fixed once published — projects record which template they came from by it.' : 'The template’s address in the API and the MCP.'}>
									Key
								</Label>
								<Input
									size='sm'
									fontFamily='mono'
									value={key}
									disabled={doc.version > 0}
									onChange={e => setKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
								/>
							</Box>
							<Box>
								<Button
									size='sm'
									variant='outline'
									disabled={!settingsChanged}
									loading={settingsState.isLoading}
									onClick={() =>
										settings(
											{ visibility, organizations: orgs, ...(key !== doc.key && { key }) },
											'Saved who can use it'
										)
									}>
									Save
								</Button>
							</Box>
						</Flex>
					</Panel>

					<Panel
						title='More'
						actions={<GuideLink section='import-export' />}>
						<Flex
							direction='column'
							gap={3}>
							<Flex
								gap={2}
								flexWrap='wrap'>
								<Button
									size='sm'
									variant='outline'
									loading={dupState.isLoading}
									onClick={async () => {
										try {
											const res = await duplicate({ id: doc._id }).unwrap();
											router.push(`/templates/${res.doc._id}`);
										} catch (e) {
											toaster.create({ type: 'error', title: 'Could not duplicate it', description: errorMessage(e, 'Try again') });
										}
									}}>
									<Copy size={14} />
									Duplicate
								</Button>
								<Button
									size='sm'
									variant='outline'
									onClick={download}>
									<Download size={14} />
									Export
								</Button>
								{doc.version > 0 && (
									<Button
										size='sm'
										variant='outline'
										loading={settingsState.isLoading}
										onClick={() => settings({ archived: !archived }, archived ? 'Restored — published again' : 'Archived — tenants no longer see it')}>
										{archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
										{archived ? 'Restore' : 'Archive'}
									</Button>
								)}
								<Button
									size='sm'
									variant='outline'
									colorPalette='red'
									onClick={() => setDeleting(true)}>
									<Trash2 size={14} />
									Delete
								</Button>
							</Flex>
							<Text
								fontSize='xs'
								color='fg.muted'>
								Duplicate makes a new draft to start a variant from. Export downloads the draft as a file another e-mint can
								import. Archive takes a published template out of the gallery without losing it.
							</Text>
						</Flex>
					</Panel>
				</Flex>
			</Grid>

			<PromptDialog
				open={restoring !== null}
				onClose={() => setRestoring(null)}
				tone='warning'
				title={`Restore version ${restoring} into the draft?`}
				description='The draft is replaced by that version. Nothing is published, and tenants aren’t affected until you publish again.'
				confirmLabel='Restore'
				loading={restoreState.isLoading}
				onConfirm={async () => {
					try {
						await restore({ id: doc._id, version: restoring as number }).unwrap();
						toaster.create({ type: 'success', title: `Version ${restoring} is in the draft` });
					} catch (e) {
						toaster.create({ type: 'error', title: 'Not restored', description: errorMessage(e, 'Try again') });
					}
					setRestoring(null);
				}}
			/>
			<PromptDialog
				open={deleting}
				onClose={() => setDeleting(false)}
				title={doc.version ? 'Archive this template?' : 'Delete this draft?'}
				subject={doc.name}
				description={
					doc.version
						? 'It has been published, so it’s archived instead of deleted: tenants stop seeing it, projects made from it are unaffected, and you can restore it.'
						: 'It has never been published, so it’s deleted for good. Its previews go too.'
				}
				confirmLabel={doc.version ? 'Archive' : 'Delete'}
				loading={removeState.isLoading}
				onConfirm={async () => {
					try {
						const res = await remove({ id: doc._id }).unwrap();
						setDeleting(false);
						if (!res.archived) router.push('/templates');
						else toaster.create({ type: 'success', title: 'Archived' });
					} catch (e) {
						toaster.create({ type: 'error', title: 'Not deleted', description: errorMessage(e, 'Try again') });
					}
				}}
			/>
		</Flex>
	);
};

export default VersionsTab;
