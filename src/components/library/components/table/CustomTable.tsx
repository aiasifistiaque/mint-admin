import { Table, Thead, Tr, Tbody, Flex, Text, CloseButton } from '@chakra-ui/react';
import { FC, useEffect } from 'react';

// Direct imports instead of barrel export
import { useAppDispatch } from '../../hooks/useReduxHooks';
import TableContainer from './table-components/containers/TableContainer';
import TableSkeleton from './TableSkeleton';
import TableSearch from './table-components/tool-bar/table-toolbar/TableSearch';
import ResultContainer from './table-components/pagination/ResultContainer';
import TableRefresh from './table-components/tool-bar/table-toolbar/TableRefresh';
import Preferences from './Preferences';
import SelectedItemsContainer from './table-components/tool-bar/select-tool-bar/SelectedItemsContainer';
import FilterContainer from './table-components/tool-bar/table-toolbar/FIlterContainer';
import TableSettingsMenuContainer from './table-components/tool-bar/table-toolbar/TableSettingsMenuContainer';
import TableSearchContainer from './table-components/tool-bar/table-toolbar/TableSearchContainer';
import TableErrorMessage from './table-components/error/TableErrorMessage';
import DynamicFilters from '../../dynamic-filters/DynamicFilters';
import { CustomTableProps } from '../../types/components.types';
import SelectedMenu from './table-components/menu/SelectedMenu';
import { selectAll } from '../../store/slices/tableSlice';
import TableResultContainer from './table-components/pagination/TableResultContainer';
import TableSort from './MobileSort';
import { setCurrentPath } from '../../store/slices/tableSlice';

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
	const onUnselect = () => dispatch(selectAll({ ids: [], isSelected: false }));

	useEffect(() => {
		dispatch(setCurrentPath(path));
	}, [path]);

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
