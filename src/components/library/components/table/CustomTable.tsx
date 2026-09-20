import { Table, Flex, Text, CloseButton } from '@chakra-ui/react';
import { FC, useEffect } from 'react';

// Direct imports instead of barrel export
import { useAppDispatch } from '../../hooks/useReduxHooks';
import { useIsMobile, useIsCardView, useTableUrlSync } from '../../hooks';
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
	const isMobile = useIsMobile();
	const isCardView = useIsCardView();
	// Cards on a desktop. On a phone they already stack one per row and the
	// viewport does the work; here there is width to fill, so they tile.
	const isCardGrid = isCardView && !isMobile;
	const onUnselect = () => dispatch(selectAll({ ids: [], isSelected: false }));

	useEffect(() => {
		dispatch(setCurrentPath(path));
	}, [path]);

	// Mirrors page/search/sort/filters to the URL's query string (and reads
	// them back on load), so a refresh lands on the same filtered/paginated
	// view instead of resetting.
	useTableUrlSync(path);

	return (
		<>
			{selectedItems?.length > 0 ? (
				<SelectedItemsContainer>
					<Flex
						align='center'
						gap={2}>
						<CloseButton
							size='sm'
							borderRadius='full'
							color='inherit'
							_hover={{ bg: 'whiteAlpha.200' }}
							onClick={onUnselect}
						/>
						<Text
							color='inherit'
							fontSize='14px'
							fontWeight='500'>
							{selectedItems?.length} selected
						</Text>
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
				<Table.Root
					size='sm'
					{...(isCardGrid && { w: '100%', tableLayout: 'fixed' })}
					// Each mobile row is one <td colSpan> holding the whole card, so
					// the table has effectively one column — `table-layout: auto`
					// (the default) sizes a table to its content's natural width
					// though, and a long unbroken value (a URL) inside that cell was
					// enough to blow the table itself wider than the viewport,
					// forcing horizontal scroll instead of the text wrapping.
					// `fixed` makes the single column just take the container width.
					{...(isMobile && { tableLayout: 'fixed', w: '100%' })}>
					<Table.Header
						position='sticky'
						top={0}
						zIndex={1}
						_light={{ bg: 'table.head.bgLight' }}
						_dark={{ bg: 'table.head.bgDark' }}>
						<Table.Row bg='inherit'>{header}</Table.Row>
					</Table.Header>
					<Table.Body css={isCardGrid ? cardGridCss : undefined}>{tbody}</Table.Body>
				</Table.Root>
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

/**
 * Lays the desktop card view out as a grid.
 *
 * Each card is already wrapped in a `<tr><td colSpan>` so it can sit legally
 * inside `<tbody>`, so the grid is applied to the tbody and the row and cell
 * are flattened to blocks to become its items. `auto-fill` with a min track
 * means the column count follows the available width instead of being a
 * breakpoint guess, and the card's own bottom margin is dropped so the grid gap
 * is the only thing setting the spacing.
 */
const cardGridCss = {
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
	gap: '16px',
	// Cards in the same row share a height. Left to their natural heights the
	// row ends ragged, which reads as a broken grid rather than a deliberate one.
	alignItems: 'stretch',

	// The height has to be handed down the whole chain: `stretch` sizes the
	// <tr> grid item, but the <td> and the card inside it are ordinary blocks
	// and would otherwise stay at their content height.
	'& > tr': { display: 'block', height: '100%' },
	'& > tr > td': { display: 'block', padding: 0, border: 'none', height: '100%' },
	'& > tr > td > *': { marginBottom: 0, height: '100%' },
};

export default CustomTable;
