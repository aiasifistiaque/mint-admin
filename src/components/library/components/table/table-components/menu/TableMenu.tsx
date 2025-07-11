import { FC, ReactNode } from 'react';
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
	DecisionModal,
	UpdateDataMenuModal,
	UpdateStringModal,
	ViewServerModal,
	useGetConfigQuery,
} from '../../../..';
import Link from 'next/link';

type TableMenuProps = {
	data: any;
	id: string;
	path: string;
	title?: any;
	item?: any;
	doc: any;
	children?: ReactNode;
};

const TableMenu: FC<TableMenuProps> = ({
	data,
	id,
	path,
	title,
	item: dataItem,
	doc,
	children,
}) => {
	const { data: schemaData, isFetching } = useGetConfigQuery(path);
	return (
		<Menu>
			{children || (
				<CustomTd>
					<MenuButton />
				</CustomTd>
			)}

			<MenuContainer>
				{data?.map((item: any, i: number) => {
					const commonProps = {
						key: i,
						id: item?.id ? item?.id(doc) : id,
						path: item?.path || path,
					};

					if (item?.renderCondition && !item?.renderCondition(doc)) return null;

					if (item?.getValue) {
						data = item?.getValue(doc);
					}

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
						case 'post':
							return (
								<CreateModal
									key={i}
									path={item?.path || path}
									data={item?.dataModel}
									doc={doc}
									invalidate={item?.invalidate}
									id={item?.id ? item?.id(doc) : id}
									title={item?.title}>
									<MenuItem>{item?.title}</MenuItem>
								</CreateModal>
							);
						case 'edit-modal':
							return (
								<CreateModal
									{...commonProps}
									isMenu
									icon='edit-outline'
									data={item?.dataModel}
									title='Edit'
									type='update'
									layout={item?.layout}
									item={item}>
									{item?.title}
								</CreateModal>
							);

						case 'edit-server-modal':
							return (
								<CreateModal
									{...commonProps}
									isMenu
									icon='edit-outline'
									data={schemaData?.form}
									title='Update'
									type='update'
									trigger={item?.title}
									layout={item?.layout}
									item={item}
								/>
							);

						case 'view':
							return (
								<Link
									as={MenuItem as any}
									key={i}
									href={`/${path}/${id}`}>
									{item?.title}
								</Link>
							);
						case 'view-item':
							return (
								<MenuItem
									icon='arrow-angle'
									key={i}
									href={`/view/${path}/${id}`}>
									{item?.title}
								</MenuItem>
							);

						case 'delete':
							return (
								<DeleteItemModal
									{...commonProps}
									title={item?.title}
									item={item}
								/>
							);
						case 'update-key':
							switch (item?.keyType) {
								case 'data-menu':
									return (
										<UpdateDataMenuModal
											key={i}
											item={item}
											id={item?.id ? item?.id(doc) : id}
											doc={doc}
										/>
									);
								case 'string':
									return (
										<UpdateStringModal
											key={i}
											item={item}
											id={item?.id ? item?.id(doc) : id}
											doc={doc}
											path={item?.path || path}
											type='text'
										/>
									);
								case 'number':
									return (
										<UpdateStringModal
											key={i}
											item={item}
											id={item?.id ? item?.id(doc) : id}
											doc={doc}
											path={item?.path || path}
											type='number'
										/>
									);
								default:
									return null;
							}
						case 'update-api':
							return (
								<DecisionModal
									item={item}
									icon='edit'
									path={item?.path || path}
									key={i}
									doc={doc}
									itemId={id}
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
									item={item}
								/>
							);

						case 'view-server-modal':
							return (
								<ViewServerModal
									{...commonProps}
									title={item?.title}
								/>
							);

						case 'custom':
							return (
								<item.modal
									{...commonProps}
									title={item?.title}
									data={doc}
									doc={doc}
								/>
							);
						case 'custom-modal':
							return (
								<item.modal
									{...commonProps}
									data={doc}
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
