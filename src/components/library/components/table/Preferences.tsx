'use client';

import {
	Button,
	useDisclosure,
	Text,
	Checkbox,
	Grid,
	IconButton,
	TextProps,
	GridProps,
	Tooltip,
} from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { useColorMode } from '@/components/ui/color-mode';

import {
	MenuModal,
	MenuModalHeader,
	MenuModalBody,
	MenuModalCloseButton,
	MenuModalFooter,
} from '../../components/table/table-components/menu-modals';

import { useUpdatePreferencesMutation } from '../../store';
import { useAppSelector } from '../../hooks';
import { formatFieldTitle } from '../../functions';
import { sizes, radius } from '../../config';
import { Icon } from '../../icon';
import { ConfirmButton, DiscardButton } from '../buttons';

const Preferences = ({ path, schema }: { path: string; schema?: any }) => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
	const { fields = [], preferences = [] } = useAppSelector(state => state.table);
	const [selected, setSelected] = useState<string[]>([]);
	const { colorMode } = useColorMode();

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

	const handleCheckboxChange = useCallback((checked: boolean, field: any) => {
		if (checked) setSelected(prevSelected => [...prevSelected, field]);
		else setSelected(prevSelected => prevSelected.filter(item => item !== field));
	}, []);

	const checkboxes = fields.map((field: string, i: number) => (
		<Checkbox.Root
			{...style.checkbox}
			key={i}
			checked={selected?.includes(field)}
			onCheckedChange={(e: any) => handleCheckboxChange(e.checked, field)}>
			<Checkbox.HiddenInput />
			<Checkbox.Control>
				<Checkbox.Indicator />
			</Checkbox.Control>
			<Checkbox.Label>{formatFieldTitle({ field, schema })}</Checkbox.Label>
		</Checkbox.Root>
	));
	return (
		<>
			<Tooltip.Root
				openDelay={200}
				closeDelay={100}
				positioning={{ placement: 'bottom' }}>
				<Tooltip.Trigger asChild>
					<IconButton
						onClick={onOpen}
						aria-label='Select Table Fields'
						colorPalette='gray'
						size='md'
						borderWidth={1}
						mr={0.5}
						h={sizes?.SEARCH_BAR_HEIGHT}
						w={sizes?.SEARCH_BAR_HEIGHT}
						borderRadius={radius?.BUTTON}
						bg={colorMode === 'dark' ? 'container.dark' : 'container.newLight'}
						borderColor={colorMode === 'light' ? 'container.borderLight' : undefined}>
						<Icon
							name='fields'
							size={12}
						/>
					</IconButton>
				</Tooltip.Trigger>
				<Tooltip.Positioner>
					<Tooltip.Content p={1}>Select Table Columns</Tooltip.Content>
				</Tooltip.Positioner>
			</Tooltip.Root>

			<MenuModal
				placement='center'
				isOpen={isOpen}
				onClose={closeModal}>
				{/* <MenuModalOverlay />
				<MenuModalContent> */}

				<MenuModalHeader>Select Preferences</MenuModalHeader>
				<MenuModalCloseButton />
				<MenuModalBody>
					<Grid {...style.checkboxGrid}>{checkboxes}</Grid>
				</MenuModalBody>
				<MenuModalFooter>
					{selected?.length < 2 ? (
						<Text {...style.errorText}>Please select at least 2 fields</Text>
					) : (
						<>
							<DiscardButton onClick={closeModal}>Discard</DiscardButton>
							<ConfirmButton
								onClick={handleSubmit}
								loadingText='Processing'
								loading={result?.isLoading}>
								Apply
							</ConfirmButton>
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
	checkbox: any;
};

const style: any = {
	checkboxGrid: {
		py: 2,
		gridTemplateColumns: '1fr 1fr',
		gap: 4,
		rowGap: 4,
		colorPalette: 'gray',
	},
	checkbox: {
		size: 'md',
		fontWeight: '500',
	},
	errorText: {
		color: 'red',
		textAlign: 'right',
	},
};

export default Preferences;
