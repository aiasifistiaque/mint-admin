'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import {
	Column,
	convertToViewFields,
	useGetByIdQuery,
	useGetSchemaQuery,
	getValue,
} from '@/components/library';

import { ViewModalDataModelProps, Layout, ViewItem } from '@/components/library';
import { Grid, GridItem } from '@chakra-ui/react';

const ViewPage = () => {
	const { id, slug }: { id: string; slug: string } = useParams();
	const { data, isFetching, isError } = useGetSchemaQuery(slug, { skip: !slug });

	return (
		<Layout
			title={slug?.toUpperCase()}
			path={slug}>
			{slug && id && data && (
				<ViewInfo
					schema={data}
					slug={slug}
					id={id}
				/>
			)}
		</Layout>
	);
};

const ViewInfo = ({ slug, id, schema }: { slug: string; id: string; schema: any }) => {
	const viewFields = convertToViewFields({ schema });

	const [fields, setFields] = React.useState<any[]>([]);

	const { data, isFetching, isError } = useGetByIdQuery(
		{
			path: slug,
			id: id,
		},
		{ skip: !id || !slug }
	);

	return (
		<Grid
			gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
			gap={{ base: 4, md: 8 }}
			pt={4}>
			{viewFields.map((item: any, i: number) => {
				const { title, dataKey, type, colorScheme, path } = item;

				const defineSpan = () => {
					if (type == 'textarea') return 2;
					else if (i == viewFields.length - 1) return 2;
					else if (viewFields[i + 1].type == 'textarea') return 2;
					else return 1;
				};

				if (item[dataKey] == undefined || item[dataKey] == '') return null;

				return (
					<GridItem
						key={i}
						colSpan={defineSpan()}>
						<ViewItem
							isLoading={isFetching}
							title={title}
							type={type}
							colorScheme={colorScheme}
							path={path}>
							{data && getValue({ dataKey, type, data })}
						</ViewItem>
					</GridItem>
				);
			})}
		</Grid>
	);
};

export default ViewPage;
