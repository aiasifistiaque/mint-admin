'use client';

import { Menu, MenuGroup, Flex, Input, useDisclosure, MenuDivider, Button } from '@chakra-ui/react';

import { useState, FC, useRef, useEffect } from 'react';

import {
	DataMenuButton,
	CreateModal,
	MenuContainer,
	MenuItem,
	ItemOfDataMenu,
	useGetAllQuery,
	FormControl,
	Scroll,
} from '../../..';

import { VDataMenuProps } from './types';
import { hiddenInputCss, searchInputCss, unselectTextCss, MAX_H, WIDTH } from './styles';

const VDataMenu: FC<VDataMenuProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	model,
	dataModel,
	hideNew = false,
	field,
	type = 'value',
	dataKey = '_id',
	menuKey = 'name',
	menuAddOnKey,
	unselect = true,
	...props
}) => {
	const { onOpen, onClose, isOpen } = useDisclosure();

	const closeMenu = () => {
		setSearch('');
		onClose();
	};

	const [title, setTitle] = useState<string>(`Select ${label}`);
	const [search, setSearch] = useState<string>('');

	const { data, isFetching, isError, error, isSuccess } = useGetAllQuery({
		path: model,
		limit: '999',
		sort: 'name',
		search,
	});

	const handleSearch = (e: any) => {
		setSearch(e.target.value);
	};

	const handleChange = (e: any) => {
		if (props.onChange) {
			const event = {
				target: {
					name: props.name,
					value: type == 'object' ? e : e?._id,
				},
			} as any;
			props.onChange(event);
		}
		setTitle(e?.name);
		onClose();
	};

	const renderMenuItems = data?.doc?.map((item: any, i: number) => (
		<ItemOfDataMenu
			cursor='pointer'
			id={item?._id}
			key={i}
			onClick={() => handleChange(item)}>
			{item?.[menuKey]} {menuAddOnKey && `(${item?.[menuAddOnKey]})`}
		</ItemOfDataMenu>
	));

	const getNameById = (id: string | undefined) => {
		const item = data?.doc?.find((item: any) => item._id === id);
		return item?.name || id;
	};

	const inputRef = useRef<any>(null);
	const btnRef = useRef<any>(null);

	useEffect(() => {
		if (isOpen) {
			if (inputRef.current) inputRef.current.focus();
		}
	}, [isOpen, onOpen, onClose]);

	return (
		<Flex w='full'>
			{dataModel && (
				<CreateModal
					data={dataModel}
					path={model}
					trigger={
						<Button
							display='none'
							ref={btnRef}>
							Add new {model}
						</Button>
					}
					type='post'
				/>
			)}
			<Menu onClose={closeMenu}>
				{({ isOpen }) => (
					<>
						<FormControl
							isRequired={isRequired}
							label={label}
							helper={helper}
							w='full'>
							<DataMenuButton
								value={value}
								isActive={isOpen}>
								{value ? getNameById(value) : `Select ${label}`}
							</DataMenuButton>
							<Input
								ref={inputRef}
								isRequired={isRequired}
								value={value}
								{...hiddenInputCss}
								{...props}
							/>
						</FormControl>

						<MenuContainer w={WIDTH}>
							<MenuGroup>
								<Flex
									p={2}
									py={0.5}>
									<Input
										{...searchInputCss}
										value={search}
										onChange={handleSearch}
									/>
								</Flex>
							</MenuGroup>
							<MenuDivider mb={1} />
							{dataModel && (
								<>
									<MenuItem onClick={() => btnRef.current.click()}>Add new {model}</MenuItem>
									<MenuDivider
										mt={1}
										mb={0}
									/>
								</>
							)}

							<Scroll maxH={MAX_H}>
								{unselect && (
									<MenuItem
										{...unselectTextCss}
										onClick={() => handleChange({ name: ``, _id: undefined })}>
										<i>Unselect</i>
									</MenuItem>
								)}
								{renderMenuItems}
							</Scroll>
						</MenuContainer>
					</>
				)}
			</Menu>
		</Flex>
	);
};

export default VDataMenu;
