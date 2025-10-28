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
	Flex,
	FlexProps,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TbArrowUp, TbArrowDown, TbArrowsDownUp } from 'react-icons/tb';

import { radius, sizes } from '../../config';
import { useIsMobile, useAppDispatch, useAppSelector } from '../../hooks';
import { Icon } from '../../icon';
import {
	MenuModal,
	MenuModalHeader,
	MenuModalBody,
	MenuModalCloseButton,
} from '../../components/table/table-components/menu-modals';
import { updateTable } from '../../store';

const MobileSort = ({ tableData, show = false }: { tableData: any; show?: boolean }) => {
	const { open, onOpen, onClose } = useDisclosure();
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

	if (!isMobile && !show) return null;

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
			<Tooltip.Root positioning={{ placement: 'bottom' }}>
				<Tooltip.Trigger asChild>
					<IconButton
						onClick={onOpen}
						{...style.iconButton}>
						<Icon
							name='sort'
							size={14}
						/>
					</IconButton>
				</Tooltip.Trigger>
				<Tooltip.Positioner>
					<Tooltip.Content>Sort results by</Tooltip.Content>
				</Tooltip.Positioner>
			</Tooltip.Root>

			<MenuModal
				isOpen={open}
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
	checkbox: any;
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
		colorPalette: 'brand',
	},
	errorText: {
		color: 'red',
		textAlign: 'right',
	},
	iconButton: {
		'aria-label': 'Select Table Fields',
		colorPalette: 'gray',
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
