'use client';

import React, { FC } from 'react';
import { Input, InputGroup, InputGroupProps, InputLeftAddon } from '@chakra-ui/react';
import {
	useAppDispatch,
	Icon,
	updateSearch,
	SideDrawer,
	Sidebar,
	Align,
} from '@/components/library';

type PosSearchProps = InputGroupProps & {};

const PosSearch: FC<PosSearchProps> = ({ ...props }) => {
	const [value, setValue] = React.useState<string>('');
	const dispatch = useAppDispatch();

	const handleSearch = (e: any) => {
		setValue(e.target.value);
		dispatch(updateSearch(e.target.value || ''));
	};

	return (
		<Align w='100%'>
			<SideDrawer />
			<InputGroup {...props}>
				<InputLeftAddon
					bg='#ddd'
					_dark={{ bg: 'background.dark' }}>
					<Icon name='barcode' />
				</InputLeftAddon>
				<Input
					bg='white'
					_dark={{ bg: 'sidebar.dark' }}
					borderRadius='lg'
					placeholder='Search By Barcode/Product Name'
					value={value}
					onChange={handleSearch}
				/>
			</InputGroup>
		</Align>
	);
};

export default PosSearch;
