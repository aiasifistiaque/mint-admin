'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Button, Flex, Tabs, Text } from '@chakra-ui/react';
import { Eye, RefreshCw, Rocket } from 'lucide-react';
import { Layout, useGetTemplateMetaQuery, useGetTemplateQuery, useSaveTemplatePartMutation } from '@/components/library';
import { ConsoleTabs, DetailSkeleton, ErrorState, PageHeader } from '@/components/library/cl';
import { HOME } from '@/components/library/config/lib/constants/panel';
import { toaster } from '@/components/ui/toaster';
import type { TemplateIssue, TemplatePart } from '@/components/library/store/services/templatesApi';
import { GuideLink, PART_LABEL, StatusBadge, TABS, TypeBadge, errorMessage, tabOfPart } from '../_components/ui';
import ProblemsPanel from './_components/ProblemsPanel';
import OverviewTab, { Overview } from './_components/OverviewTab';
import ModelsTab, { modelsFrom, modelsTo } from './_components/ModelsTab';
import QuestionsTab from './_components/QuestionsTab';
import SampleDataTab from './_components/SampleDataTab';
import GuideTab from './_components/GuideTab';
import VersionsTab from './_components/VersionsTab';
import PartSummary from './_components/PartSummary';
import PublishDialog from './_components/PublishDialog';
import PreviewDialog from './_components/PreviewDialog';

/**
 * Template Studio's editor (backend docs/templates T-07): one template's
 * draft, a tab per part, the problems the last check found, and Preview /
 * Publish. Edits stay in the page until Save — switching tabs keeps them —
 * and each changed part is saved on its own (PUT /templates/:id/draft).
 */

/** How each editable part becomes a tab's working copy, and back. */
const ADAPTERS: Partial<Record<TemplatePart, { from: (draft: any) => any; to: (w: any) => any }>> = {
	overview: {
		from: d => ({
			name: '',
			summary: '',
			description: '',
			audience: '',
			category: '',
			icon: '',
			color: '',
			cover: '',
			...(d.overview || {}),
			tags: d.overview?.tags || [],
			screenshots: d.overview?.screenshots || [],
		}),
		to: (w: Overview) => ({ ...w, tags: w.tags.map(t => t.trim()).filter(Boolean) }),
	},
	models: { from: d => modelsFrom(d.models), to: modelsTo },
	questions: {
		from: d => d.questions || [],
		to: (w: any[]) =>
			w.map(q => ({ ...q, options: (q.options || []).map((o: any) => ({ value: o.value.trim(), label: (o.label || o.value).trim() })).filter((o: any) => o.value) })),
	},
	sampleData: { from: d => d.sampleData || {}, to: w => w },
	guide: { from: d => ({ steps: d.guide?.steps || [], faq: d.guide?.faq || [] }), to: w => w },
};

const EditTemplatePage = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, isError, refetch, isFetching } = useGetTemplateQuery(id);
	const { data: meta } = useGetTemplateMetaQuery();
	const [savePart] = useSaveTemplatePartMutation();
	const doc = data?.doc;

	const [tab, setTab] = useState('overview');
	const [edits, setEdits] = useState<Partial<Record<TemplatePart, any>>>({});
	const [saving, setSaving] = useState(false);
	const [focus, setFocus] = useState<{ part: string; index?: number; at: number } | null>(null);
	const [publishing, setPublishing] = useState(false);
	const [previewing, setPreviewing] = useState(false);

	const base = useMemo(
		() => (doc ? Object.fromEntries(Object.entries(ADAPTERS).map(([part, a]) => [part, a!.from(doc.draft || {})])) : {}),
		[doc]
	) as Record<string, any>;
	const dirtyParts = Object.keys(edits) as TemplatePart[];
	const dirty = dirtyParts.length > 0;
	const archived = doc?.status === 'archived';

	useEffect(() => {
		if (!dirty) return;
		const warn = (e: BeforeUnloadEvent) => e.preventDefault();
		window.addEventListener('beforeunload', warn);
		return () => window.removeEventListener('beforeunload', warn);
	}, [dirty]);

	const valueOf = (part: TemplatePart) => (part in edits ? edits[part] : base[part]);
	const change = (part: TemplatePart) => (v: any) => setEdits(e => ({ ...e, [part]: v }));

	const save = useCallback(async () => {
		setSaving(true);
		const left = { ...edits };
		try {
			for (const part of Object.keys(edits) as TemplatePart[]) {
				await savePart({ id, part, value: ADAPTERS[part]!.to(edits[part]) }).unwrap();
				delete left[part];
			}
			toaster.create({ type: 'success', title: 'Saved', description: 'The draft is checked again — see the list at the top.' });
		} catch (e) {
			toaster.create({ type: 'error', title: 'Not saved', description: errorMessage(e, 'Try again') });
		} finally {
			setEdits(left);
			setSaving(false);
		}
	}, [edits, id, savePart]);

	const go = (issue: TemplateIssue, index?: number) => {
		setTab(tabOfPart(issue.part));
		setFocus({ part: issue.part, index, at: Date.now() });
	};

	if (isLoading)
		return (
			<Layout
				title='Templates'
				path='templates'>
				<DetailSkeleton />
			</Layout>
		);
	if (isError || !doc)
		return (
			<Layout
				title='Templates'
				path='templates'>
				<ErrorState
					message='Could not load this template — it may have been deleted.'
					onRetry={refetch}
				/>
			</Layout>
		);

	const tabs = TABS.filter(t => !t.parts.length || t.parts.some(p => (doc.parts || []).includes(p)));
	const v = doc.validation || {};

	const content = (value: string) => {
		const props = { doc, meta, focus } as any;
		switch (value) {
			case 'overview':
				return (
					<OverviewTab
						{...props}
						value={valueOf('overview')}
						onChange={change('overview')}
					/>
				);
			case 'models':
				return (
					<ModelsTab
						{...props}
						value={valueOf('models')}
						onChange={change('models')}
					/>
				);
			case 'questions':
				return (
					<QuestionsTab
						{...props}
						value={valueOf('questions')}
						onChange={change('questions')}
					/>
				);
			case 'sampleData':
				return (
					<SampleDataTab
						{...props}
						value={valueOf('sampleData')}
						onChange={change('sampleData')}
					/>
				);
			case 'guide':
				return (
					<GuideTab
						{...props}
						value={valueOf('guide')}
						onChange={change('guide')}
					/>
				);
			case 'versions':
				return (
					<VersionsTab
						doc={doc}
						dirty={dirty}
						onPublish={() => setPublishing(true)}
					/>
				);
			default:
				return (
					<PartSummary
						doc={doc}
						part={value}
					/>
				);
		}
	};

	return (
		<Layout
			title='Templates'
			path='templates'>
			<Flex
				direction='column'
				gap={4}
				pb={16}
				maxW='1280px'>
				<PageHeader
					breadcrumbs={[
						{ href: HOME, title: 'Home' },
						{ href: '/templates', title: 'Templates' },
						{ href: `/templates/${id}`, title: doc.name },
					]}
					title={doc.name}
					badge={
						<Flex
							gap={1.5}
							align='center'
							flexWrap='wrap'>
							<TypeBadge type={doc.type} />
							<StatusBadge doc={doc} />
						</Flex>
					}
					meta={`Key ${doc.key} · ${doc.source === 'mcp' ? 'written with Claude' : doc.source === 'capture' ? 'saved from a project' : doc.source === 'import' ? 'imported' : doc.source === 'starter' ? 'a built-in starter' : 'made in the studio'} · ${doc.usage?.applied || 0} project(s) made from it`}
					actions={
						<Flex
							gap={2}
							align='center'
							flexWrap='wrap'>
							<GuideLink
								section='what'
								label='Guide'
							/>
							<Button
								size='sm'
								variant='ghost'
								loading={isFetching}
								onClick={() => refetch()}>
								<RefreshCw size={14} />
								Check again
							</Button>
							<Button
								size='sm'
								variant='outline'
								disabled={archived}
								onClick={() => setPreviewing(true)}>
								<Eye size={14} />
								Preview
							</Button>
							<Button
								size='sm'
								disabled={archived || !v.canPublish || dirty || (doc.version > 0 && !doc.changed)}
								title={!v.canPublish ? 'Fix the problems and add the missing explanations first' : dirty ? 'Save first' : undefined}
								onClick={() => setPublishing(true)}>
								<Rocket size={14} />
								Publish
							</Button>
						</Flex>
					}
				/>

				{archived && (
					<Box
						px={4}
						py={3}
						borderRadius='md'
						bg='bg.muted'
						fontSize='sm'>
						Archived — tenants don’t see it and it can’t be edited. Restore it under Versions &amp; publish.
					</Box>
				)}

				{dirty && (
					<Flex
						position='sticky'
						top='64px'
						zIndex={5}
						align='center'
						gap={3}
						px={4}
						py={2.5}
						borderRadius='md'
						bg='bg.inverted'
						color='fg.inverted'
						flexWrap='wrap'>
						<Text fontSize='sm'>Unsaved changes in {dirtyParts.map(p => PART_LABEL[p]).join(', ')}</Text>
						<Flex
							gap={2}
							ml='auto'>
							<Button
								size='xs'
								variant='ghost'
								color='fg.inverted'
								_hover={{ bg: 'whiteAlpha.200' }}
								disabled={saving}
								onClick={() => setEdits({})}>
								Discard
							</Button>
							<Button
								size='xs'
								bg='bg'
								color='fg'
								_hover={{ bg: 'bg.muted' }}
								loading={saving}
								disabled={archived}
								onClick={save}>
								Save
							</Button>
						</Flex>
					</Flex>
				)}

				<ProblemsPanel
					validation={v}
					onGo={go}
				/>

				<ConsoleTabs
					tabs={tabs.map(t => {
						const n = [...(v.errors || []), ...(v.explain || [])].filter((i: any) => t.parts.includes(i.part)).length;
						const edited = t.parts.some(p => p in edits);
						return {
							value: t.value,
							label: (
								<Flex
									align='center'
									gap={1.5}>
									{t.label}
									{edited && <Box
										w='6px'
										h='6px'
										borderRadius='full'
										bg='blue.solid'
									/>}
									{n > 0 && (
										<Text
											as='span'
											fontSize='10px'
											fontWeight='700'
											color='red.fg'>
											{n}
										</Text>
									)}
								</Flex>
							),
						};
					})}
					value={tab}
					onChange={setTab}>
					{tabs.map(t => (
						<Tabs.Content
							key={t.value}
							value={t.value}
							pt={0}>
							{content(t.value)}
						</Tabs.Content>
					))}
				</ConsoleTabs>
			</Flex>

			<PublishDialog
				open={publishing}
				onClose={() => setPublishing(false)}
				doc={doc}
				dirty={dirty}
			/>
			<PreviewDialog
				open={previewing}
				onClose={() => setPreviewing(false)}
				doc={doc}
				dirty={dirty}
			/>
		</Layout>
	);
};

export default EditTemplatePage;
