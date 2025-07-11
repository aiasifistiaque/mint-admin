'use client';

import { Button, useDisclosure, Text, Checkbox, Grid } from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';

import { MenuItem } from '../../../menu';
import { useExportManyMutation } from '../../../store';
import { useAppSelector } from '../../../hooks';
import { formatFieldName } from '../../../functions';
import { DiscardButton } from '../../../components/buttons';

import {
	MenuModal,
	MenuModalHeader,
	MenuModalBody,
	MenuModalCloseButton,
	MenuModalFooter,
} from '../../../components/table/table-components/menu-modals';

const ExportManyModal = ({ path, ids, icon }: { path: string; ids: string[]; icon?: string }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { fields = [], preferences = [] } = useAppSelector(state => state.table);
	const [selected, setSelected] = useState<string[]>([]);

	const [trigger, result] = useExportManyMutation();

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger({
			path: path,
			body: {
				fields: selected,
				ids: ids,
			},
			type: 'csv',
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
		if (result?.isSuccess) {
			closeModal();
		}
	}, [result]);

	const handleCheckboxChange = useCallback((e: any, field: any) => {
		if (e.target.checked) {
			setSelected(prevSelected => [...prevSelected, field]);
		} else {
			setSelected(prevSelected => prevSelected.filter(item => item !== field));
		}
	}, []);

	const checkboxes = fields.map((field: string, i: number) => (
		<Checkbox
			size='md'
			fontWeight='500'
			colorScheme='brand'
			key={i}
			isChecked={selected?.includes(field)}
			onChange={e => handleCheckboxChange(e, field)}>
			{formatFieldName(field)}
		</Checkbox>
	));

	return (
		<>
			<MenuItem
				onClick={onOpen}
				icon='export-doc'>
				Export Selected
			</MenuItem>

			<MenuModal
				isOpen={isOpen}
				onClose={closeModal}>
				<MenuModalHeader>Select Fields</MenuModalHeader>
				<MenuModalCloseButton />
				<MenuModalBody>
					<Grid
						py={2}
						gridTemplateColumns={{ base: '1fr 1fr', md: '1fr 1fr' }}
						gap={4}
						rowGap={4}>
						{checkboxes}
					</Grid>
				</MenuModalBody>
				<MenuModalFooter>
					{selected?.length < 2 ? (
						<Text color='red'>Please select at least 2 fields</Text>
					) : (
						<>
							<DiscardButton onClick={closeModal}>Discard</DiscardButton>
							<Button
								size='sm'
								onClick={handleSubmit}
								isLoading={result?.isLoading}>
								Export
							</Button>
						</>
					)}
				</MenuModalFooter>
			</MenuModal>
		</>
	);
};

export default ExportManyModal;
