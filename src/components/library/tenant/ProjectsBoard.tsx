'use client';

import { FC, FormEvent, ReactNode, useEffect, useState } from 'react';
import { Box, Button, Center, Field, Flex, Grid, Input, SegmentGroup, Skeleton, Text, Textarea } from '@chakra-ui/react';
import { Archive, ArchiveRestore, Boxes, Globe, LayoutGrid, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import {
	Dialog,
	DialogBody,
	DialogCloseButton,
	DialogFooter,
	DialogHeader,
	DiscardButton,
	PromptDialog,
	useCreateProjectMutation,
	useDeleteProjectMutation,
	useGetProjectsQuery,
	useUpdateProjectMutation,
} from '..';
import type { MediaScope, ProjectType, TenantProject } from '../store/services/tenantApi';
import { styles } from '../config';
import { Panel } from '../cl';
import { openProject, useWorkspace } from './useWorkspace';
import GuideLink from './GuideLink';
import Workspaces from './Workspaces';
import { Menu } from '@chakra-ui/react';
import CustomMenuItem, { MenuItemStyle } from '../menu/CustomMenuItem';
import { MenuContainer } from '../menu';

const errorText = (e: any) => e?.data?.message || 'Something went wrong — try again.';

const TYPES: { value: ProjectType; title: string; hint: string; icon: ReactNode }[] = [
	{ value: 'app', title: 'App', hint: 'Your own models, pages, sidebar and dashboard — an internal tool, a CRM, an API.', icon: <LayoutGrid size={18} /> },
	{ value: 'website', title: 'Website', hint: 'Pages, SEO, content blocks and site settings, with a site API and analytics.', icon: <Globe size={18} /> },
];

const domainList = (text: string) =>
	text
		.split(/[\s,]+/)
		.map(d => d.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, ''))
		.filter(Boolean);

/**
 * A project's name, kind, media library (WO-23) and (for a website) domains:
 * a new project, or — with `project` — editing one (its kind can't change).
 */
const ProjectDialog: FC<{ open: boolean; onClose: () => void; project?: TenantProject }> = ({ open, onClose, project }) => {
	const [name, setName] = useState('');
	const [type, setType] = useState<ProjectType>('app');
	const [description, setDescription] = useState('');
	const [domains, setDomains] = useState('');
	const [mediaScope, setMediaScope] = useState<MediaScope>('project');
	const [create, created] = useCreateProjectMutation();
	const [update, updated] = useUpdateProjectMutation();
	const { isLoading, error } = project ? updated : created;

	useEffect(() => {
		if (!open) return;
		setName(project?.name || '');
		setType(project?.type || 'app');
		setDescription(project?.description || '');
		setDomains((project?.domains || []).join(', '));
		setMediaScope(project?.mediaScope || 'project');
	}, [open, project?._id]);

	const close = () => {
		created.reset();
		updated.reset();
		onClose();
	};

	const submit = async (e?: FormEvent) => {
		e?.preventDefault();
		if (!name.trim()) return;
		const body = {
			name: name.trim(),
			description: description.trim(),
			mediaScope,
			...(type === 'website' && { domains: domainList(domains) }),
		};
		if (project) {
			const res = await update({ id: project._id, ...body });
			if ('data' in res) close();
			return;
		}
		const res = await create({ ...body, type });
		if ('data' in res && res.data) {
			close();
			openProject(res.data._id);
		}
	};

	return (
		<Dialog
			isOpen={open}
			onClose={close}
			size='md'
			forceModal>
			<DialogHeader
				divider
				icon={<Boxes size={17} strokeWidth={1.75} />}
				description={project ? 'Its kind stays as it is.' : 'A project holds its own models, pages, sidebar and dashboard.'}>
				{project ? `Edit ${project.name}` : 'New project'}
			</DialogHeader>
			<DialogCloseButton />
			<DialogBody>
				<form
					id='new-project'
					onSubmit={submit}>
					<Flex
						direction='column'
						gap={4}>
						<Field.Root required>
							<Field.Label {...labelCss}>Name</Field.Label>
							<Input
								size='sm'
								value={name}
								autoFocus
								maxLength={80}
								placeholder='e.g. Customer portal'
								onChange={e => setName(e.target.value)}
							/>
						</Field.Root>
						{!project && (
							<Box>
								<Text {...labelCss}>Kind</Text>
								<Grid
									mt={1.5}
									templateColumns={{ base: '1fr', sm: '1fr 1fr' }}
									gap={2}>
									{TYPES.map(t => {
										const on = type === t.value;
										return (
											<Flex
												key={t.value}
												as='button'
												// @ts-ignore — Flex as button
												type='button'
												aria-pressed={on}
												onClick={() => setType(t.value)}
												direction='column'
												align='flex-start'
												gap={1.5}
												p={3}
												textAlign='left'
												borderRadius='lg'
												borderWidth={on ? '2px' : '1px'}
												borderColor={on ? 'accent.solid' : 'border'}
												m={on ? 0 : '1px'}
												bg={on ? 'bg.subtle' : 'bg.panel'}
												cursor='pointer'
												_hover={{ bg: 'bg.muted' }}>
												<Flex
													align='center'
													gap={2}
													color={on ? 'fg' : 'fg.muted'}>
													{t.icon}
													<Text
														fontSize='14px'
														fontWeight='600'
														color='fg'>
														{t.title}
													</Text>
												</Flex>
												<Text
													fontSize='12.5px'
													color='fg.muted'>
													{t.hint}
												</Text>
											</Flex>
										);
									})}
								</Grid>
							</Box>
						)}
						{type === 'website' && (
							<Field.Root>
								<Field.Label {...labelCss}>Domains</Field.Label>
								<Input
									size='sm'
									value={domains}
									placeholder='example.com, www.example.com'
									onChange={e => setDomains(e.target.value)}
								/>
								<Field.HelperText {...helperCss}>Where the site runs. Analytics only counts visits from these. You can add them later.</Field.HelperText>
							</Field.Root>
						)}
						<Box>
							<Text {...labelCss}>Media library</Text>
							<SegmentGroup.Root
								size='sm'
								mt={1.5}
								value={mediaScope}
								onValueChange={d => setMediaScope((d.value as MediaScope) || 'project')}
								w='fit-content'>
								<SegmentGroup.Indicator />
								<SegmentGroup.Items
									items={[
										{ value: 'project', label: 'This project only' },
										{ value: 'organization', label: 'Shared with the organization' },
									]}
								/>
							</SegmentGroup.Root>
							<Text
								{...helperCss}
								mt={1.5}>
								{mediaScope === 'organization'
									? 'Uses the organization’s shared library — the same images and files as every project that shares it.'
									: 'Its own images and files, apart from the other projects.'}
								{project && project.mediaScope !== mediaScope && ' Files stay where they were uploaded; switching back shows them again.'}
							</Text>
						</Box>
						<Field.Root>
							<Field.Label {...labelCss}>Description</Field.Label>
							<Textarea
								size='sm'
								rows={2}
								maxLength={500}
								value={description}
								placeholder='What it’s for (optional)'
								onChange={e => setDescription(e.target.value)}
							/>
						</Field.Root>
						{error && (
							<Text
								role='alert'
								fontSize='13px'
								color='red.fg'>
								{errorText(error)}
							</Text>
						)}
					</Flex>
				</form>
			</DialogBody>
			<DialogFooter>
				<DiscardButton onClick={close}>Cancel</DiscardButton>
				<Button
					{...(styles.MODAL_BUTTON as any)}
					type='submit'
					form='new-project'
					disabled={!name.trim()}
					loading={isLoading}>
					{project ? 'Save' : 'Create project'}
				</Button>
			</DialogFooter>
		</Dialog>
	);
};

/** One project: open it, or archive / restore / delete it from its menu. */
const ProjectCard: FC<{ project: TenantProject; current: boolean; canManage: boolean; isOwner: boolean }> = ({ project, current, canManage, isOwner }) => {
	const [update] = useUpdateProjectMutation();
	const [remove, removing] = useDeleteProjectMutation();
	const [confirm, setConfirm] = useState(false);
	const [editing, setEditing] = useState(false);
	const archived = !project.isActive;
	const hasData = (project.models || 0) > 0;

	return (
		<Box
			position='relative'
			borderWidth='1px'
			borderColor={current ? 'accent.solid' : 'border'}
			borderRadius='lg'
			bg='bg.panel'
			opacity={archived ? 0.7 : 1}
			transition='border-color .12s ease, background .12s ease'
			_hover={{ borderColor: current ? 'accent.solid' : 'border.emphasized' }}>
			<Flex
				as='button'
				// @ts-ignore — Flex as button
				type='button'
				onClick={() => !archived && openProject(project._id)}
				direction='column'
				align='flex-start'
				gap={3}
				w='full'
				p={4}
				textAlign='left'
				cursor={archived ? 'default' : 'pointer'}>
				<Center
					boxSize='36px'
					borderRadius='md'
					bg='bg.muted'
					color='fg.muted'>
					{project.type === 'website' ? <Globe size={18} /> : <LayoutGrid size={18} />}
				</Center>
				<Box minW={0}>
					<Text
						fontSize='14px'
						fontWeight='600'
						truncate>
						{project.name}
					</Text>
					<Text
						fontSize='12.5px'
						color='fg.muted'
						lineClamp={2}
						minH='2lh'>
						{project.description || (project.type === 'website' ? 'Website' : 'App')}
					</Text>
				</Box>
				<Flex
					gap={3}
					fontSize='12px'
					color='fg.muted'>
					<Text>{project.type === 'website' ? 'Website' : 'App'}</Text>
					<Text>
						{project.models || 0} model{project.models === 1 ? '' : 's'}
					</Text>
					{archived && <Text>Archived</Text>}
					{current && <Text color='fg'>Open</Text>}
				</Flex>
			</Flex>

			{canManage && (
				<Box
					position='absolute'
					top={2}
					right={2}>
					<Menu.Root positioning={{ placement: 'bottom-end' }}>
						<Menu.Trigger
							aria-label={`${project.name} actions`}
							asChild>
							<Center
								as='button'
								boxSize='28px'
								borderRadius='md'
								color='fg.muted'
								_hover={{ bg: 'bg.muted', color: 'fg' }}>
								<MoreHorizontal size={16} />
							</Center>
						</Menu.Trigger>
						<MenuContainer
							p='6px'
							gap={0}
							boxShadow={undefined}>
							<MenuItemStyle compact>
								<CustomMenuItem
									value='edit'
									icon={<Pencil size={15} />}
									onClick={() => setEditing(true)}>
									Edit…
								</CustomMenuItem>
								<CustomMenuItem
									value='archive'
									icon={archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
									onClick={() => update({ id: project._id, isActive: archived })}>
									{archived ? 'Restore' : 'Archive'}
								</CustomMenuItem>
								{(!hasData || isOwner) && (
									<CustomMenuItem
										value='delete'
										icon={<Trash2 size={15} />}
										danger
										onClick={() => setConfirm(true)}>
										Delete…
									</CustomMenuItem>
								)}
							</MenuItemStyle>
						</MenuContainer>
					</Menu.Root>
				</Box>
			)}

			<ProjectDialog
				open={editing}
				onClose={() => setEditing(false)}
				project={project}
			/>
			<PromptDialog
				open={confirm}
				onClose={() => setConfirm(false)}
				onConfirm={async () => {
					const res = await remove({ id: project._id, force: hasData });
					if ('data' in res) setConfirm(false);
				}}
				title={`Delete ${project.name}?`}
				description={
					hasData
						? 'Its models, every record in them, its pages, sidebar, dashboard, files and keys are deleted for good.'
						: 'The project and its sidebar and dashboard are deleted.'
				}
				subject={project.name}
				typeToConfirm={hasData ? project.name : undefined}
				loading={removing.isLoading}
				confirmLabel='Delete project'
			/>
		</Box>
	);
};

/**
 * The organization's projects, as cards: open one, or start a new one. The
 * tenant panel's home before a project is open, and /projects.
 */
const ProjectsBoard: FC<{ welcome?: boolean }> = ({ welcome }) => {
	const { organization, project, can, role } = useWorkspace();
	const [showArchived, setShowArchived] = useState(false);
	const { data, isLoading } = useGetProjectsQuery({ archived: showArchived });
	const [creating, setCreating] = useState(false);
	const projects = data?.doc || [];
	const canCreate = can('create-projects');

	return (
		<Flex
			direction='column'
			gap={4}
			pt={2}>
			{welcome && organization && (
				<Box>
					<Text
						fontSize='20px'
						fontWeight='600'>
						{organization.name}
					</Text>
					<Text
						fontSize='13.5px'
						color='fg.muted'>
						Open a project to work in it, or start a new one.
					</Text>
				</Box>
			)}
			<Panel
				title='Projects'
				subtitle='Apps and websites in this organization'
				actions={
					<Flex
						align='center'
						gap={2}>
						<GuideLink section='projects' />
						<Button
							size='xs'
							variant='ghost'
							color='fg.muted'
							onClick={() => setShowArchived(a => !a)}>
							{showArchived ? 'Hide archived' : 'Show archived'}
						</Button>
						{canCreate && (
							<Button
								size='xs'
								onClick={() => setCreating(true)}>
								<Plus size={14} />
								New project
							</Button>
						)}
					</Flex>
				}>
				{isLoading ? (
					<Grid
						templateColumns='repeat(auto-fill, minmax(240px, 1fr))'
						gap={3}>
						{[0, 1, 2].map(i => (
							<Skeleton
								key={i}
								h='150px'
								borderRadius='lg'
							/>
						))}
					</Grid>
				) : projects.length ? (
					<Grid
						templateColumns='repeat(auto-fill, minmax(240px, 1fr))'
						gap={3}>
						{projects.map(p => (
							<ProjectCard
								key={p._id}
								project={p}
								current={p._id === project?._id}
								canManage={can('manage-projects')}
								isOwner={role?.system === 'owner'}
							/>
						))}
					</Grid>
				) : (
					<Flex
						direction='column'
						align='center'
						textAlign='center'
						gap={2}
						py={10}>
						<Center
							boxSize='44px'
							borderRadius='full'
							bg='bg.muted'
							color='fg.muted'>
							<Boxes size={20} />
						</Center>
						<Text
							fontSize='14px'
							fontWeight='600'>
							No projects yet
						</Text>
						<Text
							fontSize='13px'
							color='fg.muted'
							maxW='360px'>
							A project is an app or a website: its own models, pages, sidebar and dashboard.
						</Text>
						{canCreate && (
							<Button
								mt={2}
								size='sm'
								onClick={() => setCreating(true)}>
								<Plus size={15} />
								Create your first project
							</Button>
						)}
					</Flex>
				)}
			</Panel>
			<Workspaces />
			<ProjectDialog
				open={creating}
				onClose={() => setCreating(false)}
			/>
		</Flex>
	);
};

const labelCss: any = { fontSize: '13px', fontWeight: '600', m: 0 };
const helperCss: any = { fontSize: '12px', color: 'fg.muted', m: 0 };

export default ProjectsBoard;
