'use client';

import { Menu, MenuGroup, Flex, Input, useDisclosure, MenuDivider, Button } from '@chakra-ui/react';
import React, { useState } from 'react';

import ItemOfMenu from './ItemOfMenu';
import ButtonOfMenu from './ButtonOfMenu';

import { MenuContainer, MenuItem, CreateModal, useGetAllQuery } from '@/components/library';

const WIDTH = '300px';
const MAX_H = '300px';

const PosSelect = ({
	path,
	value,
	defaultValue,
	setValue,
	insert = false,
	insertPath,
	dataModel,
	id,
}: {
	path: string;
	value: any;
	setValue: any;
	defaultValue: { _id: string; name: string };
	insert?: boolean;
	insertPath?: string;
	dataModel?: any;
	id?: string;
}) => {
	const { onOpen, onClose, isOpen } = useDisclosure();

	const close = () => {
		setSearch('');
		onClose();
	};

	const [title, setTitle] = useState<string>('Walk In Customer');
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
		setValue(e?._id);
		onClose();
	};

	const renderMenuItems = data?.doc?.map((item: any, i: number) => (
		<ItemOfMenu
			filter={path}
			id={item?._id}
			key={i}
			onClick={() => handleChange(item)}>
			{item?.name}
		</ItemOfMenu>
	));
	const btnRef = React.useRef<any>(null);

	return (
		<>
			<CreateModal
				data={dataModel}
				path={path}
				trigger={
					<Button
						display='none'
						ref={btnRef}>
						Add {path}
					</Button>
				}
				type='post'
			/>
			<Menu
				isLazy
				onClose={close}>
				{() => (
					<>
						<ButtonOfMenu isActive={isOpen}>{title}</ButtonOfMenu>

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
							{insert && <MenuItem onClick={() => btnRef.current.click()}>Add {path}</MenuItem>}

							<MenuDivider />
							<Flex
								flexDir='column'
								w='100%'
								maxH={MAX_H}
								overflowY='scroll'>
								<MenuItem
									w={WIDTH}
									onClick={() => handleChange(defaultValue)}>
									{defaultValue?.name || `Select`}
								</MenuItem>
								{renderMenuItems}
							</Flex>
						</MenuContainer>
					</>
				)}
			</Menu>
		</>
	);
};

export default PosSelect;
