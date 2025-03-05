import React, { useState, useRef, useEffect } from 'react';
import {
	Button,
	Input,
	InputGroup,
	InputRightAddon,
	InputProps,
	InputRightAddonProps,
	InputGroupProps,
} from '@chakra-ui/react';
import { TbSearch } from 'react-icons/tb';

import { useAppDispatch, updateTable, radius, sizes } from '../../../../..';

const TableSearch = () => {
	const [value, setValue] = useState<string>('');
	const dispatch = useAppDispatch();
	const inputRef = useRef<HTMLInputElement>(null);
	const btnRef = useRef<any>(null);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Check if either Alt (Option) or Meta (Command) and 'f' are pressed
			if (e.altKey && e.key.toLowerCase() === 'ƒ') {
				e.preventDefault();
				inputRef.current?.focus();
			}
			if (e.metaKey && e.key.toLowerCase() === 'f') {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const handleSearch = () => dispatch(updateTable({ search: value }));
	const enterClicked = (e: any) => {
		if (e.key === 'Enter') handleSearch();
	};

	return (
		<InputGroup {...inputGroupCss}>
			<Input
				ref={inputRef}
				type='text'
				{...inputCss}
				value={value}
				onKeyDown={enterClicked}
				onChange={e => setValue(e.target.value)}
			/>
			<InputRightAddon
				ref={btnRef}
				as={Button}
				onClick={handleSearch}
				colorScheme='gray'
				{...addOnCss}>
				<TbSearch />
			</InputRightAddon>
		</InputGroup>
	);
};

const inputGroupCss: InputGroupProps = {
	flex: 1,
	size: 'sm',
	w: { base: 'full', lg: 300 },
};

const inputCss: InputProps = {
	outline: 'none',
	focusBorderColor: 'transparent',
	_focus: {
		borderColor: 'transparent',
		boxShadow: 'none',
		outline: 'none',
		outlineOffset: 0,
	},
	h: sizes.SEARCH_BAR_HEIGHT,
	borderRadius: radius.BUTTON,
	placeholder: 'Search',
	_light: {
		bg: 'container.newLight',
		borderColor: 'container.borderLight',
	},
};

const addOnCss: InputRightAddonProps = {
	h: sizes.SEARCH_BAR_HEIGHT,
	borderRightRadius: radius.BUTTON,
	_light: {
		borderLeftColor: 'container.borderLight',
		bg: 'container.newLight',
	},
};

export default TableSearch;
