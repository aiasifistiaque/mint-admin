import React, { useRef } from 'react';
import { Flex, Grid, Text, MenuButton } from '@chakra-ui/react';
import { useGetAllQuery } from '../../../store';
import { Icon } from '../../../icon';
import Link from 'next/link';
import { TableMenu } from '../../../components/table';
import { useRouter } from 'next/navigation';

const menu = [
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
		key: 'parent',
		path: 'folders',
	},
];

const FolderGrid = ({ path, parent }: { path: string; parent?: string }) => {
	const { data, isFetching } = useGetAllQuery({ path: path, limit: '9999', filters: { parent } });
	const menuRef = useRef(null);
	const router = useRouter();
	const handleClick = ({ id }: any) => {
		router.push(`/folders/f/${id}`);
	};
	return (
		<Grid
			mb={data?.docsInPage > 0 ? 4 : 0}
			gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }}
			gap={2}>
			{data?.doc?.map((item: any, i: number) => (
				// <Link
				// 	key={i}
				// 	href={`/images/f/${item._id}`}>
				<Flex
					key={i}
					{...styles.folderCardCss}>
					<Flex
						as={Link}
						href={`/images/f/${item._id}`}
						{...styles.folderCardName}>
						<Icon
							name='folder'
							size={26}
						/>
						<Text fontWeight='600'>{item?.name}</Text>
					</Flex>

					<Flex onClick={(e: any) => e.stopPropagation()}>
						<TableMenu
							data={menu}
							doc={item}
							id={item?._id}
							path={path}>
							<Flex
								{...styles.icon}
								as={MenuButton}>
								<Icon
									name='vertical-dots'
									size={18}
								/>
							</Flex>
						</TableMenu>
					</Flex>
				</Flex>
				// </Link>
			))}
		</Grid>
	);
};

const styles = {
	folderCardCss: {
		justify: 'space-between',
		borderRadius: '8px',
		align: 'center',

		h: '50px',

		border: '1px solid border.light',
		bg: 'background.cardLight',
		_dark: {
			bg: 'background.cardDark',
		},
		gap: 0.5,
	},
	folderCardName: {
		h: 'full',
		pl: 4,

		flex: 1,
		alignItems: 'center',
		gap: 3,
	},
	icon: {
		h: 'full',
		cursor: 'pointer',
		p: 2,
		borderRadius: 'full',
	},
};

export default FolderGrid;
