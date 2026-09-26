'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
	Column,
	CreateModal,
	ViewByIdPage,
	ConfiguredView,
	ViewTabTable,
	useGetViewDocumentQuery,
	useGetRouteQuery,
	useGetDocumentHistoryQuery,
	HistoryTimeline,
	HISTORY_PAGE_SIZE,
} from '@/components/library';
import { ConsoleTabs, DetailSkeleton, PageHeader } from '@/components/library/cl';
import { Layout, useGetSchemaQuery, useGetItemNameById, useGetConfigQuery } from '@/components/library';
import { Badge, Button, FlexProps, Tabs } from '@chakra-ui/react';
import { Pencil } from 'lucide-react';
import getFieldModule from '@/layouts';

const humanize = (s: string) => (s || '').replace(/[-_]+/g, ' ').replace(/^./, c => c.toUpperCase());

/** A page's own tab, shown ahead of Overview. */
export type RecordViewTab = {
	/** Goes in `?tab=`, so keep it a stable word — not 'overview', 'history' or a number. */
	value: string;
	label: ReactNode;
	content: ReactNode;
};

export type RecordViewProps = {
	slug: string;
	id: string;
	/**
	 * A custom record page's own tabs. They come first and the first one opens
	 * by default; Overview, the linked-record tabs and History follow, exactly
	 * as on the generic view page.
	 */
	tabs?: RecordViewTab[];
	/** Header extras. The title defaults to the record's name. */
	title?: ReactNode;
	badge?: ReactNode;
	meta?: ReactNode;
	/** Buttons before Edit. */
	actions?: ReactNode;
	/** Rendered after the page, for the custom page's own dialogs. */
	children?: ReactNode;
};

/**
 * A record's page: header with Edit, then Overview (the route builder's view
 * config, or the default layout), the tabs of records linking to it, and
 * History, with the open tab kept in `?tab=`.
 *
 * `/view/<slug>/<id>` is just this. A route with its own page in code
 * (`/repos/<id>`) wraps this too and passes its console as `tabs`, so the
 * table's "Open" lands on the same overview and tabs either way.
 */
const RecordView = ({ slug, id, tabs: pageTabs = [], title, badge, meta, actions, children }: RecordViewProps) => {
	const { data } = useGetSchemaQuery(slug, { skip: !slug });

	const { name, code } = useGetItemNameById({ path: slug, id: id });
	// The list page's own title, for the breadcrumb back to it.
	const { data: routeInfo } = useGetRouteQuery(slug, { skip: !slug });
	const routeTitle = routeInfo?.title || humanize(slug);

	// A view config published in the route builder lays the page out; without
	// one this 404s and the page keeps the layout it always had.
	const {
		data: configured,
		isLoading: configuredLoading,
		isFetching: configuredFetching,
	} = useGetViewDocumentQuery({ path: slug, id }, { skip: !slug || !id });
	const [moduleData, setModuleData] = React.useState<any>(null);

	React.useEffect(() => {
		const fetchModule = async () => {
			const response = await getFieldModule(slug);
			setModuleData(response);
		};
		fetchModule();
	}, [slug]);

	// Tabs after Overview: records of other routes that link to this one, as
	// set in the route builder's view, then History, which every record has.
	// The open tab lives in `?tab=`.
	const tabs: { index: number; title: string; route: string; total: number; allowed: boolean }[] =
		configured?.tabs || [];
	const firstTab = pageTabs[0]?.value || 'overview';
	const [tab, setTab] = useState(firstTab);
	useEffect(() => {
		const t = new URLSearchParams(window.location.search).get('tab');
		if (t) setTab(t);
	}, []);
	const goTo = (t: string) => {
		setTab(t);
		const url = new URL(window.location.href);
		if (t === firstTab) url.searchParams.delete('tab');
		else url.searchParams.set('tab', t);
		window.history.replaceState(null, '', url.toString());
	};
	const openTab =
		tab === 'overview' ||
		tab === 'history' ||
		pageTabs.some(t => t.value === tab) ||
		tabs.some(t => String(t.index) === tab)
			? tab
			: firstTab;

	// Same args as the tab's first page, so the count and the log share one request.
	const { data: history } = useGetDocumentHistoryQuery(
		{ id, limit: HISTORY_PAGE_SIZE },
		{ skip: !id }
	);
	const historyTotal: number | undefined = history?.totalDocs;

	// A route with a form layout in code edits through it; every other route —
	// built models included — through its form config, the same drawer the
	// table's "Edit" opens. `config` is invalidated on save so the view refreshes.
	const hasModule = !!moduleData?.exists;
	const { data: config } = useGetConfigQuery(slug, { skip: !slug || !moduleData || hasModule });
	const configForm: any[] = Array.isArray(config?.form) ? config.form : [];

	const modalProps: any = hasModule
		? {
				id,
				path: slug,
				layout: moduleData?.module.formFields || [],
				data: [],
				type: 'update',
				doc: data,
				// 'history' so the History tab picks up the edit just saved.
				invalidate: ['config', 'history'],
		  }
		: {
				id,
				path: slug,
				data: configForm,
				title: 'Update',
				type: 'update',
				invalidate: ['config', 'history'],
		  };
	const canEdit = hasModule || configForm.length > 0;

	const recordTitle = name || code || id;

	// Overview: the configured sections, or the default layout when the view
	// config only adds tabs (or there's none at all).
	const overview =
		!slug || !id || !data ? null : configuredLoading ? (
			<DetailSkeleton />
		) : configured?.sections?.length ? (
			<ConfiguredView
				slug={slug}
				schema={data}
				view={configured}
				isLoading={configuredFetching}
			/>
		) : (
			<ViewByIdPage
				layout={moduleData}
				schema={data}
				slug={slug}
				id={id}
			/>
		);

	const countBadge = (n: number) => (
		<Badge
			ml={1.5}
			size='xs'
			variant='subtle'
			borderRadius='full'>
			{n.toLocaleString()}
		</Badge>
	);

	return (
		<Layout
			title={routeTitle}
			path={slug}>
			<Column {...containerCss}>
				<PageHeader
					breadcrumbs={[
						{ href: '/dashboard', title: 'Home' },
						{ href: `/${slug}`, title: routeTitle },
						{ href: '#', title: recordTitle },
					]}
					title={title || recordTitle}
					badge={badge}
					meta={meta ?? (name && code ? code : undefined)}
					actions={
						actions || canEdit ? (
							<>
								{actions}
								{canEdit && (
									<CreateModal {...modalProps}>
										<Button
											size='sm'
											variant='outline'>
											<Pencil size={14} />
											Edit
										</Button>
									</CreateModal>
								)}
							</>
						) : undefined
					}
				/>

				<ConsoleTabs
					value={openTab}
					onChange={goTo}
					tabs={[
						...pageTabs.map(t => ({ value: t.value, label: t.label })),
						{ value: 'overview', label: 'Overview' },
						...tabs.map(t => ({
							value: String(t.index),
							label: (
								<>
									{t.title}
									{t.allowed && countBadge(t.total)}
								</>
							),
						})),
						{
							value: 'history',
							label: (
								<>
									History
									{!!historyTotal && countBadge(historyTotal)}
								</>
							),
						},
					]}>
					{pageTabs.map(t => (
						<Tabs.Content
							key={t.value}
							value={t.value}>
							{t.content}
						</Tabs.Content>
					))}
					<Tabs.Content value='overview'>{overview}</Tabs.Content>
					{tabs.map(t => (
						<Tabs.Content
							key={t.index}
							value={String(t.index)}>
							<ViewTabTable
								path={slug}
								id={id}
								index={t.index}
								title={t.title}
							/>
						</Tabs.Content>
					))}
					<Tabs.Content value='history'>
						<HistoryTimeline id={id} />
					</Tabs.Content>
				</ConsoleTabs>
			</Column>
			{children}
		</Layout>
	);
};

const containerCss: FlexProps = {
	pt: 4,
	gap: 5,
};

export default RecordView;
