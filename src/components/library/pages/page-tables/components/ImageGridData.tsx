import {
	Center,
	CenterProps,
	Flex,
	FlexProps,
	Grid,
	IconButton,
	Image,
	ImageProps,
	MenuButton,
	Tooltip,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import LucideIcon from '../../../icon/LucideIcon';
import { Caption } from '../../../texts';
import { TableMenu, SelectItem } from '../../../components/table';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectAll } from '../../../store';

const menu = [
	{
		label: 'Details',
		type: 'view-server-modal',
	},
	{
		type: 'update-key',
		title: 'Edit Name',
		keyType: 'string',
		key: 'name',
		prompt: {
			title: 'Update Name',
			body: 'Enter the new name for this item.',
		},
	},
	{
		type: 'update-key',
		title: 'Move To Folder',
		keyType: 'data-menu',
		dataPath: 'folders',
		path: 'images',
		invalidate: ['images', 'files'],
		key: 'fileFolder',
		prompt: {
			title: 'Move to Folder',
			body: 'Select a folder to move this item to.',
		},
	},
	{
		label: 'Make Copy',
		type: 'duplicate',
	},
	{
		label: 'Delete',
		type: 'delete',
	},
];

const ImageGridData = ({ data }: { data: any }) => {
	const [index, setIndex] = useState(-1);
	const { selectedItems }: any = useAppSelector(state => state.table);
	const dispatch = useAppDispatch();

	const handleSelectAll = (isSelected: boolean) => {
		const ids = data?.map((item: any) => item?._id);
		dispatch(selectAll({ ids, isSelected }));
	};
	// Add keyboard event listener for Cmd+A / Ctrl+A
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Check for Cmd+A (Mac) or Ctrl+A (Windows/Linux)
			if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
				e.preventDefault(); // Prevent default browser select all
				handleSelectAll(true);
			}
		};

		// Add event listener
		window.addEventListener('keydown', handleKeyDown);

		// Cleanup event listener on unmount
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [data]); // Re-run effect when data changes

	return (
		<Grid
			gridTemplateColumns={{ base: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }}
			gap={{ base: 3, md: 6 }}>
			{data?.map((item: any, i: number) => (
				<Flex
					onMouseEnter={() => setIndex(i)}
					onMouseLeave={() => setIndex(-1)}
					{...contentCss}
					key={i}>
					<Flex
						{...imageBoxCss}
						borderColor={selectedItems.includes(item?.id) ? 'brand.500' : 'transparent'}
						_dark={{
							borderColor: selectedItems.includes(item?._id) ? 'brand.200' : 'transparent',
							bg: 'image.900',
							_hover: { bg: 'image.800' },
						}}>
						<Image
							{...imageCss}
							src={item?.url}
							alt={item?.name || `Image ${i + 1}`}
						/>

						<Center
							display={selectedItems?.length > 0 ? 'none' : 'flex'}
							// display={index == i ? 'flex' : 'none'}
							{...iconBoxCss}>
							<TableMenu
								data={menu}
								doc={item}
								id={item?._id}
								path='files'>
								<MenuButton
									as={IconButton}
									{...menuButtonCss}
									icon={<LucideIcon name='ellipsis' />}
								/>
							</TableMenu>
						</Center>
						<Flex {...selectBoxCss}>
							<SelectItem id={item?._id} />
						</Flex>
					</Flex>

					<Tooltip
						label={item?.name || `Image ${i + 1}`}
						placement='top'>
						<Caption mr={2}>{item?.name || `Image ${i + 1}`}</Caption>
					</Tooltip>
				</Flex>
			))}
		</Grid>
	);
};

const selectBoxCss: FlexProps = {
	bg: 'white',
	_dark: { bg: 'background.dark' },
	position: 'absolute',
	top: 3,
	left: 3,
};

const contentCss: FlexProps = {
	overflow: 'hidden',
	w: '100%',
	gap: 2,
	flexDir: 'column',
};

const menuButtonCss: any = {
	h: '30px',
	w: '30px',
	boxSize: '30px',
	size: 'sm',
	borderColor: 'white',
	borderWidth: 2,
	bg: 'transparent',
	borderRadius: '8px',
	_hover: {
		bg: 'image.50',
	},
};
const imageBoxCss: FlexProps = {
	position: 'relative',
	cursor: 'pointer',
	border: '2px solid',
	transition: '.2s',
	bg: 'image.50',
	_hover: { bg: 'image.100' },
	_dark: { bg: 'image.900', _hover: { bg: 'image.800' } },
	w: 'full',
	p: 4,
	borderRadius: '8px',
};

const iconBoxCss: CenterProps = {
	border: '1px solid',
	bg: 'white',
	borderColor: 'border.light',
	_dark: {
		borderColor: 'border.dark',
		bg: 'background.dark',
	},
	h: '34px',
	w: '34px',
	boxShadow: 'md',
	borderRadius: '6px',
	position: 'absolute',
	top: '8px',
	p: '1px',
	right: '8px',
};

const imageCss: ImageProps = {
	objectFit: 'contain',
	loading: 'lazy',
	w: { base: '150px', md: '240px' },
	h: { base: '120px', md: '160px' },
	borderRadius: '8px',
};

export default ImageGridData;
