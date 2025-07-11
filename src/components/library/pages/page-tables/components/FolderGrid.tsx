import React from 'react';
import { Flex, Grid, Text } from '@chakra-ui/react';
import { useGetAllQuery } from '../../../store';
import { Icon } from '../../../icon';
import Link from 'next/link';

const FolderGrid = ({ path, parent }: { path: string; parent?: string }) => {
	const { data, isFetching } = useGetAllQuery({ path: path, limit: '9999', filters: { parent } });
	return (
		<Grid
			mb={6}
			gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }}
			gap={2}>
			{data?.doc?.map((item: any, i: number) => (
				<Link
					key={i}
					href={`/images/f/${item._id}`}>
					<Flex {...styles.folderCardCss}>
						<Icon
							name='folder'
							size={26}
						/>
						<Text fontWeight='600'>{item?.name}</Text>
					</Flex>
				</Link>
			))}
		</Grid>
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

export default FolderGrid;
