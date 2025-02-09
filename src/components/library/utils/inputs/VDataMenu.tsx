'use client';

import {
	Menu,
	MenuGroup,
	Flex,
	Input,
	useDisclosure,
	MenuDivider,
	Button,
	InputProps,
} from '@chakra-ui/react';

import React, { ReactNode, useState } from 'react';

import {
	DataMenuButton,
	CreateModal,
	MenuContainer,
	MenuItem,
	ItemOfDataMenu,
	useGetAllQuery,
	FormControl,
} from '../..';

const WIDTH = '300px';
const MAX_H = '200px';

type VDataMenuProps = InputProps & {
	label: string;
	isRequired?: boolean;
	placeholder?: string;
	value: any;
	helper?: string;
	model: string;
	dataModel?: any;
	hideNew?: boolean;
	field?: string;
	type?: 'object' | 'value' | string;
	dataKey?: 'string';
	unselect?: boolean;
};

const VDataMenu: React.FC<VDataMenuProps> = ({
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
	unselect = true,
	...props
}) => {
	const { onOpen, onClose, isOpen } = useDisclosure();

	const close = () => {
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
			{item?.name}
		</ItemOfDataMenu>
	));

	const getNameById = (id: string | undefined) => {
		const item = data?.doc?.find((item: any) => item._id === id);
		return item?.name || id;
	};

	const inputRef = React.useRef<any>(null);
	const btnRef = React.useRef<any>(null);

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
			<Menu onClose={close}>
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
								h='1px'
								color='transparent'
								focusBorderColor='transparent'
								border='none'
								{...props}
							/>
						</FormControl>

						<MenuContainer w={WIDTH}>
							<MenuGroup>
								<Flex
									p={2}
									py={0.5}>
									<Input
										borderRadius={6}
										size='sm'
										placeholder='Search'
										value={search}
										onChange={handleSearch}
									/>
								</Flex>
							</MenuGroup>
							<MenuDivider mb={1} />
							{dataModel && (
								<MenuItem onClick={() => btnRef.current.click()}>Add new {model}</MenuItem>
							)}
							<MenuDivider
								mt={1}
								mb={0}
							/>
							<MenuItemScrollContainer>
								{unselect && (
									<MenuItem
										w={WIDTH}
										onClick={() => handleChange({ name: ``, _id: undefined })}>
										Unselect
									</MenuItem>
								)}
								{renderMenuItems}
							</MenuItemScrollContainer>
						</MenuContainer>
					</>
				)}
			</Menu>
		</Flex>
	);
};

const MenuItemScrollContainer = ({ children }: { children: ReactNode }) => (
	<Flex
		flexDir='column'
		w='100%'
		maxH={MAX_H}
		overflowY='scroll'>
		{children}
	</Flex>
);

export default VDataMenu;
