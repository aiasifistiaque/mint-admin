import {
	Center,
	CenterProps,
	Flex,
	FlexProps,
	Grid,
	IconButton,
	Image,
	ImageProps,
	Menu,
	Skeleton,
	Tooltip,
	Box,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useColorMode } from '@/components/ui/color-mode';

import LucideIcon from '../../../icon/LucideIcon';
import { Caption } from '../../../texts';
import { TableMenu, SelectItem } from '../../../components/table';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectAll, selectItem } from '../../../store';

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

const ImageGridData = ({ data, isLoading }: { data: any; isLoading?: boolean }) => {
	const [index, setIndex] = useState(-1);
	const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
	const [isLongPress, setIsLongPress] = useState(false);
	const { selectedItems }: any = useAppSelector(state => state.table);
	const dispatch = useAppDispatch();
	const { colorMode } = useColorMode();

	const handleSelectAll = (isSelected: boolean) => {
		const ids = data?.map((item: any) => item?._id);
		dispatch(selectAll({ ids, isSelected }));
	};

	const handleLongPress = (item: any) => {
		// TODO: Implement long press functionality
		console.log('Long press detected for item:', item);
	};

	const startLongPress = (item: any) => {
		setIsLongPress(false);
		const timer = setTimeout(() => {
			setIsLongPress(true);
			handleLongPress(item);
		}, 500); // 500ms for long press detection
		setLongPressTimer(timer);
	};

	const endLongPress = () => {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			setLongPressTimer(null);
		}
		setTimeout(() => setIsLongPress(false), 100);
	};

	const handleClick = (item: any, e: React.MouseEvent) => {
		if (selectedItems?.length > 0) {
			const isSelected = selectedItems.includes(item?._id);
			dispatch(selectItem({ id: item?._id, isSelected: true }));
		}
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

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (longPressTimer) {
				clearTimeout(longPressTimer);
			}
		};
	}, [longPressTimer]);

	return (
		<Grid
			gridTemplateColumns={{ base: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }}
			gap={{ base: 3, md: 6 }}>
			{isLoading
				? [...Array(12)].map((y, j) => (
						<Flex
							overflow='hidden'
							w='100%'
							gap={2}
							flexDir='column'
							key={j}>
							<Skeleton
								w={{ base: '150px', md: '240px' }}
								h={{ base: '120px', md: '160px' }}
								borderRadius='8px'
							/>
						</Flex>
				  ))
				: data?.map((item: any, i: number) => (
						<Flex
							onMouseEnter={() => setIndex(i)}
							onMouseLeave={() => setIndex(-1)}
							overflow='hidden'
							w='100%'
							gap={2}
							flexDir='column'
							key={i}>
							<Flex
								cursor='pointer'
								border='2px solid'
								transition='.2s'
								bg={colorMode === 'dark' ? 'image.900' : 'image.50'}
								_hover={{ bg: colorMode === 'dark' ? 'image.800' : 'image.100' }}
								w='full'
								p={2}
								borderRadius='8px'
								borderColor={
									selectedItems.includes(item?.id)
										? colorMode === 'dark'
											? 'brand.200'
											: 'brand.500'
										: 'transparent'
								}
								// Long press event handlers
								// onMouseDown={() => startLongPress(item)}
								// onMouseUp={endLongPress}
								// 	onMouseLeave={endLongPress}
								// 	onTouchStart={() => startLongPress(item)}
								// 	onTouchEnd={endLongPress}
								// 	onTouchCancel={endLongPress}
								onClick={(e: any) => handleClick(item, e)}>
								<Box
									backgroundImage={item?.url}
									w='full'
									backgroundPosition='center'
									backgroundSize='contain'
									backgroundRepeat='no-repeat'
									h={{ base: '120px', md: '160px' }}>
									<Flex
										onClick={(e: any) => e.stopPropagation()}
										justify='space-between'
										w='full'>
										<Flex
											bg={colorMode === 'dark' ? 'background.dark' : 'white'}
											h='20px'>
											<SelectItem id={item?._id} />
										</Flex>

										<Center
											display={selectedItems?.length > 0 ? 'none' : 'flex'}
											border='1px solid'
											bg={colorMode === 'dark' ? 'background.dark' : 'white'}
											borderColor={colorMode === 'dark' ? 'border.dark' : 'border.light'}
											h='34px'
											w='34px'
											boxShadow='md'
											borderRadius='6px'
											top='8px'
											p='1px'
											right='8px'>
											<TableMenu
												data={menu}
												doc={item}
												id={item?._id}
												path='files'>
												<IconButton
													h='30px'
													w='30px'
													size='sm'
													borderColor='white'
													borderWidth={2}
													bg='transparent'
													borderRadius='8px'
													_hover={{ bg: 'image.50' }}
													as={Menu.Trigger}>
													<LucideIcon name='ellipsis' />
												</IconButton>
											</TableMenu>
										</Center>
									</Flex>
								</Box>
							</Flex>

							<Tooltip.Root
								positioning={{ placement: 'top' }}
								openDelay={200}>
								<Tooltip.Trigger asChild>
									<Caption mr={2}>{item?.name || `Image ${i + 1}`}</Caption>
								</Tooltip.Trigger>
								<Tooltip.Positioner>
									<Tooltip.Content>{item?.name || `Image ${i + 1}`}</Tooltip.Content>
								</Tooltip.Positioner>
							</Tooltip.Root>
						</Flex>
				  ))}
		</Grid>
	);
};

export default ImageGridData;
