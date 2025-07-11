'use client';

import React, { FC, useEffect, useState } from 'react';

// Direct imports instead of barrel export
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Layout } from '../../nav';
import Toast from '../../components/toast/Toast';

import {
	useGetAllQuery,
	useGetConfigQuery,
	useGetRouteQuery,
	selectAll,
	setFields,
} from '../../store';
import { Column } from '../../containers';
import ServerPageHeading from '../../components/table/ServerPageHeading';
import ImageGridData from './components/ImageGridData';
import { CloseButton, Flex, Text } from '@chakra-ui/react';
import {
	FilterContainer,
	ImagePageHeading,
	ResultContainer,
	SelectedItemsContainer,
	SelectedMenu,
	TableErrorMessage,
	TableRefresh,
	TableSearch,
	TableSearchContainer,
	TableSettingsMenuContainer,
	TableSort,
} from '../../components/table';
import DynamicFilters from '../../dynamic-filters/DynamicFilters';
import FolderGrid from './components/FolderGrid';

type TableProps = {
	route: string;
	title?: string;
	folder?: string;
};

const menu = [
	{
		title: 'Move To Folder',
		type: 'edit-data-select',
		dataPath: 'folders',
		key: 'fileFolder',
		prompt: {
			title: 'Move to Folder',
			body: 'Select a folder to move the selected items to.',
		},
	},
];

// Define the PageTable component
const ImagePage: FC<TableProps> = ({ route, title, folder }) => {
	const path = route;
	const { page, limit, search, sort, filters, selectedItems }: any = useAppSelector(
		(state: any) => state.table
	);

	const [schema, setSchema] = useState<any>(null);
	const { data: table, isFetching: routeLoading } = useGetRouteQuery(route);
	const { data: schemaData, isFetching: schemaLoading } = useGetConfigQuery(route);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (schemaData) {
			const tableFields = schemaData?.table;
			setSchema(tableFields);
			const defaultFields = tableFields
				? tableFields?.filter((item: any) => item.type !== 'menu').map((item: any) => item?.dataKey)
				: [];
			dispatch(setFields(defaultFields));
		}
	}, [schemaData, schemaLoading]);

	const tableFilters = table?.filters !== undefined ? table?.filters : true;
	const onUnselect = () => dispatch(selectAll({ ids: [], isSelected: false }));
	// Get the table state from the redux store
	const { data, isLoading, isError, error, isSuccess } = useGetAllQuery(
		{
			page,
			limit: table?.limit || limit,
			search,
			sort,
			filters:
				table?.preFilters ??
				(tableFilters
					? {
							...(folder ? { fileFolder: folder } : {}),
							...filters,
					  }
					: null),
			path: route,
		},
		{ skip: !table }
	);

	// Return the layout, page heading, table, and toast components
	return (
		<>
			<Layout
				pb='32px'
				title={title || table?.title}
				path={route}>
				<Column gap={2}>
					<ImagePageHeading
						folder={folder}
						isLoading={!table}
						data={schemaData?.form}
						table={table}
						title={title || table?.title} //Heading of the page
						button={table?.button?.title} //Button Title
						href={table?.button?.path} //Page where button would redirect to
						isModal={table?.button?.isModal || table?.isModal} //If create page should be modal
						path={table?.path} //Path of the table
						export={table?.export} //If export button should be displayed
					/>
					{selectedItems?.length > 0 ? (
						<SelectedItemsContainer>
							<Flex
								align='center'
								gap={2}>
								<CloseButton
									size='md'
									borderRadius='full'
									onClick={onUnselect}
								/>
								<Text>{selectedItems?.length} Items Selected</Text>
							</Flex>

							<SelectedMenu
								items={selectedItems}
								hide={false}
								path={path}
								data={menu}
							/>
						</SelectedItemsContainer>
					) : (
						<TableSettingsMenuContainer>
							<FilterContainer>
								<DynamicFilters path={path} />
							</FilterContainer>

							<TableSearchContainer>
								<TableSort
									show={true}
									tableData={schema}
								/>

								<TableSearch />
								<TableRefresh />
							</TableSearchContainer>
						</TableSettingsMenuContainer>
					)}
					<FolderGrid
						parent={folder}
						path='folders'
					/>
					{data?.doc && <ImageGridData data={data?.doc} />}
					{data?.docsInPage == 0 && (
						<TableErrorMessage title='No results found.'>
							There {`aren't`} any results for that query. Try using different filters.
						</TableErrorMessage>
					)}
				</Column>
				<ResultContainer data={data} />
			</Layout>
			{/* Toast component to display error */}
			<Toast
				error={error}
				isError={isError}
			/>
		</>
	);
};

export default ImagePage;
