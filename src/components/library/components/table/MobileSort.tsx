'use client';

import {
	useDisclosure,
	Text,
	Grid,
	IconButton,
	TextProps,
	GridProps,
	IconButtonProps,
	Tooltip,
	CheckboxProps,
	Flex,
	FlexProps,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { TbArrowUp, TbArrowDown, TbArrowsDownUp } from 'react-icons/tb';

import {
	Icon,
	useAppSelector,
	MenuModal,
	MenuModalHeader,
	MenuModalBody,
	MenuModalCloseButton,
	radius,
	formatFieldName,
	sizes,
	useAppDispatch,
	updateTable,
	useIsMobile,
} from '../..';

const MobileSort = ({ tableData }: { tableData: any }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { fields = [], preferences = [], sort: val } = useAppSelector(state => state.table);
	const [selected, setSelected] = useState<string[]>([]);
	const dispatch = useAppDispatch();
	const isMobile = useIsMobile();

	const closeModal = () => {
		setSelected(preferences);
		onClose();
	};

	const handleSort = (value: string): any => {
		if (!value) return;
		const sortVal: string = val == value ? `-${value}` : value;
		dispatch(updateTable({ sort: sortVal, page: 1 }));
		closeModal();
	};

	useEffect(() => {
		setSelected(preferences);
	}, [preferences]);

	if (!isMobile) return null;

	// const checkboxes = <Text>{JSON.stringify(tableData)}</Text>;

	const checkboxes = tableData?.map((field: any, i: number) => {
		const { title, sort, dataKey, type, tooltip } = field;

		const icon =
			val == `-${sort}` ? <TbArrowUp /> : val == sort ? <TbArrowDown /> : <TbArrowsDownUp />;
		if (!fields?.includes(dataKey) && type !== 'menu') return null;
		if (type == 'menu') return null;
		if (!sort) return null;
		return (
			<Flex
				key={i}
				onClick={() => handleSort(dataKey)}
				{...sortItemsCss}>
				<Text
					fontSize='16px'
					fontWeight='600'
					key={i}>
					{title}
				</Text>
				{icon}
			</Flex>
		);
	});

	return (
		<>
			<Tooltip
				placement='bottom'
				label='Sort results by'>
				<span>
					<IconButton
						onClick={onOpen}
						{...style.iconButton}
						icon={
							<Icon
								name='sort'
								size={16}
							/>
						}
					/>
				</span>
			</Tooltip>

			<MenuModal
				isOpen={isOpen}
				onClose={closeModal}>
				{/* <MenuModalOverlay />
				<MenuModalContent> */}

				<MenuModalHeader>Sort results by</MenuModalHeader>
				<MenuModalCloseButton />
				<MenuModalBody pt={2}>
					<Grid
						pb={6}
						gap={1}>
						{checkboxes}
					</Grid>
				</MenuModalBody>
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

const sortItemsCss: FlexProps = {
	w: 'full',
	justify: 'space-between',
	p: 2,
	py: 4,
	bg: 'background.light',
	_dark: {
		bg: 'container.newDark',
	},
	cursor: 'pointer',
	align: 'center',
	gap: 1,
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

export default MobileSort;
