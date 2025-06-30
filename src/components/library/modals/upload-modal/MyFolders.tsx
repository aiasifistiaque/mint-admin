'use client';
import { useEffect, useState } from 'react';
import { Button, Flex, Grid, Text } from '@chakra-ui/react';
import { Column, Icon, useGetAllQuery, useGetQuery } from '../..';
import { ImageComponent } from '.';

const MyFolders = ({ handleSelect, type = 'image' }: { handleSelect: any; type?: string }) => {
	const [page, setPage] = useState<number>(1);
	const [viewData, setViewData] = useState<any>([]);
	const { data, isFetching } = useGetQuery({
		path: `files/get/distinct/folder`,
	});
	const [folder, setFolder] = useState<any>('');
	const [selected, setSelected] = useState<any>(null);

	const { data: imageData, isFetching: imageFetching } = useGetAllQuery(
		{
			path: `upload`,
			limit: '9999',
			type,
			page,
			sort: '-createdAt',
			filters: { type: type || 'image', folder },
		},
		{
			skip: !folder || folder === '',
		}
	);

	useEffect(() => {
		if (isFetching) return;
		if (data?.doc) {
			if (page === 1) {
				// Reset viewData for first page
				setViewData(data.doc);
			} else {
				// Append for subsequent pages
				setViewData((prev: any) => [...prev, ...data.doc]);
			}
		}
	}, [data, isFetching, page]);

	return (
		<Column
			minH='200px'
			gap={3}
			pb={2}>
			<Flex
				gap={2}
				mb={2}
				fontWeight='400'>
				<Text
					fontSize='20px'
					_hover={{
						textDecoration: 'underline',
					}}
					cursor='pointer'
					onClick={() => setFolder('')}>
					My Folders
				</Text>
				{folder !== '' && <Text fontSize='20px'>/ {folder}</Text>}
			</Flex>
			{folder == '' ? (
				<Grid
					gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }}
					gap={2}>
					{data?.map((item: any, i: number) => (
						<Flex
							key={i}
							onClick={() => setFolder(item)}
							{...styles.folderCardCss}>
							<Icon
								name='folder'
								size={26}
							/>
							<Text fontWeight='600'>{item}</Text>
						</Flex>
					))}
				</Grid>
			) : (
				<Grid
					gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(5, 1fr)' }}
					gap={2}>
					{imageData?.doc?.map((item: any, i: number) => (
						<ImageComponent
							src={item?.url}
							type={type}
							onClick={() => {
								setSelected(item?.url);
								handleSelect(item?.url);
							}}
							selected={selected}
							key={item?._id}
						/>
					))}
				</Grid>
			)}
		</Column>
	);
};

const styles = {
	folderCardCss: {
		borderRadius: '8px',
		align: 'center',
		px: 4,
		h: '50px',
		cursor: 'pointer',
		border: '1px solid border.light',
		bg: 'background.cardLight',
		_dark: {
			bg: 'background.cardDark',
		},
		gap: 3,
	},
};

export default MyFolders;
