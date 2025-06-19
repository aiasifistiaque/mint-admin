'use client';

import {
	useGetAllQuery,
	useAppDispatch,
	MenuContainer,
	MenuItem,
	applyFilters,
} from '@/components/library';
import { Menu, MenuGroup, Flex, Input, useDisclosure, MenuDivider } from '@chakra-ui/react';
import React, { useState } from 'react';

import ItemOfMenu from './ItemOfMenu';
import ButtonOfMenu from './ButtonOfMenu';

const WIDTH = '300px';
const MAX_H = '300px';

const PosFilters = ({ path, filter }: { path: string; filter: string }) => {
	const dispatch = useAppDispatch();

	const { onOpen, onClose, isOpen } = useDisclosure();

	const close = () => {
		setSearch('');
		onClose();
	};

	const [title, setTitle] = useState<string>('All ' + path);
	const [search, setSearch] = useState<string>('');

	const { data, isFetching, isError, error, isSuccess } = useGetAllQuery({
		path,
		limit: '999',
		sort: 'name',
		search,
	});

	const handleSearch = (e: any) => {
		setSearch(e.target.value);
	};

	const handleChange = (e: any) => {
		setTitle(e?.name);
		dispatch(
			applyFilters({
				key: filter,
				value: e?._id,
			})
		);
		onClose();
	};

	const renderMenuItems = data?.doc?.map((item: any, i: number) => (
		<ItemOfMenu
			filter={filter}
			id={item?._id}
			key={i}
			onClick={() => handleChange(item)}>
			{item?.name}
		</ItemOfMenu>
	));

	return (
		<Menu
			isLazy
			onClose={close}>
			{({ isOpen }) => (
				<>
					<ButtonOfMenu
						w={{ base: '100%', md: 'inherit' }}
						bg='white'
						_dark={{ bg: 'sidebar.dark' }}
						isActive={isOpen}>
						{title}
					</ButtonOfMenu>
					<MenuContainer w={WIDTH}>
						<MenuGroup>
							<Flex
								p={2}
								py={1}>
								<Input
									placeholder='Search'
									value={search}
									onChange={handleSearch}
								/>
							</Flex>
						</MenuGroup>
						<MenuDivider />
						<Flex
							flexDir='column'
							w='100%'
							maxH={MAX_H}
							overflowY='scroll'>
							<MenuItem
								w={WIDTH}
								onClick={() => handleChange({ name: `All ${path}`, _id: '' })}>
								All {path}
							</MenuItem>
							{renderMenuItems}
						</Flex>
					</MenuContainer>
				</>
			)}
		</Menu>
	);
};

export default PosFilters;
