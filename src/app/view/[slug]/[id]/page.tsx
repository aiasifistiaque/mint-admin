'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

const ViewPage = () => {
	const { id, slug }: { id: string; slug: string } = useParams();
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
	const [tab, setTab] = useState('overview');
	useEffect(() => {
		const t = new URLSearchParams(window.location.search).get('tab');
		if (t) setTab(t);
	}, []);
	const goTo = (t: string) => {
		setTab(t);
		const url = new URL(window.location.href);
		if (t === 'overview') url.searchParams.delete('tab');
		else url.searchParams.set('tab', t);
		window.history.replaceState(null, '', url.toString());
	};
	const openTab = tab === 'history' || tabs.some(t => String(t.index) === tab) ? tab : 'overview';

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

	const title = name || code || id;

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

	return (
		<Layout
			title={routeTitle}
			path={slug}>
			<Column {...containerCss}>
				<PageHeader
					breadcrumbs={[
						{ href: '/dashboard', title: 'Home' },
						{ href: `/${slug}`, title: routeTitle },
						{ href: '#', title },
					]}
					title={title}
					meta={name && code ? code : undefined}
					actions={
						canEdit ? (
							<CreateModal {...modalProps}>
								<Button
									size='sm'
									variant='outline'>
									<Pencil size={14} />
									Edit
								</Button>
							</CreateModal>
						) : undefined
					}
				/>

				<ConsoleTabs
					value={openTab}
					onChange={goTo}
					tabs={[
						{ value: 'overview', label: 'Overview' },
						...tabs.map(t => ({
							value: String(t.index),
							label: (
								<>
									{t.title}
									{t.allowed && (
										<Badge
											ml={1.5}
											size='xs'
											variant='subtle'
											borderRadius='full'>
											{t.total.toLocaleString()}
										</Badge>
									)}
								</>
							),
						})),
						{
							value: 'history',
							label: (
								<>
									History
									{!!historyTotal && (
										<Badge
											ml={1.5}
											size='xs'
											variant='subtle'
											borderRadius='full'>
											{historyTotal.toLocaleString()}
										</Badge>
									)}
								</>
							),
						},
					]}>
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
		</Layout>
	);
};

const containerCss: FlexProps = {
	pt: 4,
	gap: 5,
};

export default ViewPage;
