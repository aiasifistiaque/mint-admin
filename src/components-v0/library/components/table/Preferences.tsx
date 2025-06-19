'use client';

import { useUpdatePreferencesMutation } from '@/store/services/authApi';
import {
	Button,
	useDisclosure,
	Text,
	Checkbox,
	Grid,
	IconButton,
	TextProps,
	GridProps,
	IconButtonProps,
	Tooltip,
	CheckboxProps,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import {
	Icon,
	useAppSelector,
	MenuModal,
	MenuModalHeader,
	MenuModalBody,
	MenuModalCloseButton,
	MenuModalFooter,
	radius,
	formatFieldName,
	sizes,
	formatFieldTitle,
} from '../..';

const Preferences = ({ path, schema }: { path: string; schema?: any }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { fields = [], preferences = [] } = useAppSelector(state => state.table);
	const [selected, setSelected] = useState<string[]>([]);

	const [trigger, result] = useUpdatePreferencesMutation();
	const { isSuccess, isLoading } = result;

	const handleSubmit = () => {
		trigger({
			field: path,
			preferences: selected,
		});
	};

	const closeModal = () => {
		setSelected(preferences);
		onClose();
	};

	useEffect(() => {
		setSelected(preferences);
	}, [preferences]);

	useEffect(() => {
		if (isSuccess) closeModal();
	}, [result]);

	const handleCheckboxChange = React.useCallback((e: any, field: any) => {
		if (e.target.checked) setSelected(prevSelected => [...prevSelected, field]);
		else setSelected(prevSelected => prevSelected.filter(item => item !== field));
	}, []);

	const checkboxes = fields?.map((field: string, i: number) => (
		<Checkbox
			{...style.checkbox}
			key={i}
			isChecked={selected?.includes(field)}
			onChange={e => handleCheckboxChange(e, field)}>
			{formatFieldTitle({ field, schema })}
		</Checkbox>
	));

	return (
		<>
			<Tooltip
				placement='bottom'
				label='Select Table Columns'>
				<span>
					<IconButton
						onClick={onOpen}
						{...style.iconButton}
						icon={<Icon name='fields' />}
					/>
				</span>
			</Tooltip>

			<MenuModal
				isOpen={isOpen}
				onClose={closeModal}>
				{/* <MenuModalOverlay />
				<MenuModalContent> */}

				<MenuModalHeader>Select Preferences</MenuModalHeader>
				<MenuModalCloseButton />
				<MenuModalBody>
					<Grid {...style?.checkboxGrid}>{checkboxes}</Grid>
				</MenuModalBody>
				<MenuModalFooter>
					{selected?.length < 2 ? (
						<Text {...style?.errorText}>Please select at least 2 fields</Text>
					) : (
						<>
							<Button
								size='sm'
								variant='white'
								onClick={closeModal}>
								Discard
							</Button>
							<Button
								size='sm'
								onClick={handleSubmit}
								loadingText='Processing'
								spinnerPlacement='start'
								isLoading={result?.isLoading}>
								Apply
							</Button>
						</>
					)}
				</MenuModalFooter>
			</MenuModal>
		</>
	);
};

type Style = {
	checkboxGrid: GridProps;
	errorText: TextProps;
	iconButton: IconButtonProps;
	checkbox: CheckboxProps;
};

const style: Style = {
	checkboxGrid: {
		py: 2,
		gridTemplateColumns: '1fr 1fr',
		gap: 4,
		rowGap: 4,
	},
	checkbox: {
		size: 'md',
		fontWeight: '500',
		colorScheme: 'brand',
	},
	errorText: {
		color: 'red',
		textAlign: 'right',
	},
	iconButton: {
		'aria-label': 'Select Table Fields',
		colorScheme: 'gray',
		size: 'md',
		borderWidth: 1,
		h: sizes?.SEARCH_BAR_HEIGHT,
		w: sizes?.SEARCH_BAR_HEIGHT,
		borderRadius: radius?.BUTTON,
		_dark: {
			borderWidth: 0,
		},
		_light: {
			borderColor: 'container.borderLight',
			bg: 'container.newLight',
		},
	},
};

export default Preferences;
