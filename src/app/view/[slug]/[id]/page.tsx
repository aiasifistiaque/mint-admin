'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import {
	convertToViewFields,
	useGetByIdQuery,
	useGetSchemaQuery,
	getValue,
	ViewPageItem as PageItem,
	Layout,
	shadow,
	radius,
	Column,
	useGetItemNameById,
} from '@/components/library';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Grid, GridItem } from '@chakra-ui/react';
import Link from 'next/link';

const ViewPage = () => {
	const { id, slug }: { id: string; slug: string } = useParams();
	const { data, isFetching, isError } = useGetSchemaQuery(slug, { skip: !slug });

	const crumbCss: any = {
		fontSize: '14px',
		fontWeight: '400',
	};

	const { display } = useGetItemNameById({ path: slug, id: id });

	return (
		<Layout
			title={slug?.toUpperCase()}
			path={slug}>
			<Column
				gap={4}
				pt={4}>
				<Breadcrumb>
					<BreadcrumbItem {...crumbCss}>
						<Link href='/'>Home</Link>
					</BreadcrumbItem>

					<BreadcrumbItem {...crumbCss}>
						<Link
							style={{ textTransform: 'capitalize' }}
							href={`/${slug}`}>
							{slug}
						</Link>
					</BreadcrumbItem>

					<BreadcrumbItem
						{...crumbCss}
						fontWeight='500'
						isCurrentPage>
						<Link href='#'>{display}</Link>
					</BreadcrumbItem>
				</Breadcrumb>
				{slug && id && data && (
					<ViewInfo
						schema={data}
						slug={slug}
						id={id}
					/>
				)}
			</Column>
		</Layout>
	);
};

const ViewInfo = ({ slug, id, schema }: { slug: string; id: string; schema: any }) => {
	const viewFields = convertToViewFields({ schema });

	const { data, isFetching, isError } = useGetByIdQuery(
		{
			path: slug,
			id: id,
		},
		{ skip: !id || !slug }
	);

	return (
		<Grid
			{...containerCss}
			gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}>
			{viewFields.map((item: any, index: number) => {
				const { title, dataKey, type, colorScheme, path, model } = item;

				const defineSpan = () => {
					const fields = viewFields;
					// Full width fields
					const fullWidthTypes = ['textarea', 'external-link', 'rich-text'];
					if (fullWidthTypes.includes(type)) return 2;

					// Last field gets full width if not already full width
					if (index === fields.length - 1) return 2;

					// Field before textarea gets single width unless it's odd indexed
					const nextField = fields[index + 1];
					if (nextField?.type === 'textarea') {
						// If odd indexed and previous wasn't textarea, get single width
						if (index % 2 !== 0) {
							const prevField = fields[index - 1];
							if (!fullWidthTypes.includes(prevField?.type)) return 1;
						}
						return 2;
					}

					// Default to single width
					return 1;
				};

				// if (item[dataKey] == undefined || item[dataKey] == '') return null;

				return (
					<GridItem
						borderBottomWidth={() => {
							if (index === viewFields.length - 1) return 0;
							if (index === viewFields.length - 2) return index % 2 === 0 ? 0 : 1;
							return 1;
						}}
						{...itemCss}
						key={index}>
						<PageItem
							isLoading={isFetching}
							title={title}
							type={type}
							colorScheme={colorScheme}
							path={item?.model || path}>
							{data && getValue({ dataKey, type, data })}
						</PageItem>
					</GridItem>
				);
			})}
		</Grid>
	);
};

const itemCss: any = {
	px: 6,
	py: 3,
	// borderBottomWidth: 1,

	// _last: {
	// 	borderBottomWidth: 0,
	// },
	borderBottomColor: 'container.borderLight',
	_dark: {
		borderBottomColor: 'background.dark',
	},
	colSpan: { base: 2, md: 1 },
};

const containerCss: any = {
	w: 'full',
	py: 1,
	flexDirection: 'column',
	bg: 'container.newLight',
	borderColor: 'container.borderLight',
	shadow: shadow.DASH,
	_dark: {
		bg: 'container.newDark',
		borderColor: 'background.dark',
	},
	borderRadius: radius.CONTAINER,
	borderWidth: 1,
};

export default ViewPage;
