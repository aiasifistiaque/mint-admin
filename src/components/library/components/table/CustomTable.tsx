import { Table, Thead, Tr, Tbody, Flex, Text, CloseButton } from '@chakra-ui/react';
import { FC } from 'react';

import {
	useAppDispatch,
	TableContainer,
	TableSkeleton,
	TableSearch,
	ResultContainer,
	TableRefresh,
	Preferences,
	SelectedItemsContainer,
	FilterContainer,
	TableSettingsMenuContainer,
	TableSearchContainer,
	TableErrorMessage,
	DynamicFilters,
	CustomTableProps,
	SelectedMenu,
	selectAll,
	TableResultContainer,
	TableSort,
} from '../..';

const CustomTable: FC<CustomTableProps> = ({
	headers,
	schema,
	children,
	filters,
	header,
	data,
	isLoading,
	col,
	preferences,
	pagination = true,
	path,
	hidePreferences,
	selectedItems,
	isError = false,
	select,
	showFilters = true,
	search = true,
	table,
	error,
}) => {
	const tbody = isLoading ? (
		<TableSkeleton
			row={10}
			col={col || 5}
		/>
	) : (
		children
	);

	const dispatch = useAppDispatch();

	const onUnselect = () => {
		dispatch(selectAll({ ids: [], isSelected: false }));
	};

	return (
		<>
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
						hide={!select || !select?.show}
						path={path}
						data={select?.menu}
					/>
				</SelectedItemsContainer>
			) : (
				<TableSettingsMenuContainer>
					{showFilters && Boolean(filters) && (
						<FilterContainer>
							<DynamicFilters path={filters} />
						</FilterContainer>
					)}

					<TableSearchContainer>
						{!hidePreferences && (
							<Preferences
								path={path}
								schema={schema}
							/>
						)}
						<TableSort tableData={schema} />
						{search && (
							<>
								<TableSearch />
								<TableRefresh />
							</>
						)}
					</TableSearchContainer>
				</TableSettingsMenuContainer>
			)}
			{table?.topPagination && <TableResultContainer data={data} />}
			<TableContainer>
				<Table size='sm'>
					<Thead
						_light={{ bg: 'table.head.bgLight' }}
						_dark={{ bg: 'table.head.bgDark' }}>
						<Tr bg='inherit'>{header}</Tr>
					</Thead>
					<Tbody>{tbody}</Tbody>
				</Table>
				{data?.docsInPage == 0 && (
					<TableErrorMessage title='No results found.'>
						There {`aren't`} any results for that query. Try using different filters.
					</TableErrorMessage>
				)}
				{isError && (
					<TableErrorMessage title='Error Fetching Data.'>
						{error?.data?.message ||
							`There has been an error while fetching data. Please try refreshing the page.`}
					</TableErrorMessage>
				)}
			</TableContainer>

			{pagination && <ResultContainer data={data} />}
		</>
	);
};

export default CustomTable;
