'use client';

import { useMemo, useRef, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge, Box, Button, Flex, Grid, Image, Input, Text } from '@chakra-ui/react';
import { Camera, FileUp, Plus, Search, Sparkles } from 'lucide-react';
import { Layout, useGetTemplatesQuery, useImportTemplateFileMutation } from '@/components/library';
import { Dropdown, EmptyState, ErrorState, PageHeader, TableSkeleton, when } from '@/components/library/cl';
import { HOME } from '@/components/library/config/lib/constants/panel';
import { toaster } from '@/components/ui/toaster';
import { ChecksBadge, GuideLink, StatusBadge, TYPES, TemplateIcon, TypeBadge, errorMessage, typeOf } from './_components/ui';
import NewTemplateDialog from './_components/NewTemplateDialog';
import CaptureDialog from './_components/CaptureDialog';

/**
 * Template Studio's gallery (backend docs/templates T-07): every project
 * template, filtered by type, status and category. A template is a blueprint
 * — saving one builds nothing; tenants start new projects from the published
 * ones.
 */

const STATUSES = [
	{ value: '', label: 'Drafts and published' },
	{ value: 'draft', label: 'Drafts (never published)' },
	{ value: 'published', label: 'Published' },
	{ value: 'archived', label: 'Archived' },
];

const TemplatesPage = () => {
	const router = useRouter();
	const [type, setType] = useState('');
	const [status, setStatus] = useState('');
	const [category, setCategory] = useState('');
	const [search, setSearch] = useState('');
	const [creating, setCreating] = useState(false);
	const [capturing, setCapturing] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);
	const [importTemplate, importing] = useImportTemplateFileMutation();

	const { data, isLoading, isError, refetch } = useGetTemplatesQuery({ ...(status && { status }) });
	const all = data?.doc || [];
	const categories = useMemo(() => [...new Set(all.map((d: any) => d.category).filter(Boolean))].sort() as string[], [all]);
	const rows = all.filter(
		(d: any) =>
			(!type || d.type === type) &&
			(!category || d.category === category) &&
			(!search.trim() || `${d.name} ${d.summary} ${d.key}`.toLowerCase().includes(search.trim().toLowerCase()))
	);

	const onImport = async (file?: File) => {
		if (!file) return;
		try {
			const json = JSON.parse(await file.text());
			const res = await importTemplate(json).unwrap();
			toaster.create({ type: 'success', title: `Imported as a new draft — ${res.doc.name}` });
			router.push(`/templates/${res.doc._id}`);
		} catch (e: any) {
			toaster.create({ type: 'error', title: 'Could not import that file', description: e instanceof SyntaxError ? 'It isn’t JSON — pick a file exported from Template Studio.' : errorMessage(e, 'Import failed') });
		} finally {
			if (fileRef.current) fileRef.current.value = '';
		}
	};

	return (
		<Layout
			title='Templates'
			path='templates'>
			<Flex
				direction='column'
				gap={5}
				pb={10}
				maxW='1200px'>
				<PageHeader
					breadcrumbs={[
						{ href: HOME, title: 'Home' },
						{ href: '/templates', title: 'Templates' },
					]}
					title='Template Studio'
					meta='Blueprints tenants start new projects from — saving one builds nothing'
					actions={
						<Flex
							gap={2}
							flexWrap='wrap'>
							<input
								ref={fileRef}
								type='file'
								accept='application/json,.json'
								hidden
								onChange={e => onImport(e.target.files?.[0])}
							/>
							<Button
								asChild
								size='sm'
								variant='outline'>
								<NextLink href='/templates/connect'>
									<Sparkles size={14} />
									Connect Claude
								</NextLink>
							</Button>
							<Button
								size='sm'
								variant='outline'
								loading={importing.isLoading}
								onClick={() => fileRef.current?.click()}>
								<FileUp size={14} />
								Import
							</Button>
							<Button
								size='sm'
								variant='outline'
								onClick={() => setCapturing(true)}>
								<Camera size={14} />
								Save a project as a template
							</Button>
							<Button
								size='sm'
								onClick={() => setCreating(true)}>
								<Plus size={14} />
								New template
							</Button>
						</Flex>
					}
				/>

				<Flex
					gap={2}
					align='center'
					flexWrap='wrap'>
					<Flex gap={1}>
						{[{ value: '', label: 'All' }, ...TYPES].map(t => (
							<Button
								key={t.value}
								size='xs'
								borderRadius='full'
								variant={type === t.value ? 'solid' : 'ghost'}
								onClick={() => setType(t.value)}>
								{t.label}
							</Button>
						))}
					</Flex>
					<Box w='200px'>
						<Dropdown
							value={status}
							onChange={setStatus}>
							{STATUSES.map(s => (
								<option
									key={s.value}
									value={s.value}>
									{s.label}
								</option>
							))}
						</Dropdown>
					</Box>
					{categories.length > 0 && (
						<Box w='180px'>
							<Dropdown
								value={category}
								onChange={setCategory}>
								<option value=''>Every category</option>
								{categories.map(c => (
									<option
										key={c}
										value={c}>
										{c}
									</option>
								))}
							</Dropdown>
						</Box>
					)}
					<Flex
						align='center'
						gap={2}
						flex='1'
						minW='200px'
						maxW='320px'
						borderWidth='1px'
						borderColor='border'
						borderRadius='md'
						px={2}>
						<Search size={14} />
						<Input
							size='sm'
							border='none'
							px={0}
							_focusVisible={{ outline: 'none' }}
							placeholder='Search name, summary or key'
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
					</Flex>
					<Box ml='auto'>
						<GuideLink
							section='what'
							label='What templates are'
						/>
					</Box>
				</Flex>

				{isLoading ? (
					<TableSkeleton rows={4} />
				) : isError ? (
					<ErrorState
						message='Could not load the templates'
						onRetry={refetch}
					/>
				) : !rows.length ? (
					<EmptyState
						title={all.length ? 'No template matches' : 'No templates yet'}
						description={
							all.length
								? 'Try another type, status or category, or clear the search.'
								: 'A template is a blueprint for a new project — an app (models, sidebar, dashboard, roles), an API (models with public endpoints and webhooks) or a website (pages, SEO, content, settings). Tenants pick a published one when they start a project and get it built, then change it freely. Make one here, or let Claude write it through the Templates MCP.'
						}
						action={
							!all.length ? (
								<Flex
									gap={2}
									align='center'>
									<Button
										size='sm'
										onClick={() => setCreating(true)}>
										<Plus size={14} />
										New template
									</Button>
									<GuideLink
										section='new'
										label='Making your first template'
									/>
								</Flex>
							) : undefined
						}
					/>
				) : (
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' }}
						gap={4}>
						{rows.map((d: any) => (
							<Card
								key={d._id}
								doc={d}
							/>
						))}
					</Grid>
				)}
			</Flex>

			<NewTemplateDialog
				open={creating}
				onClose={() => setCreating(false)}
				onCreated={doc => router.push(`/templates/${doc._id}`)}
			/>
			<CaptureDialog
				open={capturing}
				onClose={() => setCapturing(false)}
				onCreated={doc => router.push(`/templates/${doc._id}`)}
			/>
		</Layout>
	);
};

const Card = ({ doc }: { doc: any }) => (
	<Box
		asChild
		borderWidth='1px'
		borderColor='border'
		borderRadius='lg'
		overflow='hidden'
		bg='bg'
		transition='border-color 0.15s'
		_hover={{ borderColor: 'border.emphasized' }}>
		<NextLink href={`/templates/${doc._id}`}>
			<Flex
				h='120px'
				align='center'
				justify='center'
				bg={doc.color || 'bg.muted'}
				color={doc.color ? 'white' : 'fg.muted'}
				position='relative'>
				{doc.cover ? (
					<Image
						src={doc.cover}
						alt=''
						w='full'
						h='full'
						objectFit='cover'
					/>
				) : (
					<TemplateIcon
						doc={doc}
						size={32}
					/>
				)}
			</Flex>
			<Box p={4}>
				<Flex
					align='center'
					gap={2}
					mb={1}>
					<Text
						fontWeight='600'
						fontSize='sm'
						truncate>
						{doc.name}
					</Text>
				</Flex>
				<Flex
					gap={1.5}
					flexWrap='wrap'
					mb={2}>
					<TypeBadge type={doc.type} />
					<StatusBadge doc={doc} />
					<ChecksBadge checks={doc.checks} />
				</Flex>
				<Text
					fontSize='xs'
					color='fg.muted'
					lineClamp={2}
					minH='2lh'>
					{doc.summary || `No summary yet — ${typeOf(doc.type).label.toLowerCase()} template.`}
				</Text>
				<Flex
					mt={3}
					gap={3}
					fontSize='xs'
					color='fg.subtle'
					flexWrap='wrap'>
					{doc.category && <Text>{doc.category}</Text>}
					<Text>
						{doc.usage?.applied || 0} project{doc.usage?.applied === 1 ? '' : 's'} · {doc.usage?.previews || 0} preview
						{doc.usage?.previews === 1 ? '' : 's'}
					</Text>
					<Text>Changed {when(doc.updatedAt)}</Text>
					{doc.source === 'mcp' && (
						<Badge
							size='xs'
							variant='outline'>
							By Claude
						</Badge>
					)}
				</Flex>
			</Box>
		</NextLink>
	</Box>
);

export default TemplatesPage;
