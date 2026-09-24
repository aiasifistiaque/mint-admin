'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
	Column,
	SpaceBetween,
	CreateModal,
	Breadcrumbs,
	ViewByIdPage,
	ConfiguredView,
	useGetViewDocumentQuery,
} from '@/components/library';
import { DetailSkeleton } from '@/components/library/cl';
import { Layout, useGetSchemaQuery, useGetItemNameById, useGetConfigQuery } from '@/components/library';
import { Button, FlexProps } from '@chakra-ui/react';
import { Pencil } from 'lucide-react';
import getFieldModule from '@/layouts';

const ViewPage = () => {
	const { id, slug }: { id: string; slug: string } = useParams();
	const { data, isFetching, isError } = useGetSchemaQuery(slug, { skip: !slug });

	const { display } = useGetItemNameById({ path: slug, id: id });
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

	const breadCrumbData = [
		{ href: '/', title: 'Home' },
		{ href: `/${slug}`, title: slug },
		{ href: '#', title: display },
	];

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
				invalidate: ['config'],
		  }
		: {
				id,
				path: slug,
				data: configForm,
				title: 'Update',
				type: 'update',
				invalidate: ['config'],
		  };
	const canEdit = hasModule || configForm.length > 0;

	return (
		<Layout
			title={slug?.toUpperCase()}
			path={slug}>
			<Column {...containerCss}>
				<SpaceBetween>
					<Breadcrumbs data={breadCrumbData} />

					{canEdit && (
						<CreateModal {...modalProps}>
							<Button {...editButtonCss}>
								<Pencil size={12} />
								Edit
							</Button>
						</CreateModal>
					)}
				</SpaceBetween>

				{slug && id && data && configuredLoading && <DetailSkeleton />}

				{slug && id && data && !configuredLoading && configured && (
					<ConfiguredView
						slug={slug}
						schema={data}
						view={configured}
						isLoading={configuredFetching}
					/>
				)}

				{slug && id && data && !configuredLoading && !configured && (
					<ViewByIdPage
						layout={moduleData}
						schema={data}
						slug={slug}
						id={id}
					/>
				)}
			</Column>
		</Layout>
	);
};

const containerCss: FlexProps = {
	pt: 4,
	gap: 4,
};

const editButtonCss: any = {
	variant: 'white',
	size: 'xs',
	px: 4,
	h: '24px',
};

export default ViewPage;
