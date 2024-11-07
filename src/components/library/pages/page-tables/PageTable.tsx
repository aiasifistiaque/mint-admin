'use client';

import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useGetSelfQuery } from '@/store/services/authApi';

import {
	TableObjectProps,
	useAppDispatch,
	useAppSelector,
	CustomTable,
	PageHeading,
	Layout,
	Toast,
	Headers,
	TableRowComponent,
	setFields,
	setPreferences,
	useGetAllQuery,
} from '../../';

type TableProps = {
	table: TableObjectProps;
	isModal?: boolean;
	inputFields?: any;
};

// Define the PageTable component
const PageTable: FC<TableProps> = ({ table, inputFields }) => {
	const { page, limit, search, sort, filters, preferences, selectedItems }: any = useAppSelector(
		(state: any) => state.table
	);
	const dispatch = useAppDispatch();
	const [col, setCol] = useState<number>(table?.data?.length + 1);
	const router = useRouter();

	const selectable = table?.select?.show ? true : false;
	const tableFilters = table?.filters !== undefined ? table?.filters : true;
	// Get the table state from the redux store
	const { data, isLoading, isError, error, isSuccess } = useGetAllQuery({
		page,
		limit: table?.limit || limit,
		search,
		sort,
		filters: table?.preFilters ?? (tableFilters ? filters : null),
		path: table?.path,
	});

	const { data: userData } = useGetSelfQuery({});
	useEffect(() => {
		const defaultFields = table?.data
			? table?.data?.filter(item => item.type !== 'menu').map(item => item.dataKey)
			: [];
		dispatch(setFields(defaultFields));
	}, []);

	useEffect(() => {
		if (table?.preferences) {
			dispatch(setPreferences(table?.preferences));
			setCol(table?.preferences.length + 1);
			if (table?.hidePreferences) {
				return;
			}
		}
		const defaultPreferences = table?.data
			? table?.data?.filter(item => item.default).map(item => item.dataKey)
			: [];
		if (userData && userData?.preferences) {
			const preference = userData?.preferences[table?.path];
			const value = preference && preference?.length > 0 ? preference : defaultPreferences;
			dispatch(setPreferences(value));
			setCol(value.length + 1);
		}
	}, [userData, table]);

	// Create the table headers
	const header = (
		<Headers
			selectable={selectable}
			fields={preferences}
			tableData={table?.data}
			isLoading={isLoading}
			data={data?.doc}
			showMenu={table?.menu ? true : false}
		/>
	);
	// Create the table body by mapping over the data and creating a TableRowComponent for each item
	const body = data?.doc?.map((item: any) => (
		<TableRowComponent
			onClick={() => table?.clickable && router.push(`${table?.toPath}/${item?._id}`)}
			selectable={selectable}
			fields={preferences}
			item={item}
			data={table?.data}
			menu={table?.menu}
			path={table?.path}
			key={item?._id}
			clickable={table?.clickable}
		/>
	));

	// Return the layout, page heading, table, and toast components
	return (
		<>
			<Layout
				title={table?.title}
				path={table?.path}>
				<PageHeading
					table={table}
					title={table?.title} //Heading of the page
					button={table?.button?.title} //Button Title
					href={table?.button?.path} //Page where button would redirect to
					isModal={table?.isModal} //If create page should be modal
					path={table?.path} //Path of the table
					data={table?.createModel} //Input fields for the create page
					export={table?.export} //If export button should be displayed
				/>

				<CustomTable
					search={table?.search} //Hide search bar
					showFilters={table?.filters} //Hide filters
					filters={table?.path} //Name of the filters
					col={col} //No of columns for skeleton
					isLoading={isLoading} //Loading state
					header={header} //Header of the table
					data={isSuccess && data} //Data to be displayed in the table
					preferences={table?.preferences} //Preferences for the table
					path={table?.path} //Path of the table
					hidePreferences={table?.hidePreferences} //Hide preferences
					selectedItems={selectedItems} //Selected items
					isError={isError} //If error while fetching data
					select={table?.select} //Select menu
					error={error} //Error message
					table={table}>
					<>{body}</>
				</CustomTable>
			</Layout>
			{/* Toast component to display error */}
			<Toast
				error={error}
				isError={isError}
			/>
		</>
	);
};

export default PageTable;
