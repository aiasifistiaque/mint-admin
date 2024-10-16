import React, { FC } from 'react';
import { Menu } from '@chakra-ui/react';
import {
	MenuButton,
	CustomTd,
	CreateModal,
	MenuContainer,
	MenuItem,
	DeleteItemModal,
	ViewItemModal,
	DuplicateModal,
	ModalMenuItem,
	ModalMenuTrigger,
} from '../../../..';
import Link from 'next/link';

type TableMenuProps = {
	data: any;
	id: string;
	path: string;
	title: any;
	item: any;
	doc: any;
};

const TableMenu: FC<TableMenuProps> = ({ data, id, path, title, item: dataItem, doc }) => {
	return (
		<Menu>
			<CustomTd>
				<MenuButton />
			</CustomTd>

			<MenuContainer>
				{data?.map((item: any, i: number) => {
					const commonProps = {
						key: i,
						id: item?.id ? item?.id(doc) : id,
						path: item?.path || path,
					};
					switch (item.type) {
						case 'custom-redirect':
							return (
								<MenuItem
									href={item?.href(doc) || '#'}
									key={i}>
									{item?.title}
								</MenuItem>
							);
						case 'redirect':
							return (
								<MenuItem
									href={item?.href || '#'}
									key={i}>
									{item?.title}
								</MenuItem>
							);

						case 'link':
							return (
								<MenuItem
									href={`${item?.href}/${id}` || '#'}
									key={i}>
									{item?.title}
								</MenuItem>
							);
						case 'edit':
							return (
								<MenuItem
									key={i}
									href={`/${path}/edit/${id}`}>
									{item?.title}
								</MenuItem>
							);

						case 'view':
							return (
								<Link
									key={i}
									href={`/${path}/${id}`}>
									<MenuItem>{item?.title}</MenuItem>
								</Link>
							);

						case 'delete':
							return (
								<DeleteItemModal
									{...commonProps}
									title={item?.title}
								/>
							);
						case 'duplicate':
							return (
								<DuplicateModal
									{...commonProps}
									title={item?.title}
								/>
							);
						case 'view-modal':
							return (
								<ViewItemModal
									{...commonProps}
									title={item?.title}
									dataModel={item?.dataModel}
								/>
							);

						case 'edit-modal':
							return (
								<CreateModal
									{...commonProps}
									data={item?.dataModel}
									title='Edit'
									type='update'
									trigger={<MenuItem>{item?.title}</MenuItem>}
								/>
							);

						case 'custom':
							return (
								<item.modal
									{...commonProps}
									data={dataItem}
								/>
							);
						case 'custom-modal':
							return (
								<item.modal
									{...commonProps}
									data={dataItem}
									title={item?.title}
								/>
							);
						default:
							return <MenuItem key={i}>{item?.title}</MenuItem>;
					}
				})}
			</MenuContainer>
		</Menu>
	);
};

export default TableMenu;
