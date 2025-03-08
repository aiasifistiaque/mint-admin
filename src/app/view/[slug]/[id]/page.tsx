'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Column, SpaceBetween, CreateModal, Breadcrumbs, ViewByIdPage } from '@/components/library';
import { Layout, useGetSchemaQuery, useGetItemNameById } from '@/components/library';
import { Button, FlexProps } from '@chakra-ui/react';
import getFieldModule from '@/layouts';

const ViewPage = () => {
	const { id, slug }: { id: string; slug: string } = useParams();
	const { data, isFetching, isError } = useGetSchemaQuery(slug, { skip: !slug });

	const { display } = useGetItemNameById({ path: slug, id: id });
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

	const modalProps: any = {
		id,
		path: slug,
		layout: moduleData?.module.formFields || [],
		data: [],
		type: 'update',
		doc: data,
	};

	return (
		<Layout
			title={slug?.toUpperCase()}
			path={slug}>
			<Column {...containerCss}>
				<SpaceBetween>
					<Breadcrumbs data={breadCrumbData} />

					{moduleData?.exists && (
						<CreateModal {...modalProps}>
							<Button {...editButtonCss}>Edit</Button>
						</CreateModal>
					)}
				</SpaceBetween>

				{slug && id && data && (
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
