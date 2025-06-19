import { FC } from 'react';
import { Grid, GridItem, GridProps } from '@chakra-ui/react';
import { useGetByIdQuery, convertToViewFields, getValue, shadow, radius } from '../../../';
import { ViewPageItem } from '../';

type ViewPageBasicInfoProps = {
	slug: string;
	id: string;
	schema: any;
	layout: { exists: boolean; module: any };
};

const ViewPageBasicInfo: FC<ViewPageBasicInfoProps> = ({ slug, id, schema, layout }) => {
	const viewFields = layout?.exists
		? convertToViewFields({ schema, fields: layout?.module?.fields })
		: convertToViewFields({ schema });

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
				const { title, dataKey, type, colorScheme, path, model, originalType, idKey } = item;

				return (
					<GridItem
						borderBottomWidth={() => {
							if (index === viewFields.length - 1) return 0;
							if (index === viewFields.length - 2) return index % 2 === 0 ? 0 : 1;
							return 1;
						}}
						{...itemCss}
						key={index}>
						<ViewPageItem
							{...(idKey ? { id: getValue({ dataKey: idKey, type, data }) } : {})}
							originalType={originalType}
							isLoading={isFetching}
							title={title}
							type={type}
							colorScheme={colorScheme}
							path={model || path}>
							{data && getValue({ dataKey, type, data })}
						</ViewPageItem>
					</GridItem>
				);
			})}
		</Grid>
	);
};

const itemCss: any = {
	px: 6,
	py: 3,
	borderBottomColor: 'container.borderLight',
	_dark: {
		borderColor: 'border.dark',
	},
	colSpan: { base: 2, md: 1 },
};

const containerCss: GridProps = {
	w: 'full',
	py: 1,
	flexDirection: 'column',
	bg: 'container.newLight',
	borderColor: 'container.borderLight',
	shadow: shadow.DASH,
	_dark: {
		bg: 'menu.dark',
		borderColor: 'border.dark',
	},
	borderRadius: radius.CONTAINER,
	borderWidth: 1,
};

export default ViewPageBasicInfo;
