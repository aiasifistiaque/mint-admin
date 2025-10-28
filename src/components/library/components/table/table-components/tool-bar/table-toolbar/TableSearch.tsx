import { useState, useRef, useEffect } from 'react';
import { Button, Input, Group, InputProps } from '@chakra-ui/react';

import { useAppDispatch } from '../../../../../hooks';
import { radius, sizes } from '../../../../../config';
import { updateTable, Icon } from '../../../../..';

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
		<Group
			{...inputGroupCss}
			attached>
			<Input
				ref={inputRef}
				type='text'
				{...inputCss}
				value={value}
				onKeyDown={enterClicked}
				onChange={e => setValue(e.target.value)}
			/>
			<Button
				ref={btnRef}
				onClick={handleSearch}
				{...addOnCss}>
				<Icon
					name='search'
					size={14}
				/>
			</Button>
		</Group>
	);
};

const inputGroupCss: any = {
	flex: 1,
	size: 'sm',
	w: { base: 'full', lg: 300 },
};

const inputCss: InputProps = {
	outline: 'none',
	color: 'text.light',
	px: 3,
	h: sizes.SEARCH_BAR_HEIGHT,
	borderRadius: radius.BUTTON,
	placeholder: 'Search... (⌘ + F)',
	_dark: {
		bg: 'transparent',
		borderColor: 'container.borderDark',
		_placeholder: { color: 'text.inputPlaceholder.dark' },
	},
	_light: {
		bg: 'container.newLight',
		borderColor: 'container.borderLight',
		_placeholder: { color: 'text.inputPlaceholder.light' },
	},
	_focus: {
		boxShadow: 'none',
		outline: 'none',
		outlineOffset: 0,
	},
};

const addOnCss = {
	h: sizes.SEARCH_BAR_HEIGHT,
	borderRightRadius: radius.BUTTON,
	border: '1px solid',
	colorPalette: 'gray',
	_dark: {
		bg: 'container.dark',
		borderColor: 'container.borderDark',
	},
	_light: {
		borderColor: 'container.borderLight',
		bg: 'container.newLight',
	},
};

export default TableSearch;
