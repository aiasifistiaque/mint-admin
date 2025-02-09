'use client';

import {
	Menu,
	MenuGroup,
	Flex,
	Input,
	useDisclosure,
	MenuDivider,
	InputProps,
} from '@chakra-ui/react';

import React, { ReactNode, useState } from 'react';

import {
	DataMenuButton,
	MenuContainer,
	MenuItem,
	ItemOfDataMenu,
	FormControl,
	fontOptions,
} from '../../..';

const WIDTH = '300px';
const MAX_H = '200px';

type VDataMenuProps = InputProps & {
	label: string;
	isRequired?: boolean;
	placeholder?: string;
	value: any;
	helper?: string;
	hideNew?: boolean;
	unselect?: boolean;
};

const VFont: React.FC<VDataMenuProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	hideNew = false,
	type = 'value',
	unselect = true,
	...props
}) => {
	const { onOpen, onClose, isOpen } = useDisclosure();

	const [title, setTitle] = useState<string>(`Select ${label}`);
	const [search, setSearch] = useState<string>('');

	const [options, setOptions] = useState<any>(fontOptions);

	const handleSearch = (e: any) => {
		setSearch(e.target.value);
		if (e.target.value === '') setOptions(fontOptions);
		else {
			const filteredOptions = fontOptions.filter((item: any) =>
				item.label.toLowerCase().includes(e.target.value.toLowerCase())
			);
			setOptions(filteredOptions);
		}
	};

	const closeMenu = () => {
		setSearch('');
		setOptions(fontOptions);
		onClose();
	};

	const handleChange = (e: { label: string; value: string | undefined }) => {
		if (props.onChange) {
			const event = {
				target: {
					name: props.name,
					value: e.value,
				},
			} as any;
			props.onChange(event);
		}
		setTitle(e?.label);
		onClose();
	};

	const renderMenuItems = options?.map((item: any, i: number) => (
		<ItemOfDataMenu
			fontFamily={item?.value}
			cursor='pointer'
			id={item?.value}
			key={i}
			onClick={() => handleChange(item)}>
			{item?.label}
		</ItemOfDataMenu>
	));

	const inputRef = React.useRef<any>(null);

	return (
		<Flex w='full'>
			<Menu onClose={closeMenu}>
				{({ isOpen }) => (
					<>
						<FormControl
							isRequired={isRequired}
							label={label}
							helper={helper}
							w='full'>
							<DataMenuButton
								isFont
								{...(value && { fontFamily: value })}
								value={value}
								isActive={isOpen}>
								{value ? value : `Select ${label}`}
							</DataMenuButton>
							<Input
								ref={inputRef}
								isRequired={isRequired}
								value={value}
								{...selectInputCSS}
								{...props}
							/>
						</FormControl>

						<MenuContainer w={WIDTH}>
							<MenuGroup>
								<Flex
									p={2}
									py={0.5}>
									<Input
										{...searchInputCSS}
										value={search}
										onChange={handleSearch}
									/>
								</Flex>
							</MenuGroup>
							<MenuDivider mb={1} />

							<MenuDivider
								mt={1}
								mb={0}
							/>
							<MenuItemScrollContainer>
								{unselect && (
									<MenuItem
										w={WIDTH}
										onClick={() => handleChange({ label: ``, value: undefined })}>
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

const searchInputCSS = {
	borderRadius: 6,
	size: 'sm',
	placeholder: 'Search',
};

const selectInputCSS = {
	h: '1px',
	color: 'transparent',
	focusBorderColor: 'transparent',
	border: 'none',
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

export default VFont;
